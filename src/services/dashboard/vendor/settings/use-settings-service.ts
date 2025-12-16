/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { SettingsService } from "./settings.service";

export const useSettingsService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<SettingsService>(dependencies.SETTINGS_SERVICE);

  const useGetSubscriptions = (options?: any) =>
    useServiceQuery([...queryKeys.settings.subscriptions()], (service) => service.getSubscriptions(options), options);

  const useGetSubscriptionOverview = (options?: any) =>
    useServiceQuery(
      [...queryKeys.settings.subscriptionOverview()],
      (service) => service.getSubscriptionOverview(),
      options,
    );

  const useGetAllAvailablePlans = (options?: any) =>
    useServiceQuery([...queryKeys.settings.allAvailablePlans()], (service) => service.getAllAvailablePlans(), options);

  const useCreateSubscriptions = () =>
    useServiceMutation((service, data: { amount: number; planCode: string; planType: string }) =>
      service.createSubscriptions(data),
    );

  const useCreatePlan = () =>
    useServiceMutation((service, data: { amount: number; name: string; interval: string; savingPercentage: number }) =>
      service.createPlan(data),
    );

  return {
    useGetSubscriptions,
    useGetSubscriptionOverview,
    useGetAllAvailablePlans,
    useCreateSubscriptions,
    useCreatePlan,
  };
};
