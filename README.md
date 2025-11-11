<img alt="Ski Shop" src="public/images/shop/hero.png" width="0" height="0" style="display:none"/>

# Ski Shop

A modern e‑commerce demo built with Next.js App Router, TypeScript, Tailwind, Radix UI, next-intl, Auth.js (NextAuth), TanStack Query, and MSW.

## Quick Start

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

Create `.env.local` (minimal):

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000/api
AUTH_SECRET=replace-with-strong-random
```

## Documentation

Comprehensive docs live in the `docs/` directory:

- Overview: docs/index.md
- Setup: docs/setup.md
- Architecture: docs/architecture.md
- Directory Structure: docs/directory-structure.md
- Environment: docs/environment.md
- Running & Scripts: docs/running-and-scripts.md
- Deployment: docs/deployment.md
- Testing: docs/testing.md
- i18n: docs/i18n.md
- Authentication: docs/authentication.md
- Data Fetching: docs/data-fetching.md
- Styling: docs/styling.md
- Routing & Middleware: docs/routing-and-middleware.md
- Components: docs/components.md
- Modules: docs/modules.md
- Conventions: docs/conventions.md
- Troubleshooting: docs/troubleshooting.md

## Tech Stack

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS 4, Radix UI
- Auth.js (NextAuth) with JWT sessions
- next-intl for i18n with locale-prefixed routes
- TanStack Query for data fetching
- MSW for mocks; Storybook for component docs

## Scripts

See `package.json` or docs/running-and-scripts.md for the full list.

## Google Maps (optional)
If using the contact page map, set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`.
