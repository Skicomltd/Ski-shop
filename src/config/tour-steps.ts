import { DriveStep } from "driver.js";

// Shared, lightweight intro copy used across tours
const introStep = (title: string, description: string): DriveStep => ({
  popover: {
    title,
    description,
  },
});

// --------------------
// Vendor onboarding
// --------------------

// 1. Vendor – email verification
export const vendorEmailVerificationTourSteps: DriveStep[] = [
  introStep("Confirm your email", "Enter the 6‑digit code we sent so we know it’s really you."),
  {
    element: '[data-tour="verify-email-code-input"]',
    popover: {
      title: "Enter the code",
      description: "Type the 6 digits from your inbox. You can paste them or use your keyboard arrows.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="verify-email-actions"]',
    popover: {
      title: "Having trouble?",
      description: "Use “Resend code” if you don’t see the email after a moment.",
      side: "top",
      align: "center",
    },
  },
];

// 2. Vendor – phone number input
export const vendorPhoneInputTourSteps: DriveStep[] = [
  introStep("Add a phone number", "We’ll send a one‑time code to secure your account and payouts."),
  {
    element: '[data-tour="phone-input-field"]',
    popover: {
      title: "Use an active number",
      description: "Enter a number you can access now. Include the correct country code.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="phone-input-submit"]',
    popover: {
      title: "Send verification code",
      description: "We’ll text a short code to this number. You can always update it later in settings.",
      side: "top",
      align: "center",
    },
  },
];

// 3. Vendor – phone verification (OTP)
export const vendorPhoneVerificationTourSteps: DriveStep[] = [
  introStep("Verify your phone", "Enter the 6‑digit code we sent by SMS to continue."),
  {
    element: '[data-tour="verify-phone-code-input"]',
    popover: {
      title: "Enter SMS code",
      description: "Type the code exactly as it appears in your message.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="verify-phone-resend"]',
    popover: {
      title: "Didn’t get it?",
      description: "Use “Resend code” if the SMS is delayed or missing.",
      side: "top",
      align: "center",
    },
  },
];

// 4. Vendor – business information
export const vendorBusinessInfoTourSteps: DriveStep[] = [
  introStep("Tell us about your business", "Basic details help us verify your store and keep Ski Shop safe."),
  {
    element: '[data-tour="business-info-business"]',
    popover: {
      title: "Business type & registration",
      description: "Choose the type that best fits you and add a registration number if you have one.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="business-info-contact"]',
    popover: {
      title: "Contact details",
      description: "Use a phone and address customers can reach if needed.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="business-info-kyc"]',
    popover: {
      title: "ID for verification",
      description: "Select an ID type and number you’re comfortable sharing for KYC checks.",
      side: "bottom",
      align: "center",
    },
  },
];

// 5. Vendor – store setup
export const vendorStoreSetupTourSteps: DriveStep[] = [
  introStep("Set up your store", "A clear profile helps shoppers recognise and trust your brand."),
  {
    element: '[data-tour="store-setup-details"]',
    popover: {
      title: "Store name & description",
      description: "Pick a name customers will recognise and describe what you sell in a sentence or two.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="store-setup-logo"]',
    popover: {
      title: "Add a logo",
      description: "Upload a clear logo so your store is easy to spot across Ski Shop.",
      side: "bottom",
      align: "center",
    },
  },
];

// 6. Vendor – bank & payout details
export const vendorBankDetailsTourSteps: DriveStep[] = [
  introStep("Add payout details", "We’ll use this account to send your earnings securely."),
  {
    element: '[data-tour="bank-details-bank-select"]',
    popover: {
      title: "Choose your bank",
      description: "Select your bank from the list so we can validate your account.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="bank-details-submit"]',
    popover: {
      title: "Double‑check before continuing",
      description: "Make sure the account name and number are correct to avoid payout issues.",
      side: "bottom",
      align: "center",
    },
  },
];

// --------------------
// Customer onboarding
// --------------------

// 1. Customer – email verification
export const customerEmailVerificationTourSteps: DriveStep[] = [
  introStep("Verify your email", "This helps keep your orders and notifications tied to you."),
  {
    element: '[data-tour="verify-email-code-input"]',
    popover: {
      title: "Enter the code",
      description: "Type the 6‑digit code from your inbox to continue.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="verify-email-actions"]',
    popover: {
      title: "Didn’t get the email?",
      description: "Tap “Resend code” or check your spam folder if it doesn’t arrive soon.",
      side: "top",
      align: "center",
    },
  },
];

// 2. Customer – phone number input
export const customerPhoneInputTourSteps: DriveStep[] = [
  introStep("Add a phone number", "We’ll use this for delivery updates and important alerts only."),
  {
    element: '[data-tour="phone-input-field"]',
    popover: {
      title: "Use your main number",
      description: "Enter the number you prefer for order and delivery notifications.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="phone-input-submit"]',
    popover: {
      title: "Send verification code",
      description: "We’ll text a short code to confirm it’s really your number.",
      side: "top",
      align: "center",
    },
  },
];

// 3. Customer – phone verification (OTP)
export const customerPhoneVerificationTourSteps: DriveStep[] = [
  introStep("Verify your phone", "A quick SMS check helps keep your account secure."),
  {
    element: '[data-tour="verify-phone-code-input"]',
    popover: {
      title: "Enter the SMS code",
      description: "Type the 6‑digit code you just received by text.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="verify-phone-resend"]',
    popover: {
      title: "Code not arriving?",
      description: "Use “Resend code” if the message is slow to appear.",
      side: "top",
      align: "center",
    },
  },
];
