/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { BackButton } from "@/components/shared/back-button";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { useAdminOrderHistoryColumn } from "@/components/shared/dashboard-table/admin/admin-table-data";
import { Details } from "@/components/shared/details";
import { DownloadCsvButton } from "@/components/shared/download-csv-button";
import { ErrorState } from "@/components/shared/empty-state";
import { FilterDropdown } from "@/components/shared/filter-dropdown";
import { orderStatusOptions } from "@/lib/constants";
import { formatDate } from "@/lib/i18n/utils";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useDashboardOrderService } from "@/services/dashboard/vendor/orders/use-order-service";

import { TableSkeleton } from "../../../../home/_components/page-skeleton";

const BuyersView = ({ id, profile }: { id: string; profile: any }) => {
  const {
    // page: currentPage,
    search: searchQuery,
    status,
    limit,
    setSearch: setSearchQuery,
    setStatus,
    resetToFirstPage,
  } = useDashboardSearchParameters();

  const orderColumn = useAdminOrderHistoryColumn();

  const orderFilters = {
    // page: currentPage,
    ...(status !== "all" && { status: status as "pending" | "delivered" | "cancelled" }),
    ...(searchQuery && { search: searchQuery }),
    // ...(limit && { limit }),
  };

  const { useGetAllOrders } = useDashboardOrderService();
  const {
    data: allOrders,
    isLoading: isAllOrdersLoading,
    isError: isAllOrdersError,
  } = useGetAllOrders({ ...orderFilters, buyerId: id });

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    resetToFirstPage(); // Reset to first page when search changes
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as "all" | "pending" | "delivered" | "cancelled");
    resetToFirstPage(); // Reset to first page when status changes
  };

  const orders = allOrders?.data?.items || [];
  const totalPages = allOrders?.data?.metadata?.totalPages || 1;
  const hasNextPage = allOrders?.data?.metadata?.hasNextPage || false;
  const hasPreviousPage = allOrders?.data?.metadata?.hasPreviousPage || false;

  return (
    <section className={`space-y-8`}>
      <DashboardHeader
        title={`Buyer's Profile - ${profile?.firstName} ${profile?.lastName}`}
        showSubscriptionBanner={false}
        icon={<BackButton />}
        actionComponent={
          <DownloadCsvButton
            data={(orders || []) as Record<string, unknown>[]}
            filename={`user-orders-${profile?.firstName || "user"}-${profile?.lastName || ""}`}
            headers={{
              reference: "Order ID",
              createdAt: "Date and Time",
              deliveryStatus: "Delivery Status",
            }}
          />
        }
      />

      <section className="space-y-6">
        <Details.Section className="shadow-sm" title="Profile Overview">
          <Details.Grid className={`lg:flex lg:justify-between`}>
            <Details.Item label="Full Name" value={`${profile?.firstName} ${profile?.lastName}`} />
            <Details.Item label="Email Address" value={profile?.email} />
            <Details.Item label="Phone Number" value={profile?.phoneNumber} />
            <Details.Item label="Date Joined" value={formatDate(profile?.createdAt)} />
            <Details.Item label="Orders" value={profile?.ordersCount ?? "—"} />
            <Details.Item label="Status" value={profile?.status ?? "—"} />
            <Details.Item label="Last Activity" value={formatDate(profile?.lastTimeActivity)} />
          </Details.Grid>
        </Details.Section>

        <section>
          {isAllOrdersLoading ? (
            <TableSkeleton />
          ) : isAllOrdersError ? (
            <ErrorState />
          ) : (
            <section className={`bg-background mt-6 space-y-4 rounded-lg p-6 shadow-sm`}>
              <section className={`flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center`}>
                <div className="">
                  <p className="text-lg font-bold"> Order History</p>
                </div>
                <div className="">
                  <div className="flex items-center gap-2">
                    <SearchInput className={``} onSearch={handleSearchChange} initialValue={searchQuery} />
                    <FilterDropdown options={orderStatusOptions} value={status} onValueChange={handleStatusChange} />
                  </div>
                </div>
              </section>
              <section>
                {isAllOrdersError ? (
                  <Loading text="Loading orders..." className="w-fill h-fit p-20" />
                ) : orders?.length ? (
                  <DashboardTable
                    data={orders}
                    columns={orderColumn}
                    totalPages={totalPages}
                    itemsPerPage={limit || 10}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    showPagination
                    pageParameter="page"
                    // onRowClick={handleRowClick}
                  />
                ) : (
                  <div className="flex items-center justify-center p-20">
                    <p>No orders found.</p>
                  </div>
                )}
              </section>
            </section>
          )}
        </section>
      </section>
    </section>
  );
};

export default BuyersView;
