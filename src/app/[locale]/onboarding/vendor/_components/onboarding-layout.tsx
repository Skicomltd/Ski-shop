"use client";

import { Logo } from "@/components/shared/logo";
import { ReactNode } from "react";

import { ProgressIndicator } from "./progress-indicator";

interface OnboardingLayoutProperties {
  children: ReactNode;
  currentStep?: number;
  showProgress?: boolean;
}

const steps = [
  { id: "verify-email", title: "Email Verification", step: 1 },
  { id: "phone-input", title: "Phone Number", step: 2 },
  { id: "verify-phone", title: "Phone Verification", step: 3 },
  { id: "business-info", title: "Business Info", step: 4 },
  { id: "store-setup", title: "Store Setup", step: 5 },
  { id: "bank-payout", title: "Bank & Payout", step: 6 },
];

export const OnboardingLayout = ({ children, currentStep, showProgress = true }: OnboardingLayoutProperties) => {
  return (
    <div className="flex min-h-screen flex-col" data-tour="onboarding-layout">
      <div className="bg-primary/10 mx-auto mt-20 flex h-16 w-16 items-center justify-center rounded-full">
        <Logo width={40} height={40} className="text-primary" />
      </div>
      {showProgress && currentStep && (
        <div className="mx-auto px-4 py-4" data-tour="onboarding-progress">
          <ProgressIndicator currentStep={currentStep} totalSteps={6} steps={steps} />
        </div>
      )}
      {/* Content */}
      <div className="flex flex-1 justify-center p-4">
        <div className="w-full max-w-xl" data-tour="onboarding-main">
          {children}
        </div>
      </div>
    </div>
  );
};
