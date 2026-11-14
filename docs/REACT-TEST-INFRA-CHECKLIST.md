# React 后台：测试基建 + 推广域补页 实施清单

> 版本：2026-11-14 **v1.18**（**11-14 17:4x 更新**：#5 /
> BUG-P2-02 按 CRM 仓代码比对确认为**调用点 URL 写错**（`/edit` →
> `/editRule`），已修并收口白名单4 → **3 条**，证据链见 `P2-TASK-CARD.md`
> **§9.9**；P3a 的 4 条口径差异 + P-3 命名 +
> P-4 顺序经使用者裁定**采用现方案**，决策注释索引见 `docs/testids.md`
> **§6**。**11-14 17:2x P3a 补页已实现并 push**（回执 `P3a-PAGE-PLAN.md` §10）；
> **11-14 16:4x** BUG-P2-01 / 03 生产代码已修复、白名单已收口（§9.8））P0 /
> P1 人审通过；A0 6/6（本地 commit `228580b` / `faf3948`）；**P2 14/14**、**P2b
> 14/14**；`atlas info.version` 与 P2 快照 `generatedFrom.atlasVersion`
> 对齐（947 path）。⚠️ 三条 bug 修复范围：#4 补 `/system` 前缀、#6 去多余 `/`
> （11-14 有效会话 A/B：A 404 + B 非 404 已运行时坐实，§9.7）、#5 改投
> `/editRule`（CRM 静态比对，§9.9）；**未发任何写请求，未改任何断言 / 门禁配置 /
> `admin-paths.json` / atlas 仓**；白名单 6 → 4 → **3 条**（#2/#3
> `2026-11-20`、#1
> `2026-11-27`），到期只允许收口删条目或人审延期，不许改断言换绿。11-13 历史裁定：①
> C5 严格口径采纳；② 到期机制（P2b）完成；③ 只读排查定成因——后台**可本地运行**、`/api`
> 代理到**测试环境**（非生产）。11-13 首次探测因会话层登录失败「读不到」按兜底登记，该结论已于 11-14
> 16:0x 被有效会话 A/B **推翻并升级为运行时已证实**。 **P3a 已完成（补页 +
> push）**；P3b / P4 待用户放行，weekly/export → V7 → P2 快照重生 →
> P3b 建议合并到 11-20 双事件窗口。/ 状态：**A–D 四项已裁定**；
> **P0 复议已通过**：M1 / M2 /
> §11.4 三条建议全部关闭，**A6 闭环（V10 人审实跑）**；V1–V10 证据、两项披露的裁定与回执诚信复核见
> `docs/P0-REWORK-ORDER-v2.md` **§10**；
> **P1 已执行完毕并验收通过（11-12）**：`node scripts/verify-test-batch.mjs --config scripts/verify-p1.json`
> → **18/18 PASS / exit 0**（含 6 组自动变异，失败条数与回执一致）；
> `docs/P1-TASK-ORDER.md` §8 **已执行完毕、勿重发**。
> **工作流变更（P2 起生效）**：判卷权交给门禁脚本，回执只填机器判不了的三样；每批**不再重写执行单**，改用
> `docs/TASK-CARD-TEMPLATE.md` + 一份 `scripts/verify-<batch>.json`
> 差值；人**不再逐格复核回执**，只看门禁 exit
> code + 裁定披露；**不再提前替 flash 排雷**（模板 §0）。 **§3 拍板 B / §5
> P1 行的「MSW 捕获真实 URL」表述作废** —— `apiFormPostBase` 把 flatten 结果放进
> **POST body**，且 node project 对相对 `/api` URL 报
> `ERR_INVALID_URL`，#1 必须落 dom project；两条实证见 `P1-TASK-ORDER.md`
> **§1**（人审即建即删探针，零残留）；
> **v2 执行单 §9 的 P0 复议指令已执行完毕，勿重发**；§10 第二步（v1.2 重建命令）**永久禁止重发**；
> **当前无可发执行指令；P2 已交付并验收通过（`P2-TASK-CARD.md`
> §6 已执行完毕、勿重发），P3a / P3b /
> P4 仍待用户放行**（本文件不构成放行指令）；
> **P2 任务卡（已验收，含 §9 人审验收记录）** = `docs/P2-TASK-CARD.md` +
> `scripts/verify-p2.json`， **P3a 实施计划（未放行）** =
> `docs/P3a-PAGE-PLAN.md`；
> **A0（扩 atlas 源仓）已由人审执行完毕（11-13）**：使用者裁定**路线 A**（仍 usage-driven + 因新增 React 重构后台项目而把它使用到的 API 调用点收进契约），并授权 atlas 在本地 git 提交做记录；在途改动固化为基线 commit
> `228580b`（**无 remote、不 push**）。 `weekly --publish`（四源钉定）+ `export`
> 后 `node scripts/verify-a0.mjs --run-tests` → **6/6 PASS / exit
> 0**（V7 按设计 SKIP，属 P3a 之后）。详见 `docs/A0-TASK-CARD.md` §0.1/§4.1。
> **P2 卡 §6 已执行完毕、勿重发**（交付物 = 契约快照 947 键 / 4 用例 / allowlist
> 6 条，门禁
> `14/14 PASS / exit 0`，人审复核见该卡 §9）；P3a 计划仍明写「未放行、勿动手」；A0 卡 §7 已标「已执行完毕，勿重发」。⚠️ 下文 §3
> A6 / §10 / §11 中「P1 已放行 / P2 待放行 / 当前唯一可发指令 =
> P1 或 P2 执行单」均为**各批次执行前的历史状态**；冲突一律以本头部 **v1.12**
> 状态为准。 **§3 A 类 A3 已于 11-12 全部裁定并关闭**：①
> atlas 随每次知识库更新同步、最少一周一次；② `info.version`
> **无条件同步**，不管 atlas 内容有没有改动 —— 已落到 KB `kb-sync` SKILL §2.5与
> `docs/atlas-integration.md` §2.2/§6（skill 双副本一致）；③
> **把 React 使用的接口纳入 atlas** ——
> **11-13 用户确认方向 = 扩 atlas 源仓让 React 调用点进契约**，目的是「atlas 也能收集后端抛给后台使用的 API 接口信息」。落地为独立前置批次
> **A0**，实施卡 `docs/A0-TASK-CARD.md`、判卷
> `scripts/verify-a0.mjs`；**不是加一行 `frontends`
> 配置**（surface 会归错、提取器不认 React 的 9 个自定义封装，实测 868 文件只提 6
> calls）。⚠️ **11-13 新发现 → 同日已裁定并落地**：atlas 是
> **usage-driven**（`reconcile.mjs:62-67`
> 只有被 UI 调用点匹配到的后端 route 才进 catalog/exports），权限包 16 端点 →
> catalog 11 → exports
> 7 就是这个机制的结果。**使用者裁定仍保持 usage-driven（路线 A），否决 admin 全量（路线 B）**，flash
> / kb-sync 不得自选；结论见 A0 卡 §2 与 KB ADR-004
> §2.3/§6。A0 实跑：React 调用点 643 calls / 584 路径 → `callers.json`
> 658 条（648 条 admin surface），947 operations 中 577 条带 React
> caller；`spreadPermPackage` 仍 7 条 path 属路线 A 预期。⚠️
> **version 陈旧的真实根因**（人审实跑，与初始判断不同）：不是「没有 API 改动所以版本没动」，而是
> `weekly` 与 `export` 是两个独立命令、kb-sync 只跑了 `weekly`；`catalog`
> 已到 11-06、 `exports` 停在 10-27。`snapshotId` 每轮由 `generatedAt`
> 生成，零变更也推进。其余 4 项（A1 / A2 / A4 / A5）仍挂账（只卡 P4 /
> e2e，不卡 P0–P3）；
> **A6 已于 11-12 拍板候选 A**（`packageManager: pnpm@10.34.5`，见 §3
> A6）：v1.2 重建口径作废、v1.3「待重定」关闭；原定稿口径被实跑证伪的事实仍记录在 §3
> A6。依据：`docs/react-test-plan.md`（2026-10-29 草案，本文不推翻它，只把它拆成可执行任务卡）、
> `docs/react-migration-gap-analysis.md`
> §二/§七、`docs/react-feature-drift-analysis.md` §8、
> `docs/react-vs-ruoyi-adr.md` §7，以及 KB `TESTCASE-CONVERSION-PLAN.md` **N10**
> / `CONTEXT.md` **D7**。上位约束：用户 2026-11-10 上下文第 2/7/8 条 ——
> e2e 只由外置 `crm-e2e`
> 消费；React 后台在「有足够用例内容需要消费」时启动测试基建（D7，本清单即为触发）。

