# 权限包管理页补页实施计划（P3a，**11-14 17:2x 已执行**）

> ⚠️ **状态：2026-11-12 人审编制；2026-11-14
> 17:2x 使用者放行「参照当前 CRM（ruoyi 后台）实现 react-admin 的权限包管理代码，做完允许 push」→ 已实现并推送。**
> 本文件保留为实施计划与旧页事实来源，执行结果与口径差异见
> **§10**；flash 勿据此重复动手。用户诉求：React 侧目前没有该页面，须参照 CRM（旧 RuoYi）实现、用 React 现有风格补一版，让后续 admin 相关测试用例**有可自动化实施的载体**，避免「只有 md 用例、跑不了自动化测试」。上位：`docs/REACT-TEST-INFRA-CHECKLIST.md`
> §0 十三条红线 / §3 拍板 B·C·D / §4 缺页事实 / §7
> testid 契约；工作流：`docs/TASK-CARD-TEMPLATE.md`（放行时转「覆盖表 + JSON +
> 12 行指令」，**不再写长执行单**）。

---

## 0. 先说清楚：补页本身不等于自动化覆盖

要真正消掉「只有 md 用例」这个局面，缺的是**三件套**，缺一件都还是跑不了：

| 环节             | 提供什么                                                                 | 状态                                                                                                            |
| ---------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **P2 契约层**    | 页面调用点的 path/method 有快照可断                                      | **11-13 已交付并验收通过**（门禁 14/14，快照 947 键；`docs/P2-TASK-CARD.md` §9 人审记录）；本计划不代替 P2 放行 |
| **P3a 补页**     | 真实页面 + 齐全 `data-testid` + hooks，让断言有落点                      | **本计划，未放行**                                                                                              |
| **P3b 组件集成** | `renderWithProviders` + MSW 的 5 条提交/回显用例，**这才产生防回归覆盖** | 清单 §5，**未放行**                                                                                             |

> **只做 P3a 会停在「页面能点、没有用例」。**
> 因此 P3a 验收通过后必须紧接 P3b，不能把补页当交付终点。另：Playwright /
> e2e 仍被 **A4 e2e 通道裁定**卡住（`crm-e2e` 无 admin project），本批能落地的是
> **L3 组件集成**，不是把 `crm-e2e`
> 的 28 条卡直接跑起来；交付说明如实写「未在浏览器验证」。

## 1. 事实基础（11-12 人审实查，flash 不得重新裁定）

| 事实                  | 实测                                                                                                                                                                                                                     | 含义                                                                                                                                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React 侧现状          | 全仓 `src/` grep `spreadPermPackage\|权限包\|spread-perm` → **0 命中**；无页面、无 hook、无类型、无路由                                                                                                                  | 用户判断成立，确实是整页缺失，不是「已有页面没接线」                                                                                                                                                                                                                                    |
| 路由                  | `src/routes/settingsRoutes.tsx` 的推广设置只在**注释**里写了 `/settings/promotion/links`，**没有实际路由对象**                                                                                                           | 需新增路由                                                                                                                                                                                                                                                                              |
| 菜单                  | `src/components/layouts/Sidebar.tsx:397-405` 推广设置下只有「推广链接」`disabled: true`，**根本没有权限包菜单项**                                                                                                        | 清单 §4.4 写「对应项去掉 disabled」**不成立**，必须**新增**子项；不许顺手放开「推广链接」（拍板 D 只补 1 页）                                                                                                                                                                           |
| 旧实现（只读 oracle） | `D:/projects/CRM/crm-admin/src/main/resources/templates/system/spreadPermPackage/`：`add.html`、`edit.html`、`spreadPermPackage.html`、`applicableUserList.html`；`SpreadPermPackageController.java` **16 端点**带权限码 | 字段、边界、行为从旧页 `name=` 与 JS 推导，**不猜产品口径**（清单 §3 A5）                                                                                                                                                                                                               |
| OpenAPI               | atlas `/system/spreadPermPackage*` **7 条 path**（旧记 11 条已纠正）；`add`/`edit`/`check*`/`listEnabled` 等不在 atlas；`info.version` 随每轮 kb-sync 无条件刷新                                                         | 见 §2 裁定项 P-1（已裁定走 A0）                                                                                                                                                                                                                                                         |
| atlas 源仓            | `atlas.config.json`：`admin.root = D:/projects/CRM/crm-admin/src/main`（旧 RuoYi）、`frontends = crmFe / mamFe`、`vue3 = crm-fe-vue3/crm-fe`；**React `D:/projects/crm-admin` 不在其中**                                 | **11-13 人确认方向 = 扩 atlas 源仓让 React 调用点进契约**，实施卡 `docs/A0-TASK-CARD.md`、判卷 `scripts/verify-a0.mjs`。⚠️ atlas 是 **usage-driven**（`reconcile.mjs:62-67`）：只有被 UI 调用点匹配到的后端端点才进 catalog/exports，详见 `P2-TASK-CARD.md` §8.1；**P3a 不碰 atlas 仓** |
| React 范式            | `src/pages/setting/trading-platform/servers/ServersSettingPage.tsx`、`.../components/AddEditServerSettingDialog.tsx`、`src/api/hooks/setting/setting.ts`、`src/locales/{zh,en}.json`                                     | §3 风格基准                                                                                                                                                                                                                                                                             |

