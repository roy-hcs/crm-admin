# P3b 任务卡：权限包管理页 · 组件集成用例（放行单）

> **放行**：2026-11-14
> 19:4x 使用者「P3b 我打算让 flash 处理，给我一个工作说明，我转发给 flash 去处理」。本卡由使用者转发给 flash，**即放行指令**。上位文件
> `docs/REACT-TEST-INFRA-CHECKLIST.md`（v1.20）§0 十三条红线 / §3 A–D 裁定 /
> §6 门禁原则、`docs/TASK-CARD-TEMPLATE.md` —— **引用不复制**，冲突以清单 +
> `scripts/verify-p3b.json` 为准。**只做 P3b，做完停机**；P4
> / 浏览器验证 / 夜间协议一律不启动。

## 0. 前置状态（人审已核实，勿重跑、勿重新周更）

- P3a 补页已 push；路由 `/settings/promotion/perm-package`、菜单、17 个
  `data-testid` 全落地（`docs/testids.md`）。
- 11-14 周更 + 契约快照重生**已完成**：`admin-paths.json` **951 键**、
  `atlasVersion=2026-11-14T10-22-35-654Z`，`pnpm test:contract` **4/4
  PASS**，5 条 P3a MISS 全部命中。⚠️ `docs/testids.md` §4「契约判红属预期」是
  **P3a阶段历史状态，已被收口取代**；本批不得据此停机、不得塞
  `allowlist.ts`、不得改 `admin-paths.json` / 断言 / atlas 仓。
- 基线实跑：`pnpm test` **5 files / 58 tests**；`pnpm lint` **0 error / 49
  warning**。
- 基建：`src/test/msw/server.ts` 是空 `setupServer()`，`src/test/setup.ts:73` 的
  `onUnhandledRequest:'error'` **无条件启用**（node / dom 双 project）；
  `renderWithProviders` 在 `src/test/utils/render.tsx`。 **MSW handler 用
  `server.use(...)` 就地写在两个用例文件内，不新增第三个文件。**
- 环境：node v22.22.2 / pnpm 10.34.5（`packageManager` 已锁）、Vitest 4.1.12 /
  jsdom 27.4.0 / RTL 16.3.3 / MSW 2.15.0。**不得 corepack enable / 改 lockfile
  / 重装 node_modules**（R-11）。
- **19:5x 时效刷新**：使用者要求提交两份 kb-sync 漂移文档，`develop` HEAD 由
  `3358768` 推进；`scripts/verify-p3b.json` 的 `expectedHead` 与
  `baselineStatus`
  由人审同步刷新为提交后终态。**本卡 §1 覆盖表、§2 判据值、5 组变异一字未改**；flash 一律以
  `scripts/verify-p3b.json` 文件为准，不按本卡日期/正文推断 HEAD 或工作区状态。

## 1. 覆盖表（人定契约，边界只增不减）

| 组  | 被测文件                           | 必须覆盖的边界（最低集）                                                                                                              | 落盘 / project                     |
| --- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| B1  | `components/PermPackageDialog.tsx` | `name` 空 → 提交被拦、必填提示可见、**不发出 add/edit 请求**                                                                          | `PermPackageDialog.test.tsx` / dom |
| B2  | 同上                               | `name` 32 可输入 / 33 字符被 `maxLength` 截断；`form.name.length > 32` 校验                                                           | 同上                               |
| B3  | 同上                               | `remark` 200 可输入 / 201 被截断 + `n/200` 字符计数回显                                                                               | 同上                               |
| B4  | 同上                               | `serverIds` 输入 → 点「查询账号类型」→ MSW 捕获 `getServerAccountTypes` 且 `spread-perm-account-type-item` 按返回渲染；**未点不请求** | 同上                               |
| B5  | `PermPackagePage.tsx`              | `resetForm()`：清空 name / status / query / 分页，列表请求回到初始参数                                                                | `PermPackagePage.test.tsx` / dom   |

> oracle =
> **当前实现的可观测输出**（清单 §3 拍板 B），不是旧 RuoYi 模板 / 产品口径。期望值先读实现推导，回执写「输入 → 期望 → 实现文件:行号」，**禁止编**（R-8）。
> **MSW 全程离线**：`onUnhandledRequest:'error'` 下不得出现未声明请求（R-5）；禁
> `vi.mock('fetch')` / mock 被测模块 / 导出私有函数 / `*.skip` /
> `expect(true).toBe(true)`。 `data-testid` **从不是阻断项**：先有用例，再按
> `land-test-case` 补最小 diff；行内 3 个按钮用 `getAllByTestId` /
> `within(row)`（`docs/testids.md` §1 动态项说明）。
> **不为成本削边界**：口径不明只停机回报，不许简化 / 删字段 / 把缺口塞白名单换绿。

## 2. 判卷：`scripts/verify-p3b.json`（人审定稿，flash 只读）

由人审从 `verify-p2.json`
复制改差值生成，**flash 不得创建、修改或「修正」**。关键值（现场核对用，以文件为准）：