---

## 0. 给执行者（glm flash）的红线

| #    | 禁止动作                                                                                                                                                                                                        | 原因                                                                                                                                                                                                       |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-1  | 改 KB `crm-knowledge/**`、改 `crm-e2e/**`、改旧后台 `D:/projects/CRM/**`                                                                                                                                        | 本任务范围只有本仓；旧后台是**只读 oracle**                                                                                                                                                                |
| R-2  | `git commit` / `git push`，或执行 `CLAUDE.md`「无人值守 / 夜间任务协议」里的自动提交、`TASK_STATE.md` 断点提交、`.zcode/night/LOCK` 心跳                                                                        | **本任务不跑夜间班车**。该协议与本红线冲突时以本清单为准                                                                                                                                                   |
| R-3  | 改工作区既有 3 个未提交文件（`docs/react-feature-drift-analysis.md`、`docs/react-migration-gap-analysis.md`、`src/pages/review/leverage-detail/components/LeverageInfoCard.tsx`）                               | 不是本任务的产物，别顺手格式化/覆盖                                                                                                                                                                        |
| R-4  | 改 `docs/react-test-plan.md` / `react-migration-gap-analysis.md` 的既有结论、自定业务口径、补 Q 口径                                                                                                            | 事实层由人裁定。本文只是任务拆分，发现文档与代码不符 → **停机回报**                                                                                                                                        |
| R-5  | 测试里打真实网络 / 真实测试环境接口；为了跑通去线上改后台配置                                                                                                                                                   | 测试必须离线可跑（MSW 拦截，未声明请求即失败）；改配置是有副作用的写操作                                                                                                                                   |
| R-6  | 在本仓自建 Playwright / 浏览器 E2E 体系                                                                                                                                                                         | e2e 归 `crm-e2e`（见 §3 A4）。本仓只做 L1 单元 / L2 契约 / L3 组件集成                                                                                                                                     |
| R-7  | 把「`pnpm test` 绿」当成验收完成                                                                                                                                                                                | 恒真测试也能全绿。每条防回归断言必须**变异能红**（§6）                                                                                                                                                     |
| R-8  | 缺信息时写占位、猜业务规则、编造接口字段或 testid                                                                                                                                                               | 唯一合法动作是停机回报，写清缺什么、在哪查过                                                                                                                                                               |
| R-9  | 把 10-29 草案 `react-test-plan.md` §15 的「待确认」当成未裁定，或按草案 §3/§5 的 happy-dom、§11/§12 的 P4 Playwright 口径执行                                                                                   | 本文是 11-12 定稿，**冲突一律以本文为准**（§3 B.1）。据此停机不干 P0 也算违规                                                                                                                              |
| R-10 | 自行加 `CI=true` / `confirmModulesPurge=false` 删库重建、改用 `--no-frozen-lockfile`、改 pnpm 全局配置、手动删 `node_modules`；或把工具链错误当成「基线本来是红的」写进回执                                     | v1.2 授权的那**一次**重建已用掉且被证伪（§3 A6）。**唯一例外**：`docs/P0-REWORK-ORDER-v2.md` §2.1 #1 授权的**一次** `packageManager` 字段写入（A6 拍板 A），按该单 §3 执行；除此之外一律禁止任何工具链动作 |
| R-11 | v2 执行单 §2.1 #1 之外的任何工具链动作：`corepack enable` / `pnpm config set` / `npm i` / 删 `node_modules` / 重跑 `CI=true pnpm install --frozen-lockfile` 重建 / `--no-frozen-lockfile` / 改 `pnpm-lock.yaml` | A6 拍板 A 是「锁版本」不是「重建」；工具链有副作用，不许临时发挥                                                                                                                                           |
| R-12 | 把「人审 shell 已验证」「A6 已闭环」写进回执；把「我这边跑绿」当成 A6 闭环；或把 pnpm 包装层 exit 1 写成「基线红」                                                                                              | 人审侧复核是人的动作（v2 执行单 V10），未填前 A6 不算闭环                                                                                                                                                  |
| R-13 | 靠改测试断言 / 改 `vitest.config.ts` / 改探针内容制造「变异红」；或变异后不还原                                                                                                                                 | 变异必须改实现且即改即还原、git 零残留                                                                                                                                                                     |

**开始前只读复述**：读本清单 + `docs/P0-REWORK-ORDER-v2.md` +
`docs/P1-TASK-ORDER.md` + `docs/react-test-plan.md` §3/§5/§7/§8/§13，复述 §0
**十三条**红线、§3 B 的 A–D 裁定、**§3 A6 拍板 A 且已闭环（人审复核见 v2
§10）**、 **§11 两项必修已关闭**、**`P1-TASK-ORDER.md` §1 的两条实证（POST body
/ dom project）**、§3
B.1 的覆盖关系、§5 的 P0 验收命令，确认能接受「缺信息只能停机」。
**此步不改任何文件。**

> **R-5 适用边界（11-13
> 17:44 使用者澄清）**：R-5 禁的是「**测试里**打真实网络 / 真实测试环境接口」，即自动化测试必须 MSW 离线、未声明请求即失败。使用者补充：React 后台虽未上线，但**可本地运行**，`vite.config.ts:21-26`
> 把 `/api` 代理到**测试环境**
> `http://admin-1.hcs55.com:38080`（不影响生产），故 API 行为可在浏览器里人工验证；这是**独立于 R-5 的通道**，须**单独放行**，不因本条自动获得，也不许把真实请求写进 vitest
> / 门禁。**R-5 不变**；使用者同时要求避免副作用写操作（详见 `P2-TASK-CARD.md`
> §9.4）。交付说明「未在浏览器验证」如实保留（P2 本批确实没做，不是「不能做」）。

---

## 1. 现状（2026-11-12 实测，非推测）

