import { OnboardingLayout } from "../_components/onboarding-layout";
import { VerifyPhoneComponent } from "../_components/verify-phone";

const VerifyPhonePage = () => {
  return (
    <OnboardingLayout currentStep={3}>
      <VerifyPhoneComponent />
    </OnboardingLayout>
  );
};

export default VerifyPhonePage;
