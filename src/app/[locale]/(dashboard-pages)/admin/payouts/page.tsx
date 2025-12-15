"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import SkiButton from "@/components/shared/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { formatCurrency } from "@/lib/i18n/utils";
import { useAdminService } from "@/services/dashboard/admin/use-admin-service";
import { Clock, DollarSign, Wallet } from "lucide-react";

import { DashboardHeader } from "../../_components/dashboard-header";
import { OverViewCard } from "../../_components/overview-card";
import { PayoutHistoryTable } from "./_views/payout-history-table";
import { PayoutRequestTable } from "./_views/payout-request-table";
import PayoutSkeleton from "./_views/payout-skeleton";

const Payout = () => {
  const { useGetPayoutsStats } = useAdminService();

  const { data, isLoading, error, refetch } = useGetPayoutsStats();

  if (isLoading) return <PayoutSkeleton />;
  if (error)
    return (
      <ErrorState
        title="Failed to load payouts"
        description={(error as Error)?.message || "Something went wrong, please try again."}
        onRetry={() => refetch()}
        className="!bg-background min-h-[calc(100vh-130px)]"
      />
    );

  const stats = data?.data;
  const isEmptyStats =
    !stats ||
    ((stats?.totalPayoutsPaid ?? 0) === 0 && (stats?.walletBalance ?? 0) === 0 && (stats?.pendingPayouts ?? 0) === 0);

  return (
    <div className="space-y-6">
      <div>
        <DashboardHeader
          title="Payouts Overview"
          subtitle="Monitor your payout statistics and wallet balance"
          showSubscriptionBanner={false}
          icon={<Icons.payouts className={`size-6`} />}
        />
      </div>

      {isEmptyStats ? (
        <EmptyState
          title="No payout activity yet"
          description="When payouts begin, you'll see totals and wallet balance here."
          actionButton={
            <SkiButton variant={`primary`} size={`lg`} className={`mt-4`} onClick={() => refetch()}>
              Refresh
            </SkiButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <OverViewCard
            title="Total Payouts Paid"
            value={formatCurrency(stats?.totalPayoutsPaid || 0)}
            icon={<DollarSign className="h-4 w-4 text-green-600" />}
            iconClassName="bg-green-100"
          />
          <OverViewCard
            title="Wallet Balance"
            value={formatCurrency(stats?.walletBalance || 0)}
            icon={<Wallet className="h-4 w-4 text-blue-600" />}
            iconClassName="bg-blue-100"
          />
          <OverViewCard
            title="Pending Payouts"
            value={formatCurrency(stats?.pendingPayouts || 0)}
            icon={<Clock className="h-4 w-4 text-orange-600" />}
            iconClassName="bg-orange-100"
          />
        </div>
      )}
      <section className="space-y-8">
        <PayoutHistoryTable />
        <PayoutRequestTable />
      </section>
    </div>
  );
};

export default Payout;
