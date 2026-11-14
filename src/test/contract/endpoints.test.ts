/**
 * P2 · 契约存在性断言（docs/P2-TASK-CARD.md §3 C3/C4；vitest unit project = node 环境）
 *
 * 纯静态：不测页面、不打真实接口、不做 schema 断言（P2 卡 §1）。
 * 扫描 src 下全部 ts/tsx 文件中 9 个 API 导出函数的字面量 URL（排除 test/spec/d.ts；
 * src/api/client.ts 为定义文件非调用点，排除）。归一化口径（在 C3 三个规定动作之外的两个扩展，
 * 已在回执口径差异披露）：
 *   1) 补前导 / —— 部分既有调用点字符串缺前导斜杠，端点归同（补全数打印披露）；
 *   2) 同文件常量前缀解析 —— 形如 `${DEPOSIT_PREFIX}/x` 的模块内 const 字符串解析后可比。
 * 命中判定 = 段级绑定比较：段相等，或任一侧为参数段（调用方 ${...}→{param} 可绑契约 {id} 形态或
 * 契约字面量；反之契约参数段可绑调用方字面量）。比对双侧，oracle = atlas 当前快照内容。
 * 无法静态判定的动态拼接计入 skip 并打印计数（C3），不静默丢弃、不可被白名单吞（白名单只匹配
 * 归一化后的 METHOD+path，skip 项不进入该匹配）。
 */
/// <reference types="node" />
/*
 * 本仓 root tsconfig 未显式加载 node 类型（typecheck 实测 node: 内建模块 TS2591；P2 仅允许改
 * 5 处文件，不能动 tsconfig / 不能装依赖）—— 上面三斜线指令为本文件拉起已安装的
 * @types/node（devDependency），不改动任何配置。若日后 tsconfig 统一加 "types": ["node"]，
 * 本行可删（重复加载无害）。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ALLOWLIST } from './allowlist';

// ---------- 类型 ----------
interface CallPoint {
  file: string;
  line: number;
  fn: string;
  method: string;
  path: string;
  raw: string;
}
interface SkipPoint {
  file: string;
  line: number;
  fn: string;
  reason: string;
}
interface ContractSnapshot {
  generatedFrom: { atlasVersion: string; sourceCommits: string; generatedAt: string };
  paths: Record<string, boolean>;
}

// ---------- 9 个 API 导出函数 → method（client.ts 定义，P2 卡 §2 事实基础） ----------
const API_FUNCTIONS: Array<readonly [string, string]> = [
  ['fetchWithAuth', 'GET'], // options.method 可覆盖；当前仓无外部调用点（仅 client.ts 内部转发）
  ['apiGet', 'GET'],
  ['apiGetCustom', 'GET'],
  ['apiPost', 'POST'],
  ['apiPut', 'PUT'],
  ['apiDelete', 'DELETE'],
  ['apiFormPost', 'POST'],
  ['apiFormPostCustom', 'POST'],
  ['apiPostFormData', 'POST'],
];
const METHOD_BY_FN = new Map(API_FUNCTIONS);
const NAMES = API_FUNCTIONS.map(([n]) => n)
  .sort((a, b) => b.length - a.length)
  .join('|');
const FN_RE = new RegExp(`\\b(${NAMES})\\b(?:<[^<>()]*>)?\\s*\\(`, 'g');

// ---------- 首参提取（处理字符串/模板/${}/嵌套括号/注释，正确处理 ${} 深度回退） ----------
function extractFirstArg(text: string, openParenIdx: number): { arg: string } {
  const stack: Array<string | { expr: number }> = []; // 'sq' | 'dq' | 'tpl' | {expr: 打开时深度}
  let depth = 0;
  let i = openParenIdx + 1;
  let start = -1;
  while (i < text.length) {
    const c = text[i];
    const top = stack[stack.length - 1];
    if (top === 'sq' || top === 'dq') {
      if (c === '\\') {
        i += 2;
        continue;
      }
      if ((top === 'sq' && c === "'") || (top === 'dq' && c === '"')) stack.pop();
      i++;
      continue;
    }
    if (top === 'tpl') {
      if (c === '\\') {
        i += 2;
        continue;
      }
      if (c === '`') {
        stack.pop();
        i++;
        continue;
      }
      if (c === '$' && text[i + 1] === '{') {
        stack.push({ expr: depth + 1 });
        depth++;
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    // code
    if (c === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && text[i + 1] === '*') {
      const e = text.indexOf('*/', i);
      i = e < 0 ? text.length : e + 2;
      continue;
    }
    if (start < 0 && !/\s/.test(c)) start = i;
    if (c === "'" || c === '"') {
      stack.push(c === "'" ? 'sq' : 'dq');
      i++;
      continue;
    }
    if (c === '`') {
      stack.push('tpl');
      i++;
      continue;
    }
    if (c === '(' || c === '[' || c === '{') {
      depth++;
      i++;
      continue;
    }
    if (c === ')' || c === ']' || c === '}') {
      // 关闭模板表达式：出栈并同步回退 ${} 计入的深度
      if (top && typeof top === 'object' && c === '}' && depth === top.expr) {
        stack.pop();
        depth--;
        i++;
        continue;
      }
      if (depth === 0 && stack.length === 0) return { arg: text.slice(start, i).trim() };
      depth--;
      i++;
      continue;
    }
    if (c === ',' && depth === 0 && stack.length === 0) return { arg: text.slice(start, i).trim() };
    i++;
  }
  return { arg: start >= 0 ? text.slice(start).trim() : '' };
}

