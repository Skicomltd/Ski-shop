# Firebase Phone Verification

This module implements Firebase Phone Authentication for verifying user phone numbers during the vendor onboarding process.

## Overview

The phone verification flow consists of:

1. **User enters phone number** → Firebase sends OTP via SMS
2. **User enters OTP code** → Firebase verifies the code
3. **Firebase returns ID token** → Backend validates and marks phone as verified
4. **Onboarding continues** → User proceeds to next step

## Architecture

### Files Structure

```
src/
├── lib/
│   └── firebase/
│       └── config.ts                 # Firebase initialization and configuration
├── services/
│   └── externals/
│       └── onboarding/
│           ├── phone-verification.service.ts    # Phone auth service
│           └── use-onboarding-user-service.ts   # React hooks
└── app/
    └── [locale]/
        └── onboarding/
            └── vendor/
                └── _components/
                    ├── phone-input-form.tsx     # Phone number input
                    └── verify-phone.tsx          # OTP verification
```

### Components

#### 1. Firebase Configuration (`src/lib/firebase/config.ts`)

Initializes Firebase with environment variables using singleton pattern to prevent multiple initializations.

**Features:**
- Validates Firebase configuration completeness
- Browser-only initialization (SSR safe)
- Singleton pattern for app instance
- Warning logs for missing configuration

#### 2. Phone Verification Service (`src/services/externals/onboarding/phone-verification.service.ts`)

Core service handling Firebase Phone Auth and backend integration.

**Methods:**

- `initializeRecaptcha(containerId: string)`: Initialize invisible reCAPTCHA
- `sendPhoneOTP(phoneNumber: string)`: Send OTP via Firebase
- `verifyPhoneOTP(code: string)`: Verify OTP and send token to backend
- `resendPhoneOTP(phoneNumber: string)`: Resend OTP
- `cleanup()`: Clean up reCAPTCHA resources

**Error Handling:**
- Firebase-specific error messages
- Backend API error handling
- User-friendly error messages

#### 3. Phone Input Form Component

Collects phone number and initiates Firebase authentication.

**Features:**
- Phone number validation (E.164 format)
- Invisible reCAPTCHA integration
- Loading states
- Error handling with toast notifications

#### 4. Verify Phone Component

Handles OTP input and verification.

**Features:**
- 6-digit OTP input with individual slots
- Real-time validation
- Resend functionality
- Backend token submission

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Phone Authentication:
   - Go to **Authentication** → **Sign-in method**
   - Enable **Phone** provider
4. Get your Firebase configuration:
   - Go to **Project Settings** → **General**
   - Scroll to **Your apps** section
   - Select or add a **Web app**
   - Copy the configuration values

### 2. Environment Variables

Add the following to your `.env.local` file:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important:** Replace `your_*` placeholders with actual values from Firebase Console.

### 3. Backend API Endpoint

Ensure your backend has the `/auth/verifyphonenumber` endpoint configured:

**Expected Request:**
```json
{
  "code": "firebase_id_token_here"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "backend_jwt_token",
    "isPhoneVerified": true
  }
}
```

### 4. Testing Phone Numbers (Development)

For development/testing, configure test phone numbers in Firebase Console:

1. Go to **Authentication** → **Sign-in method** → **Phone**
2. Scroll to **Phone numbers for testing**
3. Add test numbers with fixed verification codes

**Example:**
- Phone: `+1 650-555-1234`
- Code: `123456`

## Usage

### Sending OTP

```typescript
import { usePhoneVerificationService } from "@/services/externals/onboarding/use-onboarding-user-service";

const { phoneService } = usePhoneVerificationService();

// Initialize reCAPTCHA (do this once on component mount)
phoneService.initializeRecaptcha("recaptcha-container");

// Send OTP
const result = await phoneService.sendPhoneOTP("+2348012345678");
if (result.success) {
  console.log("OTP sent successfully");
}
```

### Verifying OTP

```typescript
const response = await phoneService.verifyPhoneOTP("123456");
if (response?.success) {
  console.log("Phone verified:", response.data);
}
```

### Resending OTP

```typescript
const result = await phoneService.resendPhoneOTP("+2348012345678");
if (result.success) {
  console.log("OTP resent successfully");
}
```

### Cleanup

```typescript
// Clean up when component unmounts
useEffect(() => {
  return () => {
    phoneService.cleanup();
  };
}, []);
```

## Phone Number Format

Phone numbers must be in **E.164 format**:

- ✅ Correct: `+2348012345678`
- ❌ Wrong: `08012345678`
- ❌ Wrong: `+234 801 234 5678`

The service automatically formats numbers if they don't start with `+`.

