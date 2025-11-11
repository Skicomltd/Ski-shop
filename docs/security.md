# Security

- Store secrets in `.env.local` (dev) and in your hosting provider (prod).
- `AUTH_SECRET` must be strong; rotate if compromised.
- Cookies use `Secure` in production. Serve over HTTPS.
- Only allow image domains in `next.config.ts` via `images.remotePatterns`.
