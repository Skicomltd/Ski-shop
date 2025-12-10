import { OnboardingLayout } from "../_components/onboarding-layout";
import { PhoneInputForm } from "../_components/phone-input-form";

const PhoneInputPage = () => {
  return (
    <OnboardingLayout currentStep={2}>
      <PhoneInputForm />
    </OnboardingLayout>
  );
};

export default PhoneInputPage;
