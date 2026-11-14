# P1 执行单（2026-11-12，人审已放行 · 交 glm flash 执行）

> ⛔ **本单已执行完毕并验收通过（18/18），勿重发**。上位清单已升 **v1.11**：
> **P2 于 11-13 交付并由人审验收通过**（`docs/P2-TASK-CARD.md`
> §6 已执行完毕、勿重发）；当前无可发指令，P3a / P3b / P4 待放行。本单内「P2 /
> P3 / P4 未放行」「P1 已放行、可执行」均为
> **11-12 历史状态**，勿据此判断现状。状态：**P1 已放行、可执行**（11-12 历史）。上位文件：`docs/REACT-TEST-INFRA-CHECKLIST.md`
> **v1.5** + `docs/P0-REWORK-ORDER-v2.md`
> §10（P0 复议已通过、A6 闭环）。冲突时以**本单**为准并停机回报（R-9）。范围：**只做 P1**（test-plan
> §8 的 **1~6**）+ 第 0 步一行小修。 **不跑 P2 / P3 /
> P4**，不做浏览器验证，四仓**不 commit /
> push**，不执行夜间无人值守协议。上位裁定不变：A–D 四项、§0 十三条红线（R-1…R-13）、A1–A5 硬阻塞挂账。

---

## 0. 一句话目标

补齐 §8 的 1~6 六组**可证伪**回归断言（每组变异能红），顺手关掉
`coverage/ → lint` 的顺序耦合。 **改完停机交回执，不自行往下跑 P2。**

---

## 1. 人审前置实证（两条，直接决定实现方式，别再试错）

### 1.1 捕获目标是 **POST body**，不是 URL —— 文档口径由人修正

清单 §3 拍板 B 与 §5 P1 行原写「用 MSW 捕获 `fetchWithAuth` 发出的**真实 URL**
间接断言 flatten 分支」。
**人审读码 + 实跑确认该表述不成立**，现由人修正（不是 flash 自行裁定，R-4 的例外已在此写明）：

- `src/api/client.ts:168-185` `apiFormPostBase` 把
  `flattenParams(params).toString()` 放进 **`body`**，URL 是原样传入的
  `url`，**不含任何 query**；
  `Content-Type: application/x-www-form-urlencoded; charset=UTF-8`。
- **判据**：MSW handler 里必须 `await request.text()` 拿 body，再用
  `new URLSearchParams(body)` 解析成键值断言。**只断 URL
  / 只断「请求发出去了」一律不算覆盖**（恒真）。
- 清单 v1.5 已同步修正文字，flash **不改 `docs/*.md`**。

### 1.2 node project 跑不了相对 `/api` URL —— #1 必须落 **dom project**

`API_BASE_URL = '/api'` 是模块常量，拍板 B 不改生产代码，所以
`fetch('/api/xxx')`
是相对 URL。人审 11-12 两个即建即删探针（已删除、`git status` 零残留）：

| 探针                                              | 命令                                                                  | 结果                                                                                                                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/zz-p1-probe.test.ts`（**unit / node**）  | `node node_modules/vitest/vitest.mjs run src/lib/zz-p1-probe.test.ts` | **exit 1**：`TypeError: Failed to parse URL from /api/p1-probe` / `ERR_INVALID_URL`，栈指向 `@mswjs/interceptors` 的 `new FetchRequest` → **MSW 拦截前就要解析 URL** |
| `src/lib/zz-p1-probe.test.tsx`（**dom / jsdom**） | 同上，换 `.tsx`                                                       | **exit 0**，`request.url = http://localhost:3000/api/p1-probe`，body 捕获成功                                                                                        |

**裁定**：#1 的用例文件**必须是 `.test.tsx`**，靠 `vitest.config.ts` 的
`include: ['src/**/*.test.tsx']` 进 dom project；jsdom 提供 base URL，相对
`/api` 才能被解析。

**不许绕的四条**：① 改 `client.ts` 导出 `flattenParams`（拍板 B）；②
`vi.mock('fetch')` / `vi.spyOn(globalThis,'fetch')` / 给 fetch 打薄包装 /
`vi.mock('@/api/client')`（清单 §6.3）；③ 改 `vitest.config.ts` 的 `projects` /
`include` 来让 `.test.ts` 吃 jsdom；④ 改 `API_BASE_URL`。
**走不通就停机回报，不要换方案**（§6 停机条件 1）。

**人审探针拿到的真实 body**（作为期望值推导的事实锚，**不是让 flash 照抄当唯一用例**）：

