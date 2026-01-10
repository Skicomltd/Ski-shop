"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import { Icons } from "@/components/core/miscellaneous/icons";
import SkiButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter as UIDialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/i18n/utils";
import { useSettingsService } from "@/services/dashboard/vendor/settings/use-settings-service";
import { CheckCircle } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type PlanId = "monthly" | "quarterly" | "yearly";

type Plan = {
  id: PlanId;
  name: string;
  price: number;
  note?: string;
  saveLabel?: string;
};

export function SubscriptionFlow() {
  const locale = useLocale() as Locale;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "paystack">("bank");
  const [showBankDialog, setShowBankDialog] = useState(false);

  const { useGetAllAvailablePlans, useCreateSubscriptions } = useSettingsService();
  const { data: plansData, isLoading: plansLoading, error: plansError } = useGetAllAvailablePlans();
  const createSubscriptionMutation = useCreateSubscriptions();

  const PLANS: Plan[] = useMemo(() => {
    if (!plansData?.data?.items) return [];
    const plans = plansData.data.items as unknown as AdminSubscriptionPlan[];
    return plans.map((plan) => {
      const saved = plan.amount * (plan.savingPercentage / 100);
      return {
        id: plan.planCode as PlanId,
        name: plan.name,
        price: plan.amount,
        note: plan.savingPercentage > 0 ? `Save ₦${saved.toLocaleString()} (${plan.savingPercentage}%)` : undefined,
      };
    });
  }, [plansData]);

  const activePlan = useMemo(() => PLANS.find((p) => p.id === selectedPlan)!, [selectedPlan, PLANS]);

  const handleProceed = () => {
    if (paymentMethod === "paystack") {
      // Call the mutation to create subscription
      createSubscriptionMutation.mutate(
        {
          amount: activePlan.price,
          planCode: activePlan.id,
          planType: activePlan.name,
        },
        {
          onSuccess: (response) => {
            if (response?.success) {
              toast.success("Redirecting to Paystack to complete your subscription");
              window.open(response.data.payment.authorizationUrl as string, "_blank", "noopener,noreferrer");
            }
          },
          onError: (error) => {
            toast.error("Failed to initiate subscription. Please try again.", {
              description: error.message,
            });
          },
        },
      );
    } else {
      setShowBankDialog(true);
    }
  };

  return (
    <section className="space-y-8">
      {/* Header / Progress */}
      <DashboardHeader
        actionComponent={<Image src="/images/skicom-star.svg" width={48} height={48} alt="Skicom Star" />}
        title="Unlock Star Seller Benefits"
        subtitle="Enjoy powerful tools and badges that boost your visibility and credibility."
        icon={<Icons.ribbonOutline />}
        showSubscriptionBanner
      />
      {/* Steps */}
      {step === 1 && (
        <Card className={`border-none px-4 shadow`}>
          <CardHeader className="border-b">
            <CardTitle className="!text-xl !font-bold">Unlock Star Seller Benefits</CardTitle>
            <CardDescription>
              Enjoy powerful tools and badges that boost your visibility and credibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
            <ul className="bg-primary/5 border-primary space-y-8 rounded-xl border-2 p-4">
              <li className="flex items-center gap-3">
                <CheckCircle className="text-primary mt-0.5 size-6 stroke-3" />
                <span className="text-sm font-medium lg:text-base">Boosted product visibility</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-primary mt-0.5 size-6 stroke-3" />
                <span className="text-sm font-medium lg:text-base">Verified Star Seller badge</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-primary mt-0.5 size-6 stroke-3" />
                <span className="text-sm font-medium lg:text-base">Access to campaign promotions</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-primary mt-0.5 size-6 stroke-3" />
                <span className="text-sm font-medium lg:text-base">Advanced analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-primary mt-0.5 size-6 stroke-3" />
                <span className="text-sm font-medium lg:text-base">Priority support</span>
              </li>
            </ul>

            {/* Plan selection */}
            <div>
              <p className="!text-primary mb-3 text-lg !font-semibold">Choose a Plan</p>
              {plansLoading ? (
                <p>Loading plans...</p>
              ) : plansError ? (
                <p className="text-red-500">Failed to load plans. Please try again.</p>
              ) : (
                <RadioGroup
                  value={selectedPlan}
                  onValueChange={(value) => setSelectedPlan(value as PlanId)}
                  className="space-y-3"
                >
                  {PLANS.map((plan) => (
                    <label key={plan.id} className="block">
                      <div className="hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={plan.id} className="mt-0.5" />
                          <div className="leading-tight">
                            <p className="text-sm !font-semibold capitalize">{plan.name}</p>
                            {plan.note && <p className="text-muted-foreground mt-0.5 text-xs">{plan.note}</p>}
                          </div>
                        </div>
                        <p className="text-sm !font-bold">{formatCurrency(plan?.price, locale)}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <SkiButton
              variant="primary"
              className="ml-auto"
              onClick={() => setStep(2)}
              isDisabled={
                plansLoading || !!plansError || PLANS.length === 0 || !PLANS.some((p) => p.id === selectedPlan)
              }
            >
              Continue
            </SkiButton>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className={`border-none px-4 shadow`}>
          <CardHeader className="border-b">
            <CardTitle>Payment</CardTitle>
            <CardDescription>Select a payment method to activate your Star Seller benefits.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-2 text-sm font-semibold">Payment Method</p>
            <div className="space-y-3">
              <label className="block">
                <div className="hover:bg-accent/50 flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-colors">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                      className="mt-1"
                    />
                    <div className="leading-tight">
                      <p className="text-sm font-semibold">Direct Bank Transfer</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Make your payment directly to our account to activate your subscription. Your Star Seller
                        benefits will be activated once your payment is confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              <label className="block">
                <div className="hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="paystack"
                      checked={paymentMethod === "paystack"}
                      onChange={() => setPaymentMethod("paystack")}
                      className="mt-1"
                    />
                    <Image src="/images/paystack-logo.svg" alt="Paystack" width={100} height={24} />
                  </div>
                </div>
              </label>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="ml-auto flex items-center gap-3">
              <SkiButton variant="outline" onClick={() => setStep(1)}>
                Back
              </SkiButton>
              <SkiButton variant="primary" onClick={handleProceed}>
                Proceed to Pay ({formatCurrency(activePlan?.price, locale)})
              </SkiButton>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Bank Transfer Dialog */}
      <ReusableDialog
        open={showBankDialog}
        onOpenChange={setShowBankDialog}
        title="Direct Transfer"
        className="sm:max-w-md"
        trigger={<button className="hidden" aria-hidden />}
        headerClassName={`!text-lg !text-center`}
      >
        <div className="bg-background border-border rounded-xl border p-4">
          <div className="text-muted-foreground mb-3 text-center text-xs">
            Please wait while we confirm your payment to the displayed account details
          </div>
          <div className="bg-primary/10 border-primary rounded-xl border p-4 text-center">
            <p className="text-muted-foreground text-xs font-medium">Guaranty Trust Bank</p>
            <div className="mt-2 text-sm font-semibold">Skicom Store Limited</div>
            <div className="mt-3 text-lg font-bold tracking-wider">8087374878</div>
            <div className="text-muted-foreground mt-2 text-xs">Amount Payable</div>
            <div className="mt-1 text-base font-semibold">{formatCurrency(activePlan?.price, locale)}</div>
          </div>
          <p className="text-muted-foreground mt-3 flex items-center justify-center gap-2 text-xs">
            <span className="bg-primary inline-flex h-2 w-2 animate-pulse rounded-full" /> Confirming Payment...
          </p>
        </div>
        <UIDialogFooter>
          <SkiButton
            variant="primary"
            className="w-full"
            onClick={() => {
              // Call the mutation to create subscription for bank transfer
              createSubscriptionMutation.mutate(
                {
                  amount: activePlan.price,
                  planCode: selectedPlan,
                  planType: selectedPlan,
                },
                {
                  onSuccess: () => {
                    setShowBankDialog(false);
                    setStep(3);
                    toast.success("Payment instructions sent. We will confirm and activate your benefits shortly.");
                  },
                  onError: () => {
                    toast.error("Failed to initiate subscription. Please try again.");
                  },
                },
              );
            }}
          >
            I have made the transfer
          </SkiButton>
        </UIDialogFooter>
      </ReusableDialog>

      {step === 3 && (
        <Card className={`shadow`}>
          <CardHeader className="border-b">
            <CardTitle>You&apos;re all set 🎉</CardTitle>
            <CardDescription>
              We are confirming your payment. You will receive an update once your Star Seller benefits are activated.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm">
              Selected plan: {activePlan.name} — {formatCurrency(activePlan?.price, locale)}
            </p>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <SkiButton variant="primary" className="ml-auto" onClick={() => setStep(1)}>
              Manage Subscription
            </SkiButton>
          </CardFooter>
        </Card>
      )}
    </section>
  );
}

export default SubscriptionFlow;
