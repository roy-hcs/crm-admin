#!/usr/bin/env node
/**
 * A0 只读判卷器（crm-admin/scripts/verify-a0.mjs）
 *
 * 判的是「atlas 扩源：React 后台调用点纳入 admin 契约」是否真的落地，
 * 依据 docs/A0-TASK-CARD.md §4。只读，不写任何文件、不跑 weekly/export、不 commit。
 *
 *   node scripts/verify-a0.mjs                  # V1–V6（A0 本批）
 *   node scripts/verify-a0.mjs --after-p3a     # 追加 V7（P3a 补页 + 再跑 weekly/export 之后）
 *   node scripts/verify-a0.mjs --run-tests     # 追加执行 atlas 全量测试
 *   node scripts/verify-a0.mjs --json          # 输出 JSON
 *
 * A0 未落地时预期 FAIL（exit 1）；这是「还没做完」，不是脚本坏。
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync, execSync } from 'node:child_process'

const ATLAS = 'D:/projects/crm-api-atlas'
const KB = 'D:/projects/crm-knowledge'
const ADMIN = 'D:/projects/crm-admin'
// 11-13 使用者授权：atlas 可在本地 git 提交做记录（不 push）；KB / crm-admin 仍不 commit。
// 228580b = 在途改动固化点（vue3 + 全量 catalog 重生），A0 改动允许作为其后代或工作区改动。
const ATLAS_BASELINE = '228580b'
const KB_HEAD = 'bd28743'
const ADMIN_HEAD = '391f701'
const args = new Set(process.argv.slice(2))
const afterP3a = args.has('--after-p3a')
const runTests = args.has('--run-tests')
const asJson = args.has('--json')

const results = []
const rec = (id, ok, detail, skipped = false) =>
  results.push({ id, ok: !!ok, skipped, detail: String(detail) })

function readJson(p) {
  if (!fs.existsSync(p)) throw new Error(`missing file: ${p}`)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}
function readText(p) {
  if (!fs.existsSync(p)) throw new Error(`missing file: ${p}`)
  return fs.readFileSync(p, 'utf8')
}
function safe(label, fn) {
  try { return fn() } catch (e) { rec(label, false, `读取/解析失败: ${e.message}`); return null }
}
function git(root, ...argv) {
  try {
    return execFileSync('git', ['-C', root, ...argv], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch { return '' }
}

// ---- V1 配置新段存在，且不在 frontends -----------------------------------
safe('V1-config', () => {
  const cfg = readJson(path.join(ATLAS, 'atlas.config.json'))
  const sources = cfg.sources || {}
  const arraySegments = Object.entries(sources).filter(([, v]) => Array.isArray(v))
  const owner = arraySegments.find(([, list]) => list.some(x => x && x.key === 'crmAdminReact'))
  const inFrontends = (sources.frontends || []).some(x => x && x.key === 'crmAdminReact')
  const entry = owner ? owner[1].find(x => x && x.key === 'crmAdminReact') : null
  const ok = !!owner && !inFrontends && !!entry && /crm-admin/.test(entry.root || '')
  rec('V1-config', ok, ok
    ? `新段=${owner[0]} key=crmAdminReact root=${entry.root}（frontends 中=${inFrontends}）`
    : `未发现独立的 crmAdminReact 源段；已有数组段=[${arraySegments.map(([k]) => k).join(',')}]，frontends 命中=${inFrontends}`)
})

// ---- V2 callers 真被发现且归 admin surface --------------------------------
safe('V2-callers', () => {
  const callers = readJson(path.join(ATLAS, 'catalog/callers.json'))
  const arr = Array.isArray(callers) ? callers : (callers.calls || callers.callers || [])
  const mine = arr.filter(c => c && c.repo === 'crmAdminReact')
  const admin = mine.filter(c => String(c.resolvedEndpointId || '').startsWith('admin:'))
  const ok = mine.length >= 200 && admin.length > 0
  rec('V2-callers', ok, `repo=crmAdminReact 的 caller=${mine.length}（阈值≥200，基线 3），其中 admin surface=${admin.length}`)
})

// ---- V3 版本一致性（kb-sync 无条件 export 的验收） -------------------------
safe('V3-version', () => {
  const exp = readJson(path.join(ATLAS, 'exports/openapi.admin.json'))
  const manifest = readJson(path.join(ATLAS, 'catalog/manifest.json'))
  const v = exp.info && exp.info.version
  const s = manifest.snapshotId
  rec('V3-version', !!v && v === s, `info.version=${v} / snapshotId=${s}`)
})

// ---- V4 第 4 源进时钟统一判据 --------------------------------------------
safe('V4-clock', () => {
  const state = readJson(path.join(KB, 'sync/state.json'))
  const reactRepo = state.repos?.crmAdminReact
  const adr = readText(path.join(KB, 'docs/atlas-integration.md'))
  const adrLines = adr.split(/\r?\n/)
  // 判据行本身必须含第 4 源；只出现「尚未落地」的说明文字不算已同步
  const hasKeyInAdr = adrLines.some(l => /manifest\.sources\.\{/.test(l) && /crmAdminReact/.test(l))
  const a = readText(path.join(KB, '.agents/skills/kb-sync/SKILL.md'))
  const b = readText(path.join(KB, '.claude/skills/kb-sync/SKILL.md'))
  const twins = a === b
  const hasSourceRef = /--source-ref crmAdminReact=/.test(a)
  const agePath = path.join(KB, 'scripts/kb-age.mjs')
  const age = fs.existsSync(agePath)
  // 知识基准行必须按 manifest.sources 动态展开，而不是硬编码三源
  const ageDynamic = age && /sourceKeys/.test(readText(agePath))
  const manifest = readJson(path.join(ATLAS, 'catalog/manifest.json'))
  const exp = readJson(path.join(ATLAS, 'exports/openapi.admin.json'))
  const reactCommit = manifest.sources?.crmAdminReact?.commit || ''
  const headOk = !!reactRepo?.head && !!reactCommit && reactCommit.startsWith(reactRepo.head)
  const scopeOk = reactRepo?.scope === 'atlas-only'
  const exportOk = state.atlas?.exportVersion === manifest.snapshotId
    && exp.info?.version === manifest.snapshotId
  const baselineOk = state.atlas?.baselineAdvanced === true
  const ok = hasKeyInAdr && twins && hasSourceRef && age && ageDynamic
    && headOk && scopeOk && exportOk && baselineOk
  rec('V4-clock', ok,
    `ADR判据键=${hasKeyInAdr} 双副本一致=${twins} weekly含新source-ref=${hasSourceRef} ` +
    `kb-age动态源=${ageDynamic} repos.crmAdminReact.head=${reactRepo?.head || '(缺)'}(实读commit=${reactCommit.slice(0, 10)}) ` +
    `atlas-only=${scopeOk} exportVersion=${exportOk} baselineAdvanced=${baselineOk}`)
})

// ---- V5 调用点真的进了导出（usage） --------------------------------------
safe('V5-usage', () => {
  const exp = readJson(path.join(ATLAS, 'exports/openapi.admin.json'))
  let withReact = 0
  let total = 0
  for (const pathItem of Object.values(exp.paths || {})) {
    for (const [method, op] of Object.entries(pathItem || {})) {
      if (!op || typeof op !== 'object') continue
      total += 1
      const callers = op['x-atlas-usage']?.callers || []
      if (callers.some(c => String(c).includes('crmAdminReact'))) withReact += 1
      void method
    }
  }
  rec('V5-usage', withReact > 0, `operations=${total}，其中 x-atlas-usage.callers 含 crmAdminReact 的=${withReact}`)
})

// ---- V6 git 纪律（atlas 本地 commit 已授权 / 禁 push）+ 可选全量测试 -------
{
  const head = git(ATLAS, 'log', '-1', '--format=%h')
  const kbHead = git(KB, 'log', '-1', '--format=%h')
  const adminHead = git(ADMIN, 'log', '-1', '--format=%h')
  const remotes = git(ATLAS, 'remote')
  const noPush = remotes === ''
  let descendant = false
  try {
    execFileSync('git', ['-C', ATLAS, 'merge-base', '--is-ancestor', ATLAS_BASELINE, 'HEAD'], { stdio: 'ignore' })
    descendant = true
  } catch { descendant = false }
  const kbUntouched = kbHead === KB_HEAD
  const adminUntouched = adminHead === ADMIN_HEAD
  let testLine = '（未跑，加 --run-tests 执行）'
  let testsOk = true
  if (runTests) {
    try {
      const pkg = readJson(path.join(ATLAS, 'package.json'))
      const cmd = pkg.scripts?.test
      if (!cmd) { testsOk = false; testLine = 'package.json 无 test script' }
      else {
        execSync(cmd, { cwd: ATLAS, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
        testLine = `"${cmd}" exit 0`
      }
    } catch (e) { testsOk = false; testLine = `atlas 测试失败: ${String(e.message).slice(0, 160)}` }
  }
  rec('V6-discipline', !!head && descendant && noPush && kbUntouched && adminUntouched && testsOk,
    `atlas HEAD=${head || '(git 不可读)'} 基线${ATLAS_BASELINE}后代=${descendant} remote=${remotes || '无(未push)'} / ` +
    `KB HEAD=${kbHead || '(git 不可读)'} 未变=${kbUntouched} / crm-admin HEAD=${adminHead || '(git 不可读)'} 未变=${adminUntouched}；测试：${testLine}`)
}

// ---- V7 仅 P3a 之后 -------------------------------------------------------
if (afterP3a) {
  safe('V7-p3a-paths', () => {
    const exp = readJson(path.join(ATLAS, 'exports/openapi.admin.json'))
    const keys = Object.keys(exp.paths || {}).filter(k => /spreadPermPackage/i.test(k))
    const need = ['add', 'edit', 'checkNameUnique', 'checkCodeUnique']
    const missing = need.filter(n => !keys.some(k => new RegExp(`/${n}$`).test(k)))
    rec('V7-p3a-paths', keys.length > 7 && missing.length === 0,
      `spreadPermPackage path=${keys.length}（基线 7），缺=${missing.length ? missing.join(',') : '无'}`)
  })
} else {
  rec('V7-p3a-paths', true, 'SKIP：非 --after-p3a（V7 属 P3a 补页后的判据，不是 A0 本批）', true)
}

// ---- 汇总 -----------------------------------------------------------------
const active = results.filter(r => !r.skipped)
const failed = active.filter(r => !r.ok)
for (const r of results) {
  const tag = r.skipped ? 'SKIP' : r.ok ? 'PASS' : 'FAIL'
  if (!asJson) console.log(`${tag}  ${r.id.padEnd(16)} ${r.detail}`)
}
if (asJson) console.log(JSON.stringify({ afterP3a, results, passed: active.length - failed.length, total: active.length }, null, 2))
else console.log(`\n${failed.length ? 'FAIL' : 'PASS'} ${active.length - failed.length}/${active.length}` +
  (afterP3a ? ' (--after-p3a)' : '') +
  (failed.length ? `\n未落地项：${failed.map(r => r.id).join(', ')}` : ''))
process.exit(failed.length ? 1 : 0)