## 2. 放行前需要人裁定的 3 项（P-1 已裁定，这份计划不替人拍板其余项）

| #       | 问题                                                                                                                                  | 推荐 / 边界                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **P-1** | **端点范围**：旧页 1:1 复刻需 16 端点，atlas 只有 7 条；补页新增调用点会直接把 P2 契约层判红，而 atlas 源仓不含 React，周更也补不进来 | ✅ **11-13 已裁定路线 A（仍 usage-driven、否决 admin 全量）并由人审执行完毕**（A0 卡 §0.1/§4.1，判卷 6/6 / exit 0）；surface 归属（admin 不是 client）、9 个自定义封装提取、`--source-ref` / 效力判据 / `state.json.repos` 扩展均已落地，**不走白名单吞缺口**。⚠️ **A0 单独跑完 path 仍是 7 条**（React 现无该页），新增端点要等 **P3a 补页推到 `origin/develop`** 后再跑一轮 weekly/export 才会进契约（detached worktree 只看远端 ref）——判据是 `verify-a0.mjs --after-p3a` 的 V7，不是 A0 的 V1–V6。**A0 已完成**：P2 按当前导出（`info.version=2026-11-13T04-15-35-768Z`，含 React 源）生成快照并如实标版本，P3a 补页触发的契约红**停机回报**，不许让 flash 自行把 9 个缺口塞 `allowlist.ts` 换绿（≤10 条限额会被吃满，且违背「不为成本减少边界覆盖」）。**不许**自行改 atlas 仓或重跑 weekly/export（A0 卡 §7 已标勿重发） |
| **P-2** | **A5 产品口径**：`applicableUserSettings` 适用用户配置、多语言 tab 是旧页最复杂的部分，口径仍挂账                                     | 按清单 §3 A5，**旧模板是事实来源**：补页按 `add.html` / `edit.html` 的 `name=` 与可观测行为 **1:1 复刻全部字段**，不因复杂而删字段、不设「二期缩减」。真正推不出的（下拉枚举来源等）按 R-8 **停机回报**，不许自行简化 —— 砍字段等于砍可测边界，与「不为成本减少边界覆盖」冲突                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **P-3** | 路由与菜单命名                                                                                                                        | 建议 `/settings/promotion/perm-package`，中文「权限包管理」、英文 `Permission Package`；由人确认后写入 i18n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **P-4** | 批次顺序                                                                                                                              | 以 **`docs/A0-TASK-CARD.md` §5** 为准：A0 → weekly/export → P2 → P3a 补页（推 `origin/develop`）→ 再跑 weekly/export → `verify-a0.mjs --after-p3a` → 重跑 P2 扫描 → P3b。补页新增的调用点先被契约层兜住，再写组件用例；P3a 与 P3b 之间不留空档                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## 3. 风格基准（flash 照抄现有范式，不另创一套）

