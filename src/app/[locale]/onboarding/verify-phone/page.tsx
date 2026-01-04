"use client";

import { Logo } from "@/components/shared/logo";
import { customerPhoneVerificationTourSteps } from "@/config/tour-steps";
import { useTour } from "@/context/tour-context";
import { useEffect } from "react";

import { VerifyPhoneComponent } from "../vendor/_components/verify-phone";

const VerifyPhonePage = () => {
  const { startTour } = useTour();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "onboarding-customer-phone-verify-tour-seen";
    const hasSeenTour = window.localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      startTour(customerPhoneVerificationTourSteps);
      window.localStorage.setItem(storageKey, "true");
    }
  }, [startTour]);

  return (
    <section className="hide-scrollbar mx-auto flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 lg:max-w-[550px] lg:px-8">
      <div className="bg-primary/10 mx-auto mt-20 flex h-16 w-16 items-center justify-center rounded-full">
        <Logo width={40} height={40} className="text-primary" />
      </div>
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl" data-tour="onboarding-main">
        <VerifyPhoneComponent />
      </div>
    </section>
  );
};

export default VerifyPhonePage;
