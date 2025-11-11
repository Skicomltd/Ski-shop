# Running & Scripts

Common scripts (see package.json):

- `pnpm dev` – Start dev server (Turbopack).
- `pnpm build` – Production build.
- `pnpm start` – Start production server.
- `pnpm lint` – Run linters.
- `pnpm lint:fix` – Fix lint issues and format.
- `pnpm format` – Prettier write.
- `pnpm storybook` – Run Storybook.
- `pnpm build-storybook` – Build Storybook static site.

## Troubleshooting
- Types ignored on build via next.config; run `pnpm lint:strict` locally to catch errors.
- If mocks enabled, ensure `public/mockServiceWorker.js` exists.
