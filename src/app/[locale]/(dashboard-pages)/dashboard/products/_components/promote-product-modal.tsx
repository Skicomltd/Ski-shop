"use client";

import { BackButton } from "@/components/shared/back-button";
import SkiButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/i18n/utils";
import { usePromotionService } from "@/services/dashboard/vendor/promotions/use-promotion-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { DashboardHeader } from "../../../_components/dashboard-header";

interface PromoteProductModalProperties {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export function PromoteProductModal({ isOpen, onClose, product }: PromoteProductModalProperties) {
  const locale = useLocale();
  const [promotionType, setPromotionType] = useState("");
  const [promotionPrice, setPromotionPrice] = useState("0.00");
  const { useGetAllAvailablePromotions, useCreateAds } = usePromotionService();
  const { data, isLoading } = useGetAllAvailablePromotions();
  const { mutateAsync: createAds, isPending: isCreating } = useCreateAds();

  const promotions = useMemo(() => data?.data?.items ?? [], [data]);

  // Standard form handling
  const promotionFormSchema = useMemo(
    () =>
      z.object({
        promotionId: z.string().min(1, "Promotion type is required"),
        price: z.number({ invalid_type_error: "Price is required" }).min(0.01, "Price must be greater than 0"),
      }),
    [],
  );

  type PromotionFormData = z.infer<typeof promotionFormSchema>;

  const methods = useForm<PromotionFormData>({
    resolver: zodResolver(promotionFormSchema),
    mode: "onChange",
    defaultValues: {
      promotionId: "",
      price: 0,
    },
  });

  const { handleSubmit, setValue, watch, formState } = methods;
  const selectedPromotionId = watch("promotionId");

  useEffect(() => {
    // Keep legacy UI state in sync with form state
    setPromotionType(selectedPromotionId ?? "");
    const selected = promotions.find((p) => p.id === selectedPromotionId);
    if (selected) {
      const amount = Number(selected.amount ?? 0);
      setPromotionPrice(amount.toFixed(2));
      setValue("price", amount, { shouldValidate: true, shouldDirty: true });
    }
  }, [selectedPromotionId, promotions, setValue]);

  const onSubmit = async () => {
    if (!selectedPromotionId) return;
    const response = await createAds({
      data: {
        promotionId: selectedPromotionId,
        productId: product.id,
        paymentMethod: "paystack",
      },
    });
    const redirectUrl = response?.data?.checkoutUrl;
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const selectedPromotion = useMemo(() => promotions.find((p) => p.id === promotionType), [promotions, promotionType]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DashboardHeader
            title="Promote Product"
            subtitle={product.name}
            showSubscriptionBanner={false}
            titleClassName={`!text-2xl !font-bold`}
            subtitleClassName={"ml-8 !text-sm"}
            icon={<BackButton />}
          />
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Promotion Type */}
            <FormField
              label="Promotion Type"
              name="promotionId"
              type="select"
              placeholder={isLoading ? "Loading promotions..." : "Select promotion type"}
              disabled={isLoading || promotions.length === 0}
              className="!h-12 w-full bg-transparent"
              options={promotions.map((promo) => ({
                value: promo.id,
                label: promo.name,
              }))}
            />

            {/* Promotion Price */}
            <FormField
              label="Price"
              name="price"
              type="number"
              disabled
              placeholder="0.00"
              className="!h-12 border-none !bg-transparent !ring-0"
              containerClassName="w-full border-border w-full border rounded-md px-4"
              leftAddon={<span className="text-gray-500">₦</span>}
              onChange={(event) => setPromotionPrice(event.target.value)}
            />

            {/* Warning Message */}
            <div className="dark:bg-background dark:border-border rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium">Limited Promotion Reach</p>
                  <p className="mt-1">
                    Promotion reach is limited for Basic Vendors. Upgrade to Star Seller for wider visibility and
                    reduced cost.
                  </p>
                </div>
              </div>
            </div>

            {/* Promotion Details */}
            {selectedPromotion && (
              <div className="!bg-muted rounded-lg p-4">
                <h4 className="mb-2 font-medium text-gray-900">Promotion Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{selectedPromotion?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">
                      {formatCurrency(Number.parseFloat(promotionPrice) || 0, locale as Locale)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{selectedPromotion?.duration} days</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <SkiButton
              type="submit"
              isDisabled={!formState.isValid || isLoading || isCreating}
              isLoading={isCreating}
              className="bg-primary hover:bg-primary/70 w-full px-6 py-3 font-medium text-white"
            >
              Confirm & Promote
            </SkiButton>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