| 项                            | 实测结果                                                                                                                                                                                                                                                                                                                                                                                                                                       | 证据                                                                                                                                                                                            |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 技术栈                        | React 19.1 + TS 6.0.3 + Vite 6.3.5 + TanStack Query v5 + Radix/Base UI + RHF + Zod + i18next                                                                                                                                                                                                                                                                                                                                                   | `package.json` / `vite.config.ts`                                                                                                                                                               |
| 测试依赖                      | **0**（无 vitest / RTL / MSW / happy-dom / playwright / coverage）                                                                                                                                                                                                                                                                                                                                                                             | `package.json` devDependencies                                                                                                                                                                  |
| 测试文件 / CI                 | **0 个** `*.test.ts(x)` / `*.spec.ts(x)`；无 `.github/workflows`                                                                                                                                                                                                                                                                                                                                                                               | 全仓扫描；`docs/react-test-plan.md` §1                                                                                                                                                          |
| 提交闸门                      | husky `pre-commit` = `npx lint-staged` + `npx tsc --noEmit`；无 pre-push                                                                                                                                                                                                                                                                                                                                                                       | `.husky/pre-commit`                                                                                                                                                                             |
| 应用规模                      | 146 条生效路由、158 个 `*Page.tsx`（test-plan §1 口径）                                                                                                                                                                                                                                                                                                                                                                                        | `src/routes/` / `src/pages/`                                                                                                                                                                    |
| API 层                        | `src/api/client.ts` 的 `fetchWithAuth`（`/api` 前缀、`credentials:'include'`、session cookie）；hooks 按 domain 分在 `src/api/hooks/`                                                                                                                                                                                                                                                                                                          | 同上                                                                                                                                                                                            |
| 后端契约源                    | `D:/projects/crm-api-atlas/exports/openapi.admin.json`（编制时 806 path / `info.version=2026-10-27T03-37-57-251Z`；**11-13 A0 周更后 947 path / `info.version=2026-11-13T04-15-35-768Z`**），其中 `/system/spreadPermPackage*` **7 条 path**（11-12、11-13 两次脚本解析实测；旧记「11 条」不准）                                                                                                                                               | 实测 JSON 解析。**`info.version` 每轮 kb-sync 无条件刷新**（v1.11 / A3），此表两个版本都只是当时快照，P2 执行须重读当时文件；A0 周更已发生，P2 生成快照时须用 11-13 版本并人审相对 10-27 的差异 |
| 代理目标                      | Vite proxy `/api` → `http://admin-1.hcs55.com:38080`（实测 HTTP 302 到登录页）                                                                                                                                                                                                                                                                                                                                                                 | `vite.config.ts` / curl                                                                                                                                                                         |
| React dev server              | 5173 **未启动**；8101（crm-fe）在跑                                                                                                                                                                                                                                                                                                                                                                                                            | curl                                                                                                                                                                                            |
| 推广设置域                    | `src/pages/` 下**没有任何推广/权限包页面**；Sidebar「推广设置 → 推广链接」`disabled: true`；`settingsRoutes.tsx` 里 `/settings/promotion/links` 只在注释里，routes 数组末尾是 `// TODO: Add more routes`                                                                                                                                                                                                                                       | `Sidebar.tsx:397`、`settingsRoutes.tsx`                                                                                                                                                         |
| `data-testid`                 | 全仓 **0 处**                                                                                                                                                                                                                                                                                                                                                                                                                                  | grep                                                                                                                                                                                            |
| 工作区                        | 3 个未提交改动（见 R-3），分支 `develop`                                                                                                                                                                                                                                                                                                                                                                                                       | `git status`                                                                                                                                                                                    |
| KB 侧                         | N4 的 28 条（M1 组）明确保留、**交 React 后台测试消费**；`CONTEXT.md:54` 已登记「React 仓没有权限包页面」                                                                                                                                                                                                                                                                                                                                      | KB `TESTCASE-CONVERSION-PLAN.md` N10                                                                                                                                                            |
| **代码基线（11-12 实跑）**    | **绿**：`tsc --noEmit` exit 0 零输出；`eslint . --ext ts,tsx` exit 0（0 error / 49 个既有 `react-refresh` warning）                                                                                                                                                                                                                                                                                                                            | 绕过 pnpm 包装层直调 `node_modules/.bin` 实测                                                                                                                                                   |
| **工具链错配（11-12 实跑）**  | `pnpm typecheck` / `pnpm lint` **exit 1，但不是代码报错**。全局 pnpm **11.22.0** 检测到 `node_modules` 由 **v10 store**（`D:\.pnpm-store\v10`）建立，跑脚本前自动 `install` 并试图删除重建 `node_modules`，非 TTY 下报 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`；离线重试另报 `ERR_PNPM_NO_OFFLINE_META`。在线 `pnpm install --frozen-lockfile --lockfile-only` 可通（supply-chain policy 530 条 / 28.3s），但不会修复 `node_modules` 状态 | 完整错误栈见 §3 A6；`node_modules/.modules.yaml` 的 `storeDir`                                                                                                                                  |
| **双环境分叉（P0 首轮暴露）** | flash 执行 shell 经 fnm 注入 **pnpm 10.34.5 / node 20.19.0**（与 v10 store 兼容，purge abort 不复现）；人审 shell 是 **pnpm 11.22.0 / node 22.22.2**。首轮时仓库无 `packageManager` 字段，两边各跑各的。**A6 ② 在 pnpm 10 下是 `Already up to date` 空操作，并未重建**                                                                                                                                                                         | flash P0 回执「环境差异」段；人审 shell 复测 `pnpm typecheck` 仍 exit 1，`node_modules/.modules.yaml` 仍为 v10 store                                                                            |
| **A6 拍板（11-12，人）**      | 选**候选 A**：`packageManager: pnpm@10.34.5`。人审侧在**仓外临时目录**预演：带该字段的 `package.json` 下，pnpm **11.22.0** shell 的 `pnpm --version` 返回 **10.34.5**（exit 0）→ 按项目版本自动切换生效，方案可行；**仓内已由 flash 实装、人审 V10 复核通过 → A6 闭环**                                                                                                                                                                        | 人审 11-12 临时目录探针 + `P0-REWORK-ORDER-v2.md` §10.1                                                                                                                                         |

> **别把 `pnpm typecheck` exit 1 读成「基线本来是红的」** —— 直调 `tsc` /
> `eslint` 都是绿的。这个坑会让 §5
> P0 的「与基线同状态」判据失效，所以工具链分叉按 §3 A6 **已拍板的候选 A**
> 处理（`packageManager`
> 锁版本 + 人审 shell 复核）；实施前 / 工具链异常时用直调 CLI 复核（§3 C）。

---

## 2. 技术选型（沿用 `react-test-plan.md` §5；DOM 环境与 L4 按 11-12 定稿调整）

| 层          | 选型                                                                                                                           | 说明 / 裁定                                                                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1 单元     | **Vitest 4** + `environment: 'node'`                                                                                           | 复用 `vite.config.ts` 的 `@` alias 与 react 插件；与 vue3 仓（vitest ^4.0.17）对齐                                                                                                                                                                      |
| L2 契约     | Vitest + **atlas 快照入库**（`src/test/contract/admin-paths.json`，由 `scripts/gen-api-contract.mjs` 生成）                    | atlas 在仓外，运行期读绝对路径不可移植；只做调用点存在性断言                                                                                                                                                                                            |
| L3 组件集成 | **@testing-library/react** + `user-event` + `jest-dom` + **MSW v2** + `renderWithProviders`（QueryClient/Router/i18n/Auth 桩） | MSW 拦 `fetch`，保留 `client.ts` 真实逻辑；`onUnhandledRequest: 'error'`                                                                                                                                                                                |
| DOM 环境    | **jsdom ^27.4.0（拍板 A 已定）**                                                                                               | vue3 仓实装 `vitest ^4.0.17 + jsdom ^27.4.0`，KB `check-assertions.mjs` R1 也按 jsdom 判 `location.href` 恒真 → 跨仓复用门禁不产生第二套环境。10-29 草案的 happy-dom 建议**不再采用**。纯函数 / 契约用例走 `environment: 'node'`，只有 RTL 用例吃 jsdom |
| 覆盖率      | `@vitest/coverage-v8`，**只用于找盲区、不设门槛、不进闸门**                                                                    | test-plan §3/§13                                                                                                                                                                                                                                        |
| L4 E2E      | **本仓不建**。归 `crm-e2e`（Playwright）                                                                                       | 见 §3 A4；test-plan §11 的 P4 三条资金链路**不启动**                                                                                                                                                                                                    |
| 版本兼容    | Vitest 4 内部 vite 版本需与项目 Vite 6.3.5 / TS 6.0.3 实测                                                                     | vue3 仓踩过「vitest@4 私装 vite7 → Sass 编译器 API 不兼容」的坑；本仓无 Sass，但 `pnpm install` 后必须实跑确认                                                                                                                                          |

安装命令（**P0 执行，版本按实装兼容结果微调并回报**）：

```bash
pnpm add -D vitest @vitest/coverage-v8 @testing-library/react \
  @testing-library/user-event @testing-library/jest-dom msw jsdom@^27.4.0
