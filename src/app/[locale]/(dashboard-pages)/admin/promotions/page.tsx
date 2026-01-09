"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import SkiButton from "@/components/shared/button";
import { formatCurrency } from "@/lib/i18n/utils";
import { usePromotionService } from "@/services/dashboard/vendor/promotions/use-promotion-service";
import { Clock, DollarSign } from "lucide-react";
import { useState } from "react";

import { DashboardHeader } from "../../_components/dashboard-header";
import { OverViewCard } from "../../_components/overview-card";
import { PromotionFormModal } from "./_views/promotion-form-modal";
import { PromotionHistoryTable } from "./_views/promotion-history-table";
import { PromotionRequestsTable } from "./_views/promotion-request-table";

const Promotions = () => {
  const { useGetAllAvailablePromotions } = usePromotionService();
  const { data } = useGetAllAvailablePromotions();

  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const promotions = (data?.data?.items ?? []) as Promotion[];
  const metadata = data?.data?.metadata;

  const totalPromotions = metadata?.total ?? promotions.length ?? 0;
  // All available promotion packages are considered "active" from an admin perspective
  const activePromotions = totalPromotions ?? 0;
  // No explicit "expired" concept is exposed for promotion packages yet
  const expiredPromotions = 0;
  // const promotionsRevenue = promotions.reduce((sum, promotion) => sum + (promotion.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <DashboardHeader
          title="Promotions & Ads"
          subtitle="Manage promotions, approve requests and monitor revenue"
          showSubscriptionBanner={false}
          icon={<Icons.promotion className={`size-6`} />}
          actionComponent={
            <SkiButton
              variant="primary"
              onClick={() => {
                setEditingPromotion(null);
                setIsPromotionModalOpen(true);
              }}
            >
              Create Promotion
            </SkiButton>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <OverViewCard
          title="Total Promotions"
          value={totalPromotions ?? 0}
          icon={<Icons.promotion className="size-6" />}
          iconClassName="bg-primary/10"
        />
        <OverViewCard
          title="Active Promotions"
          value={activePromotions ?? 0}
          icon={<Clock className="size-6 stroke-3" />}
          iconClassName="bg-green-100"
        />
        <OverViewCard
          title="Expired Promotions"
          value={expiredPromotions ?? 0}
          icon={<Clock className="size-6 stroke-3" />}
          iconClassName="bg-orange-100"
        />
        <OverViewCard
          title="Promotions Revenue"
          // value={formatCurrency(promotionsRevenue ?? 0)}
          value={formatCurrency(0)}
          icon={<DollarSign className="size-6 stroke-3" />}
          iconClassName="bg-blue-100"
        />
      </div>

      <section className="space-y-8">
        <PromotionRequestsTable
          onEditPromotion={(promotion) => {
            setEditingPromotion(promotion as Promotion);
            setIsPromotionModalOpen(true);
          }}
        />
        <PromotionHistoryTable />
      </section>

      <PromotionFormModal
        open={isPromotionModalOpen}
        onOpenChange={setIsPromotionModalOpen}
        initialPromotion={editingPromotion ?? undefined}
      />
    </div>
  );
};

export default Promotions;
