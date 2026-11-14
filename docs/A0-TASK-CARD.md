# A0 任务卡 · atlas 扩源：React 后台调用点纳入 admin 契约

> **状态（2026-11-13 二次裁定后）：已执行完毕，机器判卷
> `node scripts/verify-a0.mjs --run-tests` → 6/6 PASS / exit
> 0（V7 按设计 SKIP）。本卡已转为执行记录，§7 指令勿再重发。** 使用者裁定：**①
> atlas 仍 usage-driven**，但因新增 React 重构后台项目，须把它使用到的 API 调用点收进契约；**②
> atlas 不推远程是既有决策，但可在本地初始化 git、提交代码做记录**。上位：`docs/REACT-TEST-INFRA-CHECKLIST.md`
> §0/§3、**`docs/TASK-CARD-TEMPLATE.md`**、 `docs/P2-TASK-CARD.md` §8；KB 侧
> `docs/atlas-integration.md`（ADR-004
> §2.3/§6）。落地实跑数字与 git 纪律见 §0 表 2、§4；跨仓改动清单仍以 §3 为准。

---

## 0. 边界：这轮做了什么、什么没做

|                           | 内容                                                                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ 已做                   | 三条只读实证（§1）、A0 实施卡、`verify-a0.mjs` 判卷脚本、P2/P3a/清单/模板口径同步、项目记忆                                                                                                     |
| ✅ **11-13 追加（本次）** | 路线 A 裁定落地；atlas 在途改动固化为本地基线 commit `228580b`（**无 remote、不 push**）；A0-1..7 全部实施；`weekly --publish`（四源钉定）+ `export`；KB 侧时钟统一；`npm test` 72/72；判卷 6/6 |
| ⛔ 未做                   | 改 `sync/state.json` 的 `repos.crm/crmFe/mamFe.head` 与 `sync.lastProcessed`（属 KB 提取/卡片修订点，本轮只推进 atlas 锚点）、P2 / P3a / P3b、浏览器验证、任何 push                             |
| ✅ **11-13 追加**         | 使用者 13:35 追加授权提交：A0 代码 + 周更产物（26 文件）提交为本地 commit **`faf3948`**（`228580b` 后代，无 remote、不 push），atlas 工作区干净                                                 |

**放行条件（原）**：atlas 在途改动提交或清理 +
§2 口径裁定 → 已于 11-13 全部满足：在途改动提交为 `228580b`，§2 由使用者裁定
**路线 A（保持 usage-driven）**。

### 0.1 实跑结果（11-13，人审执行，flash 未参与）

| 项            | 结果                                                                                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| git 基线      | atlas 仓原本已有本地 git（HEAD `f666dbf`、无 remote、`main`），无需重新 init；`git add -A` 把 23 M + 13 `??`（vue3 支持 + 全量 catalog 重生，17.7 万增 / 5.7 万删）提交为 `228580b`，提交后工作区干净 |
| **A0 commit** | `faf3948`（`feat(atlas): include React admin frontend calls in admin contract (A0)`）：23 M + 3 `??` = 26 文件；提交后 `git status` 空、0 remote、未 push；V6 判卷复跑仍绿                            |
| 提取器        | `crmAdminReact` 扫 860 文件 / **643 calls / 584 唯一路径 / 0 parse errors**（基线：6 calls / 3 paths）；weekly 汇总 frontend 1093 calls                                                               |
| 契约          | catalog 1,650 端点（client 331 / **admin 1,319**，A0 前 1,165）/ 3,425 callers；`callers.json` 中 `crmAdminReact` **658 条**，其中 **648 条** `resolvedEndpointId` 以 `admin:` 开头                   |
| 导出          | `openapi.admin.json` 947 operations，其中 **577** 条 `x-atlas-usage.callers` 含 `crmAdminReact`；`info.version == snapshotId == 2026-11-13T04-15-35-768Z`                                             |
| 基线          | `weekly --publish` exit 0、`lastGood` 已推进；`atlas-check.mjs` conclusion=ok / baselineSelfCheck=true；diff 207 变更（P1 0 / P2 2 / FYI 205）                                                        |
| **V7 预期**   | `/system/spreadPermPackage*` 仍 **7 条 path** —— 路线 A 下 React 现无该页面，属预期，不是失败；V7 待 P3a 补页推远端后的下一轮周更                                                                     |

