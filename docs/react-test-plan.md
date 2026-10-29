# React 后台测试体系方案（2026-10-29）

> 状态：草案，待评审后按 §12 分阶段落地。范围：本仓 `crm-admin`（React 19 + Vite
> 6 + TypeScript + TanStack Query v5）。关系：本文只管"测试怎么建"；缺什么功能见
> [react-feature-drift-analysis.md](./react-feature-drift-analysis.md)、[react-migration-gap-analysis.md](./react-migration-gap-analysis.md)。

## 1. 现状盘点（实测，2026-10-29）

| 项           | 现状                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| 测试依赖     | 无（`devDependencies` 里没有 vitest / jest / playwright / testing-library / msw）                         |
| 测试文件     | 0 个（`*.test.ts(x)`、`*.spec.ts(x)` 均为 0）                                                             |
| CI           | 无（仓库内无 `.github/workflows`，无其他 CI 配置）                                                        |
| 提交闸门     | husky `pre-commit`：`npx lint-staged`（prettier + eslint --fix + tsc-files --noEmit）+ `npx tsc --noEmit` |
| 应用规模     | 146 条生效路由、158 个 `*Page.tsx`、约 244 处 `api*()` 调用点                                             |
| 后端契约源   | `D:\projects\crm-api-atlas\exports\openapi.admin.json`（OpenAPI 3.0.3，806 条 path，2026-10-27 生成）     |
| 旧版 oracle  | `D:\projects\CRM`（`release` 审计基线 `acde80a7f2`；`xbroker` 增量基线）                                  |
| 可登录测试态 | 无。本系统用 session cookie（`credentials: 'include'`），没有测试账号/种子数据，浏览器验收长期无法执行    |

## 2. 为什么这个项目需要测试（而不是"通用最佳实践"）

这是一个**有标准答案的影子重写**：旧版 release 就是规格，React 只是换了实现。从既有漂移清单归纳，实际发生的缺陷几乎全部落在四类边界上：

1. **契约边界**：请求 path/参数名拼错或漏传（如 `channelIds`
   多选、`emailOrPhone`、`params.walletCurrency`）。
2. **省略与空值**：旧版该发空串/该省 key，我们发了 `0`
   或补了默认值（QuickCreate 的 `accountStart/accountEnd`、Sirix 报表字段）。
3. **换算与精度**：`/100` 与 `/10000` 归一化、`factWithdrawScale`
   截断方向、汇率重算覆盖手动金额。
4. **默认值与状态分支**：近 5 天默认时间、开关驱动的必填（Google 验证码、余额调整）、活动删除后只读。

这四类都不是"算法难"，而是**人肉比对旧模板才发现的差异**——正是自动化测试性价比最高的地方。反过来说，UI 布局、列顺序、文案这些规格仍在变的部分，现在铺测试只会变成负担。

## 3. 目标与非目标

**目标**

- 契约回归：前端发出的 path/参数名与旧版/atlas 一致，拼错立刻失败。
- 换算与 payload 回归：金额精度、归一化、省略规则有可执行断言。
- 公共组件护栏：`RrhSelect` / `FormInput`
  / 表格 / 导出这类被上百页复用的基础件改动时，有回归网。
- 本地一键可跑、离线可跑（不依赖测试环境）、不拖慢现有提交流程。

**非目标**

- 不设覆盖率门槛、不做覆盖率门禁。
- 不做视觉回归、不做整页快照。
- 不做全量页面 E2E（只做资金链路试点）。
- 不做后端集成测试（后端不在本仓）。

## 4. 分层设计

| 层  | 名称      | 工具                           | 环境      | 测什么                                              | 何时跑                    | 估时             |
| --- | --------- | ------------------------------ | --------- | --------------------------------------------------- | ------------------------- | ---------------- |
| L1  | 单元      | vitest（node）                 | node      | 纯函数、`flattenParams`、zod schema                 | pre-push + 本地           | 1 人日           |
| L2  | 契约      | vitest（node）+ atlas 快照     | node      | 244 处调用点 vs 806 条 path；重构期兼做旧版差异比对 | pre-push + 本地           | 1.5 人日         |
| L3  | 组件集成  | vitest + RTL + MSW + happy-dom | happy-dom | 表单提交体、回显、开关分支、决策表组合              | 本地（子集可进 pre-push） | 2 人日           |
| L4  | E2E       | Playwright                     | 浏览器    | 3 条资金链路                                        | 手动/夜间                 | 2~3 人日（阻塞） |
| L5  | 视觉/快照 | —                              | —         | **不做**（规格仍在变）                              | —                         | —                |

