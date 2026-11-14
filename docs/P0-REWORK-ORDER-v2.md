# P0 复议执行单 v2（人审退回回执 · 交 glm flash 执行）

> 日期：2026-11-12 / 状态：**已拍板、可执行**
> 替代：`docs/REACT-TEST-INFRA-CHECKLIST.md` **§11.5**
> 的旧重做指令 —— 旧单写「M2 等人拍板」，**已作废**。上位文件：`docs/REACT-TEST-INFRA-CHECKLIST.md`
> **v1.4**（技术选型、A–D 裁定、§0 红线、§5
> P0 验收命令仍以清单为准；冲突时以**本单**为准并停机回报）。本单**只管 P0 复议**：**P1–P3 不放行**、**不做浏览器验证**、四仓**不 commit
> / push**。人审拍板（2026-11-12）：**§3 A6 候选 A** ——
> `packageManager: pnpm@10.34.5`；**§11.4 三条建议全部采纳**。

---

## 0. 一句话目标

把 P0 首轮的两项必修关闭：**M1** 让 MSW 在 node / dom 双 project 都启用；**M2**
按拍板 A 锁工具链版本。同时按采纳的三条建议补齐「可证伪」证据。**改完停机交回执，不自行往下跑。**

---

## 1. 裁定与关闭判据（人只看这张表）

| 项                                   | 人审裁定                                                                                       | 关闭判据                                                                                                                                                                                                                 | 谁验                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| **M1** · MSW 只在 DOM 启用（门禁级） | **必修**，按 §11.2 唯一允许动作：三段生命周期无条件执行                                        | node project 探针打未声明请求 → 用例红，且错误是 **`[MSW]` 拦截类**，不是 `TypeError: fetch failed`；删探针后全量复绿                                                                                                    | flash 跑；人审复核          |
| **M2** · A6 工具链未闭环             | **拍板 A**：`package.json` 顶层加 `"packageManager": "pnpm@10.34.5"`；**候选 B（真重建）作废** | ① flash 加字段并在自己 shell 自检；② **人审在 pnpm 11.22.0 shell 复核**：`pnpm --version` = `10.34.5`，且 `pnpm typecheck` / `pnpm test` / `pnpm lint` 全绿。**② 未完成前 A6 不算闭环；② 已于 11-12 填格通过，见 §10.1** | ① flash；② **人（已完成）** |
| 建议 1 · 变异验证                    | **采纳**：P0 就做，**不顺延 P1**                                                               | 至少 2 组「改实现一行 → 红 → 还原 → 绿」，`git status` 零残留                                                                                                                                                            | flash                       |
| 建议 2 · coverage 范围               | **采纳**：`coverage.exclude` 去掉 `src/components/ui/**`                                       | `pnpm test:coverage` exit 0，报告里能看到 `src/components/ui/button.tsx`                                                                                                                                                 | flash                       |
| 建议 3 · 示例用例定性                | **采纳**：如实标注，不虚报覆盖                                                                 | 回执写明 `button.test.tsx` 的 `toBeInTheDocument` / `toHaveTextContent('保存')` 是链路 smoke、**不计入防回归覆盖**；唯一计入覆盖的 `data-slot` 断言必须有一组变异证据                                                    | flash                       |

> **A6 方案 A 可行性已由人审预演（11-12）**：在**临时目录**放一份带
> `"packageManager": "pnpm@10.34.5"` 的 `package.json`，人审 shell（pnpm
> **11.22.0** / node 22.22.2）执行 `pnpm --version` 返回 **`10.34.5`**（exit
> 0）→ pnpm 按项目版本自动切换生效。因此**不需要**删
> `node_modules`、不需要重建、不需要联网装 pnpm、不需要改 pnpm 配置。该预演在仓外进行；**仓内已由 flash 按 §2 实装、人审 V10 复核通过（§10.1）**。

---

## 2. 唯一允许改动清单（超出即整批退回）

### 2.1 允许**最终落盘**的 4 个文件

