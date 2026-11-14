# 权限包管理 · data-testid 契约（P3a）

> 事实来源：`docs/P3a-PAGE-PLAN.md` §5，旧 RuoYi 模板
> `CRM/crm-admin/src/main/resources/templates/system/spreadPermPackage/`。本文件是 P3b 组件用例的落点清单，**不是预设阻断项**：先有用例，再由 agent 按
> `land-test-case` 补 testid；此处记录 P3a 已落地的那一批。

## 1. 已落地的 testid（17 个）

| testid                             | 落点                                              | 文件                    |
| ---------------------------------- | ------------------------------------------------- | ----------------------- |
| `spread-perm-screen`               | 页面根节点                                        | `PermPackagePage.tsx`   |
| `spread-perm-list`                 | 列表容器（包 `DataTable`）                        | `PermPackagePage.tsx`   |
| `spread-perm-search-button`        | 搜索                                              | `PermPackagePage.tsx`   |
| `spread-perm-reset-button`         | 重置（`resetForm()` 清空 name/status/query/分页） | `PermPackagePage.tsx`   |
| `spread-perm-edit-button`          | 行内「编辑」                                      | `PermPackagePage.tsx`   |
| `spread-perm-delete-button`        | 行内「删除」                                      | `PermPackagePage.tsx`   |
| `spread-perm-change-status-button` | 行内「启用/停用」                                 | `PermPackagePage.tsx`   |
| `spread-perm-dialog`               | 新增/编辑弹窗内容根                               | `PermPackageDialog.tsx` |
| `spread-perm-name-field`           | 名称，`maxLength=32`、必填、blur 查重             | `PermPackageDialog.tsx` |
| `spread-perm-code-field`           | 编码，`maxLength=64`、blur 查重                   | `PermPackageDialog.tsx` |
| `spread-perm-remark-field`         | 描述，`maxLength=200` + 字符计数回显              | `PermPackageDialog.tsx` |
| `spread-perm-status-trigger`       | 表单状态下拉                                      | `PermPackageDialog.tsx` |
| `spread-perm-server-trigger`       | 交易服务器（逗号分隔）→ 联动账号类型              | `PermPackageDialog.tsx` |
| `spread-perm-account-type-option`  | 触发 `getServerAccountTypes` 查询                 | `PermPackageDialog.tsx` |
| `spread-perm-account-type-item`    | 联动返回的账号类型项（动态，多个）                | `PermPackageDialog.tsx` |
| `spread-perm-count-item`           | `countApplicableUsers` 回显                       | `PermPackageDialog.tsx` |
| `spread-perm-submit-button`        | 提交（校验不通过拦截）                            | `PermPackageDialog.tsx` |

**动态项说明**：行内 3 个按钮在每一行重复出现（固定 testid，未拼后缀），P3b 断言请用
`getAllByTestId` 或 `within(row)` 定位；`spread-perm-account-type-item`
按联动结果数量动态生成。按 P3a 卡 §5「动态列表项用模板拼接，清单里只记前缀」的口径，此处未引入额外编号契约。

## 2. 字段与约束覆盖（19 个 `name=` 字段，一个不少）

- 基本：`id`(hidden→可编辑输入) `name` `code` `remark` `purpose`
  `purposeDisabled` `status`
- 配置：`serverIds` `accountGroupIds` `lever` `defaultRoleIds` `walletCurrency`
- 适用用户：`applicableUserSettings.{applicableMode, applicableTypes, roles, tags, countryId, userIds, userSubIds, agentSubIds}`
- 约束：`name` 必填 / 32（33 字符不可输入）、`code` 64、`remark` 200 +
  `descCount` 回显、多语言 `lang-name` 50 / `lang-remark`
  200 + 各自计数；`checkNameUnique` / `checkCodeUnique`
  失焦查重；`getServerAccountTypes` 联动；`countApplicableUsers` 回显。
