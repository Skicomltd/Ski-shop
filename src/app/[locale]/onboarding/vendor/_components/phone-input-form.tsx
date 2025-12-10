"use client";

import SkiButton from "@/components/shared/button";
import { PhoneInput } from "@/components/shared/inputs/phone-input";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useDecodedSearchParameters } from "@/hooks/use-search-parameters";
import { useOnboardingUserService } from "@/services/externals/onboarding/use-onboarding-user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { MdPhone, MdSend } from "react-icons/md";
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
  // const { useSendPhoneOTP } = useOnboardingUserService();
  // const { mutateAsync: sendPhoneOTP, isPending: isSubmitting } = useSendPhoneOTP();

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

  const phoneNumber = watch("phoneNumber");

  const handleSubmitForm = async (data: z.infer<typeof FormSchema>) => {
    // Temporary navigation for testing - replace with actual API call
    toast.success("Verification code sent to your phone");
    router.push(
      `/${locale}/onboarding/vendor/verify-phone?phone=${encodeURIComponent(data.phoneNumber)}&token=${token}`,
    );

    // Uncomment when API is ready:
    // await sendPhoneOTP(
    //   { phoneNumber: data.phoneNumber },
    //   {
    //     onSuccess: (response) => {
    //       if (response?.success) {
    //         toast.success("Verification code sent to your phone");
    //         router.push(
    //           `/${locale}/onboarding/vendor/verify-phone?phone=${encodeURIComponent(data.phoneNumber)}&token=${token || response?.data?.token}`
    //         );
    //       }
    //     },
    //   }
    // );
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <MdPhone className="text-primary h-8 w-8" />
        </div>
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
              isDisabled={!isValid}
              isLoading={false}
              isLeftIconVisible
              icon={<MdSend />}
            >
              Send Verification Code
            </SkiButton>
          </div>
        </form>
      </FormProvider>

      {/* Info Section */}
      <div className="bg-muted/50 space-y-2 rounded-lg p-4 text-center">
        <p className="text-muted-foreground text-xs">
          We&apos;ll send a 6-digit verification code to this number via SMS.
        </p>
        <p className="text-muted-foreground text-xs">Standard messaging rates may apply.</p>
      </div>
    </div>
  );
};
