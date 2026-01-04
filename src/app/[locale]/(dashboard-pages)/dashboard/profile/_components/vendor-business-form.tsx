/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
"use client";

import SkiButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { countries } from "@/lib/constants";
import { VendorBusinessFormData, vendorBusinessSchema } from "@/schemas";
import { useDashboardProfileService } from "@/services/dashboard/vendor/users/use-profile-service";
import { useAppService } from "@/services/externals/app/use-app-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

const businessTypes = [
  { value: "individual", label: "Individual" },
  { value: "corporation", label: "Corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "LLC" },
];

// const kycTypes = [
//   { value: "passport", label: "Passport" },
//   { value: "drivers_license", label: "Driver's License" },
//   { value: "national_id", label: "National ID" },
//   { value: "other", label: "Other" },
// ];

interface VendorBusinessFormProperties {
  initialData?: VendorProfile | null;
  onSubmit?: (data: VendorBusinessFormData) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  title?: string;
}

export const VendorBusinessForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = "Save Business Information",
  title = "Business Information",
}: VendorBusinessFormProperties) => {
  const methods = useForm<VendorBusinessFormData>({
    resolver: zodResolver(vendorBusinessSchema),
    defaultValues: {
      business: {
        type: "individual",
        businessRegNumber: "",
        country: "",
        state: "",
        address: "",
      },
    },
  });

  const { handleSubmit, reset } = methods;
  const { useUpdateVendorProfile, useGetVendorProfile } = useDashboardProfileService();
  const updateProfileMutation = useUpdateVendorProfile();

  const { data: profileResponse } = useGetVendorProfile();
  const profile = initialData ?? profileResponse?.data;

  // Delivery states for dynamic state dropdown
  const { useGetDeliveryStates } = useAppService();
  const { data: deliveryStatesResponse } = useGetDeliveryStates({ staleTime: 1000 * 60 * 5 });

  const deliveryStates = useMemo(() => {
    const raw = (deliveryStatesResponse as any)?.data;
    const list = Array.isArray(raw)
      ? (raw as any[])
      : Array.isArray(deliveryStatesResponse as any)
        ? (deliveryStatesResponse as unknown as any[])
        : [];

    return list
      .map((s: any) => s?.name || s?.state || s)
      .filter((v: any) => typeof v === "string")
      .map((value: string) => ({ value: value.toLowerCase(), label: value }));
  }, [deliveryStatesResponse]);

  useEffect(() => {
    if (profile?.business) {
      reset({
        business: {
          type: profile.business.type ?? "individual",
          businessRegNumber: profile.business.businessRegNumber ?? "",
          country: profile.business.country ?? "",
          state: profile.business.state ?? "",
          address: profile.business.address ?? "",
        },
      });
    }
  }, [profile, reset]);

  const handleFormSubmit = async (data: VendorBusinessFormData) => {
    try {
      await (onSubmit
        ? onSubmit(data)
        : updateProfileMutation.mutateAsync({
            data: {
              business: {
                type: data.business.type,
                // Fields captured in this form
                businessRegNumber: data.business.businessRegNumber,
                country: data.business.country,
                state: data.business.state,
                address: data.business.address,

                // Required fields not captured in this form; preserve existing values where possible
                contactNumber: profile?.business?.contactNumber ?? "",
                kycVerificationType: profile?.business?.kycVerificationType ?? "other",
                identificationNumber: profile?.business?.identificationNumber ?? "",

                // Optional fields
                name: profile?.business?.name,
              },
            },
          }));
      toast.success("Business information saved successfully!");
    } catch (error) {
      console.error("Error submitting business information:", error);
      toast.error("Failed to save business information. Please try again.");
    }
  };

  return (
    <div className="bg-background rounded-lg p-6">
      <h4 className="text-center">{title}</h4>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mx-auto mt-8 max-w-2xl space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField
              label="Business Type"
              name="business.type"
              type="select"
              options={businessTypes}
              placeholder="Select business type"
              className="!h-12 w-full"
            />
            <FormField
              label="Business Registration Number"
              name="business.businessRegNumber"
              placeholder="e.g., CAC: 1920384"
              className="!h-12 w-full"
            />
            <FormField
              label="Country"
              name="business.country"
              type="select"
              options={countries}
              placeholder="Select country"
              className="!h-12 w-full"
            />
            <FormField
              label="State"
              name="business.state"
              type="select"
              options={deliveryStates.length > 0 ? deliveryStates : []}
              placeholder="Select state"
              className="!h-12 w-full"
            />
            <FormField
              label="Business Address"
              name="business.address"
              placeholder="e.g., 43 Yaba Street, Lagos"
              className="col-span-2 !h-12 w-full"
            />
          </div>

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