> 为什么这样分层、组合配置怎么处理、哪些明确不测，见 §16。分层的长期定位（而非只在重构期）也在 §16.4。

## 5. 技术选型与理由

| 选择                         | 理由                                                                      | 备选与否决原因                                               |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **vitest**                   | 复用 `vite.config.ts` 的 `@` alias 与插件；ESM 原生；启动比 Jest 快数倍   | Jest 需另配 babel/ts-jest，与 Vite 6 + ESM 组合易出错        |
| **happy-dom**（组件层）      | 比 jsdom 快，Radix/base-ui 够用                                           | 若遇 `getComputedStyle`/SVG 边缘问题，单文件回退 jsdom       |
| **MSW v2**                   | 拦 `fetch`，保留 `client.ts` 的真实逻辑（flatten、401 跳转、redirect）    | 直接 mock `fetch` 会绕过被测逻辑；mock hook 会让测试失去意义 |
| **@testing-library/react**   | 按用户行为断言，不绑实现                                                  | 不引入 enzyme 类浅渲染                                       |
| **Playwright**               | 多浏览器、trace、`storageState` 便于复用登录态（本系统是 session cookie） | Cypress 对 iframe/多标签支持弱                               |
| **atlas 快照（非运行时读）** | atlas 在仓库外，运行期读绝对路径不可移植；生成快照提交入库最稳            | 直接读 `D:\projects\crm-api-atlas` 只在本人机器可用          |

依赖安装（版本取与 Vite 6 / TS 当前版本兼容的最新版）：

```bash
pnpm add -D vitest @vitest/coverage-v8 @testing-library/react \
  @testing-library/user-event @testing-library/jest-dom msw happy-dom
# 阶段 P4 再装：
pnpm add -D @playwright/test && pnpm exec playwright install chromium
```

## 6. 目录与命名约定

```text
src/
  test/
    setup.ts                 # 全局 setup：jest-dom、MSW server、i18n 固定中文、浏览器 API 桩
    msw/
      server.ts              # setupServer(...handlers)
      handlers/              # 按领域拆：review.ts / setting.ts / report.ts ...
      fixtures/              # 脱敏后的真实响应样本
    utils/render.tsx         # renderWithProviders（QueryClient/Router/i18n/Auth 桩）
    contract/
      admin-paths.json       # 由 scripts/gen-api-contract.mjs 生成的 atlas 快照（提交入库）
      allowlist.ts           # 约定契约白名单（逐条写原因）
      endpoints.test.ts      # 扫描 src 的调用点做存在性断言
  lib/utils.test.ts          # 单元测试就近放置
  api/client.test.ts
e2e/                         # Playwright（阶段 P4，独立 tsconfig.e2e.json）
scripts/gen-api-contract.mjs # 从 atlas 生成契约快照
```

- 命名：`*.test.ts(x)`；E2E 用 `*.spec.ts` 且只在 `e2e/` 下。
- 测试文件放在 `src/` 内，天然被 `tsc --noEmit`
  与 eslint 覆盖（类型/规则与业务代码一致）；不启用 vitest `globals`，一律
  `import { describe, it, expect } from 'vitest'`。

## 7. 配置改动清单（逐文件）

### 7.1 `package.json`

新增 scripts：

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:contract": "vitest run src/test/contract",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "gen:api-contract": "node scripts/gen-api-contract.mjs"
}
```

### 7.2 `vitest.config.ts`（新建，不改 `vite.config.ts`）

复用现有 vite 配置（plugin-react、`@` alias、tailwind 插件），只叠加 `test` 段：

```ts
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig(
  mergeConfig(viteConfig, {
    test: {
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      exclude: ['e2e/**', 'node_modules/**'],
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['src/**/*.test.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'dom',
            environment: 'happy-dom',
            include: ['src/**/*.test.tsx'],
          },
        },
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: ['src/components/ui/**', 'src/locales/**', 'src/test/**'],
      },
    },
  }),
);
```

> 若当前 vitest 版本不支持 `projects`，退化为单一
> `environment: 'node'`，组件测试文件头加 `// @vitest-environment happy-dom`。

### 7.3 `src/test/setup.ts`

必须处理的四件事（否则组件测试起不来）：

