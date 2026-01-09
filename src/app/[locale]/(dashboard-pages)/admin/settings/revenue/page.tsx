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

type RevenueFormData = {
  autoExpiryNotification: boolean;
  fulfillmentFeePercentage: number;
  gasFee: number;
  gracePeriodAfterExpiry: number;
  maxPayoutAmount: number;
  maxWithdrawalsPerDay: number;
  minPayoutAmount: number;
  monthlySubscriptionFee: number;
  notifyOnCommissionDeduction: boolean;
  notifyOnSubscriptionExpiry: boolean;
  notifyUserOnApproval: boolean;
  yearlySubscriptionFee: number;
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { useGetMySettings, useUpdateSettings, useCreateSettings } = useAdminSettingsService();
  const { data } = useGetMySettings({ staleTime: 30_000 });

  const updateMutation = useUpdateSettings({
    onSuccess: () => toast.success("Revenue settings updated"),
  });
  const createMutation = useCreateSettings({
    onSuccess: () => toast.success("Revenue settings created"),
  });

  const defaults: RevenueFormData = useMemo(
    () => ({
      autoExpiryNotification: data?.data?.revenueSettings?.autoExpiryNotification ?? true,
      fulfillmentFeePercentage: data?.data?.revenueSettings?.fulfillmentFeePercentage ?? 10,
      gasFee: data?.data?.revenueSettings?.gasFee ?? 1000,
      gracePeriodAfterExpiry: data?.data?.revenueSettings?.gracePeriodAfterExpiry ?? 7,
      maxPayoutAmount: data?.data?.revenueSettings?.maxPayoutAmount ?? 1e5,
      maxWithdrawalsPerDay: data?.data?.revenueSettings?.maxWithdrawalsPerDay ?? 1,
      minPayoutAmount: data?.data?.revenueSettings?.minPayoutAmount ?? 10_000,
      monthlySubscriptionFee: data?.data?.revenueSettings?.monthlySubscriptionFee ?? 10_000,
      notifyOnCommissionDeduction: data?.data?.revenueSettings?.notifyOnCommissionDeduction ?? true,
      notifyOnSubscriptionExpiry: data?.data?.revenueSettings?.notifyOnSubscriptionExpiry ?? true,
      notifyUserOnApproval: data?.data?.revenueSettings?.notifyUserOnApproval ?? true,
      yearlySubscriptionFee: data?.data?.revenueSettings?.yearlySubscriptionFee ?? 1e5,
    }),
    [data],
  );

  const methods = useForm<RevenueFormData>({
    values: defaults,
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (data?.success) reset(defaults);
  }, [data, defaults, reset]);

  const onSubmit = async (values: RevenueFormData) => {
    setIsLoading(true);
    const payload: AdminSettingsPayload = {
      revenueSetting: {
        autoExpiryNotification: values.autoExpiryNotification,
        fulfillmentFeePercentage: values.fulfillmentFeePercentage,
        gasFee: values.gasFee,
        gracePeriodAfterExpiry: values.gracePeriodAfterExpiry,
        maxPayoutAmount: values.maxPayoutAmount,
        maxWithdrawalsPerDay: values.maxWithdrawalsPerDay,
        minPayoutAmount: values.minPayoutAmount,
        monthlySubscriptionFee: values.monthlySubscriptionFee,
        notifyOnCommissionDeduction: values.notifyOnCommissionDeduction,
        notifyOnSubscriptionExpiry: values.notifyOnSubscriptionExpiry,
        notifyUserOnApproval: values.notifyUserOnApproval,
        yearlySubscriptionFee: values.yearlySubscriptionFee,
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
        title={`Revenue Settings`}
        subtitle={`Configure fees, payout rules and subscription settings.`}
        icon={<Icons.settings className={`size-6`} />}
        showSubscriptionBanner={false}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-none shadow">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Fees & Commission`}
                titleClassName={`text-xl`}
                subtitle={`Platform-wide fee configuration.`}
                icon={<Icons.wallet className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Fulfillment Fee (%)"
                name="fulfillmentFeePercentage"
                type="number"
                placeholder="10"
                className="h-12"
              />
              <FormField label="Gas Fee" name="gasFee" type="number" placeholder="1000" className="h-12" />
              <SwitchField
                name="notifyOnCommissionDeduction"
                label="Notify on Commission Deduction"
                description="Notify users when commission is deducted"
                className="bg-card hover:bg-accent/50 col-span-2 flex items-center justify-between rounded-lg border p-4 transition-colors"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Payout Rules`}
                titleClassName={`text-xl`}
                subtitle={`Define payout limits and cadence.`}
                icon={<Icons.wallet className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Minimum Payout Amount"
                name="minPayoutAmount"
                type="number"
                placeholder="10000"
                className="h-12"
              />
              <FormField
                label="Maximum Payout Amount"
                name="maxPayoutAmount"
                type="number"
                placeholder="100000"
                className="h-12"
              />
              <FormField
                label="Max Withdrawals Per Day"
                name="maxWithdrawalsPerDay"
                type="number"
                placeholder="1"
                className="h-12"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Subscriptions & Expiry`}
                titleClassName={`text-xl`}
                subtitle={`Set subscription fees, expiry behavior and notifications.`}
                icon={<Icons.ribbonOutline className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Monthly Subscription Fee"
                name="monthlySubscriptionFee"
                type="number"
                placeholder="10000"
                className="h-12"
              />
              <FormField
                label="Yearly Subscription Fee"
                name="yearlySubscriptionFee"
                type="number"
                placeholder="100000"
                className="h-12"
              />
              <FormField
                label="Grace Period After Expiry (days)"
                name="gracePeriodAfterExpiry"
                type="number"
                placeholder="7"
                className="h-12"
              />
              <SwitchField
                name="autoExpiryNotification"
                label="Auto Expiry Notification"
                description="Automatically notify users when subscriptions are about to expire"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
              <SwitchField
                name="notifyOnSubscriptionExpiry"
                label="Notify on Subscription Expiry"
                description="Send notification on actual expiry"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
              <SwitchField
                name="notifyUserOnApproval"
                label="Notify User on Approval"
                description="Notify user when approval actions occur"
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
