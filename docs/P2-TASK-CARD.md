# P2 批次任务卡 · 契约快照（**11-13 已交付并验收通过**）

> ✅ **状态：11-13 13:35 放行 → 16:20 人审验收通过**（门禁
> `14/14 PASS / exit 0`）。
> **§6 指令已执行完毕、勿重发**；人审独立复核（含首次 13/14 的成因与白名单裁定待办）见
> **§9**。上位：`docs/REACT-TEST-INFRA-CHECKLIST.md`
> §0/§3/§5（**v1.11**）、`docs/TASK-CARD-TEMPLATE.md`；判卷配置
> `scripts/verify-p2.json`。红线十三条、A–D 裁定**不复制只引用**；冲突以清单 + 本卡 +
> JSON 为准。

---

## 1. 这一批做什么

**L2 契约层**：把后端 OpenAPI 快照**入库**，静态扫描 `src/`
的 API 调用点，断言归一化后的 `method + path`
存在于快照。抓的是 path 拼错、参数名与旧版不一致、调用了没在文档化契约里的端点。
**纯静态**：不测页面、不打真实接口、不做 schema 断言、不跑浏览器。

## 2. 事实基础（人审 11-12 实查；flash 不得重新裁定，也不得照旧草案口径做）

| 事实           | 实测                                                                                                                                                                                                                                                                                                               | 对 P2 的硬约束                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| atlas 导出     | `D:/projects/crm-api-atlas/exports/openapi.admin.json`，编制时 7.2MB / `info.version = 2026-10-27T03-37-57-251Z`（**11-13 A0 周更后 = `2026-11-13T04-15-35-768Z`、947 path**），`info.description` 含 `crm@cbe492c20 · knowledgeBase@6d1d123ef(dirty) · crmFe@65f090239 · mamFe@9b8fef840`；文件 mtime 10-27 11:48 | 快照头**必须记录 `info.version` 与来源 commit**，不硬编码今天的日期。**version 保鲜口径已由人裁定（§2 末行）**：导出会随每轮 kb-sync 刷新，P2 执行前须重新读取当时的 `info.version`，不得照抄本表 10-27 的值                        |
| atlas 覆盖     | OpenAPI 3.0.3；`/system/spreadPermPackage*` **7 条 path**：`post applicableUserList / assignAgent / countApplicableUsers / list / remove`、`put change-status`、`get getServerAccountTypes`                                                                                                                        | 清单 §2/§4.1 原写「11 条」**已由实测纠正**。Controller 的 16 端点里 `add` / `edit` / `checkNameUnique` / `checkCodeUnique` / `listEnabled` 等**不在 atlas**。P2 只按 atlas 现有内容生成快照，**不补、不猜**                         |
| atlas 源仓范围 | `atlas.config.json` 的 `sources.admin.root = D:/projects/CRM/crm-admin/src/main`（**旧 RuoYi**），`frontends = crmFe / mamFe`，`vue3 = crm-fe-vue3/crm-fe`；**11-13 起新增独立段 `sources.adminFrontends.crmAdminReact` = React 新后台**（不在 `frontends` 里，避免归错 surface）                                  | A0 已由人审执行完毕（§8 / `docs/A0-TASK-CARD.md`，判卷 6/6）。P2 本批**仍不改 atlas 仓、不扩源仓**，但生成快照须用 A0 周更后的导出（含 React caller），不得拿 10-27 旧快照当最新                                                    |
| 客户端导出     | `src/api/client.ts` 共 **9** 个：`fetchWithAuth`、`apiGet`、`apiGetCustom`、`apiPost`、`apiPut`、`apiDelete`、`apiFormPost`、`apiFormPostCustom`、`apiPostFormData`                                                                                                                                                | 草案 §9 只列 6 个，**漏 `apiGet` / `apiPostFormData`** → 本批扫描目标 = 9 个，漏一个就是静默漏测                                                                                                                                    |
| 测试桩         | `src/api/client.flatten.test.tsx` 有 9 处 P1 专用假路径 `/p1-flatten`                                                                                                                                                                                                                                              | 扫描**排除 `*.test.*` / `*.spec.*`**；不许把假路径塞进白名单（额度留给约定契约）                                                                                                                                                    |
| atlas 保鲜期   | 用户口径：**每次知识库更新同步、最少一周一次**（清单 §3 A3）。**11-12 补充裁定**：`info.version` **无条件同步**，不管 atlas 内容有没有改动                                                                                                                                                                         | 已落到 KB `kb-sync` SKILL §2.5 + `docs/atlas-integration.md` §2.2/§6（双副本一致）。**版本是每轮必变的资产**：`snapshotId` 由每轮 `generatedAt` 生成，零变更也推进；P2 快照生成后若遇周更，须重生快照并人审差异，不许靠旧版本当最新 |

> **version 陈旧的真实根因（11-12 人审实跑，与用户初始判断不同）**：不是「没有 API 改动所以版本没动」。
> `catalog/manifest.json` 已推进到 `2026-11-06`、`sync/state.json` 的
> `atlas.syncedAt=2026-11-07`，说明周更一直在跑；停在 10-27 的是
> `exports/`。原因是 `weekly` 与 `export` 是**两个独立命令** （`bin/atlas.mjs`
> 的 `runWeekly` 不含 `writeExports`），而 kb-sync §2.5 只跑了
> `weekly`。修复 = 补一个无条件的 `export`
> 步骤 + 版本一致性验收，**不需要改 atlas 的版本生成逻辑**。详见
> `D:/projects/crm-knowledge/docs/atlas-integration.md` §2.2 /
> §6 评审记录 11-12 行。

### 2.1 放行前核验（11-13 13:35 人审实跑，留痕；flash 不必复核）

| 项                    | 结果                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| atlas git             | 两个本地 commit：`228580b`（在途基线）/ **`faf3948`**（A0 代码 + 周更产物，26 文件）；`git status` 空、0 remote、未 push                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 导出快照              | `info.version = 2026-11-13T04-15-35-768Z`、947 path；`/system/spreadPermPackage*` 仍 **7** 条；`/system/mtService/list`（post）**仍在** → `verify-p2.json` 的 `MUT-1` / `MUT-2` 的 find 字符串仍有效                                                                                                                                                                                                                                                                                                                                                          |
| 本仓基线              | HEAD `391f701`、`pnpm 10.34.5`、`git status --porcelain` **21 行** = `baselineStatus` 20 行 + `allowedNewStatus` 1 行（`?? docs/A0-TASK-CARD.md`），**完全吻合**；V8-status 的 added 恰为该白名单行、unexpected=0                                                                                                                                                                                                                                                                                                                                             |
| ⚠️ 已知状态（非阻断） | `node /d/projects/crm-knowledge/scripts/atlas-check.mjs` 报 `conclusion=audit-incomplete`，原因 **「契约源 HEAD 已领先快照：crmFe」**：`crm-fe` 的 `origin/develop` 从快照 `50f3541bf` 推进到 `d37911471`（docs 类提交）。`stale=false / ageDays=0 / validationPassed=true / baselineSelfCheck=true`，其余三源未领先。**P2 读的是固定的 11-13 导出快照，不受影响**；按 KB 纪律引用契约结论须写「API 审计未完成 / 截至 2026-11-13 04:15」。**不许为把它修回 ok 而重跑 weekly/export**（A0 卡 §7 明令禁止，会推进快照制造无意义 diff）；下一轮 kb-sync 自然对齐 |
| 结论                  | 门禁判据（`mutations` / `requiredSnippets` / `expectedHead` / `lintWarnings`）**无需改动**，仅把 `_comment` 状态改为「已放行」；P2 据此执行并已验收（§9）                                                                                                                                                                                                                                                                                                                                                                                                     |

