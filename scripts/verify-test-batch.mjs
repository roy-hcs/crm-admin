#!/usr/bin/env node
/**
 * 通用批次验收门禁 —— 替代「人逐格读 flash 回执」。
 *
 * 用法：
 *   node scripts/verify-test-batch.mjs --config scripts/verify-p1.json
 *   node scripts/verify-test-batch.mjs --config scripts/verify-p1.json --skip-mutations
 *   node scripts/verify-test-batch.mjs --config scripts/verify-p1.json --json report.json
 *
 * 设计原则：
 *  1. 判据只在 JSON 配置里，脚本不含任何批次专属知识；新批次复制配置即可。
 *  2. 变异即改即还原，try/finally 保证崩溃也不残留，并校验 git diff 为空。
 *  3. 每项检查产出 {id, ok, detail}，最后汇总并 exit 0/1；不采信任何回执自述。
 *  4. 命令顺序固定为 coverage → lint，用来验「coverage 产物不污染 lint」的顺序解耦。
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const arg = (flag, fallback) => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfgPath = path.resolve(root, arg('--config', 'scripts/verify-p1.json'));
const reportPath = argv.includes('--json') ? path.resolve(root, arg('--json', 'report.json')) : null;
const skipMutations = argv.includes('--skip-mutations');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));

const results = [];
const stripAnsi = s => String(s || '').replace(/\x1b\[[0-9;]*m/g, '');
const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);
const rec = (id, ok, detail) => {
  results.push({ id, ok: !!ok, detail: String(detail).replace(/\s+/g, ' ').trim().slice(0, 400) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${id.padEnd(16)} ${String(detail).replace(/\s+/g, ' ').trim().slice(0, 160)}`);
};

function run(cmd, timeout = 240000) {
  try {
    const out = execSync(cmd, {
      cwd: root,
      shell: true,
      encoding: 'utf8',
      timeout,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out: stripAnsi(out) };
  } catch (e) {
    return { code: e.status ?? 1, out: stripAnsi((e.stdout || '') + (e.stderr || '')) };
  }
}
const git = sub => run(`git ${sub}`, 60000);
// 环境噪声：工具层（shell / sandbox escalation）偶尔会在 cwd 留下 0 字节
// `_tmp_<pid>_<32hex>` 文件。它们不是仓库状态，却会污染「跑前状态」让 V8 误判，
// 且 V11 只清「本轮新增」时清不掉跑前残留。故在工作区纪律判定中排除，V11 统一清理。
const ENV_TMP_RE = /^_tmp_\d+_[0-9a-f]{32}$/;
const isZeroByteEnvTmp = name => {
  if (!ENV_TMP_RE.test(name)) return false;
  try { return fs.statSync(path.resolve(root, name)).size === 0; } catch { return false; }
};
const statusLines = () =>
  git('status --short').out.split('\n').filter(Boolean)
    .map(l => `${l.slice(0, 2)}|${l.slice(3).trim()}`)
    .filter(l => !(l.startsWith('??|') && isZeroByteEnvTmp(l.slice(3))));
const count = (re, s) => {
  const m = s.match(re);
  return m ? Number(m[1]) : null;
};

console.log(`\n=== ${cfg.batch} 批次门禁 · ${new Date().toISOString()} ===\n`);

// ---- 0. 跑前快照：用于「脚本自身无副作用」校验 -------------------------------
const watched = cfg.mustNotChange || [];
const beforeHash = new Map(
  watched.map(f => [f, fs.existsSync(path.resolve(root, f)) ? sha(fs.readFileSync(path.resolve(root, f))) : 'MISSING']),
);
const beforeStatus = statusLines();
const beforeHead = git('log -1 --format=%h').out.trim();
const tsbuildBefore = git('status --short tsconfig.tsbuildinfo').out.trim();
const tmpBefore = new Set(fs.readdirSync(root).filter(n => /^_tmp_\d+_[0-9a-f]{32}$/.test(n)));

// ---- 0b. 工作区纪律：必须在跑任何命令之前判，否则会被门禁自身副作用污染 -----
{
  const baseline = cfg.baselineStatus || beforeStatus;
  const added = beforeStatus.filter(l => !baseline.includes(l));
  const removed = baseline.filter(l => !beforeStatus.includes(l));
  const unexpected = added.filter(l => !(cfg.allowedNewStatus || []).includes(l));
  rec('V8-status', unexpected.length === 0 && removed.length === 0,
    `vs ${cfg.baselineStatus ? '配置的批次基线' : '跑前快照'}: added=${added.length} [${added.join(' ; ')}] unexpected=${unexpected.length} removed=${removed.length}`);
}

// ---- 1. 工具链 / 测试 / 类型 -------------------------------------------------
{
  const v = run('pnpm --version', 60000);
  rec('V1-pnpm', v.code === 0 && v.out.trim() === cfg.pnpmVersion, `pnpm=${v.out.trim()} exit=${v.code}`);
}
{
  const t = run(cfg.commands.test);
  const files = count(/Test Files\s+(\d+) passed/, t.out);
  const tests = count(/Tests\s+(\d+) passed/, t.out);
  // 批次若无法预知用例数（如契约扫描按调用点动态生成 it），改用 minTestFiles / minTests 判下界。
  const filesOk = cfg.expected.minTestFiles != null
    ? files !== null && files >= cfg.expected.minTestFiles
    : files === cfg.expected.testFiles;
  const testsOk = cfg.expected.minTests != null
    ? tests !== null && tests >= cfg.expected.minTests
    : tests === cfg.expected.tests;
  const ok = t.code === 0 && filesOk && testsOk;
  rec('V2-test', ok, `exit=${t.code} files=${files}/${cfg.expected.minTestFiles ?? cfg.expected.testFiles} tests=${tests}/${cfg.expected.minTests ?? cfg.expected.tests}`);
  if (cfg.expected.domMarker) {
    rec('V2b-dom', t.out.includes(cfg.expected.domMarker), `marker=${cfg.expected.domMarker} found=${t.out.includes(cfg.expected.domMarker)}`);
  }
}

// ---- 1b. 批次附加命令（如 P2 的 test:contract）；脚本不含批次知识 ------------
for (const c of cfg.extraCommands || []) {
  const r = run(c.cmd, c.timeout ?? 240000);
  const want = c.expectExit ?? 0;
  rec(`X-${c.id}`, r.code === want,
    `${c.cmd} exit=${r.code}/${want}${r.out.trim() ? ' out=' + r.out.trim().slice(0, 110) : ''}`);
}
{
  const t = run(cfg.commands.typecheck);
  rec('V3-typecheck', t.code === 0, `exit=${t.code}${t.out.trim() ? ' out=' + t.out.trim().slice(0, 120) : ''}`);
}

// ---- 2. coverage → lint 严格相邻，验顺序解耦 --------------------------------
{
  const c = run(cfg.commands.coverage);
  rec('V4-coverage', c.code === 0, `exit=${c.code} (不解读百分比)`);
  const l = run(cfg.commands.lint);
  const errors = count(/\((\d+) errors?/, l.out);
  const warnings = count(/,\s*(\d+) warnings?\)/, l.out);
  const ok = l.code === 0 && errors === cfg.expected.lintErrors && warnings === cfg.expected.lintWarnings;
  rec('V5-lint', ok, `after coverage: exit=${l.code} errors=${errors}/${cfg.expected.lintErrors} warnings=${warnings}/${cfg.expected.lintWarnings}`);
  try { fs.rmSync(path.resolve(root, 'coverage'), { recursive: true, force: true }); } catch { /* ignore */ }
}

