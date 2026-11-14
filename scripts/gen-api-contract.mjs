#!/usr/bin/env node
/**
 * P2 · 契约快照生成（REACT-TEST-INFRA-CHECKLIST.md §5 P2 行 / docs/P2-TASK-CARD.md §3 C1/C2）
 *
 * 读 atlas exports/openapi.admin.json → 抽 paths 的 path + method → 写 src/test/contract/admin-paths.json。
 * - info.version 与来源 commit 写入 generatedFrom；version 不硬编码，每次运行重读当时导出（C1）
 * - atlas 缺失 / 解析失败 / info.version 为空 → 明确报错停机，不静默复用旧文件（C1）
 * - 键 = "<METHOD> <path>"；atlas 快照每条 path 只有一个 operation（947 ops / 947 path 已实测），
 *   故每个 path 字符串只在 paths 键里出现一次（C2，保证变异 find 唯一可判）
 * - generatedFrom 不含任何具体 API path（C2）；atlas 只读，本脚本不更新 / 不导出 / 不扩源仓
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'src', 'test', 'contract', 'admin-paths.json');
const atlasDir = process.env.API_ATLAS || 'D:/projects/crm-api-atlas';
const ATLAS = path.join(atlasDir, 'exports', 'openapi.admin.json');

function fail(msg) {
  console.error(`[gen-api-contract] 停机: ${msg}`);
  console.error(`  atlas 文件: ${ATLAS}`);
  process.exit(1);
}

if (!fs.existsSync(ATLAS)) {
  fail('atlas 导出不存在（按 P2 §6 纪律：不自行生成导出，联系维护者处理）');
}
let atlas;
try {
  atlas = JSON.parse(fs.readFileSync(ATLAS, 'utf8'));
} catch (e) {
  fail(`atlas 导出 JSON 解析失败: ${e.message}`);
}
const paths = atlas.paths;
if (!paths || typeof paths !== 'object' || Object.keys(paths).length === 0) {
  fail('atlas 导出无非空 paths 对象');
}
const version = atlas.info && atlas.info.version;
if (!version || typeof version !== 'string') {
  fail('info.version 为空 —— 拒绝生成快照（C1：快照头必须记录当时导出版本）');
}

// info.description 形如 "Snapshot <version>; sources crm@… · knowledgeBase@… · crmFe@… · mamFe@… · crmAdminReact@…."
const desc = (atlas.info && atlas.info.description) || '';
const m = desc.match(/sources ([^.]+)\./);
const sourceCommits = m ? m[1].trim() : 'unknown';

const flat = {};
const methodCount = {};
for (const [p, ops] of Object.entries(paths)) {
  for (const method of Object.keys(ops)) {
    const M = method.toUpperCase();
    flat[`${M} ${p}`] = true;
    methodCount[M] = (methodCount[M] || 0) + 1;
  }
}

const snapshot = {
  generatedFrom: { atlasVersion: version, sourceCommits, generatedAt: new Date().toISOString() },
  paths: flat,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`[gen-api-contract] 快照已写入: ${OUT}`);
console.log(`  atlasVersion : ${version}`);
console.log(`  sourceCommits: ${sourceCommits}`);
console.log(`  path=${Object.keys(paths).length} operation=${Object.keys(flat).length} (${Object.entries(methodCount).map(([k, v]) => `${k}=${v}`).join(', ')})`);
