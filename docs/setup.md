# Setup

## Prerequisites
- Node.js 20+
- pnpm 9+
- A Google Maps API key (optional for contact page)

## Install
```bash
pnpm install
```

## Environment
Create a .env.local file:

```
# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000/api
AUTH_SECRET=replace-with-strong-random

# i18n
NEXT_INTL_LOCALE_PREFIX=always

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key

# Mocks
NEXT_PUBLIC_ENABLE_MOCK=false
NEXT_PUBLIC_FALLBACK_TO_MOCK=false
NEXT_PUBLIC_LOG_MOCK_REQUESTS=false
NEXT_PUBLIC_MOCK_PRODUCTS=false
NEXT_PUBLIC_MOCK_USERS=false
NEXT_PUBLIC_MOCK_CARTS=false
NEXT_PUBLIC_MOCK_DASHBOARD=false
```

## Run
```bash
pnpm dev
```

Open http://localhost:3000.