- **列表页**：`DataTable` + `CRMColumnDef` + `PageInfo` /
  `TableContentWrapper` + `ColumnVisibilityButton`，操作用 `RrhButton` /
  `RrhDropdown` / `RrhDeleteAlert` / `RrhStatusAlert`，跨页用 `useTabActions`。
- **新增/编辑弹窗**：`RrhDialog` + `RrhForm` + `useForm` / `useFieldArray` +
  `zodResolver(z)`，字段组件 `FormInput` / `FormSelect` / `FormSwitch`，提示用
  `sonner` 的 `toast`。
- **数据层**：`@tanstack/react-query` 的 `useQuery` / `useMutation` +
  `@/api/client` 的 `apiFormPost` / `apiFormPostCustom` / `apiGetCustom` /
  `apiPut`；hook 放 `src/api/hooks/setting/`，类型单独放同目录新文件；**不改
  `client.ts` 既有行为、不为测试开后门**（§4.4）。
- **i18n**：`src/locales/{zh,en}.json` 各新增一个顶层命名空间（如
  `permPackagePage`），代码里不写死中文。
- **testid**：按清单 §7 `${域}-${元素}-${类型}`，前缀
  `spread-perm-`；登记到本仓新建 `docs/testids.md`， **不写进
  `crm-e2e/contracts/testids.json`**（R-1，那份由 crm-e2e 侧按 A4 裁定后生成）。

## 4. 允许落盘（放行时转 `allowedNewStatus` / 门禁配置）

**新增**

```
src/pages/setting/promotion/perm-package/PermPackagePage.tsx
src/pages/setting/promotion/perm-package/components/PermPackageDialog.tsx
src/api/hooks/setting/spreadPermPackage.ts
src/api/hooks/setting/permPackageTypes.ts
docs/testids.md
```

**修改（最小接线，逐处限定）**

```
src/routes/settingsRoutes.tsx        只追加 1 条路由
src/components/layouts/Sidebar.tsx   推广设置下只新增 1 个子项（不动其它 disabled）
src/locales/zh.json / en.json        各加 1 个命名空间
src/test/contract/allowlist.ts       仅用于约定契约 / atlas 版本差，逐条带 reason；
                                    **不得**用于吞 P3a 新增的 9 个端点缺口（P-1 已裁定走 A0）
```

**禁止**：`src/api/client.ts`
既有行为、3 个受保护文件、lockfile、依赖、`vitest.config.ts`、其它页面/菜单、`crm-e2e`
/ KB / 旧后台任何文件；任何 commit / push、真实接口或线上配置写操作（R-5）。

## 5. 字段与可观测行为（从旧页实测，非推测）

**字段**（`add.html` 的 `name=`，共 19 个）：

```
name  code  remark  purpose  purposeDisabled  status  id
serverIds  accountGroupIds  lever  defaultRoleIds  walletCurrency
applicableUserSettings.{applicableMode, applicableTypes, roles, tags, countryId,
                        userIds, userSubIds, agentSubIds}
```

**约束与行为**（清单 §4.3 + 11-12 复核 `add.html` / 列表页）： `name` 必填
`maxlength=32`（33 字符不可输入）、`code` `maxlength=64`、`remark`
`maxlength=200` 且 `descCount` 回显字符数；多语言 tab 的 `lang-name` 50 /
`lang-remark` 200； `checkNameUnique` / `checkCodeUnique` 查重提示；选
`serverIds` 调 `getServerAccountTypes` 联动账号类型； `countApplicableUsers`
回显适用用户数；列表 `name` + `status` 搜索与 `resetForm()`
**重置清空**（C-M1-20）；启停 / 删除确认 / 分配代理。

**建议 testid 清单**（覆盖 P3b 五条断言所需落点，按 §7 类型后缀）：

```
spread-perm-screen          spread-perm-list              spread-perm-dialog
spread-perm-name-field      spread-perm-code-field        spread-perm-remark-field
spread-perm-server-trigger  spread-perm-account-type-option
spread-perm-status-trigger  spread-perm-account-type-item  spread-perm-count-item
spread-perm-search-button   spread-perm-reset-button      spread-perm-submit-button
spread-perm-edit-button     spread-perm-delete-button     spread-perm-change-status-button
```

