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

## Firebase Phone Authentication

Required for phone number verification during vendor onboarding:

| Variable | Purpose | Example |
|----------|---------|---------|
| NEXT_PUBLIC_FIREBASE_API_KEY | Firebase API key | AIzaSyC... |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Firebase auth domain | your-project.firebaseapp.com |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Firebase project ID | your-project-id |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | Firebase storage bucket | your-project.appspot.com |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | Firebase messaging sender ID | 123456789 |
| NEXT_PUBLIC_FIREBASE_APP_ID | Firebase app ID | 1:123456789:web:abc123 |

To get these values:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Project Settings → General
3. Scroll to "Your apps" and select/add a Web app
4. Copy the configuration values

See [firebase-phone-verification.md](./firebase-phone-verification.md) for detailed setup instructions.

---

Secrets should not be committed. Use `.env.local` and Vercel dashboard for production.
