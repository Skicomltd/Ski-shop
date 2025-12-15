"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { useAdminPayoutHistoryColumn } from "@/components/shared/dashboard-table/admin/admin-table-data";
import { DownloadCsvButton } from "@/components/shared/download-csv-button";
import { EmptyState } from "@/components/shared/empty-state";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { usePayoutService } from "@/services/dashboard/vendor/payouts";
import { useCallback, useMemo } from "react";

import { DashboardHeader } from "../../../_components/dashboard-header";

export const PayoutHistoryTable = () => {
  const {
    page,
    limit,
    search: searchQuery,
    setSearch: setSearchQuery,
    resetToFirstPage,
  } = useDashboardSearchParameters();
  const { useGetPayouts } = usePayoutService();

  const serverFilters: Filters = useMemo(
    () => ({
      page,
      limit,
      search: searchQuery || undefined,
    }),
    [page, limit, searchQuery],
  );

  // Fetch all payouts for admin history using the dedicated payouts endpoint
  const { data: payoutsData } = useGetPayouts(serverFilters);

  const { payoutHistory, meta } = useMemo(() => {
    const apiData = payoutsData?.data;
    const items = (apiData?.items as unknown as PayoutHistory[]) ?? [];

    const query = (searchQuery || "").toLowerCase().trim();
    let filtered = items;

    if (query) {
      filtered = items.filter((entry) => {
        const name = entry.userName?.toLowerCase() ?? "";
        const store = entry.storeName?.toLowerCase() ?? "";
        const status = entry.status?.toLowerCase() ?? "";
        return name.includes(query) || store.includes(query) || status.includes(query);
      });
    }

    return {
      payoutHistory: filtered,
      meta: apiData?.metadata,
    };
  }, [payoutsData, searchQuery]);

  const totalHistory = payoutHistory.length;
  const totalPages = meta?.totalPages ?? 1;
  const hasNextPage = meta?.hasNextPage ?? false;
  const hasPreviousPage = meta?.hasPreviousPage ?? false;

  const columns = useAdminPayoutHistoryColumn();

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      if (newSearch !== searchQuery) {
        setSearchQuery(newSearch);
        resetToFirstPage();
      }
    },
    [setSearchQuery, resetToFirstPage, searchQuery],
  );

  const renderEmptyState = () => (
    <EmptyState
      images={[{ src: "/images/empty-state.svg", width: 80, height: 80, alt: "No payout history" }]}
      title="No payout history found"
      description="There are no payout transactions matching your criteria."
      className="bg-mid-grey-I space-y-0 rounded-lg"
      titleClassName="!text-2xl"
      descriptionClassName="text-base mb-4"
      actionButton={
        <button
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary/90 text-background rounded-md px-4 py-2"
        >
          Refresh
        </button>
      }
    />
  );

  const renderPayoutHistoryTable = () => (
    <section className={`bg-background space-y-6 rounded-lg p-6`}>
      <DashboardHeader
        title="Payout History"
        subtitle="Track all payout history from users"
        showSubscriptionBanner={false}
        icon={<Icons.payouts className={`size-6`} />}
        titleClassName={`!text-lg`}
        subtitleClassName={`!text-sm`}
        actionComponent={
          <div className="flex items-center gap-2">
            <SearchInput className="" onSearch={handleSearchChange} initialValue={searchQuery} />
            <DownloadCsvButton
              data={(payoutHistory || []) as Record<string, unknown>[]}
              filename="payout-history"
              headers={{
                userName: "Store/Rider Name",
                role: "Role",
                amount: "Amount",
                dateTime: "Date & Time",
                status: "Status",
                transactionId: "Transaction ID",
              }}
            />
          </div>
        }
      />

      <div>
        {!payoutHistory || payoutHistory.length === 0 ? (
          renderEmptyState()
        ) : (
          <DashboardTable
            data={payoutHistory}
            columns={columns}
            totalPages={totalPages}
            itemsPerPage={totalHistory}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            showPagination
            pageParameter="page"
          />
        )}
      </div>
    </section>
  );

  const renderPayoutHistoryContent = () => {
    return renderPayoutHistoryTable();
  };

  return renderPayoutHistoryContent();
};