1. `import '@testing-library/jest-dom/vitest'`。
2. i18n：`src/i18n/i18n.ts` 使用 `LanguageDetector`（依赖浏览器
   `navigator`），node 环境会报错 → 在 setup 里
   `await i18n.changeLanguage('zh')`，并在测试中只断言 key 或结构，不断言文案。
3. 浏览器 API 桩：`matchMedia`、`ResizeObserver`、`IntersectionObserver`、`scrollTo`（Radix
   / dnd-kit / 虚拟列表依赖）。
4. MSW 生命周期（仅
   `typeof window !== 'undefined'`）：`beforeAll(listen({ onUnhandledRequest: 'error' }))`、`afterEach(resetHandlers + localStorage.clear())`、`afterAll(close)`。
   `onUnhandledRequest: 'error'`
   是刻意的：任何未声明的请求都让用例失败，避免"打了真接口还以为绿了"。

### 7.4 `tsconfig.app.json`

无需改动：测试文件在 `src` 内，类型来自 devDependency。若后续启用 `globals`
才需要 `"types": ["vitest/globals"]`（本方案不启用）。

### 7.5 `eslint.config.js`

- 对 `**/*.test.{ts,tsx}` 与 `src/test/**` 放宽
  `no-non-null-assertion`、`no-empty-function` 等测试常用写法。
- 忽略 `coverage/`、`playwright-report/`、`test-results/`（若 `ignores`
  未覆盖）。

### 7.6 `.husky/pre-push`（新建）

```bash
npx vitest run --silent
```

`pre-commit` 保持不动（lint-staged 已够快，测试放 pre-commit 会明显拖慢）。

### 7.7 `.gitignore`

追加 `coverage/`、`playwright-report/`、`test-results/`、`.vitest/`。

### 7.8 CI（暂不建）

仓库当前无 CI。待确认平台后加一个最小 job：`pnpm install → typecheck → lint → test`（不跑 E2E）。schema 草案：

```yaml
# 待确认平台后启用
test:
  script:
    - pnpm install --frozen-lockfile
    - pnpm typecheck
    - pnpm lint
    - pnpm test
```

## 8. 首批用例清单（P1，逐条可执行）

| #   | 目标文件                                                                    | 被测点                                                          | 断言要点                                                                                                                                           | 需先重构                                  |
| --- | --------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | `src/api/client.ts`                                                         | `flattenParams`（当前是模块私有函数）                           | 嵌套对象→`a[b]`；对象数组→`arr[0].prop`；原始数组→重复 key；`undefined` 跳过；`null`→空串；`typeNameList[0][language]` 原样透传；中文/特殊字符编码 | 导出该函数（仅 `export`，无行为变化）     |
| 2   | `src/lib/utils.ts`                                                          | `transformTotalList`                                            | 按币种聚合、空数组、数值字符串                                                                                                                     | 否                                        |
| 3   | `src/lib/utils.ts`                                                          | `formatMoneyNumber` / `formatCurrencyAmount`                    | 2 位精度、超长小数、0/负数                                                                                                                         | 否                                        |
| 4   | `src/lib/utils.ts`                                                          | `normalizeTimeByPrecision` / `formatDate`                       | `minute`/`second` 精度、23:59 边界、空值直通                                                                                                       | 否                                        |
| 5   | `src/lib/utils.ts`                                                          | `normalizePercentageInput` / `formatFileSize` / `stripHtmlTags` | 百分比边界、文件大小进位、HTML 实体                                                                                                                | 否                                        |
| 6   | `src/lib/validators.ts`                                                     | `passwordSchema`                                                | 必填/选填 (`optional`)、min/max、缺小写/大写/数字各自失败                                                                                          | 否                                        |
| 7   | `src/pages/reports/trading/position-order/PositionOrderPage.tsx`            | 表尾交易量归一化                                                | MT5 `/10000`、XForce/XOH 原值、其余 `/100`、保留 2 位                                                                                              | 抽 `normalizeVolume(serviceType, volume)` |
| 8   | `src/pages/setting/trading-platform/quick-create/components/ServerStep.tsx` | `accountStart/accountEnd` 省略规则                              | serviceType 3/5 与 XForce `generateType=2` 时发空串；其余发数值                                                                                    | 抽 `buildServerPayload(values)`           |
| 9   | 报表页默认时间（分散）                                                      | 近 5 天 00:00 → 今天 23:59                                      | 边界日、跨月、重置恢复默认                                                                                                                         | 抽 `src/lib/date-range.ts`                |
| 10  | —                                                                           | 各项 URL 模板拼接                                               | 归入 L2 契约测试，不单测                                                                                                                           | —                                         |