```text
a=1&nested%5Bc%5D=2&arr=3&arr=4&objects%5B0%5D.language=zh&empty=&name=%E4%B8%AD%E6%96%87+%26+%E7%A9%BA%E6%A0%BC
```

对应实现事实：嵌套对象 `nested[c]=2`（方括号被编码）、原始数组重复 key
`arr=3&arr=4`、对象数组 `objects[0].language=zh`（**dot**，不是
`[language]`）、`null` → 空串 `empty=`、 `undefined` →
key 整个消失、中文 / 空格 / `&` 按 `URLSearchParams` 编码（空格 `+`）。

### 1.3 oracle 口径（防「编期望值」）

- P1 的期望值 oracle = **当前实现的可观测输出**（把现状锁成回归网），
  **不是**旧版 RuoYi 模板、**不是**产品/业务口径。发现与旧版不一致 → 记进回执「待漂移分析」，**不许自行改实现或改草案**。
- 每条期望值先**读实现推导**，回执写清「输入 → 期望 → 实现文件:行号」。禁止「看起来应该」地编（R-8）。
- §8 #1 末条 `typeNameList[0][language] 原样透传`：以 `flattenParams`
  对**含方括号字面量 key**
  的实际行为推导，回执说明推导过程；**不得**引入旧版口径、不得自行改 key 命名。推不出来就按 §6 停机条件 7 停机。

---

## 2. 唯一允许改动清单（超出即整批退回）

### 2.1 允许**最终落盘**的 4 处

| #   | 文件                                                           | 唯一允许的动作                                                                                                    |
| --- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | `eslint.config.js`                                             | 第 8 行 `ignores: ['dist']` → **`ignores: ['dist', 'coverage']`**，仅此一行。**不得**顺手加规则、放宽规则、改格式 |
| 2   | `src/lib/utils.test.ts`（P0 已建、untracked）                  | **只追加** #2 / #3 / #4 剩余 / #5 的 `describe`/`it`；**P0 既有 4 组 5 条断言的文案与期望值一个字都不改**         |
| 3   | `src/lib/validators.test.ts`（新建）                           | #6 `passwordSchema`                                                                                               |
| 4   | `src/api/client.flatten.test.tsx`（新建，**后缀必须 `.tsx`**） | #1 `flattenParams` 间接断言；文件头注释写明「为何是 .tsx：需 jsdom 解析相对 /api URL，人审 11-12 探针实证」       |

> **不新增** `src/test/msw/handlers/` / `fixtures/` 目录：#1 的 handler 直接用
> `server.use(...)` 写在用例文件内（每个 `it` 自己注册，因为 setup 的
> `afterEach` 会 `resetHandlers()`）。handler 必须返回 **2xx JSON**（如
> `HttpResponse.json({ code: 0, msg: 'ok', data: null })`），否则
> `fetchWithAuth` 会走 toast / throw 分支。

### 2.2 允许**临时改动、必须即改即还原**的文件（变异用）

`src/lib/utils.ts`、`src/lib/validators.ts`、`src/api/client.ts`
—— 仅限 §4 的变异步骤， **`git status --short` 终态里不得出现这三个文件**（P0 v2
§3 已立此例：即改即还原不算改生产代码，与拍板 B 不冲突）。

### 2.3 明确禁止

- 改 `client.ts` **最终态**（尤其导出 `flattenParams` / 改 `API_BASE_URL`
  / 改 flatten 行为）、改
  `vitest.config.ts`、`src/test/setup.ts`、`src/test/msw/server.ts`、`package.json`、
  `pnpm-lock.yaml`、`.gitignore`、`vite.config.ts`、`tsconfig*`、`node_modules`、任何 pnpm/corepack 配置。
- `vi.mock('fetch')` / `vi.spyOn(globalThis,'fetch')` /
  `vi.mock('@/api/client')` / 整体替换被测对象内部。
- 靠改测试断言 / 改配置 / 删 handler 制造「变异红」（R-13）。
- 改 3 个受保护文件（`docs/react-feature-drift-analysis.md`、`docs/react-migration-gap-analysis.md`、
  `src/pages/review/leverage-detail/components/LeverageInfoCard.tsx`）、改
  `docs/*.md`（文档由人改）、改 KB `crm-knowledge/**`、改 `crm-e2e/**`、改旧后台
  `D:/projects/CRM/**`。
- 打真实接口 / 真实测试环境 / 为跑通去线上改后台配置（R-5）；#1 的 path 用**测试专用假路径**
  （如 `/p1-flatten`），**不许用真实业务端点**（避免与 P2 契约扫描混淆）。