## 3. 覆盖表（人定；边界只增不减）

| 组  | 内容                                      | 最低边界                                                                                                                                                                                                                     | 落盘 / project             |
| --- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| C1  | 生成脚本 `scripts/gen-api-contract.mjs`   | 读 atlas → 抽 `paths` 的 path + method → 写快照；把 `info.version` 与来源 commit 写入元信息；**version 不硬编码，每次运行重读当时导出**；atlas 缺失/解析失败或 `info.version` 为空时**明确报错停机**，不静默复用旧文件       | node 脚本，不进 vitest     |
| C2  | 快照 `src/test/contract/admin-paths.json` | 结构 `{ "generatedFrom": { "atlasVersion", "sourceCommits", "generatedAt" }, "paths": { "<METHOD> <path>": true } }`；**每个 path 字符串只在 `paths` 的键里出现一次**，`generatedFrom` 不得含具体 path（保证变异可判）；入库 | 产物，入库                 |
| C3  | 扫描 `src/**/*.ts(x)`                     | 提取 **9 个** API 函数的字面量 URL；排除 `*.test.*` / `*.spec.*`；归一化（去 query、`${...}`→`{param}`、去 `/api` 前缀）；**无法静态判定的动态拼接计入 skip 并打印计数**，禁止静默丢弃                                       | `endpoints.test.ts` / node |
| C4  | 存在性断言                                | 每个调用点归一化后的 `METHOD + path` 必须命中快照；失败打印「文件:行 → 调用点 → 最近候选 path」；每个断言组前 `// assert:`                                                                                                   | 同上                       |
| C5  | 白名单 `allowlist.ts`                     | ≤10 条，每条含 `reason` 与登记日期；**只**用于约定契约 / atlas 版本差缺口；不许用它吞掉扫描失败                                                                                                                              | 同上                       |
| C6  | scripts                                   | `package.json` **只加** `"test:contract": "vitest run src/test/contract"`、`"gen:api-contract": "node scripts/gen-api-contract.mjs"` 两行；不动依赖 / 版本 / `packageManager` / 既有 script                                  | `package.json`             |

> oracle =
> atlas 当前快照的可观测内容，不是产品口径；期望值从快照/实现推不出就停机（R-8）。

**允许落盘仅 5 处**（其余一律不许动）：
`scripts/gen-api-contract.mjs`、`src/test/contract/admin-paths.json`、
`src/test/contract/endpoints.test.ts`、`src/test/contract/allowlist.ts`、
`package.json`（只加 C6 的两行 script）。前三者落在已 untracked 的 `scripts/` /
`src/test/` 内，`git status --short` 不会新增状态行； `verify-p2.json` 的
`allowedNewStatus` **只有 1 行** = 人审 11-13 新增的 `?? docs/A0-TASK-CARD.md`
（模板 §1.2：人审自己新增的文档也要列进去），越界改既有生产代码由
`mustNotChange` 的 hash 判据兜住。

## 4. 验收（门禁判卷，人不逐格读回执）

`node scripts/verify-test-batch.mjs --config scripts/verify-p2.json` → 只看
`PASS n/n` 与 **exit code**。

脚本 11-12 扩展两项通用能力（不含批次知识）：`expected.minTests`
判用例**下界**（契约用例数随调用点变化，不能写死）、 `extraCommands` 跑
`pnpm test:contract`。改完已用 `verify-p1.json --skip-mutations` 回归 **12/12
PASS / exit 0**，P1 判据未受影响。

自动变异 2 组（脚本即改即还原 + `git diff` 为空校验）：

| id                | 改什么                                                                           | 预期                                                      |
| ----------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `MUT-1-callpoint` | `src/api/hooks/setting/setting.ts` 的 `'/system/mtService/list'` → 不存在的 path | 契约用例红 ≥1（对应「故意写一个不存在的 path → 必须红」） |
| `MUT-2-snapshot`  | 快照里的 `/system/mtService/list` → 改坏                                         | 契约用例红 ≥1（证明断言真的在比对快照，不是恒真）         |

> **门禁已知局限**：`git status --short`
> 折叠未跟踪目录，`src/test/contract/`、`scripts/` 下新增文件
> **不会产生新状态行**，V8-status 感知不到。因此回执必须列全落盘文件，人抽查 1~2 处；越界改既有生产代码由
> `mustNotChange`
> 的 hash 判据兜住。门禁判不了「白名单每条理由是否成立」「9 个函数是否真扫到」，这两项归人抽查。

## 5. 停机条件

1. 需改 `client.ts` / 既有页面 / lockfile / vitest 配置 / 工具链才能跑通；
2. 扫描目标少于 9 个函数、测试桩假路径被扫进契约、或动态拼接被静默丢弃；
3. 变异不红 / 还原不绿 / `git diff` 非空；
4. 白名单 >10 条、缺 `reason`，或用白名单吞掉扫描失败；
5. atlas 文件缺失、版本与回执不符却自行换源 / 自行生成导出；
6. 任何越界文件、commit / push、P3–P4 动作、真实接口 / 线上配置写操作。

## 6. 原可复制指令（✅ **已执行完毕、勿重发**；交付与人审见 §9）

