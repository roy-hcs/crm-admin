# 返佣设置页面分析报告

> 源文件：`crm-admin/src/main/resources/templates/system/crmUserRebateTemplate/manage_template.html`
> 对应路由：`/system/crmUserRebateTemplate/oneUserTemplateInfo/{rebateType}/{userId}`
> 对应 React 页面：`RebateSettingPage.tsx`

---

## 一、页面概述

本页面是 CRM 用户详情中的**返佣设置（tab-9）**子页，用于查看和编辑指定用户的返佣配置。页面行为由两个核心参数控制：

| 参数         | 说明                                                       |
| ------------ | ---------------------------------------------------------- |
| `model`      | 返佣模式。`1` = 模板模式，`2` = 直接配置模式               |
| `rebateType` | 返佣类型。`1` = 交易返佣，`2` = 手续费返佣，`3` = 入金返佣 |

页面默认处于**只读（view）**状态，点击"编辑"按钮后切换到**编辑（edit）**状态，确认后提交保存。

---

## 二、页面功能模块

### 2.1 顶部导航标签（账户详情导航）

用户详情页的通用导航，包含以下 tab 入口（通过 Shiro 权限控制显示）：

| 标签名               | 路由                                                                      | 权限                                |
| -------------------- | ------------------------------------------------------------------------- | ----------------------------------- |
| Dashboard            | `/system/agentDashboard/{userId}`                                         | `system:crmUser:detail:ibdashboard` |
| 账户跟进             | `/system/customerFollowUp/{userId}`                                       | `system:crmUser:detail13`           |
| KYC 信息             | `/system/crmUser/kycInfo/{userId}`                                        | —                                   |
| 交易账号             | `/system/crmDealAccount/oneDealAccount/{userId}`                          | `system:crmUser:detail6`            |
| 账户操作             | `/system/crmUser/manage/6/{userId}`                                       | `system:crmUser:detail12`           |
| 钱包账户             | `/system/crmUserWallet/oneUserWallet/{userId}`                            | `system:crmUser:detail7`            |
| 银行信息             | `/system/crmUserBankInfo/oneUserBankInfo/1/{userId}`                      | `system:crmUser:detail8`            |
| **返佣设置（当前）** | `/system/crmUserRebateTemplate/oneUserTemplateInfo/{rebateType}/{userId}` | `system:crmUser:detail9`            |
| 返佣账户             | `/system/crmUserRebateTemplate/toRebateAccount/{userId}`                  | `system:crmUser:detail10`           |
| 账户活动             | `/system/crmUser/userActivity/{userId}`                                   | `system:crmUser:activity`           |

### 2.2 返佣类型切换（model=1 时显示）

当 `model=1`（模板模式）时，顶部展示三个子 tab，分别对应不同返佣类型：

- **交易返佣** (`rebateType=1`)
- **手续费返佣** (`rebateType=2`)
- **入金返佣** (`rebateType=3`)

### 2.3 归属与来源（Attribution & Source）

所有模式下均显示，包含三个字段：

| 字段                       | 说明             | 交互                                                              |
| -------------------------- | ---------------- | ----------------------------------------------------------------- |
| 上级（inviter）            | 当前用户的邀请人 | 编辑模式可搜索选择、清除；显示上级姓名+返佣层级；可查看完整上级链 |
| 推荐来源（source）         | 推广链接来源     | Select2 异步搜索下拉，依赖上级 ID 动态加载选项                    |
| 注册来源（registerSource） | 注册渠道来源     | 只读展示                                                          |

### 2.4 返佣模板配置（model=1）

- **返佣模板**下拉（`templateReferId`）：选择一个已有模板，选中后自动回填返佣层级和规则
- **返佣层级**下拉（`rebateLevel`）：选择层级后动态加载对应的返佣规则列表
- **规则列表**（`#ruleSelectDiv`）：每条规则对应一个下拉，显示可选的佣金参数组合；选中后显示"查看"按钮，可弹窗查看佣金参数详情

### 2.5 返佣直接配置（model=2）

分三个 ibox 区块展示三种返佣类型的规则（交易返佣 / 手续费返佣 / 入金返佣）：

**当前用户规则（`#myRules`, `#myRules2`, `#myRules3`）**

每条规则行包含：

- 规则名称标签
- 佣金参数选择（`commissionType=1`）或自定义数值输入（`commissionType=2`）
- 单位显示（如 USD/手、%）
- "查看"按钮：弹窗查看佣金组详情或上级返佣链参数

**上级用户规则（`#ruleDivId`, `#ruleDivId2`, `#ruleDivId3`）**

当用户有上级时，额外显示上级已配置的规则，供本用户填写分配给上级的返佣值，包含：

- 规则启用 checkbox
- 佣金金额输入（含上限提示）
- 单位显示
- **平级返佣（equalType）**配置：
  - 不返佣 / 固定返佣 / 获取下级佣金 %
  - 金额/比例 + 限定代数
