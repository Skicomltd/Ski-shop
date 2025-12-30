"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import MainButton from "@/components/shared/button";
import { FormField, SwitchField } from "@/components/shared/inputs/FormFields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAdminSettingsService } from "@/services/dashboard/admin/settings/use-admin-settings-service";
import { useAppService } from "@/services/externals/app/use-app-service";
import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DashboardHeader } from "../../../_components/dashboard-header";

type GeneralFormData = {
  purchaseEmailNotification: boolean;
  newsAndUpdateEmailNotification: boolean;
  productCreationEmailNotification: boolean;
  payoutEmailNotification: boolean;
  contactEmail?: string;
  alternativeContactEmail?: string | null;
};

type PickupStationFormData = {
  name: string;
  contactPerson: string;
  address: string;
  state: string;
  phoneNumber: string;
  status: "active" | "inactive";
};

const Pages = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { useGetMySettings, useUpdateSettings, useCreateSettings } = useAdminSettingsService();
  const { useCreatePickupStation, useGetDeliveryStates } = useAppService();
  const { data } = useGetMySettings({ staleTime: 30_000 });
  const { data: deliveryStatesResponse } = useGetDeliveryStates({ staleTime: 1000 * 60 * 5 });

  const deliveryStates = useMemo(() => deliveryStatesResponse?.data ?? [], [deliveryStatesResponse?.data]);

  const updateMutation = useUpdateSettings({
    onSuccess: () => toast.success("General settings updated"),
  });
  const createMutation = useCreateSettings({
    onSuccess: () => toast.success("General settings created"),
  });

  const defaults: GeneralFormData = useMemo(
    () => ({
      purchaseEmailNotification: data?.data?.generalSettings?.purchaseEmailNotification ?? true,
      newsAndUpdateEmailNotification: data?.data?.generalSettings?.newsAndUpdateEmailNotification ?? false,
      productCreationEmailNotification: data?.data?.generalSettings?.productCreationEmailNotification ?? true,
      payoutEmailNotification: data?.data?.generalSettings?.payoutEmailNotification ?? true,
      contactEmail: data?.data?.generalSettings?.contactEmail ?? "",
      alternativeContactEmail: data?.data?.generalSettings?.alternativeContactEmail ?? "",
    }),
    [data],
  );

  const methods = useForm<GeneralFormData>({
    values: defaults,
    mode: "onChange",
  });

  const pickupStationMethods = useForm<PickupStationFormData>({
    defaultValues: {
      name: "",
      contactPerson: "",
      address: "",
      state: "",
      phoneNumber: "",
      status: "active",
    },
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  const createPickupStationMutation = useCreatePickupStation({
    onSuccess: () => {
      toast.success("Pickup station created");
      pickupStationMethods.reset();
    },
  });

  useEffect(() => {
    if (data?.success) reset(defaults);
  }, [data, defaults, reset]);

  const onSubmit = async (values: GeneralFormData) => {
    setIsLoading(true);
    const payload: AdminSettingsPayload = {
      generalSetting: {
        purchaseEmailNotification: values.purchaseEmailNotification,
        newsAndUpdateEmailNotification: values.newsAndUpdateEmailNotification,
        productCreationEmailNotification: values.productCreationEmailNotification,
        payoutEmailNotification: values.payoutEmailNotification,
        contactEmail: values.contactEmail || undefined,
        alternativeContactEmail: values.alternativeContactEmail || undefined,
      },
    };

    try {
      const hasExisting = Boolean(data?.success && data?.data?.id);
      if (hasExisting) {
        const settingId = data!.data!.id as string;
        await updateMutation.mutateAsync({ settingId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      toast.success("Saved");
    } catch (error) {
      toast.error("Failed to save", { description: (error as Error)?.message ?? "Unknown error" });
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || updateMutation.isPending || createMutation.isPending;
  const isCreatingPickupStation = createPickupStationMutation.isPending;

  const onCreatePickupStation = async (values: PickupStationFormData) => {
    try {
      await createPickupStationMutation.mutateAsync({
        name: values.name,
        contactPerson: values.contactPerson,
        address: values.address,
        state: values.state,
        phoneNumber: values.phoneNumber,
        status: values.status,
      });
    } catch (error) {
      toast.error("Failed to create pickup station", {
        description: (error as Error)?.message ?? "Unknown error",
      });
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={`General Settings`}
        subtitle={`Manage platform-level contact details and email notifications.`}
        icon={<Icons.settings className={`size-6`} />}
        showSubscriptionBanner={false}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-none shadow-none">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Email Notifications`}
                titleClassName={`text-xl`}
                subtitle={`Configure administrative email notifications.`}
                icon={<Icons.mail className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <SwitchField
                name="purchaseEmailNotification"
                label="Purchase Email Notification"
                description="Receive emails when purchases occur"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />

              <SwitchField
                name="newsAndUpdateEmailNotification"
                label="News & Update Emails"
                description="Receive platform news and updates"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />

              <SwitchField
                name="productCreationEmailNotification"
                label="Product Creation Notification"
                description="Notify when new products are created"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />

              <SwitchField
                name="payoutEmailNotification"
                label="Payout Email Notification"
                description="Notify when payouts occur"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Contact Emails`}
                titleClassName={`text-xl`}
                subtitle={`Primary and fallback contact addresses.`}
                icon={<Icons.mail className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Primary Contact Email"
                name="contactEmail"
                type="email"
                placeholder="info@skishop.com"
                className="h-12"
              />
              <FormField
                label="Alternative Contact Email"
                name="alternativeContactEmail"
                type="email"
                placeholder="support@skishop.com"
                className="h-12"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardContent className="pt-6">
              <Separator className="mb-6" />
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <MainButton
                  variant="outline"
                  type="button"
                  onClick={() => reset()}
                  isDisabled={isSubmitting}
                  className="sm:w-auto"
                >
                  Cancel Changes
                </MainButton>
                <MainButton variant="primary" type="submit" isDisabled={isSubmitting} className="sm:w-auto">
                  {isSubmitting ? "Saving..." : "Save"}
                </MainButton>
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>

      <FormProvider {...pickupStationMethods}>
        <form onSubmit={pickupStationMethods.handleSubmit(onCreatePickupStation)} className="space-y-6">
          <Card className="border-none shadow-none">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Pickup Stations`}
                titleClassName={`text-xl`}
                subtitle={`Create a new pickup station for customers.`}
                icon={<MapPin className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Station Name" name="name" placeholder="Ikeja Pickup Station" className="h-12" />

                <FormField label="Contact Person" name="contactPerson" placeholder="John Doe" className="h-12" />

                <FormField label="Phone Number" name="phoneNumber" placeholder="+234..." className="h-12" />

                <FormField
                  label="State"
                  name="state"
                  type="select"
                  placeholder={deliveryStates.length > 0 ? "Select state" : "Loading states..."}
                  disabled={deliveryStates.length === 0}
                  options={deliveryStates.map((state) => ({ value: state, label: state }))}
                  className="!h-12"
                />

                <FormField
                  label="Status"
                  name="status"
                  type="select"
                  placeholder="Select status"
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  className="!h-12"
                />
              </div>

              <FormField
                label="Address"
                name="address"
                type="textarea"
                placeholder="Full pickup station address"
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardContent className="pt-6">
              <Separator className="mb-6" />
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <MainButton
                  variant="outline"
                  type="button"
                  onClick={() => pickupStationMethods.reset()}
                  isDisabled={isCreatingPickupStation}
                  className="sm:w-auto"
                >
                  Clear
                </MainButton>
                <MainButton variant="primary" type="submit" isDisabled={isCreatingPickupStation} className="sm:w-auto">
                  {isCreatingPickupStation ? "Creating..." : "Create Pickup Station"}
                </MainButton>
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
};

export default Pages;