> 动态列表项用模板拼接，清单里只记前缀。**这些 testid 是 P3b 能否落地的前提**，不是装饰。

## 6. 验收（P3a 阶段）

**机器判**（放行时生成 `scripts/verify-p3a.json`）：`pnpm typecheck` / `lint` /
`build` / `test` （含 P2 契约）全绿；lint 仍 **0 error / 49
warning**，新文件不得贡献 warning；HEAD 不变、3 个受保护文件未碰、无探针/变异残留、无 commit
/ push。

**人判**：`pnpm dev`（5173）页面可达、菜单可点、列表出数据（**只读 /
MSW，不打真实写接口**）；抽查 `data-testid` 与 `docs/testids.md`
一致；核对 §5 字段与 testid 是否**一个没少**。

> ⚠️ **门禁局限要如实说**：`verify-test-batch.mjs`
> 的核心判据是「改实现一行 → 用例红」，但
> **P3a 阶段还没有对应组件用例**（用例在 P3b 才写），所以这一项在 P3a 无法判。P3a 的门禁只能判静态 / 构建 / 纪律 / 契约；**业务正确性由 P3b 的组件用例兜底**。这正是 §0 强调「不能停在补页」的原因，不是可以省略 P3b 的理由。

## 7. 停机条件

1. 需要改 `client.ts` / 其它页面 / 依赖 / 工具链 / 3 个受保护文件才能跑通；
2. 旧页字段或边界推不出期望值（缺口径）→ 带文件:行号停机，**不许自行简化或删字段**；
3. 契约扫描因新增调用点判红，**且 A0 / P3a 后的周更尚未完成**
   → 停机，带原始输出；
   **不许自行塞白名单换绿、不许自行改 atlas 仓**。P-1 方向已裁定（A0 卡），缺的是落地与
   `verify-a0.mjs --after-p3a` 的 V7，不是再问一次口径；
4. lint 出现新 warning / error 且无法逐条解释；
5. 任何越界文件、commit / push、P4 / 浏览器动作、真实接口或线上配置写操作。

## 8. 与后续批次的衔接 / 挂账

- **顺序（11-13 更新，详见 `docs/A0-TASK-CARD.md` §5）**： **【已完成】A0**
  React 源接入 atlas（人审执行，判卷 `scripts/verify-a0.mjs --run-tests` 6/6）→
  weekly/export →
  **【已验收 11-13】P2**（含快照生成 + 人审 806→947 差异复核：纯增 141、零回退）→
  **P3a** 补页（本计划仍未放行）→ **补页推 `origin/develop`**（detached
  worktree 只看远端 ref，工作区未推不算）→ 再跑 weekly/export →
  `verify-a0.mjs --after-p3a`（V7：权限包 path >7）→ 重跑 P2 扫描 → **P3b**
  组件集成。
  **A0 已完成**：P2/P3a 按当前导出（`info.version=2026-11-13T04-15-35-768Z`，**已含 React 源**）推进，回执须写快照版本与来源 commit，且新增调用点判红一律停机，不塞白名单。
  **A0 单独跑完 path 仍是 7 条**，11-13 实跑已确认，属正常（§2 P-1）。
- **P3b**（紧接 P3a）：5 条提交/回显断言 —— 必填拦截、32/33 字符、200/201 字符、服务器→账号类型联动、重置清空；`onUnhandledRequest:'error'`
  下无隐式真实请求，每条变异能红。M1/N4
  28 条仍**只作只读边界素材**：不解挂、不生成 case.md、不进 e2e 消费队列（拍板 C
  / §8）。
- **A4** 未裁定前不谈 Playwright；`crm-e2e` 侧 `side=admin` 卡仍按 R-9 挂起。
- 原样挂账：A1 / A2 / A5、test-plan §8 的 7~9 与三处小重构、Q 口径 / `C-M3-10` /
  2 条候选 anchor / `login-ta-*`；**未在浏览器验证**如实写进交付说明。

## 9. 放行时怎么变成任务卡