// ---------- 模板段切分：static / expr ----------
function splitTemplate(inner: string): Array<{ type: 'static' | 'expr'; text: string }> {
  const parts: Array<{ type: 'static' | 'expr'; text: string }> = [];
  let buf = '';
  let i = 0;
  while (i < inner.length) {
    const c = inner[i];
    if (c === '\\') {
      buf += c + (inner[i + 1] ?? '');
      i += 2;
      continue;
    }
    if (c === '$' && inner[i + 1] === '{') {
      let depth = 1;
      let j = i + 2;
      while (j < inner.length && depth > 0) {
        const d = inner[j];
        if (d === "'" || d === '"' || d === '`') {
          const q = d;
          j++;
          while (j < inner.length) {
            if (inner[j] === '\\') {
              j += 2;
              continue;
            }
            if (inner[j] === q) break;
            j++;
          }
        } else if (d === '{') depth++;
        else if (d === '}') depth--;
        j++;
      }
      if (buf) {
        parts.push({ type: 'static', text: buf });
        buf = '';
      }
      parts.push({ type: 'expr', text: inner.slice(i + 2, j - 1) });
      i = j;
      continue;
    }
    buf += c;
    i++;
  }
  if (buf) parts.push({ type: 'static', text: buf });
  return parts;
}

