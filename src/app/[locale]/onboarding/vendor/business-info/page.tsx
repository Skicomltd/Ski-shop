"use client";

import { vendorBusinessInfoTourSteps } from "@/config/tour-steps";
import { useTour } from "@/context/tour-context";
import { useEffect } from "react";

import { BusinessInfoForm } from "../_components/business-info-form";
import { OnboardingLayout } from "../_components/onboarding-layout";

const BusinessInfoPage = () => {
  const { startTour } = useTour();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "onboarding-vendor-business-tour-seen";
    const hasSeenTour = window.localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      startTour(vendorBusinessInfoTourSteps);
      window.localStorage.setItem(storageKey, "true");
    }
  }, [startTour]);

  return (
    <OnboardingLayout currentStep={4}>
      <BusinessInfoForm />
    </OnboardingLayout>
  );
};

export default BusinessInfoPage;
