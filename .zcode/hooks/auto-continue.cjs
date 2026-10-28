#!/usr/bin/env node
/**
 * Stop 钩子：检测"系统繁忙"类供应商故障停机，退避后自动续跑（引擎每回合最多接受 3 次）。
 *
 * 输入（stdin JSON）：responseText / responsePreview / toolCallCount / stopHookActive / sessionId / turnId ...
 * 输出（stdout JSON）：{"stopShouldContinue": true, "additionalContexts": ["..."]} 表示请求续跑；
 *                      输出为空表示正常放行（任务完成/等待输入等情况不做任何事）。
 *
 * 触发续跑的条件（满足其一）：
 *   1. 最终回复命中 PATTERNS 中的供应商故障文案（如"系统繁忙，请切换模型"）；
 *   2. 最终回复几乎为空、但本回合发生过工具调用 —— 典型的"干着活突然被打断"。
 * 守卫：
 *   - .zcode/night/MISSION_DONE 存在 → 任务已完成，永不续跑；
 *   - responseText 字段缺失（schema 变化）→ 保守放行并记录日志。
 */

const fs = require("node:fs");
const path = require("node:path");

// ===== 可调参数 =====
const PATTERNS = [
  /系统繁忙/,
  /请切换模型/,
  /服务(器)?繁忙/,
  /供应商繁忙/,
  /usage\s*limit/i,
  /quota\s*exceeded/i,
];
// 空回复 + 有工具调用 → 视为异常中断
const EMPTY_TEXT_MAX_LEN = 20;
// 续跑前的退避（毫秒）。限流场景下立刻重试只会继续繁忙。
const BACKOFF_MS = Number(process.env.AUTO_CONTINUE_BACKOFF_MS ?? 150000); // 默认 2.5 分钟
// 日志大小上限，超过则截断重写
const LOG_MAX_BYTES = 200 * 1024;

// ===== 路径 =====
const PROJECT_DIR =
  process.env.ZCODE_PROJECT_DIR ||
  path.resolve(__dirname, "..", "..");
const NIGHT_DIR = path.join(PROJECT_DIR, ".zcode", "night");
const LOCK_FILE = path.join(NIGHT_DIR, "LOCK");
const DONE_FILE = path.join(NIGHT_DIR, "MISSION_DONE");
const LOG_FILE = path.join(NIGHT_DIR, "auto-continue.log");

function log(msg) {
  try {
    fs.mkdirSync(NIGHT_DIR, { recursive: true });
    let data = "";
    if (fs.existsSync(LOG_FILE)) data = fs.readFileSync(LOG_FILE, "utf8");
    if (data.length > LOG_MAX_BYTES) data = "";
    data += msg + "\n";
    fs.writeFileSync(LOG_FILE, data, "utf8");
  } catch {
    /* 日志失败不影响主流程 */
  }
}

function readStdin() {
  return new Promise((resolve) => {
    let raw = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (raw += c));
    process.stdin.on("end", () => resolve(raw));
    process.stdin.on("error", () => resolve(""));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let input;
  try {
    input = JSON.parse(await readStdin());
  } catch {
    log(`${new Date().toISOString()}\tSKIP\tstdin 不是合法 JSON`);
    return;
  }
  if (!input || typeof input !== "object") {
    log(`${new Date().toISOString()}\tSKIP\tinput 为空`);
    return;
  }

  // 防御性取值（兼容 camelCase / snake_case）
  const text =
    typeof input.responseText === "string"
      ? input.responseText
      : typeof input.response_text === "string"
        ? input.response_text
        : typeof input.responsePreview === "string"
          ? input.responsePreview
          : null; // null = schema 未知，保守放行
  const toolCalls = Number(input.toolCallCount ?? input.tool_call_count ?? 0);
  const hookActive = Boolean(input.stopHookActive);
  const sessionId = String(input.sessionId ?? input.session_id ?? "?").slice(0, 12);
  const turnId = String(input.turnId ?? input.turn_id ?? "?").slice(0, 12);

  if (fs.existsSync(DONE_FILE)) {
    log(`${new Date().toISOString()}\tSKIP\tMISSION_DONE 已存在\tsession=${sessionId}`);
    return;
  }
  if (text === null) {
    log(
      `${new Date().toISOString()}\tSKIP\tresponseText 缺失（schema 变化?）keys=${JSON.stringify(
        Object.keys(input),
      )}\tsession=${sessionId}`,
    );
    return;
  }

  const busyHit = PATTERNS.some((p) => p.test(text));
  const abnormalEmpty =
    text.trim().length <= EMPTY_TEXT_MAX_LEN && toolCalls > 0;

  if (!busyHit && !abnormalEmpty) {
    log(
      `${new Date().toISOString()}\tPASS\t正常停止（len=${text.length} tools=${toolCalls}）\tsession=${sessionId} turn=${turnId}`,
    );
    return;
  }

  const reason = busyHit ? "命中繁忙文案" : "空回复+有工具调用（异常中断）";
  log(
    `${new Date().toISOString()}\tCONTINUE\t${reason}\tbackoff=${BACKOFF_MS}ms\thookActive=${hookActive}\tsession=${sessionId} turn=${turnId}`,
  );

  if (BACKOFF_MS > 0) await sleep(BACKOFF_MS);

  // 刷新心跳，让班车知道有运行仍然活着（钩子续跑链也算活跃）
  try {
    fs.mkdirSync(NIGHT_DIR, { recursive: true });
    fs.writeFileSync(LOCK_FILE, new Date().toISOString(), "utf8");
  } catch {
    /* 心跳失败不阻塞续跑 */
  }

  const waitedMin = Math.round(BACKOFF_MS / 60000);
  const context =
    `供应商繁忙（系统繁忙）导致上一轮被中断，系统已自动等待约 ${waitedMin} 分钟后续跑。` +
    `请先读 TASK_STATE.md 与 git status / git log 恢复现场认知，` +
    `然后从断点继续执行任务：不要重复已完成的工作，不要向用户提问，不要改变任务计划。`;

  process.stdout.write(
    JSON.stringify({ stopShouldContinue: true, additionalContexts: [context] }),
  );
}

main().catch((e) => {
  log(`${new Date().toISOString()}\tERROR\t${e && e.message}`);
  process.exit(0);
});
