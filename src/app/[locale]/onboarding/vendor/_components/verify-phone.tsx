"use client";

import SkiButton from "@/components/shared/button";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useDecodedSearchParameters } from "@/hooks/use-search-parameters";
import { usePhoneVerificationService } from "@/services/externals/onboarding/use-onboarding-user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdPhone, MdRefresh, MdVerified } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema for form validation
const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Verification code must be 6 digits.",
  }),
});

export const VerifyPhoneComponent = () => {
  const phoneNumber = useDecodedSearchParameters("phone");
  // const token = useDecodedSearchParameters("token");
  const locale = useLocale();
  const router = useRouter();
  const { phoneService } = usePhoneVerificationService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Check if we have a confirmation result when component mounts
  useEffect(() => {
    // console.log("📱 VerifyPhoneComponent mounted");
    // console.log("📞 Phone number from URL:", phoneNumber);
    const hasConfirmation = phoneService.hasConfirmationResult();
    // console.log("✅ Has confirmation result:", hasConfirmation);

    if (!hasConfirmation) {
      // console.warn("⚠️ No confirmation result found! User may need to resend code.");
    }
  }, [phoneService, phoneNumber]);

  // Initialize the form
  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await phoneService.verifyPhoneOTP(data.code);
      // console.log(response);

      if (response?.success && response?.data?.token) {
        toast.success("Phone number verified successfully");

        const currentPath = window.location.pathname;
        const isVendorFlow = currentPath.includes("/vendor");

        const redirectPath = isVendorFlow
          ? `/${locale}/onboarding/vendor/business-info?token=${response?.data?.token}`
          : `/${locale}/login`;

        router.push(redirectPath);
      } else {
        toast.error("Phone verification failed. Please try again.");
      }
    } catch (error) {
      // console.error("Error verifying OTP:", error);
      const errorMessage = error instanceof Error ? error.message : "Verification failed";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber) {
      toast.error("Phone number not found. Please go back and try again.");
      return;
    }

    setIsResending(true);

    try {
      const result = await phoneService.resendPhoneOTP(phoneNumber);

      if (result?.success) {
        toast.success("Verification code resent successfully");
      } else {
        toast.error("Failed to resend code. Please try again.");
      }
    } catch (error) {
      // console.error("Error resending OTP:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to resend code";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-4 py-6" data-tour="verify-phone-main">
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-foreground !text-2xl font-semibold">Verify Your Phone Number</h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            We&apos;ve sent a verification code to your phone number to continue your registration.
          </p>
        </div>
      </div>

      {/* Phone Display */}
      {phoneNumber && (
        <div className="bg-muted/50 flex items-center space-x-2 rounded-lg px-4 py-3">
          <MdPhone className="text-muted-foreground h-5 w-5" />
          <span className="text-foreground text-sm font-medium">{phoneNumber}</span>
        </div>
      )}

      {/* Form Section */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full space-y-6">
          <FormField
            control={methods.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <p className="text-foreground text-center text-sm font-medium">Enter Verification Code</p>
                <FormControl>
                  <div className="flex justify-center" data-tour="verify-phone-code-input">
                    <InputOTP maxLength={6} {...field} className="gap-2">
                      <InputOTPGroup className="gap-1 sm:gap-2">
                        <InputOTPSlot
                          index={0}
                          className="focus:border-primary focus:ring-primary/20 h-8 w-8 rounded-lg border-2 text-base font-semibold shadow-none transition-all duration-200 focus:ring-2 sm:h-12 sm:w-12 sm:text-lg"
                        />
                        <InputOTPSlot
                          index={1}
                          className="focus:border-primary focus:ring-primary/20 h-8 w-8 rounded-lg border-2 text-base font-semibold shadow-none transition-all duration-200 focus:ring-2 sm:h-12 sm:w-12 sm:text-lg"
                        />
                        <InputOTPSlot
                          index={2}
                          className="focus:border-primary focus:ring-primary/20 h-8 w-8 rounded-lg border-2 text-base font-semibold shadow-none transition-all duration-200 focus:ring-2 sm:h-12 sm:w-12 sm:text-lg"
                        />
                        <InputOTPSlot
                          index={3}
                          className="focus:border-primary focus:ring-primary/20 h-8 w-8 rounded-lg border-2 text-base font-semibold shadow-none transition-all duration-200 focus:ring-2 sm:h-12 sm:w-12 sm:text-lg"
                        />
                        <InputOTPSlot
                          index={4}
                          className="focus:border-primary focus:ring-primary/20 h-8 w-8 rounded-lg border-2 text-base font-semibold shadow-none transition-all duration-200 focus:ring-2 sm:h-12 sm:w-12 sm:text-lg"
                        />
                        <InputOTPSlot
                          index={5}
                          className="focus:border-primary focus:ring-primary/20 h-8 w-8 rounded-lg border-2 text-base font-semibold shadow-none transition-all duration-200 focus:ring-2 sm:h-12 sm:w-12 sm:text-lg"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormDescription className="text-center text-sm">
                  Please enter the 6-digit code sent to your phone.
                </FormDescription>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="space-y-4">
            <SkiButton
              type="submit"
              className="!bg-primary hover:!bg-primary/90 !h-12 w-full rounded-lg !font-semibold !text-white shadow-sm transition-colors"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              isLeftIconVisible
              icon={<MdVerified />}
            >
              {isSubmitting ? "Verifying..." : "Verify Phone Number"}
            </SkiButton>
          </div>
        </form>
      </FormProvider>

      {/* Resend Code Section */}
      <div className="flex flex-col items-center space-y-3" data-tour="verify-phone-resend">
        <p className="text-muted-foreground text-sm">Didn&apos;t receive the code?</p>
        <button
          onClick={handleResendCode}
          disabled={isResending}
          className="text-primary hover:text-primary/80 flex items-center space-x-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          <MdRefresh className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
          <span>{isResending ? "Resending..." : "Resend Code"}</span>
        </button>
      </div>
    </div>
  );
};
