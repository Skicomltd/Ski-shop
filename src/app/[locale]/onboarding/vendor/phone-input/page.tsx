"use client";

import { vendorPhoneInputTourSteps } from "@/config/tour-steps";
import { useTour } from "@/context/tour-context";
import { useEffect } from "react";

import { OnboardingLayout } from "../_components/onboarding-layout";
import { PhoneInputForm } from "../_components/phone-input-form";

const PhoneInputPage = () => {
  const { startTour } = useTour();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "onboarding-vendor-phone-input-tour-seen";
    const hasSeenTour = window.localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      startTour(vendorPhoneInputTourSteps);
      window.localStorage.setItem(storageKey, "true");
    }
  }, [startTour]);

  return (
    <OnboardingLayout currentStep={2}>
      <PhoneInputForm />
    </OnboardingLayout>
  );
};

export default PhoneInputPage;
