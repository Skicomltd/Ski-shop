# Firebase Phone Verification - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Firebase Console Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create/Select Project**: Click "Add project" or select existing
3. **⚠️ IMPORTANT - Upgrade to Blaze Plan**:
   - Firebase Phone Auth requires the **Blaze (Pay-as-you-go)** plan
   - Click **Upgrade** in the left sidebar
   - Add billing information (credit card required)
   - **Note**: Free tier includes 10K verifications/month, then $0.01-$0.06 per verification
4. **Enable Phone Auth**:
   - Navigate to **Authentication** → **Sign-in method**
   - Click **Phone** → **Enable** → **Save**
5. **Get Configuration**:
   - Go to **Project Settings** (⚙️ icon)
   - Scroll to **Your apps** section
   - Click **Web icon** (</>)
   - Copy all config values

### 2. Environment Variables

Create/update `.env.local`:

```bash
# Copy from Firebase Console → Project Settings → Your apps → Web app
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Backend Endpoint

Ensure your backend has this endpoint:

**POST** `/auth/verifyphonenumber`

```json
Request: { "code": "firebase_id_token" }
Response: { "success": true, "data": { "token": "jwt_token" } }
```

### 4. Test with Test Phone Numbers

For development (no real SMS):

1. Firebase Console → **Authentication** → **Sign-in method** → **Phone**
2. Scroll to **Phone numbers for testing**
3. Add test number: `+1 650-555-1234` with code `123456`

### 5. Run the App

```bash
pnpm dev
```

Navigate to: http://localhost:3000/[locale]/onboarding/vendor/phone

---

## 📋 Workflow

1. User enters phone number → Firebase sends SMS
2. User enters 6-digit code → Firebase verifies
3. Firebase returns ID token → Backend validates
4. Backend returns JWT → User proceeds to next step

---

## 🔧 Troubleshooting

### "BILLING_NOT_ENABLED" Error
**This is the most common error!**

- ✅ **Upgrade to Blaze Plan**: Go to Firebase Console → Upgrade
- ✅ Add billing information (credit card)
- ✅ Wait 5-10 minutes for billing to activate
- ✅ Free tier: 10,000 verifications/month included

**Cost Info:**
- First 10K verifications/month: **FREE**
- Additional verifications: $0.01-$0.06 each (varies by country)
- Most projects stay within free tier

### "Firebase auth is not initialized"
- ✅ Check all `NEXT_PUBLIC_FIREBASE_*` variables are set
- ✅ Restart dev server after adding env variables

### SMS not received
- ✅ Use E.164 format: `+2348012345678` (not `08012345678`)
- ✅ Check Firebase quota in Console
- ✅ Try test phone numbers first

### reCAPTCHA issues
- ✅ Check browser console for errors
- ✅ Verify domain is whitelisted in Firebase Console
- ✅ Clear browser cache

### Backend verification fails
- ✅ Ensure backend has Firebase Admin SDK configured
- ✅ Check endpoint URL is correct
- ✅ Verify CORS settings

---

## 📚 Full Documentation

See [firebase-phone-verification.md](./firebase-phone-verification.md) for:
- Detailed architecture
- API reference
- Security considerations
- Error handling
- Best practices

---

## ✅ Production Checklist

- [ ] **Firebase upgraded to Blaze (Pay-as-you-go) plan** ⚠️ REQUIRED
- [ ] Billing information added to Firebase project
- [ ] Firebase Phone Auth enabled in production project
- [ ] All environment variables set in Vercel/hosting
- [ ] Backend endpoint deployed and tested
- [ ] Domain whitelisted in Firebase Console
- [ ] Test with real phone numbers
- [ ] Monitor Firebase quota usage (10K/month free tier)
- [ ] Rate limiting configured on backend
- [ ] Error tracking setup (Sentry, etc.)

---

## 🆘 Need Help?

- Firebase Docs: https://firebase.google.com/docs/auth/web/phone-auth
- GitHub Issues: https://github.com/Skicomltd/Ski-shop/issues
- Backend Repo: https://github.com/Skicomltd/ski-shop-backend/issues/30
