/* eslint-disable no-console */
"use client";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import SkiButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { VendorStoreFormData, vendorStoreSchema } from "@/schemas";
import { useDashboardProfileService } from "@/services/dashboard/vendor/users/use-profile-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DashboardHeader } from "../../../_components/dashboard-header";

interface VendorStoreFormProperties {
  initialData?: VendorProfile | null;
  onSubmit?: (data: VendorStoreFormData) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  title?: string;
}

export const VendorStoreForm = ({
  initialData,
  onSubmit,
  isLoading,
  submitButtonText = "Save Store Information",
  title = "Store Information",
}: VendorStoreFormProperties) => {
  const fileInputReference = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const methods = useForm<VendorStoreFormData>({
    resolver: zodResolver(vendorStoreSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: null,
    },
  });

  const { handleSubmit, setValue, reset } = methods;

  // Services
  const { useUpdateVendorProfile, useUpdateVendorLogo, useGetVendorProfile } = useDashboardProfileService();
  const updateProfileMutation = useUpdateVendorProfile();
  const updateLogoMutation = useUpdateVendorLogo();

  const { data: profileResponse } = useGetVendorProfile();

  // Sync fetched data into the form when available
  useEffect(() => {
    const fetchedProfile = profileResponse?.data;
    if (fetchedProfile) {
      reset({
        name: fetchedProfile.name ?? "",
        description: fetchedProfile.description ?? "",
        logo: null,
      });
      if (typeof fetchedProfile.logo === "string" && fetchedProfile.logo) {
        setPreviewImage(fetchedProfile.logo);
      }
    }
  }, [initialData, reset, profileResponse]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("logo", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputReference.current?.click();
  };

  const handleFormSubmit = async (data: VendorStoreFormData) => {
    try {
      // Prefer internal handling; fall back to external handler if explicitly provided
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Update store information first
        await updateProfileMutation.mutateAsync({
          data: {
            name: data.name,
            description: data.description,
          },
        });

        // Update logo separately if provided
        if (data.logo instanceof File) {
          await updateLogoMutation.mutateAsync({
            logo: data.logo,
          });
        }
      }
      toast.success("Store information saved successfully!");
    } catch (error) {
      console.error("Error submitting store information:", error);
      toast.error("Failed to save store information. Please try again.");
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-center text-center">
        <DashboardHeader title={title} showSubscriptionBanner={false} />
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mx-auto mt-8 max-w-2xl space-y-6">
          {/* Profile Image/Logo Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div
                onClick={triggerFileInput}
                className="border-border hover:border-primary relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-2 border-dashed bg-gray-100"
              >
                <BlurImage
                  src={previewImage || `/images/skicom.svg`}
                  alt="Store logo"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover p-6"
                />
              </div>
              <div className="border-border bg-primary absolute right-0 bottom-0 rounded-full p-2 shadow-md">
                <Camera size={16} className="text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputReference}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Store Information Fields */}
          <div className="space-y-4">
            <FormField label="Store Name" name="name" placeholder="Enter store name" className="h-12 w-full" />
            <FormField
              label="Store Description"
              name="description"
              type="textarea"
              placeholder="Describe your store and what you offer"
              className="min-h-[100px] w-full"
            />
            {/* Store Type field removed */}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <SkiButton
              variant={`primary`}
              type="submit"
              isDisabled={isLoading || updateProfileMutation.isPending || updateLogoMutation.isPending}
              className="w-full"
              isLoading={isLoading || updateProfileMutation.isPending || updateLogoMutation.isPending}
            >
              {submitButtonText}
            </SkiButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
