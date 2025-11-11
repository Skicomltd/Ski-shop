# Conventions

- TypeScript strict mode; keep types near usage in `src/types` when shared.
- Absolute imports via `@/*` and `~/*`.
- Use React Server Components by default; opt into Client with "use client".
- Keep API calls in `src/services` or `src/lib/http`.
- Prefer Zod for schema validation in `src/schemas`.
- Use TanStack Query for caching and mutations.
- Keep environment access on server where possible.
