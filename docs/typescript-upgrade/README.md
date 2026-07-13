# TypeScript 升级归档

本文件夹归档 `crm-admin` 的 TypeScript 版本升级记录，供下次升级参考，避免污染仓库根目录。

## 文件

- [ts7-upgrade-baseline.md](./ts7-upgrade-baseline.md) — 升级前性能基准 + 实际升级结果记录（含 6.0.3 / 7.0.2 实测数据）。
- [ts7-upgrade-todo.md](./ts7-upgrade-todo.md) — 分阶段（Phase 0–5）+ Gate 关卡的升级 checklist，含「升级受阻日志」。

## 当前状态（2026-07-13）

- **TS 版本**：`5.8.3` → **`6.0.3`**（落在 `ts-upgrade` 分支）。
- **7.0 进度**：TS 7.0.2 已验证 typecheck / `tsc -b` 均 0 错，但 **typescript-eslint 尚不支持 TS 7.0**（[typescript-eslint#12518](https://github.com/typescript-eslint/typescript-eslint/issues/12518)），故暂停于 6.0.3。
- **6.0.3 验证**：typecheck 0 错、lint 0 错、`pnpm build` exit 0、`pnpm dev` HTTP 200、pre-commit（tsc-files）OK。
- **下次升级**：待 typescript-eslint 发版支持 TS 7.0 后，按 todo 文档续做 Phase 2–5（6.0.3→7.0.2 已在 Gate 2 验证 0 错）。

## 通用方法论

更通用的「TS 性能检测方案」方法论（关注指标 / 工具 / 注意事项 / 制定方案 / React·Vue·Node·Monorepo 场景）见 Obsidian 笔记：`笔记本/Evernote/TypeScript/性能检测方案.md`。
