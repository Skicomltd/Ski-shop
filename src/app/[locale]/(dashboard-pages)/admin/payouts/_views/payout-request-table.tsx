"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import SkiButton from "@/components/shared/button";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { useAdminPayoutRequestColumn } from "@/components/shared/dashboard-table/admin/admin-table-data";
import { EmptyState } from "@/components/shared/empty-state";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { usePayoutService } from "@/services/dashboard/vendor/payouts";
import { useCallback, useMemo } from "react";

import { DashboardHeader } from "../../../_components/dashboard-header";

const transformAdminWithdrawalsToPayoutRequests = (items: WithdrawalHistoryItem[]): PayoutRequest[] => {
  return items.map((item) => {
    const bank = item.bank;
    const user = bank?.user;

    const userId = user?.id ?? "";
    const userName = user?.fullName ?? "Unknown User";
    const storeName = bank?.bankName || bank?.name || undefined;
    const walletBalance = (item as WithdrawalHistoryItem & { walletBalance?: number }).walletBalance ?? 0;

    const role: PayoutRequest["role"] = "vendor"; // Current withdrawals are vendor-based

    return {
      id: item.id,
      userId,
      userName,
      storeName,
      role,
      walletBalance,
      amount: item.amount,
      dateTime: item.date,
      // Map underlying withdrawal status to admin request status
      status: item.status === "approved" || item.status === "completed" ? "approved" : "pending",
    };
  });
};

export const PayoutRequestTable = () => {
  const { search: searchQuery, setSearch: setSearchQuery, resetToFirstPage } = useDashboardSearchParameters();
  const { useGetAdminWithdrawals, useInitiateWithdrawalApproval } = usePayoutService();

  // Fetch pending withdrawals using the "Find as Admin" endpoint (status=pending)
  const { data: withdrawalsData, refetch } = useGetAdminWithdrawals({ status: "pending" });

  const { mutate: mutateWithdrawalDecision } = useInitiateWithdrawalApproval();

  const payoutRequests = useMemo(() => {
    const items = withdrawalsData?.success ? withdrawalsData.data : [];
    const requests = transformAdminWithdrawalsToPayoutRequests(items);

    const query = (searchQuery || "").toLowerCase().trim();
    if (!query) return requests;

    return requests.filter((request) => {
      const name = request.userName?.toLowerCase() ?? "";
      const store = request.storeName?.toLowerCase() ?? "";
      const role = request.role?.toLowerCase() ?? "";
      return name.includes(query) || store.includes(query) || role.includes(query);
    });
  }, [withdrawalsData, searchQuery]);

  const totalRequests = payoutRequests.length;
  const totalPages = 1;
  const hasNextPage = false;
  const hasPreviousPage = false;

  const handleDecision = useCallback(
    (request: PayoutRequest, decision: "approve" | "reject") => {
      mutateWithdrawalDecision(
        { decision, withdrawalId: request.id },
        {
          onSuccess: () => {
            // Refresh pending requests after a decision is made
            void refetch();
          },
        },
      );
    },
    [mutateWithdrawalDecision, refetch],
  );

  const columns = useAdminPayoutRequestColumn(
    (request) => handleDecision(request, "approve"),
    (request) => handleDecision(request, "reject"),
  );

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
      images={[{ src: "/images/empty-state.svg", width: 50, height: 50, alt: "No payout requests" }]}
      title="No payout requests found"
      description="There are no payout requests matching your criteria."
      className="bg-mid-grey-I space-y-0 rounded-lg"
      titleClassName="!text-2xl"
      descriptionClassName="text-base mb-4"
      actionButton={
        <SkiButton onClick={() => window.location.reload()} variant={`primary`}>
          Refresh
        </SkiButton>
      }
    />
  );

  const renderPayoutRequestsTable = () => (
    <section className={`bg-background space-y-6 rounded-lg p-6 shadow-sm`}>
      <DashboardHeader
        title="Payout Requests"
        subtitle="Track all payout requests from users"
        showSubscriptionBanner={false}
        titleClassName={`!text-lg`}
        subtitleClassName={`!text-sm`}
        icon={<Icons.payouts className={`size-6`} />}
        actionComponent={
          <div className="flex items-center gap-2">
            <SearchInput className="" onSearch={handleSearchChange} initialValue={searchQuery} />
            {/* <DownloadCsvButton
            data={(payoutRequests || []) as Record<string, unknown>[]}
            filename="payout-requests"
            headers={{
              userName: "Store/Rider Name",
              role: "Role",
              walletBalance: "Wallet Balance",
              amount: "Amount",
              dateTime: "Date & Time",
              status: "Status",
            }}
          /> */}
          </div>
        }
      />
      <div>
        {!payoutRequests || payoutRequests.length === 0 ? (
          renderEmptyState()
        ) : (
          <DashboardTable
            data={payoutRequests}
            columns={columns}
            totalPages={totalPages}
            itemsPerPage={totalRequests}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            showPagination
            pageParameter="page"
          />
        )}
      </div>
    </section>
  );

  const renderPayoutRequestsContent = () => {
    return renderPayoutRequestsTable();
  };

  return renderPayoutRequestsContent();
};