| #   | 文件                     | 唯一允许的动作                                                                                                                                                                                                                                                                                                                               |
| --- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `package.json`           | 顶层**新增一个字段** `"packageManager": "pnpm@10.34.5"`。不得改 `scripts` / `dependencies` / `devDependencies` / 其他字段，不得格式化重排；**不得因此重跑 `pnpm install`、不得动 `pnpm-lock.yaml`**                                                                                                                                          |
| 2   | `src/test/setup.ts`      | 把 `server.listen({ onUnhandledRequest: 'error' })` / `server.resetHandlers()` / `server.close()` **移出 `if (typeof window !== 'undefined')`、无条件执行**（建议放在文件末尾，i18n 动态 import 与浏览器 API 桩仍只在 DOM 分支）；`localStorage.clear()` 用 DOM 判断单独包住；修正顶部块注释第 13 行「以上 2~4 仅在 DOM 环境生效」的范围表述 |
| 3   | `src/test/msw/server.ts` | 仅修正第 7 行注释：`onUnhandledRequest:'error'` 在 setup.ts 生命周期里**无条件启用，node / dom 双 project 均生效**；`export const server = setupServer()` **不改**                                                                                                                                                                           |
| 4   | `vitest.config.ts`       | `coverage.exclude` **删掉 `'src/components/ui/**'`**（改为只排 `src/locales/**`、`src/test/**`）；其余配置、`projects`、`setupFiles` 一律不动                                                                                                                                                                                                |

### 2.2 允许**临时新建后必删**的文件

- `src/lib/p0-msw-probe.test.ts`（node
  project 探针）。**验收后必须删除**，`git status --short` 不得残留。
- `coverage/` 产物由 `.gitignore` 忽略，不算残留；**不得提交**。

### 2.3 明确禁止

- 改
  `pnpm-lock.yaml`、`node_modules`、`.gitignore`、`pnpm-workspace.yaml`、任何 pnpm
  / corepack 配置。
- 改 `src/lib/utils.ts` / `src/components/ui/button.tsx`
  的**最终态**（§3 第 4/5 步的变异必须即改即还原，git 零残留）。
- 改 `src/lib/utils.test.ts` / `src/components/ui/button.test.tsx`
  的**断言**（不许靠改测试制造红）。
- 改 3 个受保护文件（`docs/react-feature-drift-analysis.md`、`docs/react-migration-gap-analysis.md`、`src/pages/review/leverage-detail/components/LeverageInfoCard.tsx`）、改
  `docs/*.md`（文档由人改）、改 KB `crm-knowledge/**`、改 `crm-e2e/**`、改旧后台
  `D:/projects/CRM/**`。
- 新增 handlers / fixtures / 别的测试文件、加
  `data-testid`、改生产代码最终态、跑 P1–P3、起浏览器 / Playwright。
- `git commit` / `git push`、`TASK_STATE.md` 断点提交、`.zcode/night/LOCK`
  心跳、任何夜间无人值守协议。

---

## 3. 执行序（顺序不可换）