---

## 1. 事实基础（11-13 人审实跑，flash 不得重新裁定，也不得照旧草案口径做）

| #   | 事实                                                                                                                                                                                                                                                                                             | 实测 / 依据                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | **atlas 是 usage-driven**：只有被 UI 调用点匹配到的后端 route 才进 catalog → exports                                                                                                                                                                                                             | `src/reconcile.mjs:62-67`：`matchCall` 命中才 `ensureEndpoint`；导出标题即 `CRM admin API (UI-used, static catalog)`。**后端定义了但无 caller 的端点不会进契约**            |
| F2  | 权限包 Controller **16 端点**；`catalog/endpoints/admin.json` 只收 **11**（全 `tier=candidate`）；`exports/openapi.admin.json` 只有 **7 条**                                                                                                                                                     | 11 条里 4 条是 `response.kind='view'`（`GET /`、`/add`、`/applicableUserList/{id}`、`/edit/{id}`），被 `src/exports.mjs:82` 跳过 → 7 条自洽                                 |
| F3  | 差的 5 个是补页必需端点：`POST /add`、`POST /edit`、`POST /checkNameUnique`、`POST /checkCodeUnique`、`GET /listEnabled`                                                                                                                                                                         | 旧模板调用形态是变量拼接：`add.html:1082` `$.operate.saveTab(prefix + "/add", data)`、`:498/:513` `url: prefix + "/check*"`；提取器认不出 → 无 caller → F1 使其不进 catalog |
| F4  | React 后台调的**就是旧 RuoYi `/system/*` Controller**                                                                                                                                                                                                                                            | `vite.config.ts:21-26`：`/api` → `http://admin-1.hcs55.com:38080`，rewrite 去掉 `/api` 前缀                                                                                 |
| F5  | **现有提取器对 React 源近乎全废**：扫 868 文件，只提 **6 calls / 3 paths（全是碎片误识别，如 `/api{}`）**、`apiFunctions=0`                                                                                                                                                                      | 直接调 `extractFrontend()` 传 React 源配置实证；`src/extract/frontend.mjs:24` `AXIOS_CLIENT_RE` 只认 axios 家族 + 裸 `fetch`，不认 React 的 9 个自定义封装                  |
| F6  | React 实际调用量（只读正则扫 864 个非测试文件）：**266 调用点 / 245 唯一路径**；`apiFormPost` 187、`apiPost` 68、`apiGet` 4、`apiPut` 3、`apiDelete` 2、`apiFormPostCustom` 2；**205 条精确命中 admin catalog（1128 条 path）**，40 条未命中（含 `${...}` 模板、`system/...` 缺前导 `/` 的写法） | 11-13 人审只读对照。说明「后端给后台用的 API」大部分**已在 catalog**，缺的是**调用点归属**，不是整批端点凭空缺失                                                            |
| F7  | `frontends` 一律归 **client surface**；React 调 `/system/*` 是 **admin**                                                                                                                                                                                                                         | `src/reconcile.mjs:25-26` 展开成 `surface:'client'`；`:376` `filterByScope` 的 `prefers` 只认 `crmAdmin` / `crmFe` / `mamFe`                                                |
| F8  | `applySourceRefs` 只认 `crm` 与 `frontends[].key`                                                                                                                                                                                                                                                | `bin/atlas.mjs:41-63`（在途版未改这块），新 key 不加会报 `unknown source key`                                                                                               |
| F9  | 第 4 源的时钟统一判据                                                                                                                                                                                                                                                                            | ADR §2.3 键集合 `{crm,crmFe,mamFe}`；`sync/state.json` 的 `repos` 与 `atlas.sources` 同 3 源；`scripts/kb-age.mjs` 知识基准行。漏一处就静默漏审                             |
| F10 | `info.version` 保鲜口径已由人裁定并落到 KB                                                                                                                                                                                                                                                       | `weekly` 与 `export` 是两个独立命令，kb-sync §2.5 已补无条件 `export` + 版本一致性验收；**不需要改 atlas 版本逻辑**                                                         |

