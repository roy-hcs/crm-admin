# Project: crm-admin

## Commands

pnpm dev # Start dev server (Vite) pnpm build # tsc + Vite production build pnpm
lint # ESLint pnpm typecheck # TypeScript check only pnpm format:fix #
Prettier + ESLint auto-fix

## Stack

- React + TypeScript + Vite
- TanStack Query for server state; React Router DOM for routing
- Radix UI + Tailwind CSS + shadcn/ui (see `components.json`)
- React Hook Form + Zod for forms
- i18next for i18n (en/zh, locales in `src/locales/`)

## Architecture

- `src/api/client.ts` — `fetchWithAuth` wrapper; base URL is `/api` (proxied by
  Vite)
- `src/api/hooks/` — React Query hooks, organized by domain
- `src/pages/` — Page components, organized by domain
- `src/routes/` — Route definitions split by domain, assembled in `index.tsx`
- `src/components/` — Shared UI components
- `src/lib/utils.ts` — `cn()` and other utilities

## Conventions

- Auth uses session cookies, not tokens (ignore `authToken` in localStorage —
  legacy)
- All i18n strings go through i18next keys (e.g. `t('common.enable')`)
- Use `cn()` from `src/lib/utils.ts` for className merging
- New API hooks go under `src/api/hooks/<domain>/`
- comment with chinese

## 无人值守 / 夜间任务协议

长时间任务（尤其夜间免费时段）执行时必须遵守：

1. 断点落盘：每完成一个可验证的步骤，更新
   `TASK_STATE.md`（当前状态/断点/下一步）并 git commit（小步快提交）。
2. 心跳：执行期间把当前时间写入
   `.zcode/night/LOCK`（每完成一个主要步骤至少一次），供定时班车判断是否有活跃运行。
3. 禁用子代理（Agent/Task 工具）：夜间供应商限流，并行请求会高频触发"系统繁忙"。
4. 遇到"系统繁忙，请切换模型"等报错属供应商临时故障：不要改变计划、不要空转重试；Stop 钩子会自动退避续跑；若最终仍被中断，下一班定时任务会从
   `TASK_STATE.md` 接续。
5. 全部完成时：把 `TASK_STATE.md` 的当前状态改为
   `MISSION_COMPLETE`，并创建空文件 `.zcode/night/MISSION_DONE`。
6. 夜间无人在场：不要向用户提问。如必须人工决策，写入 `TASK_STATE.md`
   的"待人工决策"一节，然后继续能做的部分。