- 加 `data-testid`、跑 P2 / P3 / P4、起浏览器 /
  Playwright、生成 case.md、解挂 M1/N4 28 条。
- `git commit` / `git push`、`TASK_STATE.md` 断点提交、`.zcode/night/LOCK`
  心跳。

---

## 3. 六组覆盖契约（人定，flash 不许减边界）

> 每个 `expect` 前必须有 `// assert:`
> 注释，写明守护哪条边界 / 对应 §8 第几项（清单 §6.4）。断言目标必须是**被测代码写出的可观测输出**，不是测试自己注入的输入（清单 §6.2）。

| 组                                                                     | 文件 / project                      | 必须覆盖的边界（最低集）                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **#1** `flattenParams`                                                 | `client.flatten.test.tsx` / **dom** | ① 嵌套对象 → `nested[c]=2`（顶层 key 无前缀）；② 对象数组 → `objects[0].language=zh`，且多元素时 `[1]` 正确；③ 原始数组 → 重复 key（同一个 key 两个值）；④ `undefined` → key 不存在（`params.has()` 为 false）；⑤ `null` → 空串；⑥ 中文 / 空格 / `&` / `=` 的编码；⑦ 含方括号字面量 key 的实际行为（§1.3）；⑧ `apiFormPostCustom` 与 `apiFormPost` 走同一 flatten 路径（二选一断言即可）。**每条用例都要断解析后的 body 键值** |
| **#2** `transformTotalList`                                            | `utils.test.ts` / unit              | 按 `fileds` 顺序聚合；`null` 值跳过（注意实现判的是 `!== null`）、数值转 `String`、`currency` 原样；`undefined` / 非数组入参 → `[]`；空 `fileds` → `[]`；某 field 全为 null 时不 push 该项；多币种多行                                                                                                                                                                                                                         |
| **#3** `formatMoneyNumber` / `formatCurrencyAmount`                    | 同上                                | 默认 2 位精度 + 千分位；超长小数（`Intl` 四舍五入）；`0`、负数；非数字字符串原样返回；自定义 `significantDigits`；货币单位后缀与自定义 currency                                                                                                                                                                                                                                                                                |
| **#4** `formatDate` + `normalizeTimeByPrecision` 补余                  | 同上                                | `formatDate`：空值 → `''`、`Date` 与字符串、`format` 自定义；时间：`23:59` / `23:59:59` 边界、前导零、`trim()`、非法片段。**P0 已有 4 组断言保留，不重复写同样的用例**                                                                                                                                                                                                                                                         |
| **#5** `normalizePercentageInput` / `formatFileSize` / `stripHtmlTags` | 同上                                | 百分比：`>100` → `'100'`、超 2 位小数截断、`'0.'` 中间态、非法字符剥离、`'.'` → `''`；文件大小：`0` → `''`、`1024` 进位、末尾零移除（`"1.0" → "1"`）、负数/非法 → `''`、`decimals` 参数、TB 上限；HTML：`<br/>` 去除、`null`/`undefined` → `''`、**HTML 实体不被改写**（`&amp;` 保留）                                                                                                                                         |
| **#6** `passwordSchema`                                                | `validators.test.ts` / unit         | 合法密码通过；缺小写 / 缺大写 / 缺数字各自失败；低于 min / 高于 max 失败；`optional: true` 允许 `''`、非 optional 时 `''` 失败；传 `field` 时 `''` 触发必填；自定义 `min`/`max` 生效。用 `t` stub（`((key) => key) as unknown as TFunction`），**只断 `safeParse().success` / 错误条数，不断文案**（§7.3）                                                                                                                     |

> **`utils.ts:1` 会连带 import `client.ts`**（`API_BASE_URL`），P0 已验证 node
> project 下 import 无碍，不用额外打桩。 **#1 的 dom project 自带
> `localStorage`**（人审探针实测），**不要**再
> `vi.stubGlobal('localStorage', ...)`；若遇到
> `ReferenceError: localStorage is not defined`，按 §6 停机条件 1 停机，不要自行加桩绕。

---

## 4. 变异验证（硬判据，缺一组即退回）

- **6 组各至少 1 组**「改**实现**一行 → `pnpm test` 红 → 还原 → `pnpm test`
  复绿」，共 **≥6 组**。
- 逐组记录：改了哪个文件哪一行、改成什么、**红了几条
  `expect`**（贴原样 AssertionError 片段）、还原后复绿、`git status --short`
  中该文件不出现。
- **#1 的变异点必须在 `client.ts` 的 `flattenParams`
  实现内**（即改即还原，§2.2 已授权），例如把对象数组的 `${parentKey}.${key}`
  改成 `${parentKey}[${key}]`、或删掉 `if (value === undefined) return;`。