> 读 `docs/REACT-TEST-INFRA-CHECKLIST.md`
> §0/§3（v1.11）、`docs/TASK-CARD-TEMPLATE.md`、 `docs/P2-TASK-CARD.md` 与
> `scripts/verify-p2.json`。红线十三条以清单为准，本指令不重复。按 P2 任务卡 §3 覆盖表实现，只落盘 §3 允许的 5 处；生产文件只允许即改即还原的变异。atlas
> **只读**，不自行更新 / 生成导出 / 扩源仓；`info.version`
> 每次运行重读当时文件，当前值 `2026-11-13T04-15-35-768Z`（947
> path），不得照抄任务卡里的 10-27 旧值。
> **A0（React 源接入 atlas）已由人审执行完毕**，两个本地 commit `228580b` /
> `faf3948`；不在本批权限内，别碰、别重跑、别猜实现，也别自行跑 `weekly` /
> `export`。 `crm-knowledge/scripts/atlas-check.mjs` 现报
> `audit-incomplete`（crmFe 的 `origin/develop`
> 领先快照一个 docs 提交）属**已知非阻断状态**（§2.1）；P2 用固定导出快照，
> **别为把它修回 ok 去重跑 weekly/export**，也别因此停机。缺口径就停机回报，带原始输出，不猜、不换方案；新增调用点判红不许塞
> `allowlist.ts` 换绿。做完跑
> `node scripts/verify-test-batch.mjs --config scripts/verify-p2.json`，把门禁 stdout 贴进回执后停机，**门禁 exit
> !=
> 0 不算交付**。回执只填机器判不了的三样：期望值推导、口径差异披露、停机项 / 挂账；并列全落盘文件清单，另附快照头
> `generatedFrom.atlasVersion` 与 path 总数（供人审相对 10-27 / 806
> path 的差异）。不 commit / push、不跑 P3a /
> P3b、不做浏览器验证、不执行夜间无人值守协议。

## 7. 挂账（原样带，不自行处理）

- A1 测试账号 / A2 CI / A4 e2e 通道 / A5 推广域口径；test-plan
  §8 的 7~9 与三处小重构；M1/N4 28 条只读素材不解挂、不生成 case.md；Q 口径 /
  `C-M3-10` / 2 条候选 anchor / `login-ta-*`； **P4
  / 浏览器验证未做**，交付说明如实标注。
- **A3 两项人裁定已于 11-12 关闭**（version 无条件同步 +
  React 接口纳入 atlas），处置见 §2 事实基础末段与
  **§8**；不再作为「待人裁定」挂账。

## 8. 前置批次 A0 · React 接口纳入 atlas（**11-13 已执行完毕；仍不在 P2 本批权限内**）

> 用户 **11-13 确认方向**：「扩 atlas 源仓让 React 调用点进契约」，目的 =
> **atlas 也能收集后端抛给后台使用的 API 接口信息**；同日二次裁定
> **仍保持 usage-driven（路线 A，否决 admin 全量）**，并授权 atlas 本地 git 提交做记录。
> **完整执行记录 = `docs/A0-TASK-CARD.md`（§0.1 实跑 / §4.1 判卷）；判卷 =
> `scripts/verify-a0.mjs`**。 **A0 已由人审执行完毕：`verify-a0.mjs --run-tests`
> 6/6 PASS / exit 0（V7
> SKIP）**，本节只留 P2 需要知道的结论与判据修正，不重复实现细节。P2 /
> P3a 的 flash **不得**自行执行 / 重跑 A0 任何一条（R-1；A0 卡 §7 明写勿重发）。

### 8.1 11-13 人审新实证（补强并纠正 11-12 的判断）

| 事实                                                                                                                                                                | 对 A0 / P2 的影响                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **atlas 是 usage-driven**：`src/reconcile.mjs:62-67` 只有被 UI 调用点匹配到的后端 route 才 `ensureEndpoint` → catalog → exports（标题即 `UI-used, static catalog`） | 「后端定义的 API」≠「契约里的 API」。A0 的价值是让 React 调用点成为 **admin caller**，不是把 16 个端点整批搬进来。**11-13 使用者已裁定保持 usage-driven（路线 A）**，admin 全量（路线 B）已否决                                                                                       |
| 权限包 Controller **16 端点** → `catalog/endpoints/admin.json` **11 条** → `exports` **7 条**                                                                       | 11 条里 4 条是 `response.kind='view'` 被 `exports.mjs:82` 跳过；差的 5 个（`POST /add`、`POST /edit`、`checkNameUnique`、`checkCodeUnique`、`GET /listEnabled`）是旧模板变量拼接调用（`add.html:1082` `$.operate.saveTab(prefix + "/add", data)`）没被提取 → 无 caller → 不进 catalog |
| `vite.config.ts:21-26`：`/api` → `http://admin-1.hcs55.com:38080`，rewrite 去 `/api`                                                                                | React 后台调的就是旧 RuoYi `/system/*` Controller，属 **admin** surface                                                                                                                                                                                                               |
| 现有提取器对 React 源实测：**868 文件 → 6 calls / 3 paths（碎片误识别）/ `apiFunctions=0`**                                                                         | 加一行 `frontends` 配置 = 假绿，这条 11-12 的判断成立且被量化                                                                                                                                                                                                                         |
| React 实际调用点（864 个非测试文件）：**266 calls / 245 唯一路径**（`apiFormPost` 187、`apiPost` 68 …），**205 条精确命中 admin catalog**                           | 后端给后台用的 API 大部分**已在 catalog**，缺的是调用点归属；A0 的 V2 阈值（React caller ≥200、归 admin）由此而来                                                                                                                                                                     |
| `info.version=2026-10-27` vs `snapshotId=2026-11-06`（`verify-a0.mjs` V3 实跑）                                                                                     | 再次印证 kb-sync 补 `export` 的必要性；**A0 落地后已相等**：两者均为 `2026-11-13T04-15-35-768Z`                                                                                                                                                                                       |

### 8.2 判据修正（**原 §8.2 判据 3 已作废**）

- 旧写法「`/system/spreadPermPackage*` path 数从 7 上升到含
  `add`/`edit`/`check*`」**不是 A0 的验收判据**：React 侧现在**没有该页面**（P3a 才补），A0 单独跑完 path 仍是
  **7**。已移入 `A0-TASK-CARD.md` §4
  **V7**（`node scripts/verify-a0.mjs --after-p3a`），触发时机 = **P3a 补页推到
  `origin/develop` 之后**再跑一轮 weekly/export（detached
  worktree 只看远端 ref）。
- A0 本批判据 = **V1–V6**：配置独立源段（不在 `frontends`）、React caller
  ≥200 且 `admin:` surface、
  `exportVersion == snapshotId`、时钟统一键（`state.json.repos` / ADR §2.3 /
  kb-sync 双副本 / `kb-age.mjs`）同步、 `x-atlas-usage.callers`
  含 React 调用点、git 纪律。
- **11-12
  §8 末尾「两种理解待确认」已关闭**：用户 11-13 明确选「扩源仓」路线。同日新增的 usage-driven 口径裁定也**已关闭（选路线 A）**，结论写进 A0 卡 §2 与 KB
  ADR-004 §2.3/§6；flash 不得自选，也不得再以「待裁定」为由停机。