> **F1 + F3 + F6 合起来的结论**：A0 的价值不是「把后端 16 个端点搬进契约」，而是
> **让 React 后台的 266 个调用点作为 `admin`
> surface 的 caller 被 atlas 发现**，从而补齐 usage 信息；补页新增的 5 个端点要等 P3a 页面真实存在、再跑一轮 weekly+export 才会进契约。

---

## 2. 口径裁定（C 类，11-13 由使用者拍板）

> ✅
> **裁定结果 = 路线 A**：「**还是 usage-driven，但因为加了 react 重构的后台项目，所以需要考虑把 react 项目里使用到的 api 也收进去**」。路线 B（admin 全量）**已否决**，任何 agent
> / kb-sync 不得自行改回。结论已写入本卡与 KB ADR-004 §2.3/§6、kb-sync
> SKILL 双副本 §2.5。落地语义：契约仍是「被 UI 实际使用的端点」；React 后台的调用点作为
> **admin surface 的 caller** 被 atlas 发现并关联，后端定义了但无人调用的 admin
> API 仍不进 catalog/exports。实跑印证：admin 端点 1,165→1,319（既有 route 因补齐 usage 被匹配），
> `/system/spreadPermPackage*` 仍是 7 条 path。

**问题**：atlas 是否保持 usage-driven（F1）？

| 路线                           | 含义                                                                                                                  | 代价 / 影响                                                                                                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A（推荐）保持 usage-driven** | 契约 = 「被 UI 实际使用的端点」。A0 只让 React 调用点成为 `admin` caller；后端定义了但无人调用的 admin API 仍不进契约 | 改动集中在提取器 + surface 归类，不动 catalog 语义；`exports` 体积与既有 tier/fidelity 语义不变。用户说的「收集后端抛给后台使用的 API」通过 **caller 关联** 体现 |
| **B 改为 admin 全量**          | 契约 = 「后端提供的完整 admin API」，`sourceScope='admin'` 的 backend route 全量进 catalog/exports                    | 需重新定义 `tier` / `fidelity` / `x-atlas-usage` 语义，exports 规模大幅上涨，P2 契约层的「存在性断言」会变松（几乎恒真），且要重跑全量测试                       |

> 若选 A：**A0 单独跑完，`spreadPermPackage`
> 仍只有 7 条**（React 现无该页面，见 F10 顺序），这不是 A0 失败 ——
> 11-13 实跑已确认恰为 7 条。原 `P2-TASK-CARD.md`
> §8.2 判据 3 把「path 数上升」写成 A0 验收条件，**11-13 已纠正**：它是 P3a 补页后重生快照的判据（本卡 §4
> V7）。路线 A 已落地，**不得**为了凑 V7 去改 exports 或塞 `allowlist.ts`。

---

## 3. 改动清单（跨 3 仓；**11-13 已由人审执行完毕**，不是本仓 P2/P3a flash 的权限范围）