| 步    | 动作                                                                                                                                                                                                       | 判据                                                                                                                                           |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **0** | **只读复述**：读 `docs/REACT-TEST-INFRA-CHECKLIST.md` v1.4 与本单；复述 §0 十三条红线（R-1…R-13）、§3 B 的 A–D 四项裁定、本单 §2 允许改动清单、§4 验收命令、§8 停机条件。**此步不改任何文件**              | 复述无遗漏                                                                                                                                     |
| **1** | 按 §2.1 改 4 个文件（顺序建议：package.json → setup.ts → server.ts → vitest.config.ts）                                                                                                                    | 只动这 4 个                                                                                                                                    |
| **2** | **M1 探针**：新建 `src/lib/p0-msw-probe.test.ts`，在 `test()` 里 `fetch('http://127.0.0.1:9/audit-probe')`；跑 `pnpm test`                                                                                 | 该用例**红**，错误文本含 `[MSW]` / `Cannot bypass` / `onUnhandledRequest` 之一；**不得是 `TypeError: fetch failed`**，也不得绿。贴原样输出片段 |
| **3** | **删探针**，跑全量 `pnpm test`                                                                                                                                                                             | 2 文件 / 5 用例**全绿**；`git status --short` 无 `p0-msw-probe`                                                                                |
| **4** | **变异 A（node 纯函数）**：把 `src/lib/utils.ts:203` 的 `const hh = String(Number(h)).padStart(2, '0');` 改成 `padStart(3, '0')` → `pnpm test` 至少 1 个 `expect` **红** → **还原** → `pnpm test` **复绿** | 红 / 还原绿都记录；`git status` 里不出现 `src/lib/utils.ts`                                                                                    |
| **5** | **变异 B（DOM 组件）**：把 `src/components/ui/button.tsx:50` 的 `data-slot="button"` 改成别的值（或删掉）→ `pnpm test` 的 `toHaveAttribute('data-slot','button')` **红** → **还原** → **复绿**             | 同上；`git status` 里不出现 `button.tsx`。**不许改测试断言凑红**                                                                               |
| **6** | `pnpm test:coverage`                                                                                                                                                                                       | exit 0；报告含 `src/components/ui/button.tsx`。**不设门槛、不解读百分比**                                                                      |
| **7** | 基线复核：`pnpm --version`、`pnpm typecheck`、`pnpm lint`、`pnpm test`；`pnpm build` **选跑**（首轮未跑、无基线可比，失败就如实记录并停机，不许自行修生产代码）                                            | `tsc` exit 0；`eslint` **0 error / 49 个既有 warning**；`pnpm --version` = `10.34.5`                                                           |
| **8** | 按 §7 填**复议回执**，停机                                                                                                                                                                                 | 不跑 P1–P3、不 commit/push、不声称「人审 shell 已验证」                                                                                        |

> 第 4/5 步的「改实现一行」按 §11.4 第 1 条**不算改生产代码**（即改即还原、git 零残留），与拍板 B 不冲突。

---

## 4. 验收判据（人审复核用，逐条可对）

| #   | 命令 / 检查                                  | 期望                                                                                                                                                                        | 必须留下的证据                 |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| V1  | `pnpm --version`                             | `10.34.5`（flash shell 本来就是；**人审 shell 复核另算**）                                                                                                                  | 原样输出                       |
| V2  | 探针跑 `pnpm test`                           | 红，错误为 MSW 拦截类                                                                                                                                                       | 错误片段原样贴                 |
| V3  | 删探针后 `pnpm test`                         | 2 文件 / 5 用例绿                                                                                                                                                           | 汇总行原样贴                   |
| V4  | 变异 A / B                                   | 各「红 → 还原 → 绿」                                                                                                                                                        | 改动行号、红了几条、还原后结果 |
| V5  | `pnpm test:coverage`                         | exit 0，报告含 `button.tsx`                                                                                                                                                 | 报告片段                       |
| V6  | `pnpm typecheck` / `pnpm lint`               | exit 0 / 0 error + 49 既有 warning                                                                                                                                          | 退出码 + warning 数            |
| V7  | `git status --short`                         | 与首轮相比**只多出 `packageManager` 字段所在的 `package.json`（已在改动列表内）**；无探针、无 `utils.ts` / `button.tsx`、无 `pnpm-lock.yaml` 新改动、无 coverage 未忽略文件 | 原样输出                       |
| V8  | 3 个受保护文件                               | mtime / diff 未变                                                                                                                                                           | 复核结论                       |
| V9  | 提交纪律                                     | 最新提交仍是 `391f701`，无新 commit / push                                                                                                                                  | `git log -1 --oneline`         |
| V10 | **人审侧 A6 闭环（由人做，flash 不得代劳）** | 人审 pnpm 11.22.0 shell：`pnpm --version` = `10.34.5`，`pnpm typecheck` / `pnpm test` / `pnpm lint` 全绿                                                                    | 人审填写                       |

> **纪律**：V1–V9 的输出**贴原样片段**，不写「应该」「预计」「应该能过」。没跑的写「未跑」，不写「通过」。不得把 pnpm 包装层曾经的
> `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`
> 写成「基线本来是红的」（R-10/R-12）。

---

## 5. 与清单 v1.3 的冲突消解（防 flash 读旧文档停机）

