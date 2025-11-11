# Environment Variables

Core variables:

| Variable | Purpose |
|----------|---------|
| NEXT_PUBLIC_BASE_URL | Base backend URL for axios calls |
| AUTH_SECRET / NEXTAUTH_SECRET | Auth.js encryption/signing secret |
| NEXT_PUBLIC_GOOGLE_MAPS_API_KEY | Google Maps integration |
| NEXT_PUBLIC_ENABLE_MOCK | Toggle MSW mocks globally |
| NEXT_PUBLIC_FALLBACK_TO_MOCK | Use mocks only if backend fails |
| NEXT_PUBLIC_MOCK_* | Enable specific mock handler groups |

Secrets should not be committed. Use `.env.local` and Vercel dashboard for production.
