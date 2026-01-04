"use client";

import { vendorStoreSetupTourSteps } from "@/config/tour-steps";
import { useTour } from "@/context/tour-context";
import { useEffect } from "react";

import { OnboardingLayout } from "../_components/onboarding-layout";
import { StoreForm } from "../_components/store-form";

const StoreSetupPage = () => {
  const { startTour } = useTour();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "onboarding-vendor-store-tour-seen";
    const hasSeenTour = window.localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      startTour(vendorStoreSetupTourSteps);
      window.localStorage.setItem(storageKey, "true");
    }
  }, [startTour]);

  return (
    <OnboardingLayout currentStep={5}>
      <StoreForm />
    </OnboardingLayout>
  );
};

export default StoreSetupPage;