## Security Considerations

### 1. reCAPTCHA

- Uses invisible reCAPTCHA to prevent abuse
- Automatically initialized on component mount
- Cleaned up on unmount to prevent memory leaks

### 2. Firebase ID Token

- Short-lived token (1 hour expiry)
- Sent to backend for server-side verification
- Backend should verify token with Firebase Admin SDK

### 3. Rate Limiting

Firebase automatically implements rate limiting:
- Maximum SMS per phone number per day
- Maximum SMS per IP address
- Maximum verification attempts

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `invalid-phone-number` | Phone format incorrect | Use E.164 format |
| `invalid-verification-code` | Wrong OTP entered | Ask user to check code |
| `code-expired` | OTP expired (typically 5 min) | Resend new code |
| `too-many-requests` | Rate limit exceeded | Wait and retry later |
| `quota-exceeded` | Firebase quota exceeded | Check Firebase Console |

### Error Messages

All errors are caught and returned as user-friendly messages:

```typescript
try {
  await phoneService.sendPhoneOTP(phoneNumber);
} catch (error) {
  // Error automatically converted to friendly message
  toast.error(error.message);
}
```

## Workflow Diagram

```
┌─────────────────┐
│  Phone Input    │
│  Form Component │
└────────┬────────┘
         │
         │ User enters phone
         ▼
┌─────────────────┐
│ Initialize      │
│ reCAPTCHA       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Firebase sends  │
│ OTP via SMS     │
└────────┬────────┘
         │
         │ User receives SMS
         ▼
┌─────────────────┐
│ Verify Phone    │
│ Component       │
└────────┬────────┘
         │
         │ User enters OTP
         ▼
┌─────────────────┐
│ Firebase        │
│ verifies OTP    │
└────────┬────────┘
         │
         │ Returns ID Token
         ▼
┌─────────────────┐
│ Backend API     │
│ /verifyphonenumber │
└────────┬────────┘
         │
         │ Returns JWT Token
         ▼
┌─────────────────┐
│ Navigate to     │
│ Business Info   │
└─────────────────┘
```

## Backend Integration

### Expected Backend Flow

1. Receive Firebase ID token from frontend
2. Verify token using Firebase Admin SDK
3. Extract phone number from verified token
4. Update user record with verified phone
5. Mark `isPhoneVerified: true`
6. Return JWT token for next step

### Example Backend Code (Node.js)

```javascript
import admin from 'firebase-admin';

async function verifyPhoneNumber(req, res) {
  const { code } = req.body; // Firebase ID token
  
  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(code);
    const phoneNumber = decodedToken.phone_number;
    
    // Update user in database
    await db.users.update({
      phoneNumber,
      isPhoneVerified: true
    });
    
    // Generate backend JWT
    const jwtToken = generateJWT(user);
    
    res.json({
      success: true,
      data: { token: jwtToken }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Phone verification failed'
    });
  }
}
```

## Troubleshooting

### Issue: "Firebase auth is not initialized"

**Solution:** Ensure all environment variables are set correctly.

```bash
# Check if variables are loaded
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
```

### Issue: reCAPTCHA not working

**Solutions:**
1. Check that `recaptcha-container` div exists in DOM
2. Verify domain is whitelisted in Firebase Console
3. Check browser console for errors

### Issue: SMS not received

**Solutions:**
1. Check phone number format (must be E.164)
2. Verify phone provider is enabled in Firebase
3. Check Firebase quota in Console
4. Try with test phone numbers first

### Issue: Backend verification fails

**Solutions:**
1. Ensure backend has Firebase Admin SDK configured
2. Check backend logs for specific error
3. Verify API endpoint is correct (`/auth/verifyphonenumber`)
4. Check CORS settings if calling from different domain

## Best Practices

1. **Always initialize reCAPTCHA once** on component mount
2. **Clean up resources** on component unmount
3. **Format phone numbers** to E.164 before sending
4. **Handle all error cases** with user-friendly messages
5. **Use test phone numbers** during development
6. **Implement rate limiting** on backend as additional security
7. **Log errors** for debugging but don't expose sensitive info to users

## Future Enhancements

- [ ] Support for reCAPTCHA Enterprise
- [ ] Silent APN verification for iOS
- [ ] Multi-factor authentication (MFA)
- [ ] SMS fallback providers
- [ ] Analytics integration
- [ ] A/B testing for conversion optimization

## References

- [Firebase Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [E.164 Phone Number Format](https://en.wikipedia.org/wiki/E.164)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)

## Support

For issues or questions:
- Check Firebase Console logs
- Review browser console errors
- Check backend API logs
- Consult [Firebase Support](https://firebase.google.com/support)
