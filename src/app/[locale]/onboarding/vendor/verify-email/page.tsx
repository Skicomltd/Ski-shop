"use client";

import { vendorEmailVerificationTourSteps } from "@/config/tour-steps";
import { useTour } from "@/context/tour-context";
import { useEffect } from "react";

import { OnboardingLayout } from "../_components/onboarding-layout";
import { VerifyEmailComponent } from "../_components/verify-email";

const VerifyEmailPage = () => {
  const { startTour } = useTour();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "onboarding-vendor-email-tour-seen";
    const hasSeenTour = window.localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      startTour(vendorEmailVerificationTourSteps);
      window.localStorage.setItem(storageKey, "true");
    }
  }, [startTour]);

  return (
    <OnboardingLayout showProgress={false}>
      <VerifyEmailComponent />
    </OnboardingLayout>
  );
};

export default VerifyEmailPage;
