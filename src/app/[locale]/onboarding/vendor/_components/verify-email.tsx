"use client";

import SkiButton from "@/components/shared/button";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useResendEmail } from "@/hooks/use-resend-email";
import { useDecodedSearchParameters } from "@/hooks/use-search-parameters";
import { useOnboardingUserService } from "@/services/externals/onboarding/use-onboarding-user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { MdEmail, MdRefresh, MdVerified } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema for form validation
const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Verification code must be 6 digits.",
  }),
});

export const VerifyEmailComponent = () => {
  const email = useDecodedSearchParameters("email");
  const locale = useLocale();
  const router = useRouter();
  const { useVerifyOTP } = useOnboardingUserService();
  const { mutateAsync: verifyOTP, isPending: isSubmitting } = useVerifyOTP();
  const { handleResendEmail, isResending } = useResendEmail();
  const pathname = usePathname();
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
    await verifyOTP(
      { code: data.code },
      {
        onSuccess: (response) => {
          if (response?.success && response?.data?.token) {
            if (pathname.includes("/vendor")) {
              toast.success("Email verified successfully");
              router.push(`/${locale}/onboarding/vendor/phone-input?token=${response?.data?.token}`);
            } else {
              router.push(`/${locale}/onboarding/phone-input?token=${response?.data?.token}`);
            }
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-4 py-6" data-tour="verify-email-main">
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-foreground !text-2xl font-semibold">Verify Your Email</h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            We&apos;ve sent a verification code to your email address to complete your registration.
          </p>
        </div>
      </div>

      {/* Email Display */}
      {email && (
        <div className="bg-muted/50 flex items-center space-x-2 rounded-lg px-4 py-3">
          <MdEmail className="text-muted-foreground h-5 w-5" />
          <span className="text-foreground text-sm font-medium">{email}</span>
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
                  <div className="flex justify-center" data-tour="verify-email-code-input">
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
                <FormDescription className="text-muted-foreground text-center text-xs">
                  Enter the 6-digit code sent to your email
                </FormDescription>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3" data-tour="verify-email-actions">
            <SkiButton
              type="submit"
              className="w-full font-medium transition-all duration-200 hover:shadow-md"
              variant={`primary`}
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              isLeftIconVisible
              icon={<MdVerified />}
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </SkiButton>

            <SkiButton
              type="button"
              variant="outline"
              onClick={(event) => {
                event.preventDefault();
                handleResendEmail();
              }}
              isDisabled={isResending}
              className="hover:bg-muted/50 w-full font-medium transition-all duration-200"
              isLeftIconVisible
              icon={<MdRefresh />}
              isLoading={isResending}
            >
              {isResending ? "Sending..." : "Resend Code"}
            </SkiButton>
          </div>
        </form>
      </FormProvider>

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-muted-foreground text-xs">
          Didn&apos;t receive the code? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
};
