"use client";

import { Check } from "lucide-react";

interface ProgressIndicatorProperties {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: string; title: string; step: number }>;
}

export const ProgressIndicator = ({ currentStep, totalSteps, steps }: ProgressIndicatorProperties) => {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700 sm:text-sm">
          Step {currentStep}/{totalSteps}
        </span>
      </div>
      {/* Mobile: simple progress bar for clarity */}
      <div className="block sm:hidden">
        <div className="h-1.5 w-full rounded-full bg-gray-200">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${Math.max(0, Math.min(1, currentStep / totalSteps)) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop / tablet: detailed numbered stepper */}
      <div className="hide-scrollbar hidden items-center space-x-4 overflow-x-auto sm:flex sm:overflow-visible">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] transition-colors sm:h-8 sm:w-8 sm:text-xs ${
                  isCompleted
                    ? "border-primary bg-primary text-white"
                    : isCurrent
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="font-medium">{String(index + 1).padStart(2, "0")}</span>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-8 transition-colors sm:w-12 ${isCompleted ? "bg-primary" : "bg-gray-300"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