- A0 实际判据 V1–V6 已全绿；V6 按使用者授权允许 atlas **本地 commit**（基线
  `228580b` 的后代），但仍禁 push、KB / crm-admin HEAD 未变。

### 8.3 顺序（与 A0 卡 §5 一致）

```
【已完成 11-13】atlas 在途改动提交为 228580b + 路线 A 裁定
  → A0-1..7 → weekly --publish + export → verify-a0 --run-tests（6/6）
  → atlas 第二个 commit faf3948（A0 代码 + 周更产物，工作区干净、不 push）
【已放行 11-13 13:35】P2（含快照生成）→ 人审相对 10-27 / 806 path 的差异
  → P3a 补页（推 origin/develop）→ 再跑 weekly/export → verify-a0 --after-p3a（V7）
  → 重跑 P2 扫描 → P3b
```

> **A0 已完成**：P2 生成快照时按**当前导出**取 `info.version` （11-13 值
> `2026-11-13T04-15-35-768Z`、**已含 React 源**、`openapi.admin.json` 947
> path），快照头记录版本与来源 commit；相对 10-27 / 806
> path 旧快照须人审差异。仍不许把 7 条 `spreadPermPackage`
> path 当最终覆盖（V7 属 P3a 之后）。atlas 两个本地 commit 均已落地（`228580b` /
> `faf3948`，**无 remote、不 push**、工作区干净）。

---

## 9. 人审验收记录（11-13 16:20；**非执行指令，flash 勿据此动手**）

### 9.1 独立实跑（不采信回执自述）

| 项          | 结果                                                                                                                                                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 门禁第 1 次 | **13/14 FAIL / exit 1**，仅 V8-status 挂：`added=5 [??\|_tmp_*]`。成因 = 5 个 **0 字节** `_tmp_\d+_[0-9a-f]{32}` 文件（门禁自身临时文件模式，mtime 与跑门合同时刻）污染了跑前 `beforeStatus`；V11 因 `tmpBefore` 已含它们判 `created=0` 故未清理。**与 P2 落盘产物无关** |
| 处置        | 先按「0 字节 + 命名匹配」规则删 5 个文件，`git status` 回到 21 行、重跑 14/14；但后续复跑**再次出现残留**（可重复），故已修门禁脚本，见下方「工具链修复」                                                                                                                |
| 门禁第 2 次 | **PASS 14/14 / exit 0**（V8 `added=1 [??\|docs/A0-TASK-CARD.md] unexpected=0`；V2 `58/55`；MUT-1/2 均 `red=1 → 还原绿 → diff 空`；V11 残留 0）                                                                                                                           |
| 环境        | 人审 shell = **node v22.22.2 / pnpm 10.34.5**，`typeof localStorage === 'undefined'`，**默认环境直接跑绿**，不需要 flash 回执里的 fnm node20 PATH 注入。node 25 的 webstorage 问题是 flash agent shell 特性，不影响交付物                                                |
| git 纪律    | HEAD `391f701` 未变；终态 21 行 = 基线 20 + `?? docs/A0-TASK-CARD.md`；无 commit / push；`_tmp_*` 残留 0                                                                                                                                                                 |

> ✅ **门禁工具链已修（11-13 16:40，人审）**：根因 = **工具层（shell / sandbox
> escalation）** 在 cwd 留下 0 字节 `_tmp_<pid>_<32hex>` 垃圾；单独跑
> `pnpm test / test:contract / typecheck / lint / build`
> 均不产生，故**与 P2 落盘产物、与 vitest 均无关**。原 `V8-status`
> 在跑命令前把这类文件当新增状态、`V11-clean`
> 又只清「本轮 created」，导致「13/14 仅 V8 挂」且无法自愈。修复
> `scripts/verify-test-batch.mjs` **两处、未动任何判据**：① `statusLines()`
> 过滤「`??|` + 严格命名 + 0 字节」条目；② `V11-clean` 统一清理所有 0 字节
> `_tmp_*`（含跑前残留），detail 分别打印本轮新增 / 跑前残留 / 清理 / 残留。
> **验证**：跑前故意留 15 个残留（状态 36 行）→ V8 仍判
> `added=1 unexpected=0`、V11 清 15 个 → **连跑两次均 14/14 / exit
> 0**、终态 21 行零残留。P1 配置回归 `10/12`：仅
> `V8-status`（P1 基线未含后加的 8 个文件）与
> `V2-test`（P1 期望精确 4 文件/54 用例，现 5/58）因**基线时效**挂，属预期；其余 V1/V2b/V3–V7/V9/V10/V11 全绿，且 V8 仍准确报出 8 个真实新增 →
> **过滤未削弱严格性**。 **不改 `verify-p1.json` / `verify-p2.json` 的任何
> `allowedNewStatus` 或期望值换绿。**

### 9.2 交付物复核

| 项                  | 复核结果                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 落盘                | 恰 §3 允许的 5 处；`package.json` 只加 2 行 script；`gen-api-contract.mjs` 的 version 运行时重读、缺失 / 解析失败 / 空 version 三段停机齐备                                                                                                                                                                                                                                                                                    |
| 快照                | `atlasVersion=2026-11-13T04-15-35-768Z`（与 atlas 实文件相等）、947 键（POST 768 / GET 167 / PUT 9 / DELETE 3）、`generatedFrom` 无具体 path、`/system/mtService/list` 子串恰 1 次（MUT-2 可判）、`spreadPermPackage` 7 条                                                                                                                                                                                                     |
| **806 → 947 差异**  | 用 `git show 228580b:exports/openapi.admin.json`（即 10-27 / 806 path 基线）实跑 diff：**added=141 / removed=0 / net=+141**；新增按首段 `/system` 137 + `/common` `/crm` `/googleAuthenticator` `/loginConfig` 各 1。**纯增零回退**，符合「边界只增不减」，回执 +141 属实                                                                                                                                                      |
| 白名单 6 条后端证据 | 逐条到 `CRM/crm-admin/src/main/java` 只读核证，全部属实：`GrobalSearchController.java:21 @RequestMapping("/system/grobal/search")` + `:30 @PostMapping("list")`；`CrmUserVipController.java` 有 `GET /edit/{id}`、无 `POST /edit`（保存是 `POST /editRule:287`）；`CrmUserRebateTemplateController.java:79/:91` 与 `CrmInfoVerifyController.java:199/:385` 双参映射实存；`CrmUserProtocolRelationController.java:103` 正常映射 |

### 9.3 验收结论与**待用户裁定**（C 类，人审不自行处置）

**结论：P2 验收通过**（门禁 14/14、纯增零回退、证据链闭合、白名单可逆）。但下列 3 项
**未关闭**，不得当作「已解决」：