> 7~9 是"测试驱动的小重构"：各抽一个纯函数（改动 ≤30 行、行为不变），再对它写用例。建议在补对应漂移项时顺手做，不单独开重构 PR。

## 9. 契约测试（L2）具体做法

1. **生成快照**：`scripts/gen-api-contract.mjs` 读取
   `D:\projects\crm-api-atlas\exports\openapi.admin.json`，输出
   `src/test/contract/admin-paths.json`（path +
   method，约 50KB），并在文件头记录 atlas 生成时间与来源 commit。
2. **扫描调用点**：用例遍历 `src/**/*.ts(x)`，提取
   `apiFormPost / apiFormPostCustom / apiGetCustom / apiPost / apiPut / apiDelete`
   调用的字面量 URL。
3. **归一化**：去掉 query、`${...}` → `{param}`、去掉 `/api`
   前缀、忽略动态拼接无法静态判定的调用（计入"跳过"并计数，避免静默漏测）。
4. **断言**：归一化后的 path/method 必须存在于快照中，否则失败并打印"code 调用点 → 最近候选 path"。
5. **白名单** `allowlist.ts`：约定契约（如
   `GET /system/inOutMoneySetting/interTransAdvanceScale`、`GET /system/platFormSetting/agentDataScope`）与 atlas 版本差造成的缺口，逐条写明原因与对应文档章节，白名单保持 ≤10 条。
6. **只做存在性断言，不做 schema 断言**：atlas 与联调环境可能存在版本差，schema 校验会大面积误报；字段级校验留给 L3 的 fixtures。

> 收益：这一层直接覆盖本仓最高频的缺陷类型——接口拼错、参数名与旧版不一致、调用未在文档化的契约里。

## 10. 组件集成（L3）范围

只覆盖两类，且都限定在"资金与审核"：

1. **提交体正确**：出金审核详情审核表单、`AgentDepositDialog`
   两步表单、余额调整（Google 验证码开关分支）、QuickCreate 三步提交。
2. **回显正确**：筛选面板 → 列表与合计接口同时携带同一参数（旧版长期存在"列表带了合计没带"的漂移）。

基础设施：

- `renderWithProviders`：每个用例新建
  `QueryClient`（`retry: false`、`gcTime: 0`）、`MemoryRouter`、i18n 固定
  `zh`、`useAuth` 桩、可选 `Toaster`。
- MSW
  handler 按领域拆分；fixtures 用联调真实响应脱敏后落库，字段名与后端一一对应（不改写成 camelCase）。

不测：列顺序、样式类名、i18n 文案、图表渲染。

## 11. E2E（L4，前置未满足前不启动）

**前置**：可访问的测试环境 + 管理员账号 + 种子数据（CRM 用户、交易账号、一笔待审核出金）。

- 登录态：`storageState` 复用（本系统靠 session
  cookie，`credentials: 'include'`），登录流程只在 `setup` 项目里跑一次。
- 场景（先 3 条）：
  1. 出金审核：筛选 → 详情 → 风控 tab → 审核通过（金额/汇率/备注）。
  2. 代客入金：客户搜索 → 表单填写 → 提交成功提示。
  3. 余额调整：开关开启时 Google 验证码必填拦截。
- 只断言关键交互（按钮可用、成功提示、无控制台报错），不断言表格像素。
- 环境未就绪期间：以 L1~L3 + 人工验收为准，并在交付说明中**如实标注"未在浏览器验证"**，不得声称已通过。

## 12. 分阶段落地（估时与验收）

| 阶段 | 内容                                                                                 | 估时             | 验收标准                                                          |
| ---- | ------------------------------------------------------------------------------------ | ---------------- | ----------------------------------------------------------------- |
| P0   | 装依赖、`vitest.config.ts`、`src/test/setup.ts`、scripts、`.gitignore`、2 个示例用例 | 0.5 人日         | `pnpm test` 绿；`pnpm typecheck`、`pnpm lint` 仍绿；pre-push 生效 |
| P1   | §8 的 1~9（含 3 处小重构）                                                           | 1 人日           | `flattenParams` 全分支、归一化、schema 均有断言                   |
| P2   | 契约生成脚本 + 扫描用例 + 白名单                                                     | 1.5 人日         | 全量扫描通过；白名单 ≤10 条且逐条有原因                           |
| P3   | `renderWithProviders` + MSW + 5 个提交/回显断言                                      | 2 人日           | 5 个场景通过，且 `onUnhandledRequest: 'error'` 下无隐式真实请求   |
| P4   | Playwright 3 条链路                                                                  | 2~3 人日（阻塞） | 测试环境内可重复跑通，失败有 trace                                |