| 旧文档位置                            | 旧口径                               | **v1.4 / 本单口径**                                                                                                                                                                         |
| ------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §0 **R-10**                           | 禁止「自行加 `packageManager` 字段」 | **唯一例外**：本单 §2.1 #1 授权的这一次字段写入。其余工具链动作仍全禁（新增 R-11）                                                                                                          |
| §3 **A6**                             | 「待重定的两个候选，人拍板」         | **已拍板 A**；候选 B 作废。见 §3 A6 与 `docs/P0-REWORK-ORDER-v2.md` §1                                                                                                                      |
| §10 第二步                            | 「已暂停、勿发」                     | **永久作废**，禁止重发 v1.2 的重建命令。**本单 §9 已执行完毕并复议通过，勿重发；P1–P3 待用户放行（§10，11-12 历史状态）**                                                                   |
| §11.3                                 | 「M2 等人拍板，禁止自行处理」        | M2 **已拍板 A**，按本单 §2/§3 实施；**人审侧复核已完成（§10.1），A6 闭环**                                                                                                                  |
| §11.5                                 | 「只做 M1，M2 等人拍板」             | **整节作废**；本单 §9 亦已执行完毕、复议通过（§10）。「当前无可发指令」是 **11-12 当时状态**；11-13 起 P1 已完成、**P2 已交付并验收通过**（`docs/P2-TASK-CARD.md` §6 已执行完毕、勿重发）； |
| 当前无可发指令，P3a / P3b / P4 待放行 |
| §9 回执表 P0 行                       | 通用模板                             | 按本单 §7 填**复议回执**                                                                                                                                                                    |

**仍然有效、不得当成已放行**：

- §3 A 的 **A1** 账号+种子数据、**A2** CI、**A3** atlas 更新机制、**A4**
  e2e 通道裁定、**A5** 推广域产品口径 —— 五项仍由人给，只卡 P4 / e2e
  / 契约可信度，**不卡 P0–P3**，也不得拿来当停机理由。
- M1/N4 的 28 条 KB 卡**仍只作只读素材**，不解挂、不生成 case.md、不进 e2e 消费队列；`crm-e2e`
  的 `side=admin` 试点批仍作废挂起。
- `C-M3-10 queryData`、Q 口径、2 条候选 anchor、`login-ta-*` testid 欠账 ——
  KB 侧挂账不变，本单不涉及。
- **P1–P3 在两项必修由人审复核关闭前一律不放行**；无浏览器验证的交付说明纪律不变。

---

## 6. 红线补遗（清单 §0 R-1…R-10 全部继续生效，另加三条）

| #        | 禁止动作                                                                                                                                                                                                     | 为什么                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **R-11** | 本单 §2.1 #1 之外**任何工具链动作**：`corepack enable` / `pnpm config set` / `npm i` / 删 `node_modules` / 重跑 `CI=true pnpm install --frozen-lockfile` 重建 / `--no-frozen-lockfile` / 改 `pnpm-lock.yaml` | A6 拍板 A 是「锁版本」，不是「重建」。v1.2 那一次重建已用掉且被证伪 |
| **R-12** | 把「人审 shell 已验证」「A6 已闭环」写进回执；或把「我这边跑绿」当成 A6 闭环；或把 pnpm 包装层 exit 1 写成「基线红」                                                                                         | 人审侧复核是人的动作，V10 未填前 A6 不算闭环                        |
| **R-13** | 靠改测试断言 / 改 `vitest.config.ts` / 改探针内容来「制造变异红」；或变异后不还原                                                                                                                            | 变异必须改**实现**，且即改即还原、git 零残留                        |

---

## 7. 交付回执模板（必须逐格填，人只看这张表）

### 7.1 执行与验收