1. **白名单登记口径**：C5 限定「**只**用于约定契约 /
   atlas 版本差缺口」。`ALLOWLIST` 的 #4 `/grobal/search/list`、#5
   `/system/crmUserVip/edit`、#6 `…//oneUserProtocol/{param}`
   是**调用点缺陷**，不属这两类（回执自己已标「待人审裁定」）。本批把它们作为「已定位、待处置」的**过渡登记**接受，**不是**判为正当缺口；处置需单独放行。
2. **卫生断言盲点（重要）**：`endpoints.test.ts:344` 的 `stale` 只在
   `matchContract(method, path).ok`（快照覆盖到该条）时变红。**11-13 人审实跑：6 条白名单对 947 键快照的段级绑定命中全部为 0**
   —— #2 /
   #3 仅在「下一轮 atlas 周更确实补出双参变体」这**一个条件**下才可能收口；#1 /
   #4 / #5 / #6 的 path 是错 path
   / 范围外 path，后端无对应映射，**结构上永不进 atlas**，会永久沉底。另一盲点：即使按 ③ 修好调用点，条目字符串不变，卫生断言仍不红 → 留成无人引用的「幽灵豁免」。建议下批给
   `AllowlistEntry` 加 `expires` / `owner` 及到期 + orphan 断言——
   **P2 本批未改**；11-13 23:2x 使用者放行独立小批次 **P2b**，已落地，见 §9.6。
3. **修复归属（前提已修订，见 §9.4）**：#4 / #5 / #6 若确认要改，动的是
   `src/api/hooks/common/index.ts:10` / `account/index.ts:624` /
   `review/review.ts:719`
   等**生产代码**，超出 P2「只落盘 5 处、不改生产代码」权限。删白名单条目即红（可逆），但**不许**为让测试绿而反过来改调用点。

> 裁定进度（11-13
> 17:44）：使用者**认同 ①②**，并纠正 ③ 的前提（详见 §9.4）；③ 现重定义为「**先只读排查定成因，再谈修复**」。P2 产物保持现状、**不重跑 weekly/export**、不动生产代码。P3a
> / P3b / P4 仍未放行。 **11-13
> 23:2x 更新**：① 采纳、② 放行并完成（P2b，§9.6）、③
> #4/#6 只读探测已执行但会话层登录失败 → 按兜底口径登记 BUG-P2-01/03（§9.5）；#5 静态闭合挂账。三条 bug 的**生产代码修复仍需单独放行**，本批未动。

### 9.4 使用者口径修正 + 只读排查结论（11-13 17:39 / 17:44）

**使用者澄清**：①「真实后台」=
**测试环境**，不影响生产；② 仍须避免副作用操作，「试试能不能通」（404
= 端点不存在 / 其它报错 = 端点存在但参数无效）是好思路，但**更稳妥的是直接去 CRM 代码库按图索骥**；③「大部分」= 认同 ①②，③ 的前提「后台不可测」不成立 —— 除近两周新增代码外，**99% 代码都真正在线上取过数据、验证过**，故不应先验怀疑 API 写错，应先排查。

**人审据此撤回上一轮的推论**：「未上线 ⇒ 无法运行时验证、#4/#5 只能等上线再验」作废；「三条是代码写错」降级为「**静态不一致，成因待排查**」。以下排查**全程只读**，CRM 仓基线 HEAD
`10981ad079`（2026-11-10 release）。

| #   | 旧 RuoYi 模板写法（oracle）                                                                                                         | 后端真实映射（CRM 仓）                                                                                                                                                                                                                                        | React 调用点                                                | 判定                                                                                                                                                                                                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #4  | `templates/index.html:1005/1051` `ctx + "system/grobal/search/list"`；`ctx = [[@{/}]]`、`application.yml:7 context-path=/`          | `GrobalSearchController.java:21 @RequestMapping("/system/grobal/search")` + `:30 @PostMapping("list")`                                                                                                                                                        | `common/index.ts:10` `/grobal/search/list`                  | React **少 `/system`**；CRM 仓内**找不到**任何补偿：`client.ts:8 API_BASE_URL='/api'`、`:30 fetch('/api'+url)` 无前缀注入、`apiFormPostBase` 无前缀、`vite.config.ts:25` rewrite 只去 `/api`、无 nginx / gateway / mvc pathmatch 配置、`.env*` 的 `VITE_API_URL` 分支在 `client.ts:9-10` 已被注释 |
| #5  | `templates/system/crmUserVip/edit.html:227` `$.operate.postJson(prefix + "/editRule")`；`prefix = ctx + "system/crmUserVip"`        | `CrmUserVipController.java:38 @RequestMapping("/system/crmUserVip")` + `:287 @PostMapping("/editRule")`；**无** `POST /edit`（父类 `NoticeController→CalculateController→BaseController` 无任何 `@*Mapping`；全仓其它 Controller 的 `POST /edit` 与本类无关） | `account/index.ts:624` `apiPost('/system/crmUserVip/edit')` | React **与旧模板、后端都不一致**；`CustomerLoyaltyPlanConfig.tsx:337` `onSubmit` 真会 `await edit({id,...payload})` → **写操作**                                                                                                                                                                  |
| #6  | `CrmUserProtocolRelationController.java:103 @GetMapping("/oneUserProtocol/{userId}")`（类级 `:36 /system/crmUserProtocolRelation`） | 单斜杠                                                                                                                                                                                                                                                        | `review/review.ts:719` `//oneUserProtocol`                  | React 仓**唯一一处**双斜杠；`agent.ts:177` 同端点用单斜杠；CRM 仓无路径归一化配置                                                                                                                                                                                                                 |

**时间与调用链（使用者口径成立，但须划出例外）**：#4 引入于
`9ca7841`（2025-12-15，CRM-6298 layout）、#5
`6e837f9d`（2026-06-09，客户忠诚计划整套交互）、#6 `99e721e`
（2026-04-03，开户审核详情）—— 均**非近两周新增**，且分别被 `Header.tsx:18` /
`CustomerLoyaltyPlanConfig.tsx:120` / `KycInfoPage.tsx:31`
真实调用。但「在线上取过数据」指的是**端点在旧 RuoYi 后台跑过**；React 后台未上线，这 3 行
**URL 字符串是重构搬运时新写的**，其中 #5 是**保存 mutation**（不属于「取数据」），恰好落在「未验证」的例外里 —— 这解释了老代码为何仍会留下这三条不一致。

**对三项裁定的影响**：

- ① 口径：C5 严格口径仍建议保持（三条是**调用点侧**不一致，不是约定契约 /
  atlas 缺口），但定性措辞改为「静态不一致、归因待定」，不再先验断言「代码写错」。
- ② 机制：**不变**，仍建议单独放行 `expires` / `owner` + 到期 /
  orphan 断言的小批次。
