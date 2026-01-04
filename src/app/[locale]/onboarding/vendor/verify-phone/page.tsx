"use client";

import { vendorPhoneVerificationTourSteps } from "@/config/tour-steps";
import { useTour } from "@/context/tour-context";
import { useEffect } from "react";

import { OnboardingLayout } from "../_components/onboarding-layout";
import { VerifyPhoneComponent } from "../_components/verify-phone";

const VerifyPhonePage = () => {
  const { startTour } = useTour();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "onboarding-vendor-phone-verify-tour-seen";
    const hasSeenTour = window.localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      startTour(vendorPhoneVerificationTourSteps);
      window.localStorage.setItem(storageKey, "true");
    }
  }, [startTour]);

  return (
    <OnboardingLayout currentStep={3}>
      <VerifyPhoneComponent />
    </OnboardingLayout>
  );
};

export default VerifyPhonePage;
