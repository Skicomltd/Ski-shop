"use client";

import { BackButton } from "@/components/shared/back-button";
import SkiButton from "@/components/shared/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { usePromotionService } from "@/services/dashboard/vendor/promotions/use-promotion-service";

import { CampaignCard } from "../_components/campaign-card";
import { DashboardHeader } from "../../../_components/dashboard-header";

const Page = () => {
  const { useGetActiveCampaigns } = usePromotionService();
  const { data: campaigns, isLoading, isError, refetch } = useGetActiveCampaigns();

  const items = campaigns?.data?.items || [];

  return (
    <main className="space-y-8">
      <DashboardHeader
        title="Active Campaigns"
        subtitle={`View your active campaigns, view the performance of your campaigns and view the details of your campaigns`}
        showSubscriptionBanner
        icon={<BackButton />}
      />

      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-background rounded-lg border p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((index_) => (
                    <div key={index_} className="bg-background rounded-md border p-3 text-center">
                      <Skeleton className="mx-auto h-4 w-16" />
                      <Skeleton className="mx-auto mt-2 h-3 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !items || items.length === 0 ? (
          <EmptyState
            title="No active campaigns"
            className="bg-background"
            description="You have no active campaigns at the moment."
            descriptionClassName="text-base mb-4"
            actionButton={
              <SkiButton variant="primary" size="lg" onClick={() => refetch()}>
                Refresh
              </SkiButton>
            }
          />
        ) : (
          <div className="space-y-4">
            {items.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
