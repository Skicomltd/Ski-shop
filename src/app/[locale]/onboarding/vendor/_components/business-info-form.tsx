"use client";

import SkiButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { PhoneInput } from "@/components/shared/inputs/phone-input";
import { ComboBox } from "@/components/shared/select-dropdown/combo-box";
import { FormControl, FormItem, FormField as UIFormField } from "@/components/ui/form";
import { countries } from "@/lib/constants";
import { BusinessInfoFormData, businessInfoSchema } from "@/schemas";
import { useOnboardingUserService } from "@/services/externals/onboarding/use-onboarding-user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export const BusinessInfoForm = () => {
  const locale = useLocale();
  const router = useRouter();
  const methods = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      type: "",
      businessRegNumber: "",
      contactNumber: "",
      address: "",
      country: "",
      state: "",
      kycVerificationType: "",
      identificationNumber: "",
    },
  });

  // Onboarding user service hook
  const { useUpdateBusinessInfo } = useOnboardingUserService();
  const { mutateAsync: updateBusinessInfo, isPending } = useUpdateBusinessInfo();

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (formData: BusinessInfoFormData) => {
    await updateBusinessInfo(formData, {
      onSuccess: (response) => {
        if (response?.success && response?.data?.token) {
          toast.success("Business information updated successfully");
          router.push(`/${locale}/onboarding/vendor/store-setup?token=${response?.data?.token}`);
        }
      },
    });
  };

  const renderHeader = () => (
    <div className="mb-6 text-center">
      <h2 className="text-high-grey-II mb-2 text-xl font-semibold sm:text-2xl">Basic Business Info</h2>
      <p className="text-high-grey-II text-sm sm:text-base">
        Please provide your business details to continue. This helps us verify and tailor your experience on Ski-Shop.
      </p>
    </div>
  );

  const renderBusinessFields = () => (
    <>
      {/* Business Type */}
      <div className="space-y-2">
        <FormField
          placeholder="Select business type"
          className="!h-14 w-full"
          name="type"
          type="select"
          options={[
            { label: "Individual", value: "individual" },
            { label: "Partnership", value: "partnership" },
            { label: "Corporation", value: "corporation" },
            { label: "LLC", value: "llc" },
            { label: "Other", value: "other" },
          ]}
        />
        {methods.formState.errors.type && (
          <p className="text-sm text-red-500">{methods.formState.errors.type.message}</p>
        )}
      </div>

      {/* Registration Number */}
      <div className="space-y-2">
        <FormField
          placeholder="Business Registration Number (optional)"
          className="h-14 w-full"
          name="businessRegNumber"
        />
      </div>
    </>
  );

  const renderContactFields = () => (
    <>
      {/* Contact Phone - Full Width */}
      <div className="space-y-2 lg:col-span-2">
        <UIFormField
          control={methods.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormControl className="w-full">
                <PhoneInput
                  defaultCountry="NG"
                  className="!w-full !shadow-none"
                  inputClassName="!h-14 !shadow-none"
                  buttonClassName="!h-14 !shadow-none"
                  placeholder="Enter a phone number"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {methods.formState.errors.contactNumber && (
          <p className="text-sm text-red-500">{methods.formState.errors.contactNumber.message}</p>
        )}
      </div>

      {/* Business Address - Full Width */}
      <div className="space-y-2 lg:col-span-2">
        <FormField placeholder="Business Address" className="h-14 w-full" name="address" />
      </div>
    </>
  );

  const renderLocationFields = () => (
    <>
      {/* Country */}
      <div className="space-y-2">
        <ComboBox
          options={countries}
          value={methods.watch("country")}
          onValueChange={(value) => methods.setValue("country", value)}
          placeholder="Select country"
          searchPlaceholder="Search countries..."
          emptyMessage="No country found."
          className="text-mid-grey-II h-14 w-full rounded-lg shadow-none"
        />
        {methods.formState.errors.country && (
          <p className="text-sm text-red-500">{methods.formState.errors.country.message}</p>
        )}
      </div>

      {/* State */}
      <div className="space-y-2">
        <FormField
          placeholder="Select state"
          className="!h-14 w-full"
          name="state"
          type="select"
          options={[
            { label: "Jos", value: "jos" },
            { label: "Lagos", value: "lagos" },
          ]}
        />
        {methods.formState.errors.state && (
          <p className="text-sm text-red-500">{methods.formState.errors.state.message}</p>
        )}
      </div>
    </>
  );

  const renderKycFields = () => (
    <>
      {/* KYC Verification Type */}
      <div className="space-y-2">
        <FormField
          placeholder="Select KYC verification type"
          className="!h-14 w-full"
          name="kycVerificationType"
          type="select"
          options={[
            { label: "Passport", value: "passport" },
            { label: "Driver's License", value: "drivers-license" },
            { label: "National ID", value: "national-id" },
            { label: "Other", value: "other" },
          ]}
        />
        {methods.formState.errors.kycVerificationType && (
          <p className="text-sm text-red-500">{methods.formState.errors.kycVerificationType.message}</p>
        )}
      </div>

      {/* Identification Number */}
      <div className="space-y-2">
        <FormField placeholder="Identification Number" className="h-14 w-full" name="identificationNumber" />
      </div>
    </>
  );

  const renderSubmitButton = () => (
    <section>
      <SkiButton
        type="submit"
        className="h-12 w-full sm:h-14"
        variant="primary"
        isDisabled={isPending || !isValid}
        isLoading={isPending}
      >
        Next
      </SkiButton>
    </section>
  );

  const renderBusinessInfoForm = () => (
    <div className="mx-auto w-full max-w-2xl">
      {renderHeader()}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          <section className="grid grid-cols-1 gap-4 sm:gap-2 lg:grid-cols-2">
            {renderBusinessFields()}
            {renderContactFields()}
            {renderLocationFields()}
            {renderKycFields()}
          </section>
          {renderSubmitButton()}
        </form>
      </FormProvider>
    </div>
  );

  return renderBusinessInfoForm();
};
