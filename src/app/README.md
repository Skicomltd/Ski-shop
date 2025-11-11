# App Directory

Next.js App Router entry point. Localized routes live under `app/[locale]/`. Use nested layouts for shared UI and server components by default.

## Structure Tips
- Keep each route folder lightweight.
- Use server components unless you need client interactivity.
- Move complex UI into `src/components`.
- Avoid deep nesting beyond 3 levels.
