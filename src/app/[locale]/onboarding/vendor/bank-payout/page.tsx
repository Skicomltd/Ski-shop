"use client";

import { BankPayoutForm } from "../_components/bank-payout-form";
import { OnboardingLayout } from "../_components/onboarding-layout";

const BankPayoutPage = () => {
  return (
    <OnboardingLayout currentStep={6}>
      <BankPayoutForm />
    </OnboardingLayout>
  );
};
export default BankPayoutPage;