- ③ 重定义：先定成因再谈修复。**#5 证据链已闭合**（旧模板与后端一致指向
  `/editRule`），按图索骥即可，**无需跑接口、且绝不触发写操作**；#4 /
  #6 剩「代理层 / 容器是否归一化」这一层 CRM 仓查不到，是运行时探测唯一用武之地。

**运行时通道的边界（未放行，不得自行开跑）**：`vite.config.ts:21-26` 把 `/api`
代理到测试环境 `http://admin-1.hcs55.com:38080`（rewrite 去
`/api`），`client.ts:30 credentials:'include'` 依赖 session
cookie 登录态 → 浏览器人工验证可行。R-5 禁的是「**测试里**打真实网络」（自动化测试须 MSW 离线），人工运行时验证是**独立通道**、须单独放行，R-5 不变；P2 本批按 §1「纯静态」完成，「未在浏览器验证」的交付说明如实保留。若放行探测：只对 #4（POST 查询）/
#6（GET 查询）发**不带有效参数**的只读请求，按「404
= 端点不存在 / 其它报错 = 端点存在但参数无效」判读，两者都不落库；
**#5 绝对不发**（会带 `{id, ...payload}` 落库），只能拦截请求形状或由后端确认。

### 9.5 运行时只读探测结论 + 缺陷台账（11-13 23:2x，使用者放行）

**放行原话**：「#4 和 #6 放行只读探测，如果读不到，那就视为接口有误，标记成待处理的 bug」。

**探测设计**：A/B 对照（A = React 仓写法，B
= 后端真实映射作**阳性对照**）。阳性对照是关键 —— 否则「没登录」会被误读成「接口不存在」。四条请求均为不带有效业务参数的查询：#4
`POST /grobal/search/list` vs `POST /system/grobal/search/list`；#6
`GET /system/crmUserProtocolRelation//oneUserProtocol/0` vs 单斜杠对照。

**实跑记录（全程只读，未改任何生产代码 / 配置）**：

| 步骤       | 结果                                                                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 无凭证探底 | 4 条全部 `HTTP 302 → /login`（Shiro 在路由前拦截）→ **此形态不能判定接口存在与否**                                                                 |
| 会话来源   | `crm-e2e/.env` 有 `E2E_ADMIN_ACCOUNT/PASSWORD` + `admin/client.ts` 现成登录三连（AES-ECB + secretKey），凭证齐备（值未回显、未写入任何被跟踪文件） |
| 登录一次   | `POST /login` → `status=200, code=500, msg="暂时无法登录，请稍后重试"`；按客户端纪律「失败不重试，避免滑块 / 账号锁定」**立即停止，未二次尝试**    |
| 业务请求   | **0 条**。会话未建立，A/B 对照未能执行；临时探针脚本写在系统 temp、跑完已删                                                                        |
| #5         | **未发任何请求**（写操作，红线），保持静态挂账                                                                                                     |

**判读（必须如实分层）**：这是**会话层「读不到」**，不是「已证实 404」。按使用者兜底口径「读不到即视为接口有误」，#4
/ #6 登记为**待处理 bug**；判据 =
§9.4 的静态不一致 + 本次探测未完成，**不得对外表述为「运行时已证实接口不存在」**。若日后拿到可用会话，按上表 A/B 设计重跑即可定死（B 非 404 才算有效会话；A
404 而 B 非 404
→ 缺陷坐实；A 与 B 同结果 → 存在代理层 / 容器补偿，缺陷登记撤销）。

> **⚠️ 2026-11-14 16:0x 结论更新**：已拿到有效会话并按本设计重跑，见 **§9.7** ——
> #4 / #6 **A 404 + B
> 200，缺陷由运行时坐实**；A/B 结果不同 ⇒ 不存在代理层 / 容器补偿，登记不撤销。本节「会话层读不到」保留作历史记录，**不再作为当前结论**。

**缺陷台账（3 条；白名单 `bugId` 与之关联，均不改生产代码）**

| ID            | 调用点                                           | 静态证据                                                           | 探测结论                          | 状态 / owner                                                       | 建议处置                                                                          | 禁止事项                                               |
| ------------- | ------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **BUG-P2-01** | `common/index.ts:10` `/grobal/search/list`       | 少 `/system`；CRM 仓无补偿配置（§9.4）                             | 会话层读不到 → 按兜底记为接口有误 | **待处理 bug** / `crm-admin-frontend`                              | 补 `/system` 前缀；若确认网关层 rewrite 存在，撤销本条并说明补偿位置              | 不得为让契约套件绿而改调用点；删白名单条目即红（可逆） |
| **BUG-P2-02** | `account/index.ts:624` `/system/crmUserVip/edit` | 旧模板与后端**一致**指向 `/editRule:287`；父类链无 `/edit`（§9.4） | **不探测**（写操作）              | **静态证据闭合、挂账待后端 / 产品确认语义** / `crm-admin-frontend` | 确认 `CrmUserVipEditParams` 与 `/editRule` 入参一致、该 mutation 是否死代码后再改 | **绝不发写请求**；不得只凭静态证据改保存逻辑           |
| **BUG-P2-03** | `review/review.ts:719` `//oneUserProtocol`       | React 仓唯一双斜杠；`agent.ts:177` 同端点单斜杠（§9.4）            | 会话层读不到 → 按兜底记为接口有误 | **待处理 bug** / `crm-admin-frontend`                              | 去掉多余 `/` 与正常写法对齐；或先验证容器是否归一化 `//`                          | 同上，不为绿改调用点                                   |

> 三条均**保留白名单条目**（删了契约套件即红），由 §9.6 的到期机制强制复核，不靠「沉底」自然消失。**本批未修任何生产代码**。

### 9.6 P2b 独立小批次验收记录（11-13 23:2x，使用者放行）

**放行原话**：「放行独立小批次」（即 §9.3 ② 的 `expires` / `owner` + 到期 /
orphan 断言）。