// 查询拼接识别：引号（含嵌套模板）内含 ?，或已知 query 构造器标识符。
// `params.id ? 'edit' : 'add'` 这类三目选路（引号内无 ?）不判为 query，按路径参数处理。
const QUERY_EXPR_RE =
  /['"`][^'"`]*\?|\b(buildQuery|buildParams|queryString|toQueryString|stringifyQuery|URLSearchParams)\b/;
const CONST_RE = (name: string): RegExp =>
  new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*(['"\`])((?:[^'"\\\`\\\\]|\\\\.)*)\\1`);

// ---------- URL 归一化：去 query、${...}→{param}、去 /api 前缀、补前导 /、同文件常量解析 ----------
type NormalizeResult = { path?: string; skip?: string; slashFixed?: boolean };
function normalizeUrl(argText: string, fileContent: string): NormalizeResult {
  const t = argText.trim();
  const sm = t.match(/^'((?:[^'\\]|\\.)*)'$/s) || t.match(/^"((?:[^"\\]|\\.)*)"$/s);
  if (sm) return finish(sm[1].replace(/\\(.)/g, '$1'));
  // 贪婪 .*：整参是单个模板时首尾反引号即外层对（嵌套模板在 ${} 内可安全跨越）
  const tm = t.match(/^`(.*)`$/s);
  if (!tm) return { skip: '非字面量首参: ' + t.slice(0, 50) };
  const parts = splitTemplate(tm[1]);
  let out = '';
  for (const part of parts) {
    if (part.type === 'static') {
      const q = part.text.indexOf('?');
      if (q >= 0) {
        out += part.text.slice(0, q);
        return finish(out);
      }
      out += part.text;
      continue;
    }
    const expr = part.text.trim();
    if (QUERY_EXPR_RE.test(expr)) return finish(out); // 查询拼接：连同其后内容丢弃
    if (out === '' && /^[A-Za-z_$][\w$]*$/.test(expr)) {
      const cm = fileContent.match(CONST_RE(expr));
      if (cm) {
        out += cm[2].replace(/\\(.)/g, '$1');
        continue;
      }
      return { skip: '前缀常量不可静态解析: ' + expr };
    }
    out += '{param}';
  }
  return finish(out);

  function finish(p: string): NormalizeResult {
    let slashFixed = false;
    let v = p;
    if (!v.startsWith('/') && v.length > 0) {
      v = '/' + v;
      slashFixed = true;
    }
    if (v.startsWith('/api/') || v === '/api') v = v.slice(4);
    if (!v.startsWith('/')) return { skip: '归一化后非绝对路径: ' + v.slice(0, 50) };
    return { path: v, slashFixed };
  }
}

// ---------- 快照与命中判定 ----------
const snapshotPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'admin-paths.json');
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8')) as ContractSnapshot;

// 契约参数段 {id} → {*}（统一形态）；调用方参数段保持 {param} 原样以区分方向
const canonContractSegs = (p: string): string[] => p.replace(/\{[^}]+\}/g, '{*}').split('/');
const snapByMethod = new Map<string, Array<{ raw: string; segs: string[] }>>();
for (const key of Object.keys(snapshot.paths)) {
  const sp = key.indexOf(' ');
  if (sp <= 0) continue;
  const method = key.slice(0, sp);
  const raw = key.slice(sp + 1);
  if (!snapByMethod.has(method)) snapByMethod.set(method, []);
  snapByMethod.get(method)!.push({ raw, segs: canonContractSegs(raw) });
}

// 段级绑定比较：段相等，或任一侧为参数段
function pathMatch(callerSegs: string[], contractSegs: string[]): boolean {
  if (callerSegs.length !== contractSegs.length) return false;
  for (let k = 0; k < callerSegs.length; k++) {
    if (callerSegs[k] === contractSegs[k]) continue;
    if (callerSegs[k] === '{param}' || contractSegs[k].startsWith('{')) continue;
    return false;
  }
  return true;
}

// 命中 = pathMatch 成功；未命中时给最近同方法候选（只用于失败信息）
function matchContract(method: string, p: string): { ok: boolean; nearest: string } {
  const segs = p.split('/');
  const list = snapByMethod.get(method) || [];
  for (const e of list) {
    if (pathMatch(segs, e.segs)) return { ok: true, nearest: `${method} ${e.raw}` };
  }
  let best = '';
  let bestD = Infinity;
  for (const e of list) {
    const d = Math.abs(e.segs.length - segs.length);
    if (d < bestD) {
      bestD = d;
      best = `${method} ${e.raw}`;
    }
  }
  return { ok: false, nearest: best };
}

// ---------- 扫描 src（模块级执行一次，各断言共享） ----------
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const SCAN_SKIP = /(\.test\.|\.spec\.|\.d\.ts$)/;
const EXCLUDED_FILES = ['src/api/client.ts']; // 定义文件非调用点（内部转发首参均为变量）

function walkSrc(dir: string, acc: Array<{ rel: string; fp: string }>): void {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkSrc(fp, acc);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(e.name)) continue;
    const rel = path.relative(ROOT, fp).replace(/\\/g, '/');
    if (SCAN_SKIP.test(rel)) continue;
    if (EXCLUDED_FILES.includes(rel)) continue;
    acc.push({ rel, fp });
  }
}

