---
id: architecture
---

# Architecture

This project uses Next.js App Router with localized routing, Auth.js (NextAuth) for auth, next-intl for i18n, TanStack Query for data, MSW for mocks, Tailwind for styling, and Storybook for UI docs.

## High-level

- Requests enter middleware for locale enforcement and access control.
- Pages are under `app/[locale]/...` and can use server or client components.
- Auth flows via `src/lib/next-auth/auth.ts` with JWT strategy and refresh.
- i18n is configured in `src/lib/i18n` and integrated via a plugin in `next.config.ts`.
- Data fetching uses axios and TanStack Query.
- UI uses Radix UI + Tailwind.

## Diagram

```mermaid
flowchart TD
  A[Request] --> B{Middleware}
  B -->|static| C[_next/assets]
  B -->|api| D[API Routes]
  B -->|localized| E[app/[locale]/...]
  E --> F[Server Components]
  E --> G[Client Components]
  G --> H[TanStack Query]
  H --> I[Axios]
  I --> J[(Backend API)]
  B --> K[Auth.js]
```

## Key Decisions

- App Router for layouts and streaming.
- Locale prefix always in path for SEO and clarity.
- JWT sessions for scalability; refresh handled in jwt callback.
- Middleware centralizes redirects to avoid content flicker.
- MSW supports local dev without backend.
