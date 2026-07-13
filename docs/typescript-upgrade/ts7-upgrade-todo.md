# TypeScript 5.8.3 → 7.0 升级 TODO

> 配套文档：[ts7-upgrade-baseline.md](./ts7-upgrade-baseline.md)（升级前基准数据）
>
> **升级路径**：推荐 `5.8 → 6.0 → 7.0`（经 6.0 过渡，可用 `ignoreDeprecations` 暴露弃用项）。
> 若选择**直接跳 7.0**：跳过 Phase 1，但失去 `ignoreDeprecations` 安全网，所有问题会在 Gate 2 一次性暴露。

## 阅读说明

- 每个 Phase 末尾有 **Gate**（检查关卡）。
- **⛔ Gate 不通过 = 禁止进入下一阶段**，需先修复或回滚（见文末 [回滚预案](#回滚预案)）。
- 关键 Gate（Gate 2、Gate 4）专门拦截「升级后大量新增 TS 报错」「TS 跑不通」这两类情况。
- 基线对照值（来自 baseline 文档）：`tsc --noEmit` 中位数 **22.49s**，类型错误数 **0**。

---

## Phase 0 — 准备

- [ ] 确认基准已采集：[ts7-upgrade-baseline.md](./ts7-upgrade-baseline.md) 各指标已填
- [ ] 从 `develop` 拉升级分支：`git checkout -b chore/upgrade-typescript-7`
- [ ] 记录环境快照：TS `5.8.3` / Node `v20.19.0` / 后续全程锁定同一 Node 版本
- [ ] 确认工作区干净：`git status` 无未提交改动
- [ ] 关闭 VSCode 已打开的 TS 重型分析（减少干扰），准备好可随时 `git restore` 回退

**Gate 0**
- ✅ 基准文件完整、分支已建、工作区 clean
- ⛔ 基准缺失或工作区脏 → 不开始

---

## Phase 1 — 过渡到 TS 6.0（暴露弃用项）

> 目的：用 6.0 把“7.0 会变硬错误”的弃用项先暴露出来，借助 `ignoreDeprecations: "6.0"` 逐步修。

- [ ] 安装 TS 6.0 最新版：`pnpm add -D typescript@~6.0`
- [ ] 临时加 `"ignoreDeprecations": "6.0"`（仅过渡期，三个 tsconfig 都加）
- [ ] 跑一次 `pnpm exec tsc --noEmit`，收集所有 deprecation 警告

**移除已知硬阻塞项（TS 7.0 会直接报错）：**
- [ ] 删除 [tsconfig.json](../../tsconfig.json) 的 `"baseUrl": "."`（保留 `paths`，无 baseUrl 时相对 tsconfig 目录解析）
- [ ] 删除 [tsconfig.app.json](../../tsconfig.app.json) 的 `"baseUrl": "."`
- [ ] 核对 `@/*` 别名仍生效（Vite 侧 [vite.config.ts](../../vite.config.ts) 独立配置，理论上不受影响——实测确认）

**排查其它弃用项（本项目预计没有，但需确认）：**
- [ ] 无 `importsNotUsedAsValues` / `preserveValueImports`（已用 `verbatimModuleSyntax` 替代 ✓）
- [ ] 无 `outFile`
- [ ] 无旧式 `moduleResolution`（已用 `bundler` ✓）

- [ ] 全部弃用项解决后，**移除 `ignoreDeprecations: "6.0"`**，确认无新告警

**Gate 1**
- [ ] `pnpm exec tsc --noEmit` 退出码为 0
- [ ] 错误数 = 基线 = **0**：`pnpm exec tsc --noEmit 2>&1 | grep -c "error TS"` 返回 0
- [ ] 无 deprecation 告警：`pnpm exec tsc --noEmit 2>&1 | grep -i deprecat` 为空
- [ ] `@/*` 别名在 typecheck 中正常解析
- ⛔ 出现新错误或无法解决的弃用项 → 停在 6.0，不进 7.0；先逐条修复

---

## Phase 2 — 升级到 TS 7.0

- [ ] 升级 TS：`pnpm add -D typescript@7`
- [ ] 确认版本：`pnpm exec tsc --version` → `Version 7.x`
- [ ] 跑全量类型检查：`pnpm exec tsc --noEmit`
- [ ] 跑构建闸门：`pnpm exec tsc -b`（确认增量编译能跑通）

**重点关注 TS 7.0 的破坏性变更：**
- [ ] 类型级字符串工具（UTF-16 → 码点变更）是否产生新错误——本项目此前 grep 未发现此类用法，预计不受影响
- [ ] 任何“诊断变严”导致的新错误，逐条确认是真实问题还是 TS 行为差异

**Gate 2（关键关卡 — 拦截「大量新增报错 / TS 跑不通」）**
- [ ] `pnpm exec tsc --noEmit` 退出码为 0
- [ ] **错误数 = 基线 = 0**：`pnpm exec tsc --noEmit 2>&1 | grep -c "error TS"` 返回 0
- [ ] `pnpm exec tsc -b` 成功（产出 `tsconfig.tsbuildinfo`，退出码 0）
- ⛔ **大量新增 TS 报错** → 不要继续。先判断来源：
  - 若是 UTF-16 字符串类型变更 → 修对应工具类型
  - 若是推断变严 → 评估是否需 `// @ts-expect-error` 或补类型
  - 无法快速解决 → **回滚到 Phase 1 的 6.0 状态**，分批迁移
- ⛔ **`tsc -b` 跑不通 / 崩溃** → 回滚到 6.0，记录问题，等 TS 7.0 patch 版本

---

## Phase 3 — 生态工具适配

> 这是本项目**最大的不确定性**：typescript-eslint 通过 TS 编译器 API 读 Program，需确认对 Go 原生编译器兼容。

- [ ] 升级 typescript-eslint 到支持 TS 7.0 的版本（8.63.0+）：`pnpm add -D typescript-eslint@latest`
- [ ] 跑全量 lint：`pnpm lint`（[package.json](../../package.json) → `eslint . --ext ts,tsx`）
- [ ] 验证 `tsc-files`（lint-staged 在用）兼容性：手动 stage 一个 ts 文件，跑 `pnpm exec tsc-files --noEmit <file>` 看是否正常
- [ ] 配置 VSCode 工作区使用项目 TS SDK：`.vscode/settings.json` 加 `"typescript.tsdk": "node_modules/typescript/lib"`，确认编辑器诊断与构建一致
- [ ] 触发一次完整的 lint-staged（`git add` 一个文件后 commit 试跑）确认 pre-commit 钩子不报错

**Gate 3**
- [ ] `pnpm lint` 通过，无新增 lint 错误
- [ ] `tsc-files` 能正常对单文件做类型检查
- [ ] lint-staged / pre-commit 钩子跑通
- [ ] VSCode 编辑器诊断与 `tsc` 一致（无“编辑器报错但构建不报”或反之）
- ⛔ typescript-eslint 与 TS 7.0 不兼容（lint 报 unrelated 错）→ 暂时把 typescript-eslint 固定到兼容版本，或暂停升级等生态跟进
- ⛔ tsc-files 崩溃 → lint-staged 中临时替换为别的方案或降级处理

---

## Phase 4 — 验证与性能复测

- [ ] 端到端构建：`pnpm build` 成功，`dist/` 正常产出
- [ ] 开发服务器：`pnpm dev` 能起，HMR 正常
- [ ] 冒烟测试关键流程（手动）：
  - [ ] 登录页
  - [ ] 一个含表格 + 列控制的页面（如账号管理）
  - [ ] 一个含复杂表单（RrhForm + Zod）的弹窗
  - [ ] 一个含图表的报表页
- [ ] 用 baseline 文档附录脚本复测性能，填入下表

| 指标 | 升级前 | 升级后 | 倍率 |
|---|---|---|---|
| `tsc --noEmit` | 22.49s | _____ | __ |
| `tsc -b` 冷 | 27.05s | _____ | __ |
| `tsc -b` 热 | 23.27s | _____ | __ |
| `pnpm build` 冷 | 39.31s | _____ | __ |
| 类型错误数 | 0 | _____ | — |

**Gate 4（关键关卡 — 拦截「构建/运行时回归」）**
- [ ] `pnpm build` 退出码 0
- [ ] `pnpm dev` 可正常启动与热更
- [ ] 冒烟测试 4 个关键流程无运行时错误
- [ ] 类型错误数仍 = 0
- [ ] 性能：`tsc --noEmit` 明显快于 22.49s（若不升反降 → 异常，需排查）
- ⛔ **构建失败** → 修；修不好回滚到 6.0
- ⛔ **运行时崩 / 冒烟流程报错** → 排查（注意：vite 用 esbuild 转译，TS 版本理论上不影响产物；若确有差异，重点查 emit 相关配置）

---

## Phase 5 — 收尾

- [ ] 更新 baseline 文档的「升级后」列与本文件的性能表
- [ ] 清理过渡期产物（确认 `ignoreDeprecations` 已移除、无遗留临时配置）
- [ ] 确认 `git status` 干净，改动均在升级分支
- [ ] 开 PR，描述里贴「前/后性能对比表」与「关键检查结论」
- [ ] （可选）若团队达成共识，更新 [CLAUDE.md](../../CLAUDE.md) 中的 TS 版本说明

---

## 回滚预案

任意 Gate 反复无法通过时：

1. **回滚依赖**：`git checkout develop -- package.json pnpm-lock.yaml && pnpm install`
2. **回滚配置**：`git checkout develop -- tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts`
3. 确认 `pnpm exec tsc --noEmit` 恢复 0 错误、`pnpm build` 通过
4. 把卡住的问题（哪一步、什么报错）记录到本文件末尾的「升级受阻日志」，留待后续版本重试

## 升级受阻日志

> （遇到 Gate 未通过时在此记录：阶段 / 现象 / 根因 / 处理，便于下次重试）

### [已解决] Phase 1 / Gate 1 — TS 6.0 新增 `process` 报错

- **阶段**：Phase 1，升级到 TS 6.0.3 后。
- **现象**：`tsc --noEmit` 由基线 0 错误变为 1 错误：`src/i18n/i18n.ts(22,12): error TS2591: Cannot find name 'process'`。
- **根因**：TS 6.0 不再为浏览器侧 tsconfig 自动注入 `@types/node` 的全局 `process`（5.8.3 会自动注入）。`i18n.ts` 用了 `process.env.NODE_ENV`。
- **处理**：改用项目既有约定 `import.meta.env.DEV`（`tanstack-query.ts` 已在用 `import.meta.env.PROD`，`vite-env.d.ts` 已 reference `vite/client` 提供类型）。单行改动，语义等价，无需引 node 类型。
- **结论**：Gate 1 通过，0 错误 / 0 弃用。该改动一并适用于 TS 7.0。

### [暂停] Phase 3 / Gate 3 — typescript-eslint 不支持 TS 7.0

- **阶段**：Phase 3，TS 7.0.2 + typescript-eslint 8.63.0。
- **现象**：`pnpm lint` 崩溃，`TypeError: Cannot read properties of undefined (reading 'Cjs')` at `@typescript-eslint/typescript-estree/dist/create-program/shared.js`。
- **根因**：TS 7.0 Go 原生编译器改变了内部 API，typescript-estree 读取 `ModuleKind.Cjs` 之类属性时为 `undefined`。typescript-eslint 全系（含 canary `8.63.1-alpha.16`）声明 peer `<6.1.0`，未支持 TS 7.0。
- **处理**：经评估**暂停于 TS 6.0.3**（typecheck / lint / build / pre-commit 全绿），保留全部向前兼容改动；等 typescript-eslint 支持 7.0 后按「下次升级 checklist」一步升 7.0.2。
- **跟踪**：[typescript-eslint#12518](https://github.com/typescript-eslint/typescript-eslint/issues/12518)。
- **6.0.3 落点已验证**（Phase 4）：`pnpm build` exit 0（40s）、`pnpm dev` HTTP 200、`tsc-files` OK。详见 baseline 文档「升级结果记录」。
- **6.0.3 相比 5.8.3 的得失**：typecheck -8%（20.66s vs 22.49s）、推断更准、7.0 就绪；唯一破坏性变更（`process` 报错）已修，无回归。利大于弊。
