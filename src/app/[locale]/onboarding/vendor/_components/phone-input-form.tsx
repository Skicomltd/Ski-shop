"use client";

import SkiButton from "@/components/shared/button";
import { PhoneInput } from "@/components/shared/inputs/phone-input";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useDecodedSearchParameters } from "@/hooks/use-search-parameters";
import { usePhoneVerificationService } from "@/services/externals/onboarding/use-onboarding-user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema for form validation
const FormSchema = z.object({
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
});

export const PhoneInputForm = () => {
  const token = useDecodedSearchParameters("token");
  const locale = useLocale();
  const router = useRouter();
  const { phoneService } = usePhoneVerificationService();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = methods;

  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  const phoneNumber = watch("phoneNumber");

  const handleSubmitForm = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);

    try {
      // Ensure phone number is in E.164 format
      const formattedPhone = data.phoneNumber.startsWith("+") ? data.phoneNumber : `+${data.phoneNumber}`;

      // Send OTP via Firebase
      const result = await phoneService.sendPhoneOTP(formattedPhone);

      if (result?.success) {
        toast.success("Verification code sent to your phone");
        // Check if current route includes 'vendor' to determine redirect path
        const currentPath = window.location.pathname;
        const isVendorFlow = currentPath.includes("/vendor");

        const redirectPath = isVendorFlow
          ? `/${locale}/onboarding/vendor/verify-phone?phone=${encodeURIComponent(formattedPhone)}&token=${token}`
          : `/${locale}/onboarding/verify-phone?phone=${encodeURIComponent(formattedPhone)}&token=${token}`;
        router.push(redirectPath);
      } else {
        toast.error("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send verification code";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-4 text-center">
        {/* <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <MdPhone className="text-primary h-8 w-8" />
        </div> */}
        <div className="space-y-2">
          <h2 className="text-foreground !text-2xl font-semibold">Verify Your Phone Number</h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            Please enter your phone number. We&apos;ll send you a verification code to confirm your number.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full space-y-6">
          <FormField
            control={methods.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormControl className="w-full">
                  <PhoneInput
                    defaultCountry="NG"
                    className="!w-full !shadow-none"
                    inputClassName="!h-14 !shadow-none"
                    buttonClassName="!h-14 !shadow-none"
                    placeholder="Enter your phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="space-y-4">
            <SkiButton
              type="submit"
              className="w-full font-medium transition-all duration-200 hover:shadow-md"
              variant="primary"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              isLeftIconVisible
              icon={<MdSend />}
            >
              Send Verification Code
            </SkiButton>
          </div>
        </form>
      </FormProvider>

      {/* reCAPTCHA container - visible for debugging */}
      <div className="w-full">
        <div id="recaptcha-container" className="flex justify-center"></div>
      </div>

      {/* Info Section */}
      <div className="bg-muted/50 space-y-2 rounded-lg p-4 text-center">
        <p className="text-muted-foreground text-[10px]">
          We&apos;ll send a 6-digit verification code to this number via SMS.
        </p>
        <p className="text-muted-foreground text-[10px]">Standard messaging rates may apply.</p>
      </div>

      {/* Test Numbers Info - Development Only */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="space-y-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
            🧪 Development Mode - Test Numbers
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">Use these test numbers (no SMS sent):</p>
          <ul className="space-y-1 text-left text-xs text-yellow-700 dark:text-yellow-300">
            <li>
              • <strong>+234 902 055 1592</strong> → Code: <strong>123456</strong>
            </li>
            <li>
              • <strong>+234 810 079 2853</strong> → Code: <strong>123098</strong>
            </li>
          </ul>
          <p className="mt-2 text-xs text-yellow-600 italic dark:text-yellow-400">
            Note: Firebase billing must still be enabled even for test numbers.
          </p>
        </div>
      )} */}
    </div>
  );
};