| 项         | 改动 / 动作                        | 命令 + 退出码                                 | 关键输出（贴原样片段）     | 结论                 |
| ---------- | ---------------------------------- | --------------------------------------------- | -------------------------- | -------------------- |
| M2 字段    | `package.json` 加 `packageManager` | `pnpm --version`                              |                            | 通过 / 停机          |
| M1 修复    | `setup.ts` / `server.ts`           | —                                             | 贴改后生命周期代码片段     | 通过 / 停机          |
| M1 探针    | 新建 → 跑 → **删**                 | `pnpm test`                                   | **错误类型必须是 MSW**     | 红=通过              |
| 删探针复绿 | `git status --short`               | `pnpm test`                                   | 2 文件 / 5 用例            | 通过 / 停机          |
| 变异 A     | `utils.ts:203`                     | `pnpm test` 两次                              | 改了什么 / 红几条 / 还原后 | 红→还原绿            |
| 变异 B     | `button.tsx:50`                    | `pnpm test` 两次                              | 同上                       | 红→还原绿            |
| coverage   | `vitest.config.ts`                 | `pnpm test:coverage`                          | 报告含 `button.tsx`        | 通过 / 停机          |
| 基线       | —                                  | `pnpm typecheck` / `pnpm lint` / `pnpm build` | 退出码 + warning 数        | 通过 / 未跑 / 停机   |
| 纪律       | —                                  | `git status --short` / `git log -1 --oneline` | 原样输出                   | 无残留 / 无新 commit |

### 7.2 §11.4 三条建议的采纳回执

| 建议                      | 是否采纳 | 证据位置                                                                                                                 | 不做的理由（若不做） |
| ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| 1 · 变异验证 P0 就做      | 是       | 7.1 变异 A / B                                                                                                           | —                    |
| 2 · coverage 不排 ui 目录 | 是       | 7.1 coverage                                                                                                             | —                    |
| 3 · smoke 如实定性        | 是       | 在下方写：`button.test.tsx` 前两条为链路 smoke，**不计入防回归覆盖**；`data-slot` 为唯一计入覆盖的断言，变异证据见变异 B | —                    |

### 7.3 未验证项 / 停机项 / 挂账（如实写）

- 未验证项：浏览器验证（未做）、人审 pnpm 11
  shell 的 A6 复核（**由人做，flash 不填结论**）、P1–P3（未跑）。
- 停机项：无 / 写清楚卡在哪一步、看到什么输出。
- 挂账：A1–A5、M1/N4 28 条只读、Q 口径 / `C-M3-10` / 2 条候选 anchor /
  `login-ta-*`（本单均不涉及）。

> **覆盖率口径**：按「跑绿且断言对准需求」计数；P0 计入防回归覆盖的断言 =
> `utils.test.ts` 全部 `expect` + `button.test.tsx` 的 `data-slot`
> 一条。**不按文件数、不按 `passed` 数。**

---

## 8. 停机条件（命中任意一条，停机回报，不自行处置）

