# Authentication

Auth.js (NextAuth) with Credentials and Google OAuth (via backend) lives in `src/lib/next-auth/auth.ts`.

- Session strategy: JWT
- Auto refresh: jwt callback decodes exp and refreshes via `/auth/refresh`
- Cookies: `__Secure-authjs.session-token` in production; middleware reads the same
- Pages: custom sign-in at `/login`

## Environment
- `AUTH_SECRET` (or `NEXTAUTH_SECRET`)
- `NEXT_PUBLIC_BASE_URL` pointing to API server

## Server usage

```ts
import { auth } from "@/lib/next-auth/auth";

const session = await auth();
```

## Client usage

```tsx
"use client";
import { signIn, signOut } from "@/lib/next-auth/auth";

await signIn("credentials", { email, password });
await signOut();
```

## Route protection

- `src/middleware.ts` performs primary checks and redirects.
- Route patterns live in `src/lib/routes/routes.ts`.
