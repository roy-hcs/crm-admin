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