const srcFiles: Array<{ rel: string; fp: string }> = [];
walkSrc(path.join(ROOT, 'src'), srcFiles);

const calls: CallPoint[] = [];
const skips: SkipPoint[] = [];
const slashCompleted: string[] = [];
const perFn: Record<string, number> = {};
for (const [n] of API_FUNCTIONS) perFn[n] = 0;

for (const { rel, fp } of srcFiles) {
  const src = fs.readFileSync(fp, 'utf8');
  FN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = FN_RE.exec(src))) {
    const fn = m[1];
    perFn[fn] = (perFn[fn] || 0) + 1;
    const { arg } = extractFirstArg(src, m.index + m[0].length - 1);
    if (!arg) continue;
    const line = src.slice(0, m.index).split('\n').length;
    const norm = normalizeUrl(arg, src);
    if (norm.skip || !norm.path) {
      skips.push({ file: rel, line, fn, reason: norm.skip || '未知' });
      continue;
    }
    if (norm.slashFixed) slashCompleted.push(`${rel}:${line}`);
    const method = METHOD_BY_FN.get(fn) || 'GET';
    calls.push({
      file: rel,
      line,
      fn,
      method,
      path: norm.path,
      raw: arg.replace(/\s+/g, ' ').slice(0, 70),
    });
  }
}

const allowlistKeys = new Set(ALLOWLIST.map(e => `${e.method} ${e.path}`));

