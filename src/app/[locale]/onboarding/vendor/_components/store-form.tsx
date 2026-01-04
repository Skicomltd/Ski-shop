"use client";

import SkiButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { StoreFormData, storeSchema } from "@/schemas";
import { useOnboardingUserService } from "@/services/externals/onboarding/use-onboarding-user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export const StoreForm = () => {
  const locale = useLocale();
  const router = useRouter();
  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      description: "",
      image: null,
    },
  });

  // Onboarding user service hook
  const { useCreateStore } = useOnboardingUserService();
  const { mutateAsync: createStore, isPending } = useCreateStore();

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (formData: StoreFormData) => {
    await createStore(formData, {
      onSuccess: (response) => {
        if (response?.success && response?.data?.token) {
          toast.success("Store created successfully");
          router.push(`/${locale}/onboarding/vendor/bank-payout?token=${response?.data?.token}`);
        }
      },
    });
  };

  const renderHeader = () => (
    <div className="mb-6 text-center">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:text-2xl">Create Your Store</h2>
      <p className="text-sm text-gray-600 sm:text-base">
        Set up your store profile to start selling on Ski-Shop. Add your store details and logo to build trust with
        customers.
      </p>
    </div>
  );

  const renderStoreFields = () => (
    <section className="space-y-4" data-tour="store-setup-details">
      {/* Store Name */}
      <div className="space-y-2">
        <FormField placeholder="Store Name" className="h-14 w-full" name="name" />
      </div>

      {/* Store Description */}
      <div className="w-full space-y-2">
        <FormField
          placeholder="Store Description"
          className="!h-30 w-full bg-white shadow-none"
          name="description"
          type="textarea"
        />
      </div>

      {/* Store Logo Upload */}
      <div className="!w-full space-y-2" data-tour="store-setup-logo">
        <FormField
          label="Store Logo"
          name="image"
          type="file"
          acceptedFileTypes="image/*"
          maxFiles={1}
          showPreview={true}
          containerClassName="!w-full"
          className="!w-full"
        />
      </div>
    </section>
  );

  const renderSubmitButton = () => (
    <section>
      <SkiButton
        type="submit"
        className="h-12 w-full sm:h-14"
        variant="primary"
        isDisabled={!isValid || isPending}
        isLoading={isPending}
      >
        Create Store
      </SkiButton>
    </section>
  );

  const renderStoreForm = () => (
    <div className="mx-auto w-full max-w-2xl">
      {renderHeader()}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          {renderStoreFields()}
          {renderSubmitButton()}
        </form>
      </FormProvider>
    </div>
  );

  return renderStoreForm();
};
