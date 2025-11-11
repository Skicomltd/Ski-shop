# Deployment

## Vercel

- Set environment variables in Vercel dashboard.
- Ensure `AUTH_SECRET` is set (same across middleware and Auth.js).
- Configure Next.js Image Remote Patterns (next.config.ts) for all external image hosts.
- Optional: Enable Speed Insights.

## CI

- Chromatic workflow exists under `note/workflows/chromatic.yml`.
- Add a build step and tests in your CI if needed.

## Production Cookies

Auth cookies are configured with `__Secure-` name in production and `secure` flag enabled. Ensure your domain uses HTTPS.
