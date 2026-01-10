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

type PlayToWinFormData = {
  couponRedemptionFrequency: string;
  drawCycleResetTime: string;
  loginRequiredToPlay: boolean;
  notifyAdminOnCouponExhaustion: boolean;
  playFrequency: string;
  redemptionWindowDays: number;
  showWinnersNotification: boolean;
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { useGetMySettings, useUpdateSettings, useCreateSettings } = useAdminSettingsService();
  const { data } = useGetMySettings({ staleTime: 30_000 });

  const updateMutation = useUpdateSettings({
    onSuccess: () => toast.success("Play-to-Win settings updated"),
  });
  const createMutation = useCreateSettings({
    onSuccess: () => toast.success("Play-to-Win settings created"),
  });

  const defaults: PlayToWinFormData = useMemo(
    () => ({
      couponRedemptionFrequency: data?.data?.play2winSettings?.couponRedemptionFrequency ?? "Once Every 24 Hours",
      drawCycleResetTime: data?.data?.play2winSettings?.drawCycleResetTime ?? "08:00PM",
      loginRequiredToPlay: data?.data?.play2winSettings?.loginRequiredToPlay ?? true,
      notifyAdminOnCouponExhaustion: data?.data?.play2winSettings?.notifyAdminOnCouponExhaustion ?? true,
      playFrequency: data?.data?.play2winSettings?.playFrequency ?? "Once Every 24 Hours",
      redemptionWindowDays: data?.data?.play2winSettings?.redemptionWindowDays ?? 7,
      showWinnersNotification: data?.data?.play2winSettings?.showWinnersNotification ?? true,
    }),
    [data],
  );

  const methods = useForm<PlayToWinFormData>({
    values: defaults,
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (data?.success) reset(defaults);
  }, [data, defaults, reset]);

  const onSubmit = async (values: PlayToWinFormData) => {
    setIsLoading(true);
    const payload: AdminSettingsPayload = {
      play2winSetting: {
        couponRedemptionFrequency: values.couponRedemptionFrequency,
        drawCycleResetTime: values.drawCycleResetTime,
        loginRequiredToPlay: values.loginRequiredToPlay,
        notifyAdminOnCouponExhaustion: values.notifyAdminOnCouponExhaustion,
        playFrequency: values.playFrequency,
        redemptionWindowDays: values.redemptionWindowDays,
        showWinnersNotification: values.showWinnersNotification,
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

  const freqOptions = [
    { value: "Once Every 24 Hours", label: "Once Every 24 Hours" },
    { value: "Twice Daily", label: "Twice Daily" },
    { value: "Once Weekly", label: "Once Weekly" },
  ];

  const timeOptions = [
    { value: "06:00AM", label: "06:00AM" },
    { value: "12:00PM", label: "12:00PM" },
    { value: "06:00PM", label: "06:00PM" },
    { value: "08:00PM", label: "08:00PM" },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={`Play-to-Win Settings`}
        subtitle={`Configure game cadence and administrative notifications.`}
        icon={<Icons.controller className={`size-6`} />}
        showSubscriptionBanner={false}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-none shadow">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Game Frequency`}
                titleClassName={`text-xl`}
                subtitle={`Control how often users can play and redeem`}
                icon={<Icons.controller className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Play Frequency"
                name="playFrequency"
                type="select"
                options={freqOptions}
                placeholder="Select frequency"
                className="!h-12"
              />
              <FormField
                label="Coupon Redemption Frequency"
                name="couponRedemptionFrequency"
                type="select"
                options={freqOptions}
                placeholder="Select redemption frequency"
                className="!h-12"
              />
              <FormField
                label="Redemption Window (days)"
                name="redemptionWindowDays"
                type="number"
                placeholder="7"
                className="h-12"
              />
              <FormField
                label="Draw Cycle Reset Time"
                name="drawCycleResetTime"
                type="select"
                options={timeOptions}
                placeholder="Select reset time"
                className="!h-12"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow">
            <CardHeader className="space-y-1">
              <DashboardHeader
                title={`Notifications & Access`}
                titleClassName={`text-xl`}
                subtitle={`Administrative alerts and access control.`}
                icon={<Icons.controller className={`size-4`} />}
                showSubscriptionBanner={false}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <SwitchField
                name="loginRequiredToPlay"
                label="Require Login To Play"
                description="Users must be logged in to participate"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
              <SwitchField
                name="notifyAdminOnCouponExhaustion"
                label="Notify Admin on Coupon Exhaustion"
                description="Send alert when coupons are exhausted"
                className="bg-card hover:bg-accent/50 flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
              />
              <SwitchField
                name="showWinnersNotification"
                label="Show Winners Notification"
                description="Display winner notifications to users"
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