按 `docs/TASK-CARD-TEMPLATE.md`：本计划 **§4 → `allowedNewStatus`**、**§5
→ 覆盖表**、 **§6 → `scripts/verify-p3a.json`**（`extraCommands` 加
`pnpm test:contract`， `mutations` 留给 P3b，P3a 不伪造变异）、**§7
→ 停机条件**；再配约 12 行指令即可发。
**不再另写 200+ 行散文执行单**，红线十三条以清单为准。

## 10. 执行回执（11-14 17:2x，使用者放行）

**放行原话**：「1.参照当前 CRM（ruoyi 后台）实现 react-admin 的权限包管理代码。2.做完允许 push」。此句视为对
**P-2** 的答复（旧模板为事实来源、1:1 复刻、不砍字段）。
**P-3 路由/菜单命名采用 §2 推荐值**（`/settings/promotion/perm-package`、中文「权限包管理」、英文
`Permission Package`），**P-4 按 A0 卡 §5 顺序，本轮只到「补页 + 推 origin/develop」**，周更 / 快照重生 /
P3b 留下一轮 —— 这两项**仍待人审确认**。

**落盘**：新增 5 文件（`PermPackagePage.tsx`、`components/PermPackageDialog.tsx`、
`spreadPermPackage.ts`、`permPackageTypes.ts`、`docs/testids.md`）；最小接线 4 处（`settingsRoutes.tsx`
+1 路由、`Sidebar.tsx` +1 子项、 `zh.json` / `en.json` 各 +1 命名空间）；另同步
`endpoints.test.ts` 注释数字与本文档 / 清单状态。 **未碰**
`client.ts`、3 个受保护文件、lockfile、`vitest.config.ts`、其它页面/菜单、crm-e2e
/ KB / 旧后台、`allowlist.ts`、`admin-paths.json`、atlas 仓。

**覆盖**：旧页 19 个 `name=` 字段一个不少；`name` 必填 / 32、`code` 64、`remark`
200

- 计数、多语言 `lang-name` 50 / `lang-remark` 200 + 计数、两个查重、
  `getServerAccountTypes` 联动、`countApplicableUsers`
  回显、列表 name+status 搜索 / `resetForm()`
  清空 / 启停 / 删除确认 / 分配代理 hook；17 个 `data-testid` 全落地（清单见
  `docs/testids.md`
  §1）。16 个后端映射中 12 个业务端点 1:1 落地，4 个返回 Thymeleaf 视图页的 GET 不迁移（SPA 用客户端弹窗承接，理由见
  `testids.md` §3）。

**实跑**：`typecheck` 0 错；`lint` **0 error / 49
warning**（与基线一致，新文件零贡献）； `build` exit 0；`test` 57 passed / 1
failed（即契约）；`test:contract` 1 failed / 3 passed。调用点 629 →
**641**、skip 3。`C4` 报 **5 条 MISS**： `POST add` / `POST edit` /
`POST checkNameUnique` / `POST checkCodeUnique` / `GET listEnabled`。

**契约红 =
§7.3 停机项，如实披露、不自行处置**：这 5 个端点不在 947 条 atlas 快照里（旧模板变量拼接调用提取不到 →
usage-driven 无 caller）。**未塞 `allowlist.ts`
换绿、未改 atlas 仓、未跑 weekly/export**；按 A0 卡 §5，补页推远端后需跑一轮
`weekly/export` → `verify-a0.mjs --after-p3a`（V7）→ 重跑 P2 快照，契约才收口。

**过程中修掉一处漏扫**：`apiFormPost<AjaxResult<unknown>>`
的嵌套泛型使扫描器正则失配， `add` / `edit`
曾被静默跳过（只报 3 条）；改为无泛型后 5 条全部暴露。属**增加覆盖**，非改调用点换绿。

**未做 / 待办**：`scripts/verify-p3a.json`、P3b 五条组件用例、`pnpm dev`
浏览器人工验证（独立通道，须单独放行）、weekly/export、V7 判卷、P2 快照重生、P4。
**口径差异 4 条**（视图端点 / 多语言字典来源 / 编辑回显范围 / 数组提交形态）见
`docs/testids.md` §3，**均待人审确认**，未自行简化字段或边界。
