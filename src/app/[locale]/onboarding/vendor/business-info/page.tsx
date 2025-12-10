"use client";

import { BusinessInfoForm } from "../_components/business-info-form";
import { OnboardingLayout } from "../_components/onboarding-layout";

const BusinessInfoPage = () => {
  return (
    <OnboardingLayout currentStep={4}>
      <BusinessInfoForm />
    </OnboardingLayout>
  );
};

export default BusinessInfoPage;