- **不许**改测试断言 / 改 `vitest.config.ts` / 删 handler
  / 改探针内容凑红（R-13）。
- 变异必须**一组一组做**（改 → 跑 → 还原 → 复绿 → 再下一组），不许一次改多处。

---

## 5. 执行序与验收判据（顺序不可换）

| 步    | 动作                                                                                                                                                                                                        | 判据                                                                                                                                                                                                                    |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0** | **只读复述**：读清单 v1.5、`P0-REWORK-ORDER-v2.md` §10、本单全文、`docs/react-test-plan.md` §8；复述 §0 十三条红线、A–D 裁定、本单 §1 两条实证、§2 允许改动、§4 变异要求、§6 停机条件。**此步不改任何文件** | 复述无遗漏；特别说明「#1 必须 .tsx / 断 body 不是 URL」                                                                                                                                                                 |
| **1** | 第 0 步小修：`eslint.config.js` 加 `'coverage'`                                                                                                                                                             | 只改第 8 行一处                                                                                                                                                                                                         |
| **2** | 先跑一次 `pnpm test:coverage` → **再跑** `pnpm lint`                                                                                                                                                        | 顺序解耦验收：`test:coverage` exit 0；`lint` 仍 **0 error / 49 warnings**（P0 复议披露的 +3 不再出现）。跑完 `rm -rf coverage` 清产物                                                                                   |
| **3** | 按 §2.1 #2 / #3 写 #2~#6；跑 `pnpm test`                                                                                                                                                                    | 全绿；`pnpm typecheck` exit 0                                                                                                                                                                                           |
| **4** | 按 §2.1 #4 写 #1（`.tsx` + `server.use` + `await request.text()`）；跑 `pnpm test`                                                                                                                          | 全绿；#1 用例确实归在 **dom** project（输出里看得到 `✓ dom`）；**不得**出现 `ERR_INVALID_URL` 后被自行绕过                                                                                                              |
| **5** | §4 的 **≥6 组**变异                                                                                                                                                                                         | 每组红 → 还原 → 绿，零残留                                                                                                                                                                                              |
| **6** | 全量复核：`pnpm --version`、`pnpm test`、`pnpm typecheck`、`pnpm lint`、`pnpm test:coverage`；`pnpm build` 选跑                                                                                             | `--version` = `10.34.5`；test exit 0（**4 个测试文件**：P0 的 2 个 + P1 新增 2 个；用例数如实报）；typecheck exit 0；lint 0E / 49W；coverage exit 0（不解读百分比）；build 若跑，机械更新 `tsconfig.tsbuildinfo` 后还原 |
| **7** | 纪律证据 + 按 §7 填回执，**停机**                                                                                                                                                                           | `HEAD` 仍 `391f701`；3 受保护文件 mtime 未变；`git status --short` 相对 P0 终态只多出本单允许的改动；无探针 / 变异残留；无 commit / push                                                                                |

> `pnpm build` 会机械更新
> `tsconfig.tsbuildinfo`：`git checkout -- tsconfig.tsbuildinfo`
> **只在该文件当前干净时可用**；若它带着人的未提交改动，**禁止 checkout，停机回报**（P0 复议 §10.2 补充纪律）。

---

## 6. 停机条件（命中即停，写清缺什么、在哪查过）

1. §1.2 的 dom project 路径跑不通（含 `ERR_INVALID_URL`、`localStorage`
   未定义、handler 不拦）—— **不许换方案、不许改配置、不许自行打桩**，直接停。
2. 任何一组变异不红 / 还原不绿 / `git status` 有残留。
3. 发现必须改 `client.ts` 最终态、改 `vitest.config.ts` /
   `setup.ts`，或动任何 §2.3 禁项才能跑通。
4. `pnpm lint` 出现
   **error**，或 warning 数 >49 且无法逐条解释来源（新文件不得贡献 warning）。
5. §8 1~6 里列的函数不存在 / 签名与清单不符 → 停机，**不许自己改实现适配**。
6. 需要改 `docs/*.md`、改工具链、装新依赖、commit/push、跑 P2–P4。
7. §1.3 的 `typeNameList[0][language]`
   类 key 从实现推不出期望值 → 停机写清推导卡在哪一行。

---

## 7. P1 回执模板（人只看这张表）

### 7.1 六组覆盖与变异