| #    | 仓    | 文件                                                                                                               | 改什么                                                                                                                                                                                                                                         | 判据                                       |
| ---- | ----- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| A0-1 | atlas | `atlas.config.json`                                                                                                | 新增**独立段**（建议 `sources.adminFrontends`，类比现有 `vue3` 独立段），key `crmAdminReact`，`root=D:/projects/crm-admin`、`scan:["src"]`、`apiRoots:["src/api"]`、`extensions:[".ts",".tsx"]`。**禁止塞进 `frontends`**（F7 会归错 surface） | V1                                         |
| A0-2 | atlas | `src/extract/frontend.mjs`                                                                                         | 让 9 个自定义封装（`apiGet/apiGetCustom/apiPost/apiPut/apiDelete/apiFormPost/apiFormPostCustom/apiPostFormData/fetchWithAuth`）被识别；建议把 client 名集合做成 config 可配，不改既有 axios 行为；支持字面量路径 + `${...}` 模板               | V2（**基线 F5 的 3 条 → 目标 ≥200 条**）   |
| A0-3 | atlas | `src/reconcile.mjs`                                                                                                | 新段产生的 caller 归 `admin` surface；`filterByScope` 的 `prefers` 补 `crmAdminReact → ['admin']`；不再把新段硬编码为 `client`                                                                                                                 | V2 / V5                                    |
| A0-4 | atlas | `bin/atlas.mjs`                                                                                                    | `applySourceRefs` 支持新段 key；`weekly` 收集新源；`export` 仍按 kb-sync 新口径无条件执行                                                                                                                                                      | V3 / `--source-ref crmAdminReact=...` 可用 |
| A0-5 | atlas | `test/**`                                                                                                          | 新增回归测试：提取器识别 9 封装、surface 归类、source-ref、版本一致性                                                                                                                                                                          | V6                                         |
| A0-6 | KB    | `sync/state.json`（由 kb-sync 自动推进）、`docs/atlas-integration.md` §2.3 键集合、`scripts/kb-age.mjs` 知识基准行 | 第 4 源进时钟统一；**不许手改 state.json 的 head**，只在 weekly 后自动记                                                                                                                                                                       | V4                                         |
| A0-7 | KB    | `.agents/skills/kb-sync/SKILL.md` + `.claude` 副本 §2.5                                                            | weekly 命令加 `--source-ref crmAdminReact=origin/develop`；无条件 `export` 保持不变                                                                                                                                                            | V4（双副本一致）                           |

### 3.1 实际落地记录（11-13，与原清单的差异如实登记）

| #    | 文件                                                                                                           | 实际改动                                                                                                                                                                                                                                                                          |
| ---- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A0-1 | atlas `atlas.config.json`                                                                                      | 新增 `sources.adminFrontends[0]`：key `crmAdminReact`、root `D:/projects/crm-admin`、`scan:["src"]`、`apiRoots:["src/api"]`、`extensions:[".ts",".tsx"]`、`exclude`（测试文件 / `src/api/client.ts` / `src/test/**`）、`ignoreBuiltinFetch:true`、`apiClients` 9 个封装→HTTP 方法 |
| A0-2 | atlas `src/extract/frontend.mjs`                                                                               | 合并 `frontends + adminFrontends` 两段并给 call 打 `surface`；新增 `matchesExclude`（glob）、`apiClients` 分支（method 取自封装名、`fetchWithAuth` 从 options.method 读）、内容类型提示；裸 `fetch` 在新段按配置禁用。**既有 axios/fetch 行为未改**（原 68 条测试全绿）           |
| A0-3 | atlas `src/reconcile.mjs`                                                                                      | `calls` 保留 `call.surface`（缺省 client）；`filterByScope` 的 `prefers` 补 `crmAdminReact → ['admin']`；`hasFrontendUsage` 排除它，**避免把 admin 端点 tier 从 candidate 抬成 confirmed**（保持 tier 语义不变）                                                                  |
| A0-4 | atlas `bin/atlas.mjs` + `src/report.mjs` + `src/catalog.mjs` + `src/snapshot.mjs`                              | `applySourceRefs` / `runDoctor` 支持新段；phase0/phase1 manifest 的 `sources` 收第 4 源（含 `ref`）；`collectUiChanges` 动态建 byRepo 键。F9 的四处时钟统一全部同步                                                                                                               |
| A0-5 | atlas `test/admin-frontend.test.mjs`（新）+ `package.json`                                                     | 4 组回归（9 封装识别 / exclude 与误识别 / 模板与无前导斜杠路径 / surface 与 tier）；`npm test` 原命令在 Node 22 + Windows 把 `test` 目录当模块报 MODULE_NOT_FOUND，改 `node --test "test/*.test.mjs"`，**72/72 绿**                                                               |
| A0-6 | KB `scripts/atlas-source-head.mjs`（新）、`sync/state.json`、`docs/atlas-integration.md`、`scripts/kb-age.mjs` | 第 4 源做成 **atlas-only 契约锚点**：不进 `sync/config.json` 内容源、不参与卡片 diff；head 由脚本从 `manifest.sources.crmAdminReact.commit` 实读推进（`--check` 可校验），不手填。ADR §2.1/§2.2/§2.3/§5/§6 同步；kb-age atlas 段改按 `manifest.sources` 动态展开                  |
| A0-7 | KB `.agents` + `.claude` kb-sync SKILL                                                                         | §2.5 weekly 加 `--source-ref crmAdminReact=origin/develop` 与 `node scripts/atlas-source-head.mjs`；§5 收尾字段说明；双副本字节一致                                                                                                                                               |

