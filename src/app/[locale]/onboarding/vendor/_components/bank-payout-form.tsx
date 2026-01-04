"use client";

import SkiButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { ComboBox } from "@/components/shared/select-dropdown/combo-box";
import { BankPayoutFormData, bankPayoutSchema } from "@/schemas";
import { useOnboardingUserService } from "@/services/externals/onboarding/use-onboarding-user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export const BankPayoutForm = () => {
  const locale = useLocale();
  const router = useRouter();
  const methods = useForm<BankPayoutFormData>({
    resolver: zodResolver(bankPayoutSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountName: "",
      code: "",
    },
  });

  const { useSetupBankDetails, useGetAvailableBanks } = useOnboardingUserService();
  const { data: availableBanks, isLoading: isLoadingAvailableBanks } = useGetAvailableBanks();
  const { mutateAsync: setupBankDetails, isPending } = useSetupBankDetails();

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (formData: BankPayoutFormData) => {
    await setupBankDetails(formData, {
      onSuccess: (response) => {
        if (response?.success) {
          toast.success("Bank details updated successfully, you can now start selling");
          if (response?.data?.token) {
            router.push(`/${locale}/onboarding/vendor/success?token=${response?.data?.token}`);
          }
        }
      },
    });
  };

  const renderHeader = () => (
    <div className="mb-6 text-center">
      <h2 className="mb-2 !text-3xl font-semibold text-gray-900">Bank and Payout Setup</h2>
      <p className="text-sm text-gray-600">To receive your payments, please provide accurate bank details.</p>
    </div>
  );

  const renderBankFields = () => (
    <>
      <div data-tour="bank-details-bank-select">
        <ComboBox
          options={
            availableBanks?.data?.map((bank) => ({
              value: bank.code,
              label: bank.name,
            })) || []
          }
          value={methods.watch("code")}
          onValueChange={(value) => {
            const selectedBank = availableBanks?.data?.find((bank) => bank.code === value);
            if (selectedBank) {
              methods.setValue("bankName", selectedBank.name);
              methods.setValue("code", selectedBank.code);
            }
          }}
          placeholder="Select bank..."
          searchPlaceholder="Search bank..."
          emptyMessage="No bank found."
          className="text-high-grey-II h-14 w-full rounded-lg bg-white shadow-none"
          contentClassName="w-full"
        />
      </div>
      <FormField placeholder="Account Number" className="h-14 w-full" name="accountNumber" />
      <FormField placeholder="Account Name" className="h-14 w-full" name="accountName" />
    </>
  );

  const renderSubmitButton = () => (
    <div className="pt-4" data-tour="bank-details-submit">
      <SkiButton
        type="submit"
        className="h-12 w-full font-medium"
        variant="primary"
        isDisabled={!isValid || isPending || isLoadingAvailableBanks}
        isLoading={isPending}
      >
        Continue & Submit
      </SkiButton>
    </div>
  );

  const renderBankPayoutForm = () => (
    <div className="mx-auto w-full max-w-md">
      {renderHeader()}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          {renderBankFields()}
          {renderSubmitButton()}
        </form>
      </FormProvider>
    </div>
  );

  return renderBankPayoutForm();
};
