# Routing & Middleware

- Routes live under `src/app/[locale]/...`.
- Middleware at `src/middleware.ts` enforces locale prefix and role-based access.
- Central route patterns in `src/lib/routes/routes.ts`.
- Client/server route guards in `src/lib/routes/`.

## Adding Pages
- Create under `src/app/[locale]/your/page.tsx`.
- Use `Link` from i18n/navigation to keep locale prefix.

## Protected Areas
- vendor: `/dashboard`
- admin: `/admin`
- super-admin: `/super-admin`

Middleware redirects unauthorized users to `/[locale]/login` with callback.
