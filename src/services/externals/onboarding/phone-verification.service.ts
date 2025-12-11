import { auth } from "@/lib/firebase/config";
import { OnboardingHttpAdapter } from "@/lib/http/onboarding-http-adapter";
import { tryCatchWrapper } from "@/lib/tools/tryCatchFunction";
import { isAxiosError } from "axios";
import { ApplicationVerifier, ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export class PhoneVerificationService {
  private readonly http: OnboardingHttpAdapter;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private _confirmationResult: ConfirmationResult | null = null;

  constructor() {
    this.http = new OnboardingHttpAdapter();
    console.log("🏗️ PhoneVerificationService constructor called");
  }

  // Getter and setter to persist confirmationResult
  get confirmationResult(): ConfirmationResult | null {
    if (!this._confirmationResult && typeof window !== "undefined") {
      // Try to restore from sessionStorage
      const stored = window.sessionStorage.getItem("firebase_confirmation_result");
      if (stored) {
        console.log("🔄 Attempting to restore confirmationResult from sessionStorage");
        try {
          const parsed = JSON.parse(stored);
          // Note: We can't fully restore ConfirmationResult object, but we store the verificationId
          console.log("📦 Found stored verification data:", parsed);
        } catch (e) {
          console.error("❌ Failed to parse stored confirmation:", e);
        }
      }
    }
    return this._confirmationResult;
  }

  set confirmationResult(value: ConfirmationResult | null) {
    console.log("💾 Setting confirmationResult:", !!value);
    this._confirmationResult = value;

    // Store reference in sessionStorage
    if (typeof window !== "undefined") {
      if (value) {
        try {
          // Store the verificationId which we can use to track state
          window.sessionStorage.setItem(
            "firebase_confirmation_result",
            JSON.stringify({
              verificationId: (value as any).verificationId,
              timestamp: Date.now(),
            }),
          );
          console.log("✅ Stored confirmation result in sessionStorage");
        } catch (e) {
          console.error("❌ Failed to store confirmation:", e);
        }
      } else {
        window.sessionStorage.removeItem("firebase_confirmation_result");
        console.log("🗑️ Cleared confirmation result from sessionStorage");
      }
    }
  }

  /**
   * Initialize reCAPTCHA verifier for phone authentication
   * @param containerId - The ID of the container element for reCAPTCHA
   */
  initializeRecaptcha(containerId: string): RecaptchaVerifier | null {
    try {
      if (typeof window === "undefined" || !auth) {
        console.error("❌ Firebase auth is not initialized");
        return null;
      }

      // Clean up existing verifier if any
      if (this.recaptchaVerifier) {
        console.log("🧹 Cleaning up existing recaptcha verifier");
        try {
          this.recaptchaVerifier.clear();
        } catch (e) {
          console.warn("Could not clear recaptcha:", e);
        }
        this.recaptchaVerifier = null;
      }

      console.log("🔧 Initializing RecaptchaVerifier with container:", containerId);

      // Use invisible for automatic verification
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber
          console.log("✅ reCAPTCHA verified successfully", response);
        },
        "expired-callback": () => {
          // Reset reCAPTCHA if it expires
          console.log("⚠️ reCAPTCHA expired");
        },
      });

      console.log("✅ RecaptchaVerifier created successfully");
      return this.recaptchaVerifier;
    } catch (error) {
      console.error("❌ Failed to initialize reCAPTCHA:", error);
      return null;
    }
  }

  /**
   * Send OTP to phone number using Firebase Phone Authentication
   * @param phoneNumber - Phone number in E.164 format (e.g., +2348012345678)
   * @returns Promise with confirmation result
   */
  async sendPhoneOTP(phoneNumber: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log("📞 Starting sendPhoneOTP for:", phoneNumber);

      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }

      // Ensure phone number is in E.164 format
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
      console.log("📱 Formatted phone:", formattedPhone);

      // Check if this is a test phone number
      const testNumbers = ["+2349020551592", "+2348100792853"];
      const isTestNumber = testNumbers.includes(formattedPhone.replace(/\s/g, ""));

      if (isTestNumber) {
        console.log("🧪 Test phone number detected:", formattedPhone);
        console.log("💡 Use verification code from Firebase Console: 123456 or 123098");
      }

      // Check if recaptcha verifier exists
      if (!this.recaptchaVerifier) {
        console.log("⚠️ No recaptcha verifier found, initializing...");
        const verifier = this.initializeRecaptcha("recaptcha-container");
        if (!verifier) {
          throw new Error("Failed to initialize reCAPTCHA. Please refresh the page.");
        }

        // Render the reCAPTCHA widget
        try {
          await this.recaptchaVerifier.render();
          console.log("✅ reCAPTCHA widget rendered");
        } catch (renderError) {
          console.warn("⚠️ reCAPTCHA already rendered or error:", renderError);
        }
      }

      console.log("🔄 Calling signInWithPhoneNumber...");

      // Send OTP via Firebase
      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        this.recaptchaVerifier as ApplicationVerifier,
      );

      console.log("✅ signInWithPhoneNumber successful!");
      console.log("✅ Confirmation result:", this.confirmationResult);
      console.log("✅ ConfirmationResult verificationId:", this.confirmationResult?.verificationId);

      // Double check it was actually set
      if (!this.confirmationResult) {
        throw new Error("Failed to get confirmation result from Firebase");
      }

      // Store in sessionStorage as backup
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("phone_verification_pending", "true");
        window.sessionStorage.setItem("phone_number", formattedPhone);
        console.log("💾 Stored verification state in sessionStorage");
      }

      return {
        success: true,
        message: isTestNumber
          ? "Test number - use code from Firebase Console (123456 or 123098)"
          : "Verification code sent successfully",
      };
    } catch (error: any) {
      console.error("❌ Error in sendPhoneOTP:", error);
      console.error("Error code:", error?.code);
      console.error("Error message:", error?.message);

      // Format error message
      let errorMsg = "Failed to send verification code";

      if (error?.code === "auth/invalid-phone-number") {
        errorMsg = "Invalid phone number. Use format: +2348012345678";
      } else if (error?.code === "auth/too-many-requests") {
        errorMsg = "Too many requests. Please wait a few minutes.";
      } else if (error?.code === "auth/quota-exceeded") {
        errorMsg = "SMS quota exceeded. Please try again later.";
      } else if (error?.message?.includes("billing") || error?.message?.includes("BILLING")) {
        errorMsg =
          "Firebase billing not enabled. Phone auth requires Blaze plan. Note: Test numbers also require billing to be enabled in Firebase.";
      } else if (error?.message) {
        errorMsg = error.message;
      }

      throw new Error(errorMsg);
    }
  }

  /**
   * Verify OTP code and send Firebase ID token to backend
   * @param code - The 6-digit OTP code
   * @returns Promise with backend response // if (!this.confirmationResult) {
        //   throw new Error("No verification in progress. Please request a code first.");
        // }
   */ // if (!this.confirmationResult) {
  //   throw new Error("No verification in progress. Please request a code first.");
  // }
  async verifyPhoneOTP(code: string): Promise<ShortTokenResponse> {
    const result = await tryCatchWrapper(
      async () => {
        console.log("🔍 Checking confirmationResult:", !!this.confirmationResult);
        console.log("🔍 ConfirmationResult object:", this.confirmationResult);

        // Check sessionStorage for verification state
        if (typeof window !== "undefined") {
          const hasPendingVerification = window.sessionStorage.getItem("phone_verification_pending");
          const storedPhone = window.sessionStorage.getItem("phone_number");
          console.log("💾 SessionStorage check - pending:", hasPendingVerification, "phone:", storedPhone);
        }

        if (!this.confirmationResult) {
          console.error("❌ No confirmationResult found!");
          console.error("❌ This means signInWithPhoneNumber was never successful or billing is not enabled");
          throw new Error(
            "No verification in progress. Please go back and resend the code. Make sure Firebase billing is enabled.",
          );
        }

        console.log("✅ ConfirmationResult exists, verifying code:", code);

        // Verify the code with Firebase
        const userCredential = await this.confirmationResult.confirm(code);
        console.log("✅ Firebase code verified successfully:", userCredential);

        // Get the Firebase ID token
        const idToken = await userCredential.user.getIdToken();

        // Send the ID token to backend for verification
        const response = await this.http.post<ShortTokenResponse>("/auth/verifyphonenumber", {
          code: idToken,
        });

        if (response?.status === 200 || response?.status === 201) {
          // Clear confirmation result after successful verification
          this.confirmationResult = null;
          return response.data;
        }

        throw new Error("Phone verification failed on backend");
      },
      (error: unknown) => {
        console.error("Error verifying OTP:", error);
        if (isAxiosError(error)) {
          return new Error(error.response?.data?.message || "Phone verification failed");
        }
        if (error instanceof Error) {
          // Handle Firebase-specific errors
          if (error.message.includes("invalid-verification-code")) {
            return new Error("Invalid verification code. Please try again.");
          }
          if (error.message.includes("code-expired")) {
            return new Error("Verification code has expired. Please request a new one.");
          }
          return new Error(error.message || "Phone verification failed");
        }
        return new Error("Unknown error during phone verification");
      },
    );

    if (!result) {
      throw new Error("Phone verification failed");
    }

    if (result instanceof Error) {
      throw result;
    }

    return result;
  }

  /**
   * Resend OTP by repeating the phone sign-in process
   * @param phoneNumber - Phone number in E.164 format
   */
  async resendPhoneOTP(phoneNumber: string): Promise<{ success: boolean; message?: string }> {
    // Reset the confirmation result
    this.confirmationResult = null;

    // Re-initialize reCAPTCHA if needed
    if (!this.recaptchaVerifier) {
      throw new Error("reCAPTCHA verifier not initialized");
    }

    // Send new OTP
    return this.sendPhoneOTP(phoneNumber);
  }

  /**
   * Check if verification is in progress (for debugging)
   */
  hasConfirmationResult(): boolean {
    console.log("🔍 Checking service state:");
    console.log("  - Has recaptchaVerifier:", !!this.recaptchaVerifier);
    console.log("  - Has confirmationResult:", !!this.confirmationResult);
    return !!this.confirmationResult;
  }

  /**
   * Clean up reCAPTCHA verifier
   */
  cleanup() {
    console.log("🧹 Cleaning up PhoneVerificationService");
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }
}
