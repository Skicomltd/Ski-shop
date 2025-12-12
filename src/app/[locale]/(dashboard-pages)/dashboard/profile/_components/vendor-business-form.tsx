/* eslint-disable no-console */
"use client";

import SkiButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { VendorBusinessFormData, vendorBusinessSchema } from "@/schemas";
import { useDashboardProfileService } from "@/services/dashboard/vendor/users/use-profile-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

const businessTypes = [
  { value: "individual", label: "Individual" },
  { value: "corporation", label: "Corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "LLC" },
];

const kycTypes = [
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "national_id", label: "National ID" },
  { value: "other", label: "Other" },
];

const countries = [
  { value: "nigeria", label: "🇳🇬 Nigeria" },
  { value: "united_kingdom", label: "🇬🇧 United Kingdom" },
  { value: "united_states", label: "🇺🇸 United States" },
  { value: "canada", label: "🇨🇦 Canada" },
  { value: "australia", label: "🇦🇺 Australia" },
];

const states = [
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "kano", label: "Kano" },
  { value: "kaduna", label: "Kaduna" },
];

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
        name: "",
        contactNumber: "",
        country: "",
        state: "",
        address: "",
        kycVerificationType: "passport",
        identificationNumber: "",
      },
    },
  });

  const { handleSubmit, reset } = methods;
  const { useUpdateVendorProfile, useGetVendorProfile } = useDashboardProfileService();
  const updateProfileMutation = useUpdateVendorProfile();

  const { data: profileResponse } = useGetVendorProfile();

  useEffect(() => {
    const fetchedProfile = profileResponse?.data;
    if (fetchedProfile?.business) {
      reset({
        business: {
          type: fetchedProfile.business.type ?? "individual",
          businessRegNumber: fetchedProfile.business.businessRegNumber ?? "",
          name: fetchedProfile.business.name ?? "",
          contactNumber: fetchedProfile.business.contactNumber ?? "",
          country: fetchedProfile.business.country ?? "",
          state: fetchedProfile.business.state ?? "",
          address: fetchedProfile.business.address ?? "",
          kycVerificationType: fetchedProfile.business.kycVerificationType ?? "passport",
          identificationNumber: fetchedProfile.business.identificationNumber ?? "",
        },
      });
    }
  }, [initialData, reset, profileResponse]);

  const handleFormSubmit = async (data: VendorBusinessFormData) => {
    try {
      await (onSubmit
        ? onSubmit(data)
        : updateProfileMutation.mutateAsync({
            data: {
              business: {
                type: data.business.type,
                businessRegNumber: data.business.businessRegNumber,
                name: data.business.name,
                contactNumber: data.business.contactNumber,
                country: data.business.country,
                state: data.business.state,
                address: data.business.address,
                kycVerificationType: data.business.kycVerificationType,
                identificationNumber: data.business.identificationNumber,
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
              label="Business Name"
              name="business.name"
              placeholder="Enter business name (optional for individuals)"
              className="!h-12 w-full"
            />
            <FormField
              label="Business Registration Number"
              name="business.businessRegNumber"
              placeholder="e.g., CAC: 1920384"
              className="!h-12 w-full"
            />
            <FormField
              label="Contact Number"
              name="business.contactNumber"
              placeholder="+234810..."
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
              options={states}
              placeholder="Select state"
              className="!h-12 w-full"
            />
            <FormField
              label="Business Address"
              name="business.address"
              placeholder="e.g., 43 Yaba Street, Lagos"
              className="col-span-2 !h-12 w-full"
            />
            <FormField
              label="KYC Verification Type"
              name="business.kycVerificationType"
              type="select"
              options={kycTypes}
              placeholder="Select verification type"
              className="!h-12 w-full"
            />
            <FormField
              label="Identification Number"
              name="business.identificationNumber"
              placeholder="Enter ID number"
              className="!h-12 w-full"
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