| 项         | 结果                                                                                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 改动范围   | **仅 2 个已跟踪文件**：`src/test/contract/allowlist.ts`（接口加 `expires` / `owner` / `bugId?`，6 条逐条补齐）、`endpoints.test.ts`（在**既有**白名单卫生 `it()` 内加 3 组断言）。**零新增文件** → `git status` 仍 21 行，V8 `unexpected=0` |
| 三条新断言 | ① `unowned`：`expires` 格式合法 + `owner` 非空；② `expired`：UTC 日期比较，到期未复核即红；③ `orphan`：条目必须仍有同 `method+path` 的调用点 → 杀「幽灵豁免」                                                                               |
| 盲点收口   | 原 `stale` 只判「条目 path 是否进快照」，#1/#4/#5/#6 结构上永不触发 → 现由 **①+② 强制到期复核**；调用点修好后忘删条目 → 现由 **③ 变红**                                                                                                     |
| 期限       | #2/#3 `2026-11-20`（V7 周更可能补出双参变体）；#1/#4/#5/#6 `2026-11-27`。到期只允许「收口删条目」或「人审复核后改 `expires`」，**不许改断言换绿**                                                                                           |
| 专项变异   | 3/3 变红：`MUT-1` 把 `expires` 改过去日期、`MUT-2` 清空 `owner`、`MUT-3` 插入一条无人引用的孤儿条目 → 均 `red_exit=1`，还原后 `exit=0`、字节一致、临时脚本已删。**未改 `mutations` 配置**，变异在 `allowlist.ts` 内完成                     |
| 门禁       | `node scripts/verify-test-batch.mjs --config scripts/verify-p2.json` → **14/14 PASS / exit 0**；V2 `5/5 · 58/55`、V5 `0e/49w`、V10 断言全可追溯、MUT-1/2 仍 `diff_empty=true`、V11 清 4 个跑前残留后零残留                                  |
| 配置纪律   | **`verify-p1.json` / `verify-p2.json` 一字未动**（`allowedNewStatus`、期望值、`requiredSnippets` 均未改）；`admin-paths.json` 未动；三仓 HEAD 未变（`391f701` / `faf3948` / `bd28743`），无 commit / push                                   |
| 未做       | 未修 BUG-P2-01..03 任何生产代码；未重跑 weekly/export；未做浏览器验证；P3a / P3b / P4 仍未放行                                                                                                                                              |

**到期提醒（给后续会话）**：`2026-11-20`
起 #2/#3 若 V7 周更补出双参变体，`stale` 与 `expired`
会同时变红 —— 那是**正常收口**，删除对应条目即可；**不要**为了让门禁绿去改快照、塞白名单或改断言。

### 9.7 有效会话下的 A/B 复核：#4 / #6 缺陷运行时坐实（11-14 16:0x）

**会话来源**：使用者在浏览器已登录后台并提供一条真实请求 curl，从 `Cookie`
头提取 Shiro 会话
`crmBackSessionId`。**值不落任何被跟踪文件 / 日志 / 记忆，临时探针跑完即删**。因此**零登录请求**、零账号密码、零写操作；沿用 §9.5 的 A/B 设计，另加一条使用者 curl 里的已知有效端点作会话阳性对照，避免把「会话失效」误判成「接口不存在」。

**实跑原始结果（5 条，全部不带有效业务参数，`redirect: manual`）**：

| tag                       | method + path                                                   | status  | 响应要点                                                        |
| ------------------------- | --------------------------------------------------------------- | ------- | --------------------------------------------------------------- |
| `SANITY-session`          | `GET /system/mtAccountSetting/getAllCurrency`                   | **200** | `code:0 操作成功` + 币种数据 ⇒ **会话有效、探测方法可信**       |
| `#4-A-react`              | `POST /grobal/search/list`                                      | **404** | 空 body、无 `content-type`                                      |
| `#4-B-backend`            | `POST /system/grobal/search/list`                               | **200** | `code:0 操作成功` + 菜单数据 ⇒ 端点存在且可用                   |
| `#6-A-react-double-slash` | `GET /system/crmUserProtocolRelation//oneUserProtocol/0?from=1` | **404** | 空 body、无 `content-type`                                      |
| `#6-B-backend`            | `GET /system/crmUserProtocolRelation/oneUserProtocol/0?from=1`  | **200** | `code:500 系统错误` ⇒ 参数无效导致业务错，**非 404 = 端点存在** |

**按 §9.5 事先约定判据判读**：B 两条均非 404
⇒ 会话与探测方法有效；A 两条均 404 且 B 均非 404 ⇒ **BUG-P2-01 /
BUG-P2-03 由「按兜底登记的待处理 bug」升级为「运行时已证实的接口错误」**；A /
B 结果不同 ⇒
**不存在代理层 / 容器归一化补偿**，缺陷登记不撤销，§9.4 的静态结论（#4 少
`/system`、#6 孤立双斜杠）得到运行时确认。#5 依旧**未发任何请求**（写操作红线），BUG-P2-02 保持静态挂账待后端 / 产品确认语义。

**台账更新**：BUG-P2-01 / 03 状态 → **已证实、待放行修复**（owner
`crm-admin-frontend`），修复建议不变（补 `/system` 前缀 / 去掉多余
`/`）。**白名单条目仍保留、删即红**；
`allowlist.ts`、调用点、生产代码、门禁配置**一字未动**。到期日不变（#1/#4/#5/#6
`2026-11-27`），到期只允许收口删条目或人审延期，不许改断言换绿。

**未做 / 需单独放行**：三条 bug 的生产代码修复；P3a / P3b / P4；weekly /
export；浏览器端到端验证。本轮只做只读探测与事实登记。

### 9.8 生产代码修复 + 白名单收口（11-14 16:4x，使用者放行）

**放行原话**：「按你说的做，授权修改和 push react-admin 的库」（11-14
16:43）。本轮**只执行推荐顺序的第一梯队**，P3a / P3b / P4 未放行、未执行。

**改动范围（4 个代码 / 测试文件 + 2 份文档）**：

| 文件                                  | 改动                                                     | 依据                                                                              |
| ------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/api/hooks/common/index.ts:10`    | `'/grobal/search/list'` → `'/system/grobal/search/list'` | §9.7 A 404 / B 200；快照含 `POST /system/grobal/search/list`                      |
| `src/api/hooks/review/review.ts:719`  | `//oneUserProtocol` → `/oneUserProtocol`                 | 与 `agent/agent.ts:177` 同端点写法对齐；快照含 `GET .../oneUserProtocol/{userId}` |
| `src/test/contract/allowlist.ts`      | 删 #4 / #6 两条（**6 → 4 条**）                          | 调用点修复后条目无引用，`orphan` 断言按 §9.6 设计**变红强制收口**；非为绿改调用点 |
| `src/test/contract/endpoints.test.ts` | 注释 `623 命中 / 6 条白名单` → `625 / 4`                 | 事实同步，**断言一字未动**                                                        |

**修复后契约状态**：`pnpm test:contract` → **4/4 PASS**；629 调用点 / 3
skip 不变、无 MISS、无 orphan。两个新 path 均**命中现有 947 条快照**（段级绑定
`{param}` ↔ `{userId}`）⇒ **未改
`admin-paths.json`、未重生快照、未跑 weekly/export**。

