"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import MainButton from "@/components/shared/button";
import { FormField, SwitchField } from "@/components/shared/inputs/FormFields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAdminSettingsService } from "@/services/dashboard/admin/settings/use-admin-settings-service";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DashboardHeader } from "../../../_components/dashboard-header";

type PromotionFormData = {
  autoApprovePromotions: boolean;
  bannerPromotion: boolean;
  defaultDurationDays: number;
  featuredSectionPromotion: boolean;
  maxPromotionsPerDay: number;
  notifyOnNewRequest: boolean;
  notifyVendorOnApproval: boolean;
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { useGetMySettings, useUpdateSettings, useCreateSettings } = useAdminSettingsService();
  const { data } = useGetMySettings({ staleTime: 30_000 });

  const updateMutation = useUpdateSettings({
    onSuccess: () => toast.success("Promotion settings updated"),
  });
  const createMutation = useCreateSettings({
    onSuccess: () => toast.success("Promotion settings created"),
  });

  const defaults: PromotionFormData = useMemo(
    () => ({
      autoApprovePromotions: data?.data?.promotionSettings?.autoApprovePromotions ?? true,
      bannerPromotion: data?.data?.promotionSettings?.bannerPromotion ?? true,
      defaultDurationDays: data?.data?.promotionSettings?.defaultDurationDays ?? 7,
      featuredSectionPromotion: data?.data?.promotionSettings?.featuredSectionPromotion ?? true,
      maxPromotionsPerDay: data?.data?.promotionSettings?.maxPromotionsPerDay ?? 3,
      notifyOnNewRequest: data?.data?.promotionSettings?.notifyOnNewRequest ?? true,
      notifyVendorOnApproval: data?.data?.promotionSettings?.notifyVendorOnApproval ?? true,
    }),
    [data],
  );

  const methods = useForm<PromotionFormData>({
    values: defaults,
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (data?.success) reset(defaults);
  }, [data, defaults, reset]);

  const onSubmit = async (values: PromotionFormData) => {
    setIsLoading(true);
    const payload: AdminSettingsPayload = {
      promotionSetting: {
        autoApprovePromotions: values.autoApprovePromotions,
        bannerPromotion: values.bannerPromotion,
        defaultDurationDays: values.defaultDurationDays,
        featuredSectionPromotion: values.featuredSectionPromotion,
        maxPromotionsPerDay: values.maxPromotionsPerDay,
        notifyOnNewRequest: values.notifyOnNewRequest,
        notifyVendorOnApproval: values.notifyVendorOnApproval,
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

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={`Promotion Settings`}
        subtitle={`Control how promotions work across the platform.`}
        icon={<Icons.promotion className={`size-6`} />}
        showSubscriptionBanner={false}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-none shadow">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Promotion Rules`}
                titleClassName={`text-xl`}
                subtitle={`Configure approval flow and where promotions can appear.`}
                icon={<Icons.promotion className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <SwitchField
                name="autoApprovePromotions"
                label="Auto-Approve Promotions"
                description="Automatically approve incoming promotion requests"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
              <SwitchField
                name="bannerPromotion"
                label="Enable Banner Promotion"
                description="Allow promotions to appear in banner slots"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
              <SwitchField
                name="featuredSectionPromotion"
                label="Enable Featured Section Promotion"
                description="Allow promotions to appear in featured sections"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Limits & Defaults`}
                titleClassName={`text-xl`}
                subtitle={`Set daily caps and default durations.`}
                icon={<Icons.promotion className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Default Duration (days)"
                name="defaultDurationDays"
                type="number"
                placeholder="7"
                className="h-12"
              />
              <FormField
                label="Max Promotions Per Day"
                name="maxPromotionsPerDay"
                type="number"
                placeholder="3"
                className="h-12"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Notifications`}
                titleClassName={`text-xl`}
                subtitle={`Keep admins and vendors informed.`}
                icon={<Icons.promotion className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <SwitchField
                name="notifyOnNewRequest"
                label="Notify on New Promotion Request"
                description="Send admin notification when a new request arrives"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
              <SwitchField
                name="notifyVendorOnApproval"
                label="Notify Vendor on Approval"
                description="Notify vendor when their promotion is approved"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow">
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
    </div>
  );
};

export default Page;
