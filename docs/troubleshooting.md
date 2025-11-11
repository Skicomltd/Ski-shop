# Troubleshooting

## Locale redirects loop
Ensure paths include a locale prefix and middleware excludes static paths.

## Unauthorized redirects
Check role patterns in `src/lib/routes/routes.ts` and the token role in session.

## Mock handlers not applied
Confirm `NEXT_PUBLIC_ENABLE_MOCK=true` and worker file exists in `public/`.

## Images not loading
Add host to `images.remotePatterns` in `next.config.ts`.

## Auth refresh failing
Verify `/auth/refresh` backend endpoint and that `AUTH_SECRET` is consistent. Look for `RefreshAccessTokenError` in the session.
