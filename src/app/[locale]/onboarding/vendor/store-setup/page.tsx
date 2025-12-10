"use client";

import { OnboardingLayout } from "../_components/onboarding-layout";
import { StoreForm } from "../_components/store-form";

const StoreSetupPage = () => {
  return (
    <OnboardingLayout currentStep={5}>
      <StoreForm />
    </OnboardingLayout>
  );
};

export default StoreSetupPage;
