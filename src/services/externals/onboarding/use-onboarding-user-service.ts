import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { BankPayoutFormData, BusinessInfoFormData, StoreFormData } from "@/schemas";

import { OnboardingUserService } from "./onboarding-user.service";

export const useOnboardingUserService = () => {
  const { useServiceMutation, useServiceQuery } = createServiceHooks<OnboardingUserService>(
    dependencies.ONBOARDING_USER_SERVICE,
  );

  const useResendOTP = () => useServiceMutation((service, data: { email: string }) => service.resendOTP(data));

  const useVerifyOTP = () => useServiceMutation((service, data: { code: string }) => service.verifyOTP(data));

  // Mutations
  const useUpdateBusinessInfo = () =>
    useServiceMutation((service, data: BusinessInfoFormData) => service.updateBusinessInfo(data));

  const useSetupBankDetails = () =>
    useServiceMutation((service, data: BankPayoutFormData) => service.setupBankDetails(data));

  const useCreateStore = () => useServiceMutation((service, data: StoreFormData) => service.createStore(data));

  const useGetAvailableBanks = () => useServiceQuery([], (service) => service.getAvailableBanks());

  return {
    useResendOTP,
    useVerifyOTP,
    useUpdateBusinessInfo,
    useSetupBankDetails,
    useCreateStore,
    useGetAvailableBanks,
  };
};