| 键                                    | 值                                                                                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `expectedHead`                        | 放行单提交后由人审实读写入 `develop` HEAD（见 §0 时效刷新）。**该 JSON 故意不提交**，以保持 HEAD 稳定、避免 V7 自指；flash 以文件为准，不得自行推断          |
| `expected`                            | `minTestFiles: 6` / `minTests: 63` / `lintErrors: 0` / `lintWarnings: 49`                                                                                    |
| `extraCommands`                       | `pnpm test:contract`，`expectExit: 0`                                                                                                                        |
| `baselineStatus`                      | 漂移文档提交后工作区仅 1 行未跟踪文件 `scripts/verify-p3b.json`，无任何修改行（**原样，不许改**）                                                            |
| `allowedNewStatus`                    | 仅 §1 两个 `.test.tsx`；别的文件一律不许新增                                                                                                                 |
| `mustNotChange`                       | `client.ts` / `setup.ts` / `msw/server.ts` / `vitest.config.ts` / `pnpm-lock.yaml` / 契约三文件 / `Sidebar` / `settingsRoutes` / 两个实现文件 / 两份漂移文档 |
| `newTestFiles` / `forbiddenScanFiles` | §1 两个用例文件                                                                                                                                              |
| `implementationFiles`                 | 两个实现文件（**只允许即改即还原的变异**）                                                                                                                   |
| `mutations`                           | 5 组，对应 B1–B5；`find` 全文件唯一命中已核实为 1x                                                                                                           |

`mutations` 的 `find → replace`（人审定，**flash 写的用例必须让它们变红**）：

| 组  | 文件   | find → replace                                                        |
| --- | ------ | --------------------------------------------------------------------- |
| B1  | Dialog | `if (!form.name.trim())` → `if (false)`                               |
| B2  | Dialog | `maxLength={32}` → `maxLength={64}`                                   |
| B3  | Dialog | `form.remark.length > 200` → `form.remark.length > 400`               |
| B4  | Dialog | `enabled: showAccountTypes` → `enabled: false`                        |
| B5  | Page   | `setQuery({ name: '', status: '' });` → `setQuery({ name, status });` |

> 每组 `minFailed: 1`。门禁自动完成「改实现 → 红 → 还原 → 绿 → `git diff` 空」；
> **变异不红 / 还原不绿 / diff 非空 = 停机**，不许改判据或断言换绿。

## 3. 指令（约 12 行，可直接转发）

```
读 docs/REACT-TEST-INFRA-CHECKLIST.md §0/§3、docs/TASK-CARD-TEMPLATE.md、
docs/P3b-TASK-CARD.md、scripts/verify-p3b.json 与任务卡 §1 覆盖表。
红线十三条以清单为准，本指令不重复。
HEAD 与工作区基线一律以 scripts/verify-p3b.json 为准，不按任务卡日期推断。
按覆盖表写 5 组组件用例（renderWithProviders + MSW，onUnhandledRequest:'error'），
只落盘 allowedNewStatus 里的两个 .test.tsx；实现文件只允许即改即还原的变异。
期望值从当前实现推导，回执写「输入 → 期望 → 实现文件:行号」，禁止编造。
撞到环境 / 口径问题就停机回报，带原始输出，不要自行换方案、不要猜业务口径。
不要提前排雷，也不要自行裁定 §2 的任何判据值。
做完跑 node scripts/verify-test-batch.mjs --config scripts/verify-p3b.json，
把门禁 stdout 整段贴进回执后停机。门禁 exit != 0 不算交付。
不 commit / push、不跑后续批次、不做浏览器验证、不执行夜间协议。
```

## 4. 停机条件

1. 门禁要求改 `implementationFiles` 最终态 / 配置 / 工具链才能过；
2. 变异不红、还原不绿、`git diff` 非空；
3. 静态扫描命中禁用绕法，或 `// assert:` 追溯不到；
4. 期望值从实现推不出来（缺口径）→ 写清卡在哪一行停机，**不许简化 / 删字段**；
5. `onUnhandledRequest:'error'` 报出未声明请求（存在隐式真实请求）；
6. 任何越界文件、commit / push、P4 / 浏览器、真实接口或线上配置写操作；
7. `docs/testids.md`
   §3 的 4 条口径差异（尤其 ③ 编辑不回显适用用户配置、④ 数组字段 `join(',')`
   提交形态）**只作只读边界素材**，不得自行裁定、不得伪造默认值、不得补接口；需要定论就停机交人 / 贵模型。

## 5. 回执（只填机器判不了的三样）

按 `docs/TASK-CARD-TEMPLATE.md`
§4 表格：每组写「期望值推导（输入 → 期望 → 实现:行号）」+「口径差异 / 披露」，另附门禁 stdout 整段、停机项、未验证项、挂账。**不得写「人审侧已验证」「本批已验收通过」**——验收由门禁 exit
code + 人审裁定共同给出。

## 6. 原样挂账（不重解）

A1 测试账号 / A2 CI / A4 e2e 通道 / A5 推广域口径；test-plan
§8 的 7~9 与三处小重构；M1/N4 28 条 `side=admin`
卡只作只读素材（不解挂、不生成 case.md、不进 e2e 消费队列，R-9）；Q 口径 /
`C-M3-10 queryData` / 2 条候选 anchor / `login-ta-*` testid；P4
/ 浏览器验证未做，交付说明如实标注「未在浏览器验证」。