- **越级返佣（passType）**配置（`rebateLevelSetting=2` 时显示）：
  - 不返佣 / 固定返佣 / 获取下级佣金 %
  - 金额/比例 + 限定次数

### 2.6 编辑/保存/取消

| 操作                        | 说明                                                  |
| --------------------------- | ----------------------------------------------------- |
| 编辑（`checkEditModel2`）   | 切换为 edit 模式，启用所有输入控件，显示确认/取消按钮 |
| 确认（`tab_confirm_click`） | 校验上级关系 → 构建规则字符串 → 调保存 API            |
| 取消（`tab_cancel_click`）  | 重新加载页面，恢复原始状态                            |

保存时针对 model 分两路：

- `model=2`：先调 `checkSubUserGroupSetting` 判断是否需二次确认，再调
  `editSaveModel2`
- `model=1`：直接调 `oneUserTemplateInfo/edit`

---

## 三、API 接口汇总

### 3.1 数据加载接口

| 接口                         | 方法 | 路径                                                  | 参数                                                                            | 说明                                                |
| ---------------------------- | ---- | ----------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------- |
| 获取返佣层级列表             | POST | `/system/crmRebateLevel/getLevelList`                 | `model`                                                                         | 初始化层级下拉                                      |
| 获取 Trader 规则列表         | POST | `/system/crmRebateTraderDeal/getTraderList`           | `levelId`, `userId`, `model`, `rebateType`(m1), `upperId`(m2), `commissionType` | 加载某层级的返佣规则项                              |
| 获取佣金组选项               | POST | `/system/crmRebateTwoCommissionGroup/getRuleGroups`   | `levelId`, `model`, `rebateTraderId`, `userId`                                  | model=2 时加载每条规则的佣金组下拉                  |
| 获取自定义返佣值/上限        | POST | `/system/crmRebateTwoCommissionGroup/getCustomRebate` | `rebateTraderId`, `userId`, `inviter`                                           | commissionType=2 时加载自定义输入框的当前值和最大值 |
| 获取上级输入框规则           | POST | `/system/crmUserRebateTwo/getUpperInput`              | `userId`, `levelId`, `upperId`                                                  | 初始化时构建上级规则输入区                          |
| 获取上级返佣规则（切换上级） | POST | `/system/crmUserRebateTwo/getUpperUserRebateTwo`      | `upperUserId`, `levelId`                                                        | 上级切换后重新加载上级规则                          |
| 获取推荐来源选项             | POST | `/system/spreadLink/link`                             | `userId`(inviterId), `keyword`, `linkType`(optional)                            | Select2 异步加载推荐来源                            |
| 获取上级姓名和层级           | POST | `/system/crmUser/getUserInviterLevel`                 | `userId`(inviterId)                                                             | 选择上级后展示上级信息                              |

### 3.2 弹窗查看接口

| 接口                            | 方法 | 路径                                                              | 参数                                  | 说明                                              |
| ------------------------------- | ---- | ----------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| 查看完整上级链                  | GET  | `/system/crmUser/getUpperList`                                    | `userId`                              | 弹窗展示用户的完整上级层级链                      |
| 查看佣金规则详情（交易返佣）    | GET  | `/system/crmRebateCommissionRule/edit/{id}/1`                     | `onlyReady=1`                         | model=1 时查看已选佣金参数详情                    |
| 查看佣金规则详情（手续费/入金） | GET  | `/system/crmBrokerageRebateCommissionRule/edit/{id}/{rebateType}` | `onlyReady=1`                         | model=1 时查看其他类型佣金参数详情                |
| 查看佣金组详情                  | GET  | `/system/crmRebateTwoCommissionGroup/edit/{groupId}/1`            | `limit=view`, `rebateTraderId`        | model=2 commissionType=1 时查看佣金组             |
| 查看上级自定义返佣链            | POST | `/system/crmRebateTwoCommissionGroup/getInviterCustomRebate`      | `rebateTraderId`, `userId`, `inviter` | model=2 commissionType=2 时查看整条上级链的返佣值 |

### 3.3 校验接口

| 接口           | 方法 | 路径                            | 参数                  | 说明                                     |
| -------------- | ---- | ------------------------------- | --------------------- | ---------------------------------------- |
| 校验上级合法性 | POST | `/system/crmUser/notInviteBoss` | `userId`, `inviterId` | 提交前校验不能将自己的上级设为自己的下级 |

### 3.4 保存接口

| 接口                    | 方法 | 路径                                                               | 参数       | 说明                     |
| ----------------------- | ---- | ------------------------------------------------------------------ | ---------- | ------------------------ |
| 保存（model=1）         | POST | `/system/crmUserRebateTemplate/oneUserTemplateInfo/edit`           | 序列化表单 | 模板模式保存             |
| 检查下级配置（model=2） | POST | `/system/crmUserRebateTemplate/checkSubUserGroupSetting`           | JSON body  | 判断是否需要二次确认弹窗 |
| 保存（model=2）         | POST | `/system/crmUserRebateTemplate/oneUserTemplateInfo/editSaveModel2` | JSON body  | 直接配置模式保存         |