> **新源不进 KB 内容源是有意裁定**：React 后台未上线，纳入 `sync/config.json`
> 会让 `sync-plan`
> / 提取脚本把它当第 4 个卡片基准仓（扩大范围、制造噪声）。因此只用
> `state.repos.crmAdminReact`（`scope:'atlas-only'`）参与 §2.3 契约效力判据。

> **detached worktree 推论**（ADR §2.2）：React 仓未提交到 `origin/develop`
> 的补页**不会被扫到**。所以 P3a 补页在本仓工作区、未推分支时，A0 后跑 weekly 也看不到新端点——这条必须写进 P3a 交付说明，别把「补页已写」当成「契约已覆盖」。

---

## 4. 验收（`scripts/verify-a0.mjs`，只读，只看 exit code）

| 判据                    | 内容                                                                                                                                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V1                      | 配置存在 `crmAdminReact` 新段且**不在** `sources.frontends` 里                                                                                                                                                              |
| V2                      | `catalog/callers.json` 出现 `repo=crmAdminReact` 的 caller ≥200 条，且 `resolvedEndpointId` 以 `admin:` 开头（surface 正确）                                                                                                |
| V3                      | `exports/openapi.admin.json` 的 `info.version` == `catalog/manifest.json` 的 `snapshotId`（F10 版本验收）                                                                                                                   |
| V4                      | `sync/state.json` 的 `repos.crmAdminReact` 存在（`atlas-only`、head 与 manifest 实读一致）、ADR §2.3 判据文本含该键、kb-sync 双副本一致、`kb-age.mjs` 动态展开源集合、`state.atlas.exportVersion` / `baselineAdvanced` 达标 |
| V5                      | `exports/openapi.admin.json` 的 `x-atlas-usage.callers` 含 `crmAdminReact` 样本（调用点真的进了导出）                                                                                                                       |
| V6                      | atlas 全量测试绿 + **atlas 允许本地 commit**（须为基线 `228580b` 的后代）、**无 remote / 不 push**；KB / crm-admin HEAD 未变                                                                                                |
| **V7**（`--after-p3a`） | `/system/spreadPermPackage*` path 数 **>7** 且至少含 `add`、`edit`、`checkNameUnique`、`checkCodeUnique`；**不许靠 P2 `allowlist.ts` 吞缺口**                                                                               |

> V7
> **不是 A0 的判据**（§2 路线 A 下 A0 阶段不可能达成），是 P3a 补页 + 再跑一轮 weekly/export 之后的判据。

### 4.1 11-13 实跑回执（`node scripts/verify-a0.mjs --run-tests`，exit 0）