describe('P2 契约断言（atlas 快照 vs src 调用点）', () => {
  it('快照结构完整（C2：generatedFrom + paths 非空）', () => {
    // assert: 守护快照生成口径 —— 快照头必须带当时 atlas 版本（P2 卡 §2：version 每轮重读，
    // 不得照抄旧值）；下界 900 由当前导出 947 path 推导（后续周更只增不减时仍绿）。
    expect(snapshot.generatedFrom.atlasVersion).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/);
    // assert: 守护快照非空 —— 空快照会让全部调用点假性失败或假性通过；当前 947 条为基线。
    expect(Object.keys(snapshot.paths).length).toBeGreaterThanOrEqual(900);
    const badKeys = Object.keys(snapshot.paths).filter(k => !/^(GET|POST|PUT|DELETE) \//.test(k));
    // assert: 守护键格式 = "<METHOD> /path"（C2 结构契约），坏键会让绑定比较静默失配。
    expect(badKeys).toEqual([]);
  });

  it('扫描覆盖完整（C3：9 个 API 函数全部登记，无静默漏扫）', () => {
    const wrappers = API_FUNCTIONS.map(([n]) => n).filter(n => n !== 'fetchWithAuth');
    const emptyWrappers = wrappers.filter(n => (perFn[n] || 0) < 1);
    // assert: 守护 9 函数登记完整 —— 某函数调用点为 0 说明扫描器漏登记（P2 卡 §2：漏一个就是
    // 静默漏测）；当前实测 8 个包装函数均有调用点（apiPostFormData=1 为最小）。
    expect(emptyWrappers).toEqual([]);
    // assert: fetchWithAuth 当前仓外部调用点 = 0（定义在 client.ts，内部转发不属调用点）——
    // 若日后出现直接调用，此断言变红提示把它纳入契约扫描口径评估。
    expect(perFn['fetchWithAuth']).toBe(0);
    // assert: 调用点总量下界 600 由当前实测 629 推导 —— 扫描器结构性失效（如正则失配归零）
    // 会击穿下界，防止「空扫描恒绿」。
    expect(calls.length).toBeGreaterThanOrEqual(600);
  });

  it('每个调用点 method+path 命中契约快照或白名单（C4）', () => {
    console.log(
      `[contract] src 文件 ${srcFiles.length} 个 · 调用点 ${calls.length} · skip ${skips.length} · 补前导斜杠 ${slashCompleted.length}`,
    );
    for (const s of skips) console.log(`[contract] SKIP ${s.file}:${s.line} [${s.fn}] ${s.reason}`);
    const failures: string[] = [];
    for (const c of calls) {
      if (matchContract(c.method, c.path).ok) continue;
      if (allowlistKeys.has(`${c.method} ${c.path}`)) continue;
      failures.push(
        `${c.file}:${c.line} [${c.fn}] ${c.method} ${c.path} (raw: ${c.raw}) -> 最近候选: ${matchContract(c.method, c.path).nearest}`,
      );
    }
    if (failures.length > 0) {
      for (const f of failures) console.log(`[contract] MISS ${f}`);
    }
    // assert: 守护「调用点 ⊆ 契约 ∪ 白名单」（P2 卡 §3 C4）—— 抓 path 拼错 / 参数名与旧版
    // 不一致 / 调用未文档化端点。失败清单含 文件:行 → 调用点 → 最近候选 path。
    // 当前 641 调用点中 633 命中、3 条白名单（见 allowlist.ts 逐条 reason）、3 条 skip 计数打印。
    // 白名单 6 → 4 条（11-14 #4/#6 修复，P2 卡 §9.8）→ 3 条（#5 改投 /editRule 后命中
    // 快照，P2 卡 §9.9）；三次都是调用点修好后由 orphan 断言判红触发的收口，断言未改。
    // P3a 补页新增 5 个 atlas 快照缺口（add / edit / checkNameUnique / checkCodeUnique /
    // listEnabled），按 P3a 卡 §7.3 停机披露；待补页推 origin/develop 后跑 weekly/export 收口，
    // 不塞白名单、不改断言。
    expect(failures).toEqual([]);
    // assert: skip 计数锁口径 —— 无法静态判定的动态拼接必须显式登记而非静默丢弃（C3）。
    // 当前 3 条 = src/api/hooks/system/system.ts:338/354/655 的局部包装函数（首参为 url 变量）；
    // 新增动态拼接须有意识地把此数上调并在回执披露，防止 skip 无限膨胀。
    expect(skips.length).toBe(3);
  });

  it('白名单卫生（C5：≤10 条、字段完整、不覆盖快照；P2b：到期 / orphan）', () => {
    // assert: 白名单上限 10 条（P2 卡 §3 C5），超限说明缺口失控须停机而非堆白名单。
    expect(ALLOWLIST.length).toBeLessThanOrEqual(10);
    const malformed = ALLOWLIST.filter(
      e => !e.reason.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(e.date),
    );
    // assert: 每条白名单必须带非空 reason 与登记日期 —— 无 reason 的条目 = 不可审计的吞红。
    expect(malformed).toEqual([]);
    const stale = ALLOWLIST.filter(e => matchContract(e.method, e.path).ok);
    // assert: 白名单只收「快照没有」的端点 —— atlas 周更覆盖到对应端点后条目自动失效变红，
    // 强制清理（到期即收口，不留陈旧豁免）。
    expect(stale).toEqual([]);
    // P2b —— stale 只判「条目自身 path 是否进快照」，对范围外 / 错 path 的条目结构上
    // 永不触发；下面三条补上「沉底」与「幽灵豁免」两个盲点（P2 卡 §9.6）。
    const unowned = ALLOWLIST.filter(
      e => !/^\d{4}-\d{2}-\d{2}$/.test(e.expires ?? '') || !(e.owner ?? '').trim(),
    );
    // assert: 每条豁免必须有合法 expires 与非空 owner —— 无主、无期限的条目会永久沉底。
    expect(unowned).toEqual([]);
    const todayUtc = new Date().toISOString().slice(0, 10);
    const expired = ALLOWLIST.filter(e => e.expires < todayUtc);
    // assert: 到期未复核即红（UTC 日期比较）—— 时间驱动强制复核；到期只允许收口删条目
    // 或人审复核后改 expires，不许改本断言换绿。
    expect(expired).toEqual([]);
    const orphan = ALLOWLIST.filter(
      e => !calls.some(c => c.method === e.method && c.path === e.path),
    );
    // assert: 孤儿豁免 —— 条目必须仍有同 method+path 的调用点需要它；调用点修好后
    // 忘记删条目会留下无人引用的静默放行，此处变红强制清理。
    expect(orphan).toEqual([]);
  });
});