---

## 四、表单字段说明

### 主表单（`form-crmUserRebateTemplate-edit`）

| 字段名                         | 类型     | 说明                                                |
| ------------------------------ | -------- | --------------------------------------------------- | -------------------- |
| `id`                           | hidden   | 当前返佣模板记录 ID                                 |
| `userId`                       | hidden   | 当前 CRM 用户 ID                                    |
| `rebateType`                   | hidden   | 返佣类型（1/2/3）                                   |
| `templateReferId`              | hidden   | 关联模板 ID                                         |
| `rebateLevel`                  | hidden   | 选中的返佣层级 ID                                   |
| `rebateTraderCommissionRule`   | hidden   | 规则-佣金参数映射字符串，格式：`ruleId:commissionId | ruleId:commissionId` |
| `inviter`                      | hidden   | 上级用户 ID                                         |
| `inviterName`                  | text     | 上级姓名（只读展示）                                |
| `source`                       | select   | 推荐来源（Select2）                                 |
| `registerSource`               | text     | 注册来源（只读）                                    |
| `userTwo[i].agencyId`          | select   | model=2 当前用户佣金参数选择                        |
| `userTwo[i].customRebateValue` | number   | model=2 commissionType=2 自定义返佣值               |
| `upper[i].commissionValue`     | number   | 分配给上级的返佣值                                  |
| `upper[i].traderIsChecked`     | checkbox | 是否启用该上级规则                                  |
| `upper[i].equalType`           | select   | 平级返佣类型（1=不返佣/2=固定/3=获取下级%）         |
| `upper[i].equalMoney`          | number   | 平级返佣金额/比例                                   |
| `upper[i].equalLimit`          | number   | 平级返佣限定代数                                    |
| `upper[i].passType`            | select   | 越级返佣类型（1=不返佣/2=固定/3=获取下级%）         |
| `upper[i].passMoney`           | number   | 越级返佣金额/比例                                   |
| `upper[i].passLimit`           | number   | 越级返佣限定次数                                    |

---

## 五、页面变量（服务端注入）

| 变量名                  | 类型   | 说明                                                                                                           |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| `rebateType`            | int    | 1=交易返佣 / 2=手续费返佣 / 3=入金返佣                                                                         |
| `model`                 | int    | 1=模板模式 / 2=直接配置模式                                                                                    |
| `commissionType`        | int    | 1=佣金组方案 / 2=自定义方案                                                                                    |
| `paramFillType`         | int    | 返佣参数填写方式（1=只读）                                                                                     |
| `source`                | string | `1`=内嵌模式（隐藏外框），其他=完整页面                                                                        |
| `crmUser`               | object | 当前 CRM 用户对象（含 `id`, `inviter`, `accountType`, `rebateLevelId`, `sourceText`, `registerSourceText` 等） |
| `userId`                | long   | 当前用户 ID                                                                                                    |
| `userInviter`           | string | 上级姓名展示字符串                                                                                             |
| `crmUserRebateTemplate` | object | 当前用户的返佣模板记录                                                                                         |
| `rebateLevelSetting`    | string | 层级设置（`0`=隐藏平级越级 / `1`=显示平级 / `2`=显示平级+越级）                                                |

---

## 六、React 重构要点

1. **路由**：该页面应作为 `CrmAccountsDetailPage` 下的子路由，URL 参数包含
   `userId`，查询参数包含 `rebateType`（1/2/3）和 `model`（1/2）。

2. **状态管理**：
   - `editMode: 'view' | 'edit'` 控制表单是否可编辑
   - 使用 TanStack Query 管理各异步数据（层级列表、规则列表、佣金组等）
   - 表单状态使用 React Hook Form + Zod 校验

3. **动态表单**：上级规则输入区（`upper[]` 数组）和当前用户规则（`userTwo[]`
   数组）需要用 `useFieldArray` 动态管理。

4. **条件渲染**：大量基于
   `model`、`commissionType`、`paramFillType`、`rebateLevelSetting`
   的条件显示逻辑，需在组件中清晰拆分。

5. **API hooks 位置**：所有新增 hook 按以下路径组织：
   - `src/api/hooks/rebate/` — 返佣相关（层级、规则、佣金组、保存等）
   - `src/api/hooks/user/` — 用户相关（上级查询、来源查询等）

6. **弹窗（Modal）**：原 jQuery layer 弹窗需改为 shadcn/ui `Dialog` 组件。

7. **Select2**：推荐来源的异步搜索下拉改用 `react-select` 或 shadcn `Combobox`。
