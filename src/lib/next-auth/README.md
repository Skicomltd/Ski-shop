# Auth.js Setup

Configuration for Auth.js (NextAuth) lives in `auth.ts`.

- Providers: Credentials, Google via backend callback
- Session: JWT with refresh handled in `jwt` callback
- Cookies: secure in production with `__Secure-` prefix
- Pages: custom `/login`

See also: `docs/authentication.md` and `src/middleware.ts` for route protection.
