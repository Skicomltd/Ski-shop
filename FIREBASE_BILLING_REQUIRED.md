# Firebase Billing Requirement

## ⚠️ BILLING_NOT_ENABLED Error

If you see this error, it means Firebase Phone Authentication requires billing to be enabled.

### Why This Happens

Firebase Phone Auth is **NOT available on the free Spark plan**. It requires the **Blaze (Pay-as-you-go)** plan.

### How to Fix (5 minutes)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Click "Upgrade" in the left sidebar**
4. **Choose "Blaze (Pay-as-you-go)" plan**
5. **Add billing information** (credit card required)
6. **Confirm upgrade**

### 💰 Cost Information

**Good news: It's mostly FREE!**

- **Free tier**: 10,000 phone verifications per month
- **After free tier**: $0.01 - $0.06 per verification (varies by country)
- **No monthly fee**: You only pay for what you use beyond free tier

**Example:**
- If you have 500 users/month verifying phones = **$0** (within free tier)
- If you have 15,000 users/month = **$0** for first 10K, then ~$50-$300 for remaining 5K

### For Development

**Use Test Phone Numbers** to avoid SMS costs:

1. Firebase Console → **Authentication** → **Sign-in method** → **Phone**
2. Scroll to **Phone numbers for testing**
3. Add test numbers:
   - Phone: `+1 650-555-1234`
   - Code: `123456`
   - Click **Add**

These test numbers work without sending real SMS and don't count toward your quota.

### Alternative Solutions

If you cannot enable billing:

1. **Option 1**: Use Email verification only (already implemented)
2. **Option 2**: Implement SMS via third-party (Twilio, AWS SNS, etc.)
3. **Option 3**: Skip phone verification for now, add later

### Need Help?

- Firebase Pricing: https://firebase.google.com/pricing
- Phone Auth Pricing: https://firebase.google.com/docs/auth/pricing
- Contact: Your project lead or DevOps team

---

**Once billing is enabled, the phone verification will work immediately. No code changes needed.**