- 列表：`name` + `status` 搜索、`resetForm()` 清空、启停、删除确认。

## 3. 与旧 RuoYi 的口径差异（**待人审确认，不是自行简化**）

1. **4 个视图端点不迁移**：`GET /system/spreadPermPackage`、`GET /add`、
   `GET /edit/{id}`、`GET /applicableUserList/{id}` 返回 Thymeleaf
   HTML 页；React 为 SPA，由客户端弹窗/表格承接，不调用这 4 个端点。其余
   **12 个业务端点 1:1 落地** （见
   `src/api/hooks/setting/spreadPermPackage.ts`）。字段与行为未因此减少。
2. **多语言语言列表来源**：旧页 `languages` 由服务端 `sys_language`
   字典注入（`SpreadPermPackageController#resolveLanguageLabel`）；React 侧暂无对应 REST 端点，因此实现为「手动添加语言条目 + 语言代码输入」，**不硬编码猜测任何语言字典值**。若要与旧页完全一致，需后端提供字典接口，再由人裁定补一个调用点。
   `lang-name` / `lang-remark` 的字段与 50/200 约束均保留。
3. **编辑回显范围**：`/list` 行只带主表字段，**不带**
   `applicableUserSettings`；旧页编辑由服务端渲染补出。当前编辑时适用用户配置初始化为空值，需后端提供详情接口或由 P3b 的 MSW
   fixture 补齐。已如实标注，未伪造默认值。
4. **数组字段提交形态**：旧页 select2 multiple 序列化为多值同名参数；React 侧
   `toPermPackageFormParams()` 统一 `join(',')` 成逗号串（后端实体 `serverIds`
   等本身即逗号串，`CrmApplicableUserSettings` 的 `List<String>`
   依赖 Spring 转换器）。该转换需 P3b 用 MSW 断言请求体形状确认。

## 4. 契约层状态（P3a 阶段）

`admin-paths.json`（atlas `info.version=2026-11-13T04-15-35-768Z`）中权限包只有
**7 条 path**： `list` / `remove` / `change-status` / `countApplicableUsers` /
`getServerAccountTypes` / `applicableUserList` / `assignAgent`。

本页新增的 5 个调用点（`add` / `edit` / `checkNameUnique` / `checkCodeUnique` /
`listEnabled`）**不在快照中 ⇒ `pnpm test:contract`
判红属预期**（P3a 卡 §7.3 停机项）。处置口径：**不塞 `allowlist.ts`
换绿、不改 atlas 仓**；按 `A0-TASK-CARD.md` §5，补页推 `origin/develop` 后跑一轮
`weekly/export` → `verify-a0.mjs --after-p3a`（V7）→ 重跑 P2 快照 → 契约才收口。

## 5. 实跑验证（11-14 17:2x）

| 项                   | 结果                                                           |
| -------------------- | -------------------------------------------------------------- |
| `pnpm typecheck`     | **0 错**                                                       |
| `pnpm lint`（全量）  | **0 error / 49 warning**，与 P2 基线一致，**新增文件零贡献**   |
| `pnpm build`         | **exit 0**                                                     |
| `pnpm test`          | 57 passed / **1 failed**（即下方契约红，非组件用例失败）       |
| `pnpm test:contract` | **1 failed / 3 passed**；`C4` 报 5 条 MISS，与 §4 预估完全一致 |
| 扫描规模             | src 文件 867 个 · 调用点 **641**（P2 时 629，+12）· skip 3     |

**过程中修掉一处漏扫**（重要）：最初 `apiFormPost<AjaxResult<unknown>>(...)`
的**嵌套泛型** 使 `endpoints.test.ts` 的 `FN_RE` 正则失配，`add` / `edit`
两个调用点被静默跳过，契约只报 3 条 MISS。已改为无泛型调用，**5 条缺口全部如实暴露**。这是增加覆盖而非为绿改调用点；扫描器本身的嵌套泛型局限未改判据，留作后续评估。
