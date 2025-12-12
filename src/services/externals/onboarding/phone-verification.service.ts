/* eslint-disable @typescript-eslint/no-explicit-any */
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
  }

  // Getter and setter to persist confirmationResult
  get confirmationResult(): ConfirmationResult | null {
    return this._confirmationResult;
  }

  set confirmationResult(value: ConfirmationResult | null) {
    this._confirmationResult = value;

    // Store reference in sessionStorage
    if (typeof window !== "undefined") {
      if (value) {
        window.sessionStorage.setItem(
          "firebase_confirmation_result",
          JSON.stringify({
            verificationId: (value as any).verificationId,
            timestamp: Date.now(),
          }),
        );
      } else {
        window.sessionStorage.removeItem("firebase_confirmation_result");
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
        return null;
      }

      // Clean up existing verifier if any
      if (this.recaptchaVerifier) {
        try {
          this.recaptchaVerifier.clear();
        } catch {
          // Silent fail
        }
        this.recaptchaVerifier = null;
      }

      // Use invisible for automatic verification
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber
        },
        "expired-callback": () => {
          // Reset reCAPTCHA if it expires
        },
      });

      return this.recaptchaVerifier;
    } catch {
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
      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }

      // Ensure phone number is in E.164 format
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;

      // Check if this is a test phone number
      const testNumbers = ["+2349020551592", "+2348100792853"];
      const isTestNumber = testNumbers.includes(formattedPhone.replaceAll(/\s/g, ""));

      // Check if recaptcha verifier exists
      if (!this.recaptchaVerifier) {
        const verifier = this.initializeRecaptcha("recaptcha-container");
        if (!verifier) {
          throw new Error("Failed to initialize reCAPTCHA. Please refresh the page.");
        }
      }

      // Render the reCAPTCHA widget
      if (this.recaptchaVerifier) {
        try {
          await this.recaptchaVerifier.render();
        } catch {
          // Silent fail - already rendered
        }
      }

      // Send OTP via Firebase
      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        this.recaptchaVerifier as ApplicationVerifier,
      );

      // Double check it was actually set
      if (!this.confirmationResult) {
        throw new Error("Failed to get confirmation result from Firebase");
      }

      // Store in sessionStorage as backup
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("phone_verification_pending", "true");
        window.sessionStorage.setItem("phone_number", formattedPhone);
      }

      return {
        success: true,
        message: isTestNumber
          ? "Test number - use code from Firebase Console (123456 or 123098)"
          : "Verification code sent successfully",
      };
    } catch (error: any) {
      // Format error message
      let errorMessage = "Failed to send verification code";

      switch (error?.code) {
        case "auth/invalid-phone-number": {
          errorMessage = "Invalid phone number. Use format: +2348012345678";

          break;
        }
        case "auth/too-many-requests": {
          errorMessage = "Too many requests. Please wait a few minutes.";

          break;
        }
        case "auth/quota-exceeded": {
          errorMessage = "SMS quota exceeded. Please try again later.";

          break;
        }
        default: {
          if (error?.message?.includes("billing") || error?.message?.includes("BILLING")) {
            errorMessage =
              "Firebase billing not enabled. Phone auth requires Blaze plan. Note: Test numbers also require billing to be enabled in Firebase.";
          } else if (error?.message) {
            errorMessage = error.message;
          }
        }
      }

      throw new Error(errorMessage);
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
        if (!this.confirmationResult) {
          throw new Error("No verification in progress. Please go back and resend the code.");
        }

        // Verify the code with Firebase
        const userCredential = await this.confirmationResult.confirm(code);

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
    return !!this.confirmationResult;
  }

  /**
   * Clean up reCAPTCHA verifier
   */
  cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }
}