// ---- 3. build（可选）+ tsbuildinfo 还原 -------------------------------------
if (cfg.build) {
  if (tsbuildBefore) {
    rec('V6-build', false, `SKIP: tsconfig.tsbuildinfo 跑前非干净 (${tsbuildBefore})，按纪律禁止 checkout 还原`);
  } else {
    const b = run(cfg.commands.build);
    const dirty = git('status --short tsconfig.tsbuildinfo').out.trim();
    if (dirty) git('checkout -- tsconfig.tsbuildinfo');
    const restored = !git('status --short tsconfig.tsbuildinfo').out.trim();
    rec('V6-build', b.code === 0 && restored, `exit=${b.code} tsbuildinfo_dirty=${dirty || 'no'} restored=${restored}`);
  }
}

// ---- 4. git 纪律 ----------------------------------------------------------
{
  const head = git('log -1 --format=%h').out.trim();
  rec('V7-head', head === beforeHead && head.startsWith(cfg.expectedHead), `head=${head} expected=${cfg.expectedHead} (无新 commit/push)`);
}
{
  const changed = watched.filter(f => {
    const p = path.resolve(root, f);
    const after = fs.existsSync(p) ? sha(fs.readFileSync(p)) : 'MISSING';
    return after !== beforeHash.get(f);
  });
  rec('V9-no-touch', changed.length === 0, `watched=${watched.length} changed_during_verify=[${changed.join(', ')}]`);
}