**完整判卷**：`node scripts/verify-test-batch.mjs --config scripts/verify-p2.json`
→ **12/14 / exit 1**，仅 `V7-head` / `V8-status` 红（配置写死 P2 批次放行前的
`expectedHead=391f701` 与 20 行在途基线），属**基线时效**；其余 12 项全绿：V2
`5/5 · 58/55`、`X-contract`、V3 typecheck、V4 coverage、V5 lint `0e/49w`、V6
build、V9-no-touch、V10 静态断言、MUT-1/2 变红还原
`diff_empty=true`、V11 零残留。 **未改任何判据 / `allowedNewStatus` / `expected`
换绿**。

> **为什么不「更新 `verify-p2.json` 基线」**：该配置 `_comment` 明确它是
> **P2 批次放行前的状态基线**（21 行在途 +
> `391f701`），批次交付并提交后必然失效；而 `V7` 判的是
> `head.startsWith(expectedHead)`，若把 `expectedHead`
> 填成「本轮最终 commit」，填值这次修改本身又会产生新 commit 改变 HEAD（**自指**），除非改判据或永久留一个脏工作区 ——二者都违反纪律。故**历史基线保持不动**，后续批次用各自的
> `verify-<batch>.json`。本卡 11-14
> 16:3x 曾建议「更新基线」，经代码复核后**撤回该建议**。

**BUG-P2-02（#5）未修**：保存 mutation，静态证据链虽已闭合（后端
`POST /editRule`、旧模板同），但按 §9.5 禁止事项须后端 / 产品确认
`CrmUserVipEditParams`
入参与该 mutation 是否仍在使用；**绝不发写请求、不凭静态证据改保存逻辑**。白名单 #5 保留至
`2026-11-27`。

> ⚠️ 本段为 §9.8 当时的状态，**已被 11-14 17:4x 使用者裁定覆盖，见 §9.9**。

**未做**：weekly / export、P3a 补页、P3b、P4、浏览器端到端验证；
`crm-e2e/admin/client.ts` 的 UA 问题未动。P3a 补页仍需先裁定 P-2 / P-3 / P-4。

### 9.9 BUG-P2-02（#5）收口：按 CRM 代码比对后修复（11-14 17:4x，使用者放行）

**放行原话**：「1.关于 #5，直接取 CRM 的代码里看看它忠诚计划使用的哪个接口，需要哪些字段，比对一下就好了。如果有，就参照 CRM 的代码实现，如果没有，说明后端没有抛出接口（类似于直接写库的操作）那就把这个单子挂在后续待补的地方，之后在根后端确认。」⇒ 以
**CRM 仓静态事实**取代 §9.8 的「须后端 / 产品确认」前置条件。
**结论：后端有抛出接口，属调用点 URL 写错，不挂账。**

#### 证据链（全部只读，CRM 仓 HEAD `10981ad079`）

| #   | 事实                                                                                                                                                                                                                                                                                                        | 位置                                                                                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | 旧 RuoYi 保存提交 `prefix + "/editRule"`（postJson，JSON body），`data = { id, languageList, crmUserVipAndRuleList, crmUserVipOrRuleList }`                                                                                                                                                                 | `crm-admin/src/main/resources/templates/system/crmUserVip/edit.html:159, :205-227`            |
| 2   | 后端 `POST /editRule`，`editRule(@RequestBody CrmUserVip)`，`@Transactional`：`updateUserVip` → 删插 `languageList` → 删插两组规则                                                                                                                                                                          | `CrmUserVipController.java:287-323`                                                           |
| 3   | **不存在 `POST /edit`**：`:148` 的 `GET /edit/{id}` 是 Thymeleaf 视图页；类继承 `NoticeController`，父链无额外 `@*Mapping` ⇒ 原调用必然 404                                                                                                                                                                 | 同上 `:38/:40/:148`                                                                           |
| 4   | 字段一一对齐：`CrmUserVip` = `id / sort / status / languageList / crmUserVipAndRuleList / crmUserVipOrRuleList`；`CrmUserVipLang` = `name / description / language ...`；`CrmUserVipRule` = `ruleEvent / ruleSymbol / ruleType / ruleValue / ruleLevel / ruleTag ...`，与 React `CrmUserVipEditParams` 同名 | `crm-common/.../domain/CrmUserVip{,Lang,Rule}.java`、`src/api/hooks/account/types.ts:643-678` |
| 5   | React 多传的 `sort / status` 不是多余字段：`updateUserVip` 的 SQL 显式按非空更新这两列                                                                                                                                                                                                                      | `crm-common/.../mapper/crm/CrmUserVipMapper.xml:144-157`                                      |
| 6   | 传输形态匹配：本仓 JSON POST 封装由 `fetchWithAuth` 设 `Content-Type: application/json`，与 `@RequestBody` 一致（不能用表单封装）                                                                                                                                                                           | `src/api/client.ts:20-26, :92-102`                                                            |
| 7   | `POST /system/crmUserVip/editRule` **已在 947 条快照** ⇒ 改完直接命中契约，无需动 `admin-paths.json` / atlas / 周更                                                                                                                                                                                         | `src/test/contract/admin-paths.json:417`                                                      |

#### 改动（5 文件，均为 crm-admin）

- `src/api/hooks/account/index.ts`：`useCrmUserVipEdit` 的 `/edit` →
  `/editRule`，并落下上面 1–6 的完整比对注释（含「为什么不发写请求」「线上若报错查哪里」）。
- `src/test/contract/allowlist.ts`：删 #5 / `BUG-P2-02` 条目（**4 →
  3 条**），留收口注记。删条目是 P2b `orphan`
  断言按设计判红后的正常收口，**未改断言**。
- `src/test/contract/endpoints.test.ts`：仅注释计数 `632 → 633` 命中、`4 → 3`
  白名单， **断言与 skip 下界一字未动**。
- 本卡 §9.9、`docs/REACT-TEST-INFRA-CHECKLIST.md`（v1.17 → v1.18）。

#### 实跑与纪律

`pnpm test:contract` →
`1 failed / 3 passed`，`[contract] src 文件 867 个 · 调用点 641 · skip 3`；**C5 白名单卫生（≤10
/ 到期 / unowned / orphan）全绿**，5 条 MISS 全为 P3a 补页预期缺口（`add` /
`edit` / `checkNameUnique` / `checkCodeUnique` /
`listEnabled`），与 #5 无关。调用点命中数 632 → **633**，白名单 6 → 4 → **3**
条（剩余 #1 `/logout` 至 `2026-11-27`、#2/#3 双参变体至 `2026-11-20`）。

**红线遵守**：这是写库 mutation，**未发任何运行时保存请求、未登录、未动测试环境数据**；结论只来自 CRM 代码与快照的静态比对。若线上编辑仍异常，排查顺序 = 后端
`system:crmUserVip:edit` 权限 → `languageList`
是否为 null（editRule 直接遍历）→ 规则项 `ruleEvent` 为 null 时后端会跳过该条。