```
PASS  V1-config        新段=adminFrontends key=crmAdminReact root=D:/projects/crm-admin（frontends 中=false）
PASS  V2-callers       repo=crmAdminReact 的 caller=658（阈值≥200，基线 3），其中 admin surface=648
PASS  V3-version       info.version=2026-11-13T04-15-35-768Z / snapshotId=2026-11-13T04-15-35-768Z
PASS  V4-clock         ADR判据键=true 双副本一致=true weekly含新source-ref=true kb-age动态源=true
                       repos.crmAdminReact.head=391f701b09(实读commit=391f701b09) atlas-only=true
                       exportVersion=true baselineAdvanced=true
PASS  V5-usage         operations=947，其中 x-atlas-usage.callers 含 crmAdminReact 的=577
PASS  V6-discipline    atlas HEAD=228580b 基线228580b后代=true remote=无(未push) /
                       KB HEAD=bd28743 未变=true / crm-admin HEAD=391f701 未变=true；
                       测试："node --test "test/*.test.mjs"" exit 0
SKIP  V7-p3a-paths     SKIP：非 --after-p3a（V7 属 P3a 补页后的判据，不是 A0 本批）
PASS 6/6
```

> 判卷器本身也随授权改了：V6 不再禁 atlas 的本地 commit（使用者 11-13 已授权），但仍判「无 remote
> / 不 push」与 KB / crm-admin
> HEAD 未变；V4 比原版更严（head 实读一致、scope、exportVersion、baselineAdvanced、kb-age 动态源）。**不是为凑绿放宽判据**。

---

## 5. 顺序（11-13 修订，含 F10 的顺序耦合）

```
【已完成 11-13】atlas 在途改动提交为 228580b → §2 口径裁定（路线 A）
  → A0-1..7 → weekly --publish（四源钉定）+ export → verify-a0.mjs --run-tests（V1–V6 = 6/6）
【待用户放行】重生成 P2 快照并人审差异 → P2
  → P3a 补页（本仓工作区）→ 补页推到 origin/develop（否则 worktree 扫不到）
  → 再跑 weekly + export → verify-a0.mjs --after-p3a（V7）
  → 重跑 P2 契约扫描 → P3b 组件集成
```

P2 执行时**按当时导出**生成快照（`P2-TASK-CARD.md` §3），快照头须记
`info.version`（11-13 当前值
`2026-11-13T04-15-35-768Z`，已含 React 源）与来源 commit；周更后须重生快照并人审差异。仍不许把 7 条
`spreadPermPackage` path 当最终覆盖。

## 6. 停机条件

1. 需要改 atlas 在途未提交文件才能跑通 → 停机，不许叠加混合 diff；
2. 提取器改完 React 调用点仍 <200 条，或 surface 仍为 `client`
   → 停机带原始输出；
3. `--source-ref crmAdminReact=...` 报 unknown source key、或 weekly 退出 2；
4. `exportVersion != snapshotId`、或 V4 判据键不同步；
5. P3a 补页新增调用点导致 P2 契约红而 §2 未裁定 → 停机，**不许自行把缺口塞
   `allowlist.ts` 换绿**；
6. 任何越界文件、**push**（atlas 本地 commit 已由使用者 11-13 授权，不算越界）、真实接口 / 线上配置写操作、浏览器验证。

## 7. 指令状态（✅ **已执行完毕，勿重发**）

> A0 由人审在 11-13 直接执行（非 flash），判卷 6/6 / exit 0，结果见 §4.1。
> **不要再把 §3 当执行单发给 flash**，也不要为了让 flash 有活干重跑
> `weekly --publish` /
> `export`（会再推进一次快照、制造无意义 diff）。复核只需两条只读命令：
> `cd D:/projects/crm-admin && node scripts/verify-a0.mjs --run-tests` 与
> `cd D:/projects/crm-knowledge && node scripts/atlas-source-head.mjs --check`。后续权限仍分层：**P2 已交付并由人审验收通过**（`docs/P2-TASK-CARD.md`
> §6 已执行完毕、勿重发，人审记录见该卡 §9）；P3a /
> P3b 待放行；`--after-p3a`（V7）在 P3a 补页推远端并再跑一轮 weekly/export 之后才适用；atlas 两个本地 commit 均已落地（`228580b`
> 基线 / `faf3948` A0，工作区干净、不 push）。
