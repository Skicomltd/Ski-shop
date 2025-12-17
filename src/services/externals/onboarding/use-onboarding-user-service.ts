import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { BankPayoutFormData, BusinessInfoFormData, StoreFormData } from "@/schemas";

import { OnboardingUserService } from "./onboarding-user.service";
import { PhoneVerificationService } from "./phone-verification.service";

export const useOnboardingUserService = () => {
  const { useServiceMutation, useServiceQuery } = createServiceHooks<OnboardingUserService>(
    dependencies.ONBOARDING_USER_SERVICE,
  );

  const useResendOTP = () => useServiceMutation((service, data: { email: string }) => service.resendOTP(data));

  const useVerifyOTP = () => useServiceMutation((service, data: { code: string }) => service.verifyOTP(data));

  // Phone verification mutations (backend direct, no Firebase)
  const useSendPhoneOTP = () =>
    useServiceMutation((service, data: { phoneNumber: string }) => service.sendPhoneOTP(data));

  const useVerifyPhoneOTP = () => useServiceMutation((service, data: { code: string }) => service.verifyPhoneOTP(data));

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
    useSendPhoneOTP,
    useVerifyPhoneOTP,
    useUpdateBusinessInfo,
    useSetupBankDetails,
    useCreateStore,
    useGetAvailableBanks,
  };
};

// Singleton instance of PhoneVerificationService
let phoneServiceInstance: PhoneVerificationService | null = null;

// Phone verification service hooks - using singleton pattern to persist across pages
export const usePhoneVerificationService = () => {
  if (typeof window !== "undefined" && !phoneServiceInstance) {
    // console.log("🔧 Creating new PhoneVerificationService singleton instance");
    phoneServiceInstance = new PhoneVerificationService();
  }

  return {
    phoneService: phoneServiceInstance as PhoneVerificationService,
  };
};