## 13. 规范与流程

- 每补一个漂移项：至少 1 个回归用例（L1 纯函数 或 L3 提交断言），与代码、清单**同一个 commit**（沿用现有"代码 + 清单合并提交"约定）。
- 修 bug：先补失败用例，再改代码。
- 不追覆盖率数字；`test:coverage` 只用于找盲区，不进闸门。
- 测试必须离线可跑：不依赖测试环境、不依赖真实网络。
- 用例命名写业务语义（`it('旧版行为：MT5 交易量按 10000 归一化')`），不写实现细节。

## 14. 风险与对策

| 风险                                    | 对策                                                              |
| --------------------------------------- | ----------------------------------------------------------------- |
| 规格仍在变，测试成为负担                | 只测契约/换算/提交体，不测布局与文案；不设覆盖率门槛              |
| 组件强依赖 Auth/Router/i18n 导致难测    | 统一 `renderWithProviders` + `useAuth` 桩                         |
| TanStack Query 缓存串味导致用例互相污染 | 每用例新建 `QueryClient`（`retry: false`），`afterEach` 清理      |
| node / happy-dom 双环境 setup 冲突      | setup 内按 `typeof window` 分支；单测一律 node                    |
| atlas 过期，契约测试误报                | 生成脚本记录来源与时间；只做存在性断言；白名单收敛并有文档挂账    |
| 无 CI，测试容易被绕过                   | 至少挂 pre-push；CI 待确认平台后补（§7.8）                        |
| 测试拖慢提交                            | pre-commit 不动；测试只进 pre-push                                |
| 有测试反而误以为验收完成                | 明确 L1~L3 不代表浏览器可用；E2E 未就绪时交付说明如实标注"未验证" |

## 15. 待确认（阻塞决策）

1. **CI 平台**：是否有 GitLab/GitHub/自建流水线，是否允许在 PR/MR 阶段跑
   `test`。
2. **测试环境与账号**：是否有可登录的测试环境、管理员账号、种子数据（决定 P4 能否启动）。
3. **atlas 更新机制**：谁负责、多久更新一次
   `openapi.admin.json`（决定契约测试的可信度）。
4. **小重构接受度**：§8 中 3 处抽纯函数（`flattenParams`
   导出、`normalizeVolume`、`buildServerPayload`、`date-range`）是否可随对应漂移项一起做。
5. **跨配置语义交互**：业务是否提供规则表（例如「渠道 × 方式 × 状态」的可用性矩阵）。没有规则表的组合按 §16.3 列入"不测"，由试算/线上核对兜底。

## 16. 后台系统的测试取舍：不变量 / round-trip / 决策表

> 本节回答两件事：后台系统的测试重心应该放哪，以及**组合配置爆炸怎么办**。它同时决定 §4 各层的长期定位。

### 16.1 测试重心（后台视角）

单一功能复杂度低、需求明确，所以"功能是否正确"的测试价值低（人工点两下即可确认）。真正的缺陷集中在下面几类，而它们大多不在需求文档里：

| 重心            | 典型缺陷形态                                         | 归属层       | 说明                                           |
| --------------- | ---------------------------------------------------- | ------------ | ---------------------------------------------- |
| 计算与聚合      | 列表带了参数合计没带、换算比例用错、精度截断方向反了 | L1           | 本仓最高价值；已发生的漂移多属此类             |
| 隐式语义        | 空 vs 0、禁用 vs 隐藏、软删 vs 硬删、时区、数据范围  | L1 + L3      | 需求文档不写，重构期旧版是唯一事实来源         |
| 契约            | path/参数名拼错、枚举值不一致、分页与合计同参        | L2           | 拆分后新增的缺陷类别，只能靠契约层兜           |
| 授权与状态机    | 越权读、按钮该禁未禁、状态迁移缺守卫                 | L3 + 后端    | 前端测试只能证明"表现"，真正的守卫必须在后端   |
| 配置 round-trip | 保存后读不回、重复保存不幂等、新增项缺默认值         | L1 + L3      | 组合正确性的基础，见 16.2                      |
| 组合配置        | 仅对少数高风险轴做决策表                             | L3（表驱动） | 不枚举全组合，见 16.2                          |
| 交互路径        | 跳转、页签、面包屑                                   | L4（少量）   | 规格变则全红，只保留"配置一次、跨页生效"的纵切 |