1. 加 `packageManager` 后 `pnpm --version` 不是 `10.34.5`，或任一
   `pnpm <script>` 仍报 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` /
   `ERR_PNPM_NO_OFFLINE_META` →
   **停机交人**，不得 corepack、不得改 pnpm 配置、不得重建。
2. 探针用例**绿**，或红的错误是 `TypeError: fetch failed` → M1 未修好；可继续改
   `setup.ts`，但**不得**改测试 / 改配置 / 加 handler 把探针「变绿」。
3. 变异不红，或还原后不绿，或 `git status` 出现 `utils.ts` / `button.tsx`
   残留 → 停机。
4. `server.listen()`
   报重复调用 / 双环境互相干扰 → 停机回报，**不得自行加全局单例或改 `pool`**。
5. `pnpm test:coverage` 非 0 且无法解释 → 如实记录 + 停机。
6. `pnpm build`
   失败且无法证明与本单 4 个文件无关 → 如实记录 + 停机，**不许自行修生产代码**。
7. 任何需要改生产代码最终态、改 lockfile、碰 KB / `crm-e2e`
   / 旧后台、或需要人裁定业务口径的情形 → 停机交人。

---

## 9. 可直接复制发出的指令

> ⛔
> **状态更新（2026-11-12 人审复议后）：本节指令已执行完毕并通过复议，勿重发。**
> 结论与 V1–V10 证据见 **§10**；P1–P3 待用户另行放行。以下为历史存档。

> 读 `crm-admin/docs/REACT-TEST-INFRA-CHECKLIST.md` **v1.4** 与
> `crm-admin/docs/P0-REWORK-ORDER-v2.md`，执行
> **P0 复议**（旧 §11.5 指令作废，以 v2 为准）。
>
> 1. 按 v2 §3 执行序做，只改 §2.1 允许的 4 个文件 + 临时探针（即建即删）：
>    `package.json` 加
>    `"packageManager": "pnpm@10.34.5"`（**A6 已拍板 A，这是 R-10 的唯一例外**）；
>    `src/test/setup.ts` 把 MSW 三段生命周期移出 DOM 分支、无条件执行；
>    `src/test/msw/server.ts` 修注释；`vitest.config.ts` 的 coverage 去掉
>    `src/components/ui/**`。
> 2. 按 v2 §4 逐条验收：node project 探针必须报 **MSW 拦截错误**（不是
>    `fetch failed`）→ 删探针 → 全量 `pnpm test`
>    复绿；做 2 组实现变异（`utils.ts:203`、`button.tsx:50`）红→还原→绿；
>    `pnpm test:coverage` exit 0 且报告含 `button.tsx`；`pnpm typecheck` /
>    `pnpm lint` 与基线同状态。
> 3. 按 v2 §7 填**复议回执**，逐格贴原样输出；`button.test.tsx`
>    前两条如实标注为 smoke、不计防回归覆盖。
> 4. 红线 R-1…R-13：**不 commit/push**、不跑夜间协议、不动 3 个受保护文件、不碰 KB
>    / `crm-e2e` / 旧后台、不做任何其他工具链动作、不跑 P1–P3、不做浏览器验证。
>    **人审 pnpm 11
>    shell 的 A6 复核由人做，不要写「A6 已闭环」或「人审侧已验证」。**
> 5. 命中 v2
>    §8 任一停机条件就停机回报。修完**停机**，等人审复议，不自行放行 P1。

---

## 10. 人审复议结论（2026-11-12，实跑复核）

**结论：P0 复议通过。M1 /
M2 两项必修关闭，§11.4 三条建议全部兑现，A6 闭环（V10 已由人审实跑填格）。**
审核方式：在人审 shell（全局 pnpm 11.22.0 / node
22.22.2）逐条实跑 V1–V10 + 独立探针 + 文件态复核， **不采信回执自述**。P1–P3
**仍待用户一句放行**，本节不构成放行指令。

### 10.1 V1–V10 人审实跑结果

| 判据           | 人审实跑                                                                               | 结果                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| V1 / **V10 ①** | `pnpm --version` → `10.34.5`（exit 0）                                                 | **通过**：人审 pnpm 11 shell 已按 `packageManager` 自动切到 10.34.5，双环境分叉消除                                               |
| V2             | 人审独立探针 `src/lib/zz-human-audit.test.ts`（unit/node），直调 `vitest.mjs run` → 红 | **通过**：`InternalError: [MSW] Cannot bypass a request when using the "error" strategy...`，非 `fetch failed`。探针已删          |
| V3             | 删探针后 `pnpm test`                                                                   | 2 文件 / 5 用例绿，exit 0；`git status` 无探针残留                                                                                |
| V4             | 变异还原核验                                                                           | `utils.ts:203` = `padStart(2, '0')`、`button.tsx:50` = `data-slot="button"`，git status 无两文件 → 即改即还原成立                 |
| V5             | `pnpm test:coverage`                                                                   | exit 0；报告含 `components/ui → button.tsx`（100% stmts，未设门槛、不解读百分比）                                                 |
| V6             | `pnpm typecheck` / `pnpm lint` / `pnpm build`                                          | exit 0 / `✖ 49 problems (0 errors, 49 warnings)` / exit 0（19.46s，chunk >500kB 是既有告警）                                     |
| V7             | `git status --short`                                                                   | 与首轮一致；无探针 / coverage / tsbuildinfo 残留。lockfile mtime 14:32（首轮）、package.json 15:43（本轮）→ **本轮未动 lockfile** |
| V8             | 3 个受保护文件 mtime                                                                   | `2026-11-07 ×2` / `2026-10-28`，与首轮一致 → 未被碰                                                                               |
| V9             | `git log -1 --oneline`                                                                 | `391f701`，无新 commit / push                                                                                                     |
| **V10 ②**      | 人审 pnpm 11 shell：`pnpm typecheck` exit 0、`pnpm test` 2/5 绿、`pnpm lint` 0E/49W    | **A6 闭环** ✅                                                                                                                    |

> V7 口径澄清：status 中 `docs/P0-REWORK-ORDER-v2.md` 与
> `docs/REACT-TEST-INFRA-CHECKLIST.md`
> 两个 untracked 是**人审自己写的文档**，不计入 flash 产物，不构成 V7 违规。4 个授权文件已逐一读回：`package.json`
> 只多 `packageManager` 一行；`setup.ts` 三段钩子无条件注册、
> `localStorage.clear()` 单独 DOM 判断、i18n 与 API 桩仍 DOM-only；`server.ts`
> 仅注释； `vitest.config.ts` 的 `coverage.exclude` =
> `['src/locales/**','src/test/**']`。

### 10.2 两项披露的复核与裁定

**披露 1（coverage 污染 lint 计数）——属实，采纳修复。**
人审复现：`pnpm test:coverage` 后 `pnpm lint` = **52 problems（0 errors, 52
warnings，+3）**；删 `coverage/` 后回到 **49 /
0E**。根因核实：`eslint.config.js:8` 的 `ignores` 只有 `['dist']`， `.gitignore`
的 `coverage/` 对 eslint 无效，产物里 3 个 `Unused eslint-disable directive`
各贡献 1 条。flash 未改 `eslint.config.js`
是对的（该文件不在 §2.1 允许清单），删产物取证的做法也有效。

> **裁定**：把 `'coverage'` 加进 `eslint.config.js` 的 `ignores`（一行），消除
> `test:coverage → lint`
> 的顺序耦合，让「与基线同状态」判据在任何执行顺序下都成立。这**不阻断 P0 通过**（lint 始终 exit
> 0，只是 warning 数漂移），列为
> **P1 放行后的第 0 步小修**，由 flash 执行、人审复核；该文件由此获得一次明确的新授权，**除此之外 P1 前不得改任何配置**。

**披露 2（build 机械更新 tsbuildinfo）——属实，处置有效，补一条纪律。** 人审复跑
`pnpm build` 后 `tsconfig.tsbuildinfo` 确实变 `M`，已 `git checkout --`
还原、status 干净。

> **补充纪律**：`git checkout -- <file>`
> 只在确认该文件**当前干净**时才可用于还原构建产物；若它带人的未提交改动，禁止 checkout，只能停机回报。本轮已确认该文件干净，无损失。

### 10.3 回执诚信复核

回执逐格与实跑一致，无夸大：M2 明确写「待 V10 人审复核」、未声称人审侧已验证（R-12 遵守）；smoke 定性、变异条数（A 红 2 条 /
B 红 1 条）、coverage 不解读百分比、未跑项与挂账均如实。 `pnpm build`
的 chunk 告警与 `tsconfig.tsbuildinfo` 处置也已复现。

### 10.4 状态与下一步

- **已关闭**：M1、M2 / A6、§11.4 三条建议、P0 复议。
- **未放行**：P1–P3（等用户点头）；浏览器验证（A1 未满足）；A1–A5 五项硬阻塞照旧挂账，只卡 P4
  / e2e / 契约可信度；M1/N4 28 条仍只读、不解挂；Q 口径 / `C-M3-10` /
  2 条候选 anchor / `login-ta-*` 欠账不变。
- **四仓未 commit /
  push**；本轮人审只做只读复核 + 临时探针（即建即删）+ 必要的构建产物还原，未改任何最终态文件。
- 下一步由用户决定是否发 P1 放行指令；P1 内容按清单 §5：test-plan §8 的 **1~6**
  纯函数单测， `flattenParams` 用 MSW 捕获 `fetchWithAuth`
  真实 URL 间接断言全分支（**不改
  `client.ts`**），每组变异能红，且先完成 §10.2 的 `eslint.config.js` 一行小修。
