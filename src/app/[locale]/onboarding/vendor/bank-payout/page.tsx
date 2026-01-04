"use client";

import { vendorBankDetailsTourSteps } from "@/config/tour-steps";
import { useTour } from "@/context/tour-context";
import { useEffect } from "react";

import { BankPayoutForm } from "../_components/bank-payout-form";
import { OnboardingLayout } from "../_components/onboarding-layout";

const BankPayoutPage = () => {
  const { startTour } = useTour();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "onboarding-vendor-bank-tour-seen";
    const hasSeenTour = window.localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      startTour(vendorBankDetailsTourSteps);
      window.localStorage.setItem(storageKey, "true");
    }
  }, [startTour]);

  return (
    <OnboardingLayout currentStep={6}>
      <BankPayoutForm />
    </OnboardingLayout>
  );
};
export default BankPayoutPage;