### 16.2 组合爆炸的四种归约

把组合当成测试矩阵，任何后台都测不完；把它当成设计问题，规模会掉几个数量级：

1. **归约为不变量，而不是枚举组合**。断言"任一 X，都满足 Y"，成本是 O(规则数) 而非 O(取值^轴数)。本仓可用的不变量示例：
   - 任一渠道的出金：到账 = 金额 × 汇率 − 手续费，并按 `factWithdrawScale`
     截断；
   - 任一风控范围/周期：分子与分母取自同一时间窗与同一账号集合；
   - 任一权限组合：无权时既不发请求，也不渲染可点击入口。
2. **配置 round-trip 把乘法变加法**。每个配置项只测「保存 → 读回 → 生效且重复保存幂等 → 未设置项走默认值」。只要每项单独可信、且写入互不覆盖（`platFormSetting/edit`
   按 `isNotBlank`
   逐字段落库即此形态），组合的正确性由各分量合成得到，不必再对组合覆盖一遍。这是后台测试投入产出比最高的一条。
3. **决策表 +
   pairwise，只留少数轴**。确实要枚举的（方式 × 渠道 × 状态 × 币种）应把规则抽成数据表、实现改为查表，测试直接对表做 table-driven 断言——组合从"代码路径"变成"可评审的数据"。轴多时用 all-pairs 把 N^k 降到 N² 量级，并声明"每轴至少取值一次"而不是"全组合"。
4. **试算/预览即等价覆盖**。出金手续费试算（`calculateWithdrawFeeThird`）、代客入金汇率试算，一次调用就走完整条组合链；把试算接口测透，等价于覆盖了所有渠道配置组合，比在 UI 上排列组合便宜一个数量级。

补充：**缺陷驱动**。每出现一次组合型缺陷，把该组合补进决策表或抽成不变量断言，不再新增一条 E2E。

### 16.3 明确不测（写进评审清单）

- 跨配置的语义交互（例如"促销活动与返佣规则叠加"），除非业务给出规则表；
- 未在决策表里声明的组合（由试算/线上核对兜底，不穷举）；
- 纯样式、文案、列顺序、图表渲染；
- 跨服务事务一致性、并发扣减（属后端边界）。

写清"不测什么"比多写 50 个用例更能防止测试体系失控：评审时可以直接引用本节驳回"这个组合也测一下"的要求。

### 16.4 重构期与原生期的 oracle 差异

| 时期   | oracle       | 主要手法                                     | 用例去向                             |
| ------ | ------------ | -------------------------------------------- | ------------------------------------ |
| 重构期 | 旧版 release | 差异测试：同一输入比对旧版行为、payload 对照 | 可直接演化为不变量断言，接力成本很低 |
| 上线后 | 无           | 不变量 + 决策表 + 契约                       | 存量用例保留，新增组合只进决策表     |

因此 L2 契约层不是"重构期临时措施"：重构期兼做与旧版/atlas 的差异比对，长期做调用点存在性断言（§9），两层用同一套基础设施。

### 16.5 附：与 RuoYi 服务端渲染方案的对比

拆分 SPA 对测试的意义不在框架本身，而在**边界被显式化**：

- RuoYi（Thymeleaf）当然可以测，且最划算的是 Spring
  `MockMvc`（参数绑定、权限、视图模型）与 service 单测；页面行为则只能整页浏览器 E2E，选择器依赖
  `th:each`
  生成的 DOM，脆弱且慢。中间最便宜的一层（纯函数/组件）在服务端渲染里没有位置。
- 拆分后：计算与格式化落到可单测的纯函数（L1），接口契约成为一等公民（L2），表单提交体可在组件层断言（L3），E2E 只留纵切（L4）。
- 代价也要认：新增"契约不同步"这一缺陷类别（§2 的四类之一主要由此而来），且服务端不再天然按权限裁剪页面——React 目前无 RBAC 权限点体系（见
  `react-feature-drift-analysis.md` §4），权限必须由后端接口守卫兜底。
- 完整对比、后果与本仓的处置方案（最小 RBAC）见
  [react-vs-ruoyi-adr.md](./react-vs-ruoyi-adr.md)。
