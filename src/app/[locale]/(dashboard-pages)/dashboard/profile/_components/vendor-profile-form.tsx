/* eslint-disable no-console */
"use client";

import SkiButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { VendorPersonalFormData, vendorPersonalSchema } from "@/schemas";
import { useDashboardProfileService } from "@/services/dashboard/vendor/users/use-profile-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface VendorProfileFormProperties {
  initialData?: VendorProfile | null;
  onSubmit?: (data: VendorPersonalFormData) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  title?: string;
}

export const VendorProfileForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = "Save Vendor Information",
  title = "Vendor Information",
}: VendorProfileFormProperties) => {
  const methods = useForm<VendorPersonalFormData>({
    resolver: zodResolver(vendorPersonalSchema),
    defaultValues: {
      vendor: {
        name: "",
      },
    },
  });

  const { handleSubmit, reset } = methods;
  const { useUpdateVendorProfile, useGetVendorProfile } = useDashboardProfileService();
  const { data: profileResponse } = useGetVendorProfile();
  const updateProfileMutation = useUpdateVendorProfile();

  // Sync fetched data into the form when available
  useEffect(() => {
    const fetchedProfile = profileResponse?.data;
    if (fetchedProfile) {
      reset({
        vendor: {
          name: fetchedProfile.vendor?.name ?? "",
        },
      });
    }
  }, [initialData, reset, profileResponse]);

  const handleFormSubmit = async (data: VendorPersonalFormData) => {
    try {
      await (onSubmit
        ? onSubmit(data)
        : updateProfileMutation.mutateAsync({
            data: {
              vendor: {
                name: data.vendor.name,
              },
            },
          }));
      toast.success("Vendor information saved successfully!");
    } catch (error) {
      console.error("Error submitting vendor information:", error);
      toast.error("Failed to save vendor information. Please try again.");
    }
  };

  return (
    <div className="bg-background rounded-lg p-6">
      <h4 className="text-center">{title}</h4>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mx-auto mt-8 max-w-2xl space-y-6">
          <FormField label="Vendor Name" name="vendor.name" placeholder="Enter vendor name" className="h-12 w-full" />

          {/* Submit Button */}
          <div className="flex justify-center">
            <SkiButton
              variant={`primary`}
              type="submit"
              isDisabled={isLoading || updateProfileMutation.isPending}
              className="w-full"
              isLoading={isLoading || updateProfileMutation.isPending}
            >
              {submitButtonText}
            </SkiButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
