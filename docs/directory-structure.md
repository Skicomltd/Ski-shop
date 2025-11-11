# Directory Structure

Key folders and their roles:

- `src/app` – Next.js App Router. Nested routes by locale at `app/[locale]`.
- `src/components` – Reusable UI (ui, shared, core). Storybook ready.
- `src/context` – React context providers.
- `src/HOC` – Higher-order components.
- `src/hooks` – Custom hooks.
- `src/lib` – Framework glue and utilities (i18n, routes, auth, http, storage, theme, tools).
- `src/middleware.ts` – Global middleware for i18n and auth/role routing.
- `src/mocks` – MSW browser/server handlers and provider.
- `src/modules` – Feature modules (play-to-win, tracking).
- `src/schemas` – Zod schemas.
- `src/services` – API callers per domain.
- `src/styles` – Global and tokens.
- `src/types` – Shared TypeScript types.

Public assets live in `public/`.
