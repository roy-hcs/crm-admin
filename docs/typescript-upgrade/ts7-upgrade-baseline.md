# TypeScript 7.0 升级 — 性能基准（升级前）

> 用于对比升级到 TS 7.0（Go 原生编译器）前后的性能差异。**升级后请用相同方法、相同 commit、相同机器复测，填入“升级后”列。**

## 环境快照

| 项 | 值 |
|---|---|
| TypeScript | 5.8.3 |
| Node.js | v20.19.0 |
| 机器 | AMD Ryzen 7 8745HS / 31.3 GB RAM / Windows 11 |
| 分支 / commit | develop |
| 计时工具 | bash `time`（`TIMEFORMAT='%R'`，hyperfine 未安装） |
| 测量日期 | 2026-07-13 |

## 基准数据

| 指标 | 升级前（中位数） | 升级前（明细） | 升级后 |
|---|---|---|---|
| **`tsc --noEmit`**（全量类型检查，无缓存） | **22.49s** | 21.19 / 22.31 / 22.49 / 22.98 / 24.24（5 轮） | _待测_ |
| **`tsc -b`** 冷启动（无 tsbuildinfo） | **27.05s** | 单次 | _待测_ |
| **`tsc -b`** 热启动（incremental，无改动） | **23.27s** | 22.54 / 23.27 / 24.67（3 轮） | _待测_ |
| **`pnpm build`** 冷启动（`tsc -b && vite build`） | **39.31s** | 单次 | _待测_ |
| `vite build` 单独（参照，不受 TS 版本影响） | 14.25s | 单次 | _预期不变_ |
| 类型错误数 | **0**（exit 0） | — | _应保持 0_ |

> 计时方式：`tsc --noEmit` 先跑 1 次未计时的 warmup 预热 OS 文件缓存，再跑 5 轮取中位数；`tsc -b` 热启动跑 3 轮取中位数；冷启动 / 全量构建为单次（冷启动天然单次）。均用本地 `pnpm exec tsc`，已避开 husky / lint-staged 干扰。

## 关键观察

1. **类型检查占总构建约 69%**：`tsc -b` 冷 27.05s 占 `pnpm build` 39.31s 的约 69%，vite 占约 31%。TS 类型检查正是 TS 7.0 加速的部分。
2. **incremental 缓存当前几乎无效**：`tsc -b` 热（23.27s）≈ 冷（27.05s）。原因是根 `tsconfig.json` 没有拆成 composite 项目引用（`references: []`），即使是“热”也几乎做全量检查。
   - 推论：TS 7.0 的全量加速对“冷”和“热”都应近乎等比例生效（热启动不会因为缓存而吃掉提速）。
3. **类型错误数为 0**：基准是干净的，升级后若错误数变化说明 TS 7.0 在诊断层面有差异（质量信号，非性能）。

## 升级后预期（按 Microsoft 宣传的 ~10× 估算）

| 指标 | 升级前 | 预期（10×） |
|---|---|---|
| `tsc --noEmit` | 22.49s | ~2.3s |
| `tsc -b` 冷 | 27.05s | ~2.7s |
| `pnpm build` 冷 | 39.31s | ~17s（vite 14.25s + tsc ~2.7s） |

> 注意：10× 是 Microsoft 对大型项目的宣传口径，本项目实际倍率以升级后实测为准。

## 复测方法（升级后照此执行）

```bash
export TIMEFORMAT='%R'

# 1. 全量类型检查（主指标，5 轮取中位数）
pnpm exec tsc --noEmit >/dev/null 2>&1   # warmup
for i in 1 2 3 4 5; do e=$( { time pnpm exec tsc --noEmit >/dev/null 2>&1 ; } 2>&1 ); echo "run $i: ${e}s"; done

# 2. 增量构建 冷 + 热
find . -maxdepth 2 -name "*.tsbuildinfo" -not -path "*/node_modules/*" -delete
{ time pnpm exec tsc -b >/dev/null 2>&1 ; } 2>&1   # 冷
for i in 1 2 3; do e=$( { time pnpm exec tsc -b >/dev/null 2>&1 ; } 2>&1 ); echo "warm $i: ${e}s"; done

# 3. 端到端
find . -maxdepth 2 -name "*.tsbuildinfo" -not -path "*/node_modules/*" -delete
{ time pnpm build >/dev/null 2>&1 ; } 2>&1
```

## 升级结果记录（2026-07-13）

**结论：暂停于 TS 6.0.3。** TS 7.0 本身验证通过，但 lint 工具链（typescript-eslint）尚未支持 7.0。

### TS 6.0.3（当前落点）实测

| 指标 | 5.8.3 基线 | 6.0.3 | 变化 |
|---|---|---|---|
| `tsc --noEmit` 中位数 | 22.49s | 20.66s（20.39 / 20.66 / 20.93） | **-8%** |
| 类型错误数 | 0 | 0 | — |
| `pnpm lint` | 0 error（36 warn） | 0 error（36 warn） | — |
| `tsc-files`（pre-commit） | OK | OK | — |
| `pnpm build` 冷 | 39.31s | 40s | 持平 |

- 6.0.3 改动：移除 `baseUrl`、`i18n.ts` `process.env`→`import.meta.env.DEV`、typescript-eslint `8.30.1`→`8.63.0`。
- ~8% 提升来自 6.0 新默认 `types: []`（不再无脑加载全部 `@types/*` 全局）+ `libReplacement: false`；本项目 `@types` 仅 6 个，收益中等。

### TS 7.0.2 验证（已验证、未上线）

- `tsc --noEmit`：**exit 0，0 错误**（与基线一致，无回归）。
- `tsc -b`：exit 0，构建模式正常。
- **`pnpm lint` 崩溃**：`@typescript-eslint/typescript-estree` 报 `Cannot read properties of undefined (reading 'Cjs')`——TS 7.0 Go 原生编译器内部 API 变更所致。
- 阻塞 issue：[typescript-eslint#12518](https://github.com/typescript-eslint/typescript-eslint/issues/12518)，截至 2026-07-13 无兼容版本（含 canary `8.63.1-alpha.16`，peer 仍声明 `<6.1.0`）。

### 下次升级（→ 7.0）checklist

1. 确认 typescript-eslint 已发版支持 TS 7.0（订阅 #12518）。
2. `pnpm add -D typescript@7`（6.0.3→7.0.2，Gate 2 已验证 0 错）。
3. `pnpm lint` 不再崩溃 → 升 typescript-eslint 到支持版本。
4. 用本文「复测方法」脚本测 7.0 性能，填回上方「升级后」列（预期 `tsc --noEmit` ~2–3s）。