// ---- 5. 静态扫描：断言可追溯 / 禁用绕法 / 文件约定 --------------------------
{
  const problems = [];
  for (const f of cfg.newTestFiles || []) {
    const p = path.resolve(root, f);
    if (!fs.existsSync(p)) { problems.push(`${f}: MISSING`); continue; }
    const src = fs.readFileSync(p, 'utf8');
    const lines = src.split(/\r?\n/);
    // 组级追溯：连续 expect 可共用一条 // assert:，但注释必须在本 it() 块内、且距离有限。
    const window = cfg.assertMaxDistance ?? 8;
    const expectIdx = lines.map((l, i) => (/\bexpect\s*\(/.test(l) ? i : -1)).filter(i => i >= 0);
    const noAssert = expectIdx.filter(i => {
      let boundary = i;
      while (boundary > 0 && !/\b(it|test)\s*\(/.test(lines[boundary])) boundary--;
      return !lines.slice(Math.max(boundary, i - window), i).some(l => /\/\/\s*assert\s*:/.test(l));
    });
    if (noAssert.length) problems.push(`${f}: ${noAssert.length} 个 expect 追溯不到 // assert: (行 ${noAssert.map(i => i + 1).join(',')})`);
  }
  for (const f of cfg.forbiddenScanFiles || []) {
    const p = path.resolve(root, f);
    if (!fs.existsSync(p)) { problems.push(`${f}: MISSING`); continue; }
    const src = fs.readFileSync(p, 'utf8');
    for (const pat of cfg.forbiddenPatterns || []) {
      if (src.includes(pat)) problems.push(`${f}: 含禁用模式 ${pat}`);
    }
    for (const snip of (cfg.requiredSnippets || {})[f] || []) {
      if (!src.includes(snip)) problems.push(`${f}: 缺必需片段 ${snip}`);
    }
    const suffix = (cfg.requiredSuffix || {})[f];
    if (suffix && !f.endsWith(suffix)) problems.push(`${f}: 后缀应为 ${suffix}`);
  }
  for (const f of cfg.implementationFiles || []) {
    const src = fs.readFileSync(path.resolve(root, f), 'utf8');
    for (const pat of cfg.forbiddenPatterns || []) {
      if (src.includes(pat)) problems.push(`${f}: 含禁用模式 ${pat}`);
    }
  }
  rec('V10-static', problems.length === 0, problems.length ? problems.join(' | ') : `${(cfg.newTestFiles || []).length} 个测试文件断言全可追溯、本批新增文件无禁用绕法`);
}

// ---- 6. 变异：改实现 → 必须红 → 还原 → 必须绿 → 零残留 ---------------------
if (!skipMutations) {
  for (const m of cfg.mutations || []) {
    const abs = path.resolve(root, m.file);
    const original = fs.readFileSync(abs, 'utf8');
    const hits = original.split(m.find).length - 1;
    if (hits !== 1) {
      rec(`MUT-${m.id}`, false, `${m.file}: find 命中 ${hits} 次（要求恰好 1 次），配置需更新`);
      continue;
    }
    let red, failed = 0;
    try {
      fs.writeFileSync(abs, original.replace(m.find, m.replace));
      red = run(cfg.commands.test);
      failed = count(/(\d+) failed/, red.out) ?? 0;
    } finally {
      fs.writeFileSync(abs, original);
    }
    const green = run(cfg.commands.test);
    const diff = git(`diff -- ${m.file}`).out.trim();
    const ok = red.code !== 0 && failed >= (m.minFailed ?? 1) && green.code === 0 && diff === '';
    rec(`MUT-${m.id}`, ok,
      `${m.file} [${m.find}] red_exit=${red.code} failed=${failed}/${m.minFailed ?? 1} green_exit=${green.code} diff_empty=${diff === ''}`);
  }
} else {
  console.log('SKIP  mutations (--skip-mutations)\n');
}

// ---- 7. 清理 0 字节 _tmp_*（含跑前残留；不删非空文件） ----------------------
{
  const matches = () => fs.readdirSync(root).filter(n => ENV_TMP_RE.test(n));
  const present = matches();
  const created = present.filter(n => !tmpBefore.has(n));
  const preexisting = present.length - created.length;
  let removed = 0;
  for (const n of present) {
    const p = path.resolve(root, n);
    try {
      if (fs.statSync(p).size === 0) { fs.unlinkSync(p); removed++; }
    } catch { /* 保留非空或非本轮文件 */ }
  }
  const leftover = matches();
  rec('V11-clean', leftover.length === 0,
    `0 字节 _tmp_* 本轮新增=${created.length} 跑前残留=${preexisting} 清理=${removed} 残留=${leftover.length}`);
}

// ---- 汇总 -----------------------------------------------------------------
const failed = results.filter(r => !r.ok);
const report = { batch: cfg.batch, at: new Date().toISOString(), head: beforeHead, pass: failed.length === 0, total: results.length, failed: failed.length, results };
console.log(`\n=== ${report.pass ? 'PASS' : 'FAIL'} · ${results.length - failed.length}/${results.length} 项通过 ===`);
if (!report.pass) console.log('未通过：' + failed.map(r => r.id).join(', '));
if (reportPath) { fs.writeFileSync(reportPath, JSON.stringify(report, null, 2)); console.log(`report -> ${reportPath}`); }
process.exit(report.pass ? 0 : 1);