| 组  | 文件 / project | 用例数 | 期望值推导（输入 → 期望 → 实现文件:行号） | 变异（改了哪行 / 红几条 expect / 还原复绿 / 零残留） | 备注 |
| --- | -------------- | ------ | ----------------------------------------- | ---------------------------------------------------- | ---- |
| #1  |                |        |                                           |                                                      |      |
| #2  |                |        |                                           |                                                      |      |
| #3  |                |        |                                           |                                                      |      |
| #4  |                |        |                                           |                                                      |      |
| #5  |                |        |                                           |                                                      |      |
| #6  |                |        |                                           |                                                      |      |

### 7.2 命令与退出码

| 命令                                          | 退出码 | 关键输出（原样片段）           |
| --------------------------------------------- | ------ | ------------------------------ |
| `pnpm --version`                              |        |                                |
| `pnpm test`                                   |        | 文件数 / 用例数 / dom 归属     |
| `pnpm typecheck`                              |        |                                |
| `pnpm lint`（`test:coverage` **之后**跑）     |        | 0 error / warning 数           |
| `pnpm test:coverage`                          |        |                                |
| `pnpm build`（选跑，未跑写「未跑」）          |        |                                |
| `git status --short` / `git log -1 --oneline` |        | HEAD / 残留 / 受保护文件 mtime |

### 7.3 如实披露

- **未验证项**：浏览器验证（未做）、P2–P4（未跑、未放行）、A1–A5（挂账）。
- **停机项**：无 / 逐条列。
- **smoke 定性**：若某条断言只证明「请求发出 / 组件渲染」，明确标注 smoke、**不计入防回归覆盖**（清单 §11.4 第 3 条口径）。
- **挂账**：§8 的 7~9 与 3 处小重构、M1/N4 28 条只读素材、Q 口径 / `C-M3-10` /
  2 条候选 anchor / `login-ta-*` 照旧。
- **不得**写「人审侧已验证」「P1 已验收通过」——验收由人审实跑后判定。

---

## 8. 可直接整段复制发出的指令

> 读 `crm-admin/docs/REACT-TEST-INFRA-CHECKLIST.md` **v1.5**、
> `docs/P0-REWORK-ORDER-v2.md` **§10**、`docs/P1-TASK-ORDER.md`（本单）全文、
> `docs/react-test-plan.md` **§8**。
>
> **P1 已由人放行**，按 `P1-TASK-ORDER.md` 执行：第 0 步只读复述 → 第 1 步
> `eslint.config.js` 第 8 行加 `'coverage'` → 第 2 步验证 `test:coverage → lint`
> 顺序解耦 → 第 3/4 步按 §3 六组覆盖契约写 #2~#6 与 #1（**#1 必须 `.test.tsx`
> 进 dom project，断 `await request.text()` 的 POST
> body，不是 URL**）→ 第 5 步 6 组以上实现变异 → 第 6 步全量复核 → 第 7 步按 §7 填回执后**停机**。
>
> 注意两条人审实证（§1）：`apiFormPostBase` 把 flatten 结果放进 **body**；node
> project 对相对 `/api` URL 会 `ERR_INVALID_URL`，**不许**改 `client.ts`
> 导出 flattenParams、不许 mock
> fetch、不许改 vitest 配置绕开。只准落盘 §2.1 的 4 处；`client.ts` /
> `vitest.config.ts` / `setup.ts` / `package.json` / lockfile / 3 个受保护文件 /
> `docs/*.md`
> 一律不动；变异即改即还原、git 零残留。不跑 P2–P4、不做浏览器验证、不 commit/push、不执行夜间协议。命中 §6 任一停机条件就停机回报，不要自行换方案。**只做 P1，做完停机。**

---

## 9. 仍挂账（不要当成已放行）

- §3 A 的 **A1** 测试账号+种子数据、**A2** CI 平台、**A3**
  atlas 更新机制、**A4** e2e 通道裁定、 **A5**
  推广域产品口径 —— 五项都由人给，只卡 P4 / e2e / 契约可信度，**不卡 P1**。
- test-plan §8 的 **7~9**（含 `normalizeVolume` / `buildServerPayload` /
  `date-range` 三处小重构）——按拍板 B 挂账，**本批不做，不是删用例**。
- **P2 / P3a / P3b /
  P4 全部未放行**（11-12 历史状态）；**11-13 更新：P2 已交付并验收通过**
  （`docs/P2-TASK-CARD.md` §6 勿重发、§9 人审记录），P3a / P3b / P4 仍待放行。
- M1/N4 28 条保持只读素材、不解挂、不生成 case.md；Q 口径 / `C-M3-10` /
  2 条候选 anchor / `login-ta-*` testid 欠账照旧。