```

> **不要装 `happy-dom`、不要装
> `@playwright/test`**（R-6）。版本按 §2 末行的实装兼容结果微调并回报。

---

## 3. 必要前置条件

### A. 硬阻塞：人给，flash 不能自行解决

| #   | 前置                                                                                                                                                                         | 卡住什么                                  | 现状                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | 可登录的测试环境 + 管理员账号 + 种子数据                                                                                                                                     | 任何真实浏览器验收（P4 / e2e）            | 体验后台 302 未登录；`.env.test` 是空文件；无种子数据。**凭证只能进 gitignore 的 `.env`，不得入库**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| A2  | CI 平台是否允许在 PR 跑 `pnpm test`                                                                                                                                          | §7.8 的最小 job；`.husky/pre-push` 是否加 | 无 CI；pre-push 目前不存在。**改提交钩子属流程变更，需人点头，flash 不自动加**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| A3  | atlas 更新机制（谁更新、多久一次、`openapi.admin.json` 是否含新增页面端点）                                                                                                  | L2 契约可信度                             | **11-12 全部裁定并关闭**：① 人给口径 = 每次知识库更新同步、**最少一周一次**（与 `crm-api-atlas-implementation.md:24` 一致）；② **`info.version` 无条件同步**，不管内容有没有改动 —— 已落到 KB `kb-sync` SKILL §2.5（双副本）+ `docs/atlas-integration.md` §2.2/§6；③ **React 使用的接口纳入 atlas** —— **11-13 用户确认方向 = 扩 atlas 源仓让 React 调用点进契约**（目的：atlas 也能收集后端抛给后台使用的 API 接口信息），实施卡 `docs/A0-TASK-CARD.md` + 判卷 `scripts/verify-a0.mjs`，不是加一行 `frontends`。**11-13 新发现**：atlas 是 usage-driven（`reconcile.mjs:62-67`），后端 16 端点 → catalog 11 → exports 7；是否改 admin 全量为剩余一项人裁定（A0 卡 §2）。**根因更正**：version 停在 10-27 不是「没改动」，而是 `weekly` 不含 `export`；`catalog` 已到 11-06、`snapshotId` 每轮必变。快照须记录 `info.version` 与来源 commit；遇周更须重生快照并人审差异 |
| A4  | **e2e 通道裁定**：`crm-e2e` 目前 7 个 Playwright project 全是 crm-fe 站点（8101 / real），**没有 React admin 站点 project**；`land-test-case` 的 testid 流程也是按 Vue2 写的 | M1/N4 28 条卡最终能否端到端消费           | 归 `crm-e2e` 侧决定：加 admin project + baseURL + Page Object + testid 契约。**本清单不实现，但必须登记为挂账**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| A5  | 推广域页面的产品口径（尤其 `applicableUserSettings` 适用用户配置、多语言 tab）                                                                                               | 补页时能否照旧模板 1:1 复刻               | 旧模板是事实来源；有歧义按 R-8 停机，不猜                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

### A6. 工具链前置（**11-12 已拍板 A、flash 实装、人审复核通过 → 闭环**；属 §11 必修项）

**11-12 P0 首轮实测**：

| 环境                         | 工具链                          | `pnpm typecheck`                                            |
| ---------------------------- | ------------------------------- | ----------------------------------------------------------- |
| flash 执行 shell（fnm 注入） | pnpm **10.34.5** / node 20.19.0 | **exit 0**，与 v10 store 兼容，purge abort 不复现           |
| 人审 shell（本清单作者侧）   | pnpm **11.22.0** / node 22.22.2 | **仍 exit 1**：`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` |

flash 按授权跑的 ② `CI=true pnpm install --frozen-lockfile` 在 pnpm 10 下返回
`Already up to date`（923ms，**无 purge**），是**空操作**；`node_modules/.modules.yaml`
仍是
`storeDir: D:\.pnpm-store\v10`。因此回执里「A6 三步全过」**不成立**——它证明的是「pnpm
10 环境无需重建」，不是「A6 处置完成」。**首轮时**人审 shell 的错配仍在、A6 未闭环（现已在 v2 执行单 §10.1 闭环）。（回执本身如实标注了环境差异，这点没毛病；错在把空操作记成了「A6 全过」。）

**原口径作废**：v1.2 写的「接受全局 pnpm 11 + 一次显式重建」隐含「执行 shell
= 人审 shell = pnpm
11」，该前提不成立。**不要再照 §10 第二步重跑重建命令**（v1.2 那一次授权已用掉且被证伪；R-10
/ R-11 一律禁止重建）。

**11-12 人拍板：选 A（B 作废）**

- **A（已选）：把仓库锁到 pnpm 10.34.5** —— `package.json` 顶层加
  `"packageManager": "pnpm@10.34.5"`，让 pnpm 11
  shell 自动切到 10.34.5，消除双环境分叉； **不删
  `node_modules`、不重建、不改 lockfile、不装 pnpm、无破坏性**。
  - **可行性已预演（人审，11-12）**：仓外临时目录放同字段的
    `package.json`，人审 shell（pnpm 11.22.0 / node 22.22.2）执行
    `pnpm --version` 返回 `10.34.5`（exit 0）→ pnpm 按项目版本自动切换生效。
  - **闭环判据（两层）**：① flash 按 `docs/P0-REWORK-ORDER-v2.md`
    §2/§3 加字段并在自己 shell 自检；② **人审在 pnpm 11 shell 复核**
    `pnpm --version` = `10.34.5` 且 `pnpm typecheck` / `pnpm test` / `pnpm lint`
    全绿。**② 未完成前 A6 不算闭环**，回执不得写「A6 已闭环」（R-12）。**11-12 人审已实跑 ② 通过 →
    A6 闭环，证据见 v2 执行单 §10.1。**
  - 这是 **R-10 的唯一例外**；其余工具链动作一律禁止（R-11）。
- **B（作废）：由人在 pnpm 11 shell 补跑一次真重建** —— 会 purge 整个
  `node_modules`，破坏性大且跨版本重建结果需重新验证，**不再采用**。

**§10 第二步（v1.2 重建命令）永久禁止重发**；**v2 执行单 §9 已执行完毕并复议通过，勿重发**。两项必修已由人审复核关闭、A6 闭环（证据 v2
§10.1）；**P1 已执行完毕并验收通过；P2 已交付并验收通过（`P2-TASK-CARD.md`
§6 勿重发、§9 人审记录）**，P3a / P3b / P4 待用户放行。

### B. 已拍板（2026-11-12 最终口径；flash 不得再裁定，也不得再等确认）

| 拍板                         | 裁定                                       | 依据                                                                                                                                                              | 对 flash 的硬约束                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** DOM 环境               | **jsdom ^27.4.0**                          | vue3 仓实装 `vitest ^4.0.17 + jsdom ^27.4.0`；KB `check-assertions.mjs` R1 按 jsdom 判 `location.href` 恒真                                                       | 装 `jsdom@^27.4.0`，**不装 happy-dom**；纯函数/契约 `environment: 'node'`，只有 RTL 用例吃 jsdom                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **B** 测试驱动小重构         | **本批一律不做**（P0–P3 不碰既有生产代码） | 改动面保持 100% 新增文件，「基线绿」才判得准；草案 §8 #7~9 属**其他域**漂移项，本就不在本批范围                                                                   | 只许补页**必需的最小接线**（`settingsRoutes.tsx` 追加路由、`Sidebar.tsx` 去 `disabled`、i18n 新增键）。`flattenParams` **不导出**，改用 MSW 捕获 `apiFormPost` 真实发出的 **POST body**（`await request.text()` → `new URLSearchParams(body)`）间接断言全部 flatten 分支 —— **覆盖不减，只换测法**；**v1.5 修正**：原写「捕获真实请求 URL」不成立（flatten 结果在 body 不在 query），且 node project 对相对 `/api` URL 报 `ERR_INVALID_URL`，故 #1 用例必须 `.test.tsx` 进 dom project，实证见 `P1-TASK-ORDER.md` §1；#7~9 登记挂账，不是删用例 |
| **C** M1/N4 28 条作 P3b 首批 | **是，但只作只读需求素材**                 | 用例量已够、正好触发 D7；与 §8「保持挂起」不矛盾（§8 有专门注释消解）                                                                                             | 只引用其边界描述（`C-M1-01/05/11/13/20` …）推导 P3b 的 5 条断言；**不生成 case.md、不解挂、不进 e2e 消费队列**；N10 修订仍由人做                                                                                                                                                                                                                                                                                                                                                                                                                |
| **D** 补页范围               | **只补「权限包管理」1 页**                 | M1/N4 的目标页，A 类；旧模板 / 16 端点 / atlas **7 条 path**（旧记 11 条，v1.7 已纠正）+ A0 扩源后覆盖缺口，能形成「补页 → testid → 组件集成 → 变异验证」最小闭环 | 推广链接、推广素材、客户详情推广 tab **不在本批**；B/C 类（落地页、链接组）不做。第一闭环人审通过后再由人决定放量                                                                                                                                                                                                                                                                                                                                                                                                                               |

#### B.1 与 10-29 草案的覆盖关系（防文档分叉）

`docs/react-test-plan.md`
是 10-29 草案，本文是 11-12 定稿拆分，**冲突一律以本文为准**：

- 草案 §15「待确认」第 **4** 项（小重构接受度）→ 已由**拍板 B** 裁定。
- 草案 §15 第 **1/2/3/5** 项 → 对应本清单 §3 A 的
  **A1/A2/A3/A5**。**A3 已于 11-12 全部裁定并关闭**（见 §3 A3 /
  `P2-TASK-CARD.md` §8）；其余仍是硬阻塞，但只卡 P4 /
  e2e 通道 / 契约可信度 / 跨配置口径，**不卡 P0–P3**。flash 既不得自行补齐，也不得拿它们当理由停机不干 P0。
- 草案 §3/§5/§8 表格里的 `happy-dom` → 已被**拍板 A** 覆盖为 jsdom。
- 草案 §11/§12 的 P4 Playwright 三条资金链路 → 按 R-6 / §5 **不启动**。
- 草案 §12 的 P1「§8 的 1~9（含 3 处小重构）」→ 本批只做
  **1~6**，其中 #1 换测法；7~9 与 3 处重构挂账。

### C. 环境（工具链按 §3 A6 拍板 A 实装；其余可并行，不阻塞）

1. **工具链按 §3 A6 拍板 A 已实装并闭环**（`packageManager`
   锁版本 + 人审 shell 复核，证据 v2 §10.1）。 **A6 闭环后 `pnpm <script>`
   在人审 shell 已实测可用**（`pnpm --version` = 10.34.5，typecheck / test /
   lint 全绿）→ **P1 起一律用 `pnpm`
   脚本**（P1 执行单 §5），仅在工具链异常时才用**直调 CLI** 复核：
   `node node_modules/typescript/bin/tsc --noEmit` /
   `node node_modules/eslint/bin/eslint.js . --ext ts,tsx` /
   `node node_modules/vitest/vitest.mjs run`。11-12 已实测：直调 `tsc` exit
   0、`eslint` 0 error / 49 既有 warning、`vitest` 5 用例绿（§1 / §11.1）；
   **`pnpm <script>` 曾在人审 shell 的 exit 1 不是基线红**，别写进回执（R-10 /
   R-12）。
2. `pnpm dev`（5173）用于人工看页面；单测/契约/组件测试**不需要起服务**。
3. 工作区 3 个既有改动保持不动（R-3）；新产物全部是新增文件。

---

## 4. 缺页清单（用户问的「如果缺页面」—— 确实缺，且不止一页）

`docs/react-migration-gap-analysis.md`
§二 记「推广设置（4）」+ 其他域 1 个 tab；§七 按后端接口可用性分 A/B/C：

| 页面                                              | 旧后台端点                                                | 分类  | 能做？                                        | 估算   |
| ------------------------------------------------- | --------------------------------------------------------- | ----- | --------------------------------------------- | ------ |
| **推广链接**（平台/代理/直客/个人）               | `/system/spreadLink`                                      | **A** | 现有 JSON 接口，纯前端可交付                  | 1.5d   |
| **权限包管理** ★ M1/N4 卡的目标页                 | `/system/spreadPermPackage`                               | **A** | 同上                                          | 1.5d   |
| **推广素材**（含二维码下载）                      | `/system/marketing/material`                              | **A** | 同上                                          | 1.5d   |
| 推广落地页设置                                    | —                                                         | **B** | 旧页由 `ModelMap` 注入，需后端补 1 个读取接口 | 待后端 |
| 链接组                                            | controller 被注释                                         | **C** | **后端先行，本批不做**                        | —      |
| 客户详情「推广」tab（权限包/链接/统计，M5/M6 卡） | `/system/crmUserSpread/{oneUserSpreadInfo,permPackage/*}` | **A** | 2d                                            | 2d     |

> §六 优先级里「推广链接体系与权限包」属
> **P3（业务页面）**；§七 批次建议②把它与推广素材并排。结论：**权限包管理页是 A 类，flash 可以做**，不需要等后端；B/C 两类不要在这批里硬做。

### 4.1 参考实现（只读 oracle，精确到文件）

| 用途                           | 路径                                                                                                                                                                        |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 旧后台列表页                   | `D:/projects/CRM/crm-admin/src/main/resources/templates/system/spreadPermPackage/spreadPermPackage.html`                                                                    |
| 旧后台新增页（52KB，字段最全） | `.../spreadPermPackage/add.html`                                                                                                                                            |
| 旧后台编辑页（60KB）           | `.../spreadPermPackage/edit.html`                                                                                                                                           |
| 适用用户列表                   | `.../spreadPermPackage/applicableUserList.html`                                                                                                                             |
| 端点/权限码                    | `D:/projects/CRM/crm-admin/src/main/java/com/ruoyi/web/controller/system/SpreadPermPackageController.java`                                                                  |
| OpenAPI 契约                   | `D:/projects/crm-api-atlas/exports/openapi.admin.json`（`/system/spreadPermPackage*` **7 条 path**；Controller 16 端点里 `add`/`edit`/`check*`/`listEnabled` 等不在 atlas） |
| React 页面范式                 | `src/pages/setting/trading-platform/servers/ServersSettingPage.tsx`（列表 + 弹窗 + Query hook）、`src/pages/setting/payment/currency/CurrencySettingsPage.tsx`              |
| React hook 范式                | `src/api/hooks/setting/{setting,platform,payment}.ts`                                                                                                                       |
| 路由 / 菜单 / i18n             | `src/routes/settingsRoutes.tsx`、`src/components/layouts/Sidebar.tsx:397`、`src/locales/{zh,en}.json`                                                                       |

### 4.2 端点清单（Controller 实测，`@RequiresPermissions` 逐条照抄）

```
GET    /system/spreadPermPackage                 列表页（view）
POST   /system/spreadPermPackage/list            分页列表
GET    /system/spreadPermPackage/add             新增页
POST   /system/spreadPermPackage/add             保存
POST   /system/spreadPermPackage/checkNameUnique 名称查重
POST   /system/spreadPermPackage/checkCodeUnique 编码查重
GET    /system/spreadPermPackage/edit/{id}       编辑页
POST   /system/spreadPermPackage/edit            保存编辑
GET    /system/spreadPermPackage/getServerAccountTypes?serverIds=   服务器→账号类型联动
POST   /system/spreadPermPackage/countApplicableUsers                适用用户数
GET    /system/spreadPermPackage/applicableUserList/{id}            适用用户页
POST   /system/spreadPermPackage/applicableUserList                 适用用户列表
PUT    /system/spreadPermPackage/change-status                      启停
GET    /system/spreadPermPackage/listEnabled?keyword=                启用项
POST   /system/spreadPermPackage/assignAgent                        分配代理
POST   /system/spreadPermPackage/remove                              删除
```

### 4.3 新增/编辑页必须复刻的字段（从 `add.html` 的 `name=` 提取，非推测）

```
name  code  remark  purpose  purposeDisabled  status  id
serverIds  accountGroupIds  lever  defaultRoleIds  walletCurrency
applicableUserSettings.{applicableMode,applicableTypes,roles,tags,countryId,
                        userIds,userSubIds,agentSubIds}
```

同时复刻旧页的**可观测行为**（M1 卡要断的就是这些，别只画 UI）：

- `name` 必填 + 32 字符可输入 / 第 33 字符不可输入；`remark`
  200/201 字符边界（旧页 `descCount`）。
- `checkNameUnique` / `checkCodeUnique` 的查重提示。
- 选 `serverIds` 后调 `getServerAccountTypes` 联动账号类型（`accountTypeArea` /
  `accountTypeEmptyTip`）。
- `countApplicableUsers` 回显适用用户数；`lever` 受账号关联设置约束。
- 列表页的搜索/状态筛选/**重置清空**（C-M1-20）。

### 4.4 页面交付要求

1. 路由加进 `settingsRoutes.tsx`，Sidebar 对应项去掉
   `disabled: true`（只动推广域那几项）。
2. i18n 文案进 `src/locales/{zh,en}.json`，代码里不写死中文。
3. **所有可交互元素加 `data-testid`**，命名按 §7；清单同步登记到
   `docs/testids.md`（本仓新建）。
4. 表单校验用 RHF + Zod，与旧页边界一致；API 走 `fetchWithAuth` + React Query
   hook，按 domain 放 `src/api/hooks/setting/`。
5. 不改 `src/api/client.ts` 的既有行为；不为测试在生产代码里开后门。

---

## 5. 分步任务卡（可直接派给 flash）

| 阶段                                                                  | 输入                                                                          | 动作                                                                                                                                                                                                                                                                                                                                                                  | 验收命令 / 判据                                                                                                                                                                                                                                                                                              | 谁做                                                         |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **A0 · atlas 扩源**（**11-13 已裁定路线 A 并由人审执行完毕**）        | `docs/A0-TASK-CARD.md` §0.1 实跑、§3.1 落地记录、§4.1 判卷                    | 独立源段 `adminFrontends.crmAdminReact` + 9 封装提取 + admin surface 归类；React **643 calls / 584 路径**进契约（658 caller，648 归 `admin:`）；四源 weekly/export、KB 时钟统一                                                                                                                                                                                       | `node scripts/verify-a0.mjs --run-tests` **6/6 PASS / exit 0**；V7 SKIP 属 P3a 之后。`spreadPermPackage` 仍 7 条 path 属路线 A 预期                                                                                                                                                                          | 已执行完毕（人审）；**A0 卡 §7 勿重发**，P2/P3a flash 不得碰 |
| **P0 基建骨架**（首轮不通过，**复议已通过 → v2 执行单 §10**）         | 本文 §2、test-plan §7                                                         | 装依赖；新建 `vitest.config.ts`（复用 vite 配置、双环境 projects 或单环境 + 文件头覆盖）、`src/test/setup.ts`（jest-dom / i18n 固定中文 / 浏览器 API 桩 / MSW 生命周期）、`src/test/utils/render.tsx`、scripts、`package.json` scripts、`.gitignore` 追加 coverage 等；**2 个示例用例**（1 个 node 纯函数、1 个 RTL 渲染）                                            | `pnpm test` 绿；`pnpm typecheck` / `lint` / `build` 与 §1 直调基线同状态（`pnpm` 包装层 exit 1 不算基线红，见 R-10）；**`onUnhandledRequest:'error'` 必须在 unit(node) 与 dom(jsdom) 两个 project 都生效**（各写一个故意未声明请求的探针、必须红、然后删探针）；**§11 两项必修全部关闭（含人审侧 A6 复核）** | flash                                                        |
| **P1 纯函数单测**（**11-12 已放行**，执行单 `docs/P1-TASK-ORDER.md`） | test-plan §8 的 **1~6**（7~9 挂账）                                           | `transformTotalList` / 金额与时间归一化 / `passwordSchema` 等断言；`flattenParams` **不导出**，用 MSW 捕获 **POST body** 间接断言全部分支。**v1.5 修正**：原写「捕获真实 URL、MSW 在 node 环境即可拦 fetch、不需 DOM」**已由人审实跑证伪** —— node project 对相对 `/api` URL 报 `ERR_INVALID_URL`，#1 必须 `.test.tsx` 进 dom project（实证见 `P1-TASK-ORDER.md` §1） | `pnpm test` 绿 + **6 组各 1 个以上**变异（改实现一行）必须红、还原复绿、`git status` 零残留；**不得改 `client.ts` 最终态**（变异即改即还原除外）；先做 `eslint.config.js` 加 `'coverage'` 一行小修并验证 `test:coverage → lint` 顺序解耦                                                                     | flash                                                        |
| **P2 契约快照**（**11-13 已验收通过**）                               | atlas `openapi.admin.json`                                                    | `scripts/gen-api-contract.mjs` 生成 `src/test/contract/admin-paths.json` 入库；扫描 `src/` 调用点做存在性断言；`allowlist.ts` 白名单 ≤10 条且逐条写原因                                                                                                                                                                                                               | `pnpm test:contract` 绿；故意写一个不存在的 path → 必须红                                                                                                                                                                                                                                                    | flash                                                        |
| **P3a 补页**                                                          | §4（参考实现只读）                                                            | 按**拍板 D**：只补「权限包管理」1 页 + 路由 + 菜单 + i18n + hooks + testid；不碰其余 A 类页                                                                                                                                                                                                                                                                           | `pnpm typecheck` / `lint` / `build` 绿；`pnpm dev` 下 5173 页面人工可达；**不得打真实写接口**（R-5）；生产代码改动仅限拍板 B 允许的最小接线                                                                                                                                                                  | flash                                                        |
| **P3b 组件集成**                                                      | `renderWithProviders` + MSW、§6、**只读引用** M1/N4 28 条的边界描述（拍板 C） | 5 个提交/回显断言：必填拦截、32/33 字符、200/201、服务器→账号类型联动、重置清空                                                                                                                                                                                                                                                                                       | `pnpm test` 绿；`onUnhandledRequest:'error'` 下无隐式真实请求；每条变异能红；**不生成 case.md、不解挂 N4**                                                                                                                                                                                                   | flash                                                        |
| **P4 E2E**                                                            | —                                                                             | **不启动**（A1/A4 未满足，且归 crm-e2e）                                                                                                                                                                                                                                                                                                                              | 交付说明如实写「未在浏览器验证」，不得声称已通过                                                                                                                                                                                                                                                             | 人 / 后续批次                                                |

> 每阶段结束填 §9 回执；**任一验收不过就停在该阶段，不带着红往下走**。P0 完成后先让人看一眼再继续 —— 双环境配置在 TS
> 6 / Vite 6 上是首个真实风险点。

---

## 6. 门禁与防恒真（对齐 KB `ASSERTION-CONTRACT.md`）

1. **每条防回归断言必须能红**：改坏被守护的实现一行 → 用例红 → 还原 → 复绿。即改即还原，git 零残留。
2. **断言目标 = 被测代码写入的可观测输出**（请求 path/body、DOM 状态、toast/错误提示、回调入参），
   **不是测试自己注入的输入**（自己塞的 `required`、自己 mock 的返回值）。
3. **mock 三档**：可 mock 输入依赖（API / route
   query）；不得整体替换被测对象内部；MSW 拦 `fetch` 而非直接
   `vi.mock('fetch')`，保留 `client.ts` 的 flatten / 401 / redirect 逻辑。
4. `// assert:` 追溯：每个 `expect`
   前用注释写明「守护哪条需求 / 哪个 KB 卡 id」。
5. 建议在本仓加 `scripts/check-test-assertions.mjs`（镜像
   `D:/projects/crm-knowledge/scripts/check-assertions.mjs`
   的 R1-R8 静态扫描，说明书见
   `D:/projects/crm-knowledge/.agents/skills/kb-testcase/ASSERTION-CONTRACT.md`），挂进
   `pnpm test` 前置；**规则细节以 KB 契约为准，不在本仓另定第二套**。
6. 不设覆盖率门槛、不做整页快照、不做视觉回归（test-plan §3/§13）。
7. **L1~L3 绿 ≠ 浏览器可用**；A1 未满足时交付说明必须如实标注。

---

## 7. testid 契约（与 `crm-e2e/CLAUDE.md` 对齐）

```
${域}-${元素}-${类型}
类型 ∈ field | button | link | screen | list | dialog | item | trigger | option
```

- 推广权限包页建议前缀 `spread-perm-`：如
  `spread-perm-name-field`、`spread-perm-submit-button`、
  `spread-perm-list`、`spread-perm-reset-button`、`spread-perm-server-trigger`。
- 本仓先登记 `docs/testids.md`；**不要自己写进
  `crm-e2e/contracts/testids.json`**（R-1，那份由 crm-e2e 侧按 A4 裁定后生成）。
- 动态列表项用模板拼接，清单里只记前缀。

---

## 8. 与 KB / N10 的衔接

- M1 /
  N4 的 28 条卡**保持挂起**，不因本清单启动而提前消费；按 N10「规范重订后修订、交 React 后台测试消费」。
  > 与 §3 拍板 C 不矛盾：C 说的是**只读引用**这 28 条的边界描述当 P3b 断言素材，不等于解挂、不等于生成 case.md、不等于进 e2e 消费队列。本节管的是**消费**，C 管的是**素材**。
- 触发顺序：P0–P3 落地 → §3 A4 的 e2e 通道裁定 → 人修订 N4
  28 条 → 才进消费队列。
- 本清单不修改 KB 大纲、不修改 `crm-e2e/contracts/FLASH-TASK-CARD.md`
  的既有红线； `crm-e2e` 的 `side=admin` 卡仍按 R-9 挂起。

---

## 9. 阶段回执模板（每阶段一行，人只看这张表）

| 阶段    | 改动文件                                                                                                                                   | 跑过的命令 + 退出码                                                                                                                                                                                                                                                       | 变异验证（改了什么 / 是否红 / 还原后是否绿）                                                             | 停机项 / 挂账                                                                                                                                                  | 未验证项（如实写）                                                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P0      |                                                                                                                                            |                                                                                                                                                                                                                                                                           |                                                                                                          |                                                                                                                                                                |                                                                                                                                                                          |
| P1      |                                                                                                                                            |                                                                                                                                                                                                                                                                           |                                                                                                          |                                                                                                                                                                |                                                                                                                                                                          |
| **P2**  | 5 处：`scripts/gen-api-contract.mjs`、`src/test/contract/{admin-paths.json,endpoints.test.ts,allowlist.ts}`、`package.json` 加 2 行 script | `node scripts/verify-test-batch.mjs --config scripts/verify-p2.json` → **14/14 PASS / exit 0**；人审独立复跑第 1 次 13/14（V8 被 0 字节 `_tmp_*` 环境垃圾污染）→ 修门禁脚本后**连跑两次 14/14**；`pnpm test` 58/58、typecheck、lint `0e/49w`、build、`test:contract` 全绿 | MUT-1 调用点 / MUT-2 快照各 `red=1 → 还原绿 → git diff 空`；快照 **806→947 纯增 141、零回退**            | **3 条白名单争议已裁定**（§9.5 / §9.6）：C5 严格口径采纳，登记 **BUG-P2-01/02/03 待处理**；到期机制由 P2b 落地；生产代码修复仍需单独放行；A1/A2/A4/A5 原样挂账 | 未在浏览器验证；#4/#6 运行时探测因会话层登录失败**未完成**（按兜底口径登记，未证实 404）；白名单 reason 业务语义已抽查（6 条后端证据逐条核实），9 函数扫描分布未逐条复核 |
| **P2b** | 2 个已跟踪文件：`src/test/contract/{allowlist.ts,endpoints.test.ts}`（零新增文件）                                                         | `verify-test-batch.mjs --config verify-p2.json` → **14/14 PASS / exit 0**；`pnpm test:contract` 4/4、typecheck、lint `0e/49w`                                                                                                                                             | 专项变异 3/3 变红（expires 过期 / owner 空 / 孤儿条目）→ 还原绿、字节一致；P1/P2 的 `mutations` 配置未改 | 3 个 bug 的生产代码修复未放行；到期日 11-20 / 11-27，到期只允许收口删条目或人审延期                                                                            | 未做浏览器验证；未重跑 weekly/export                                                                                                                                     |
| P3a     |                                                                                                                                            |                                                                                                                                                                                                                                                                           |                                                                                                          |                                                                                                                                                                |                                                                                                                                                                          |
| P3b     |                                                                                                                                            |                                                                                                                                                                                                                                                                           |                                                                                                          |                                                                                                                                                                |                                                                                                                                                                          |

> **P0 复议回执**按 `docs/P0-REWORK-ORDER-v2.md`
> §7 单独填写（含 M2 字段、M1 探针、2 组变异、coverage、纪律复核与未验证项）；本表 P0 行只记「复议通过 / 不通过」。
> **P1 回执**按 `docs/P1-TASK-ORDER.md` **§7** 单独填写（六组覆盖 + 期望值推导 +
> ≥6 组变异 + 命令退出码 + 如实披露）；本表 P1 行只记「人审复核通过 / 不通过」。

---

## 10. 可直接发出的指令（2026-11-12 **v1.5** 历史存档；A–D 与 A6 均已拍板、P1 已执行完毕）

> ⚠️ **本节为 P0/P1 阶段历史存档，勿按此发指令**。
> **P2 已于 11-13 交付并验收通过，`docs/P2-TASK-CARD.md`
> §6 勿重发；当前无可发指令**；冲突以头部 **v1.12** 为准。✅
> **指令状态（P1 放行后）**：P0 复议**已通过**，两项必修关闭、A6 闭环，证据见
> `docs/P0-REWORK-ORDER-v2.md` **§10**（V1–V10 人审实跑）。
> **P1 已执行完毕、门禁验收通过**：`docs/P1-TASK-ORDER.md` §8
> **勿重发**；该单 §1 的两条实证已修正本清单 §3 拍板 B / §5
> P1 行的旧「捕获 URL」口径。
> **v2 执行单 §9 的 P0 复议指令已执行完毕，勿重发**；**第二步（v1.2 重建命令）永久禁止重发**。
> **P2 已验收通过**（`P2-TASK-CARD.md` §6 勿重发，人审见 §9）；P3a / P3b /
> P4 仍待用户放行（R-10 / R-11 继续生效）。

### 第一步 · 只读复述（**P0 阶段已执行，仅历史存档**；不要重发）

> 读
> `crm-admin/docs/REACT-TEST-INFRA-CHECKLIST.md`（**当时的 v1.4，现为 v1.5**）、`docs/P0-REWORK-ORDER-v2.md`
> 与 `docs/react-test-plan.md`。复述 §0 **十三条**红线、§3
> B 的 A–D 四项裁定、**§3 A6 的拍板 A 与人审复核边界**、
> **§11 两项必修的处置（v2 执行单）**、§3
> B.1 的覆盖关系、§5 的 P0 验收命令。特别说明：`pnpm typecheck` 曾在人审 shell
> exit 1 是 pnpm 11 / store v10 错配，**不是基线红**；直调 `tsc --noEmit` /
> `eslint`
> 实测都是绿的（§1）；A6 拍板 A 后由人审复核关闭。文档冲突以清单 + 执行单为准（R-9；**P0 阶段**是 v1.4 +
> v2 执行单， **P1 阶段是 v1.5 +
> `P1-TASK-ORDER.md`**）；草案 §15 的「待确认」不构成停机理由。
> **不改任何文件、不装依赖、不 commit/push、不执行 CLAUDE.md 的夜间无人值守协议。**

### 第二步 · ⛔ **永久作废，勿发**（复议后）

P0 首轮验收不通过（§11）。v1.2 的第二步含 A6 重建命令，该命令**已用掉一次且被证伪**
（§3
A6），**不得重发、不得重跑**。**§11.5 的旧重做指令与 v2 执行单 §9 的 P0 复议指令均已执行完毕并复议通过，勿重发**。

P0 复议结论与 V1–V10 证据见 **`docs/P0-REWORK-ORDER-v2.md`
§10**；两项披露的裁定（含 `eslint.config.js` 加 `'coverage'`
的一行小修）见 §10.2 —— **该小修已并入 `P1-TASK-ORDER.md`
第 1/2 步，由 flash 在 P1 里做，不要单独再发一次**。
**P1 已执行完毕、`P1-TASK-ORDER.md`
§8 勿重发**；**P2 已验收通过**（`P2-TASK-CARD.md` §6 勿重发）； **P3a / P3b /
P4 待用户点头后才由人发放行指令**；本仓无浏览器验证的交付说明纪律不变。

### 10.1 仍挂账、不要当成已放行

§3 A 的 **A1** 测试账号+种子数据、**A2** CI 平台、**A4** e2e 通道裁定、 **A5**
推广域产品口径 —— 仍由人给，flash 不得自行补齐；**A3 于 11-12 全部裁定并关闭**
（version 无条件同步已落到 kb-sync
skill；React 接口纳入 atlas 已定方向、落地为前置批次 A0，见 `P2-TASK-CARD.md`
§8），不再是挂账项。它们只卡 P4 / e2e / 契约可信度，
**不卡 P0–P3**。其中 A4 是 M1/N4 28 条最终能否端到端消费的关键，仍记在 `crm-e2e`
侧。
**A6 已拍板候选 A、flash 实装 + 人审复核均已完成，A6 闭环**（原口径已证伪，见 §3
A6）；两项必修已关闭。**P1 已执行完毕**（`P1-TASK-ORDER.md` §8 勿重发），
**P2 已交付并验收通过**（`P2-TASK-CARD.md` §6 勿重发、§9 人审记录），**P3a / P3b
/ P4 待用户放行**，§10 第二步与 v2 §9 均勿重发。

**P2 交付后新增挂账（11-13）**：`src/test/contract/allowlist.ts` 的 #4
`/grobal/search/list`、#5 `/system/crmUserVip/edit`、#6
`…//oneUserProtocol/{param}` 三条「疑似调用点缺陷」不属 C5 定义的「约定契约 /
atlas 版本差缺口」。 **11-13 23:2x 人裁定 + 处置已完成**：①
C5 严格口径采纳（三条仍属过渡登记、非正当缺口）；②
**P2b 独立小批次已放行并落地** —— `expires` / `owner` / `bugId` + 到期 /
orphan 断言，补上原卫生断言「沉底 + 幽灵豁免」两个盲点（门禁 14/14 / exit
0，P1/P2 配置一字未动）；③ #4 /
#6 只读探测已执行但会话层登录失败（「读不到」）→ 按兜底口径登记为 **BUG-P2-01 /
BUG-P2-03 待处理 bug**；#5 静态证据闭合、写操作禁探测 →
**BUG-P2-02 挂账待后端 / 产品确认**。详见 `P2-TASK-CARD.md` §9.5（缺陷台账）/
§9.6（P2b 验收）。
**仍挂账、未关闭**：3 个 bug 的**生产代码修复需单独放行**；白名单条目保留（删即红），由到期机制强制复核，到期只允许收口删条目或人审延期，**不许改断言换绿**；
**不得**因门禁绿就视为已解决，也不得删掉白名单条目后自行改调用点换绿。
`2026-11-20`
起 #2/#3 若 V7 周更补出双参变体，契约套件变红属**正常收口**，删条目即可。

---

## 11. P0 首轮审核退回单（2026-11-12，人审实跑）

**结论：部分通过，P0 验收不通过。**
产物方向对、纪律好（无 commit/push、受保护 3 文件未碰、版本回钉到清单大版本、装依赖微调如实备案），但有
**2 项必修**，其中 1 项是门禁级漏洞。审核方式：直调 `node_modules`
里的 CLI 绕开 pnpm 包装层 + 临时探针实跑，不采信回执自述。

> **11-12 人拍板（v1.4）**：M2 选 §3 A6
> **候选 A**（`packageManager: pnpm@10.34.5`）；
> **§11.4 三条建议全部采纳**。处置指令见
> **`docs/P0-REWORK-ORDER-v2.md`**（§11.5 旧指令作废）。
> **11-12 人审复议：P0 通过、两项必修关闭、A6 闭环**，V1–V10 证据见该单
> **§10.1**； **P1 已执行完毕**（`docs/P1-TASK-ORDER.md`
> §8 勿重发），**P2 已验收通过** （`docs/P2-TASK-CARD.md` §6 勿重发），P3a / P3b
> / P4 仍待用户放行。

### 11.1 已复核通过（不必重做）

| 项                                                            | 复核结果                                                                                                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 6 个新文件 + `package.json` / `.gitignore` / `pnpm-lock.yaml` | 全部存在；版本 `vitest ^4.1.12` / `msw ^2.15.0` / `jsdom ^27.4.0` / RTL ^16.3.3 / jest-dom ^7.0.1 / user-event ^14.6.10，与 §2 选型一致；**未装 happy-dom / playwright** |
| `pnpm test`                                                   | 直调 `node_modules/vitest/vitest.mjs run` → **2 文件 / 5 用例全绿**，双环境归属正确                                                                                      |
| 三条基线（新增文件后）                                        | `tsc --noEmit` exit 0；`eslint` exit 0 / **0 error + 49 既有 warning**（无新增）；与 §1 同状态                                                                           |
| 3 个受保护文件                                                | mtime `2026-11-07` / `2026-10-28`，diff 内无 P0/测试字样 → **未被碰**                                                                                                    |
| 提交纪律                                                      | 最新提交仍是 `391f701`，无新 commit；未写 `TASK_STATE.md` / `.zcode/night/LOCK`                                                                                          |
| lockfile                                                      | `+1303/-7`，全是新增测试依赖的解析结果，无意外                                                                                                                           |
| `// assert:` 追溯                                             | `utils.test.ts` 每个 `expect` 前均有注释 ✓                                                                                                                               |

### 11.2 必修 M1 · MSW 只在 DOM 环境启用（门禁级）

**证据**：审核探针写在 `src/lib/*.test.ts`（**unit / node
project**），打一个未声明请求 `http://127.0.0.1:9/audit-probe`，结果是
`TypeError: fetch failed` —— **请求真的发出去了**，不是
`[MSW] Cannot bypass a request ...` 的拦截错误。探针已删除。

**根因**：`src/test/setup.ts:65-79` 把
`server.listen({ onUnhandledRequest: 'error' })` / `resetHandlers` / `close`
全包在 `if (typeof window !== 'undefined')` 里。node 环境（`.test.ts`）下
`window` 未定义 → **MSW 从未启动**。回执写「`onUnhandledRequest:'error'`
生效」只在 DOM project 成立，结论不完整。

**影响**：

1. **R-5 破防** —— node 环境用例可以打真实接口还显示绿；
2. **拍板 B 落空** —— P1 的 `flattenParams` 要靠 MSW 捕获 `apiFormPost`
   的真实请求 **POST body** 间接断言（「覆盖不减，只换测法」），而当时
   `utils.test.ts` 所在的 node project 里 MSW 从没起 → 该路径不可用。
   > **v1.5 修正**：原写「捕获真实请求 URL」不准确（flatten 结果在 body 不在 query）。M1 修复让 node
   > project 的 MSW 起作用后，**仍不能**在 node 环境跑 `apiFormPost`：
   > `API_BASE_URL = '/api'` 是相对 URL，node fetch 报
   > `ERR_INVALID_URL`（人审 11-12 探针实证）。故 #1 落 dom
   > project（`.test.tsx`），见 `P1-TASK-ORDER.md` §1.2。

**唯一允许动作**：把 MSW 三段生命周期**移出 DOM 分支、无条件执行**（`msw/node`
的 `setupServer` 在 node 环境本就可用）；只把 `localStorage.clear()`
留在 DOM 判断内；i18n 初始化与浏览器 API 桩继续只在 DOM 环境做。同步修正
`src/test/msw/server.ts` 注释里「在 setup.ts 生命周期里启用」的范围表述。

**验收**：新建一个 `.test.ts`（node project）探针 → 未声明请求必须报 `[MSW]`
拦截错误（用例红，错误类型必须是 MSW 而非 `fetch failed`）→ 删探针 → 全量
`pnpm test` 复绿 → `tsc --noEmit` / `eslint` 同状态。**探针必须真删**，git
status 不得残留。

### 11.3 必修 M2 · A6 工具链未闭环

见 §3 A6：flash shell 是 pnpm 10、人审 shell 是 pnpm
11，`CI=true pnpm install --frozen-lockfile` 在 pnpm 10 下是
`Already up to date` 空操作；**人审 shell 复测 `pnpm typecheck` 仍 exit 1**
（`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`），`node_modules` 仍是 v10
store。回执「A6 三步全过」应改记为「A6 未闭环（执行环境差异）」。

**处置（11-12 人拍板）**：选 **A**，按 `docs/P0-REWORK-ORDER-v2.md` §2/§3 在
`package.json` 顶层加
`"packageManager": "pnpm@10.34.5"`；**这是 R-10 的唯一例外**，其余工具链动作一律禁止（R-11）。闭环判据：**人审在 pnpm
11 shell** `pnpm --version` = `10.34.5` 且 `pnpm typecheck` / `pnpm test` /
`pnpm lint` 全绿；flash
**不得**声称已完成该复核（R-12）。候选 B（真重建）作废。**11-12 人审已按上述判据实跑复核通过 →
A6 闭环（v2 执行单 §10.1）。**

### 11.4 建议（**11-12 已全部采纳**；执行细节见 `docs/P0-REWORK-ORDER-v2.md` §1 / §3 / §7.2）

1. **变异验证**：`src/lib/utils.test.ts`
   是真实防回归断言（真实函数 + 具体输出），§6.1 要求「改实现一行 → 红 → 还原 → 绿」。即改即还原、git 零残留，**不算「改生产代码」**，与拍板 B 不冲突。
   **P0 就做，不顺延 P1**。
2. **coverage 范围**：`vitest.config.ts` 的 `coverage.exclude` 含
   `src/components/ui/**`（被测组件目录），会让盲区分析失真；**改为只排 `src/test/**`与 locales**，并跑`pnpm
   test:coverage`确认报告含`button.tsx`。
3. **示例用例定性**：`button.test.tsx` 的 `toBeInTheDocument` /
   `toHaveTextContent('保存')`
   断的是测试自己注入的 testid 与文案，属链路 smoke；只有
   `toHaveAttribute('data-slot','button')`
   具备可证伪性。回执**不得把前两条计入防回归覆盖**。

> 采纳口径：**2 组实现变异**（`src/lib/utils.ts:203` 的
> `padStart(2,'0')`、`src/components/ui/button.tsx:50` 的
> `data-slot`）各做「红 → 还原 → 绿」，证据填 v2 执行单 §7.1；coverage 与 smoke 定性填 §7.2。

### 11.5 交给 flash 的重做指令 —— **已作废且已执行完毕**

> ⛔ 本节旧指令写「M2 等人拍板」，已作废；替代它的 `docs/P0-REWORK-ORDER-v2.md`
> §9 **也已执行完毕、复议通过**（结论见该单 §10）。
> **P0 的复述/重做/复议指令全部执行完毕、勿重发**；
> **当前无可发指令**（P1 已完成并验收通过；**P2 已交付并验收通过，§6 勿重发**）；P3a
> / P3b / P4 待放行，不得自行往下做。
