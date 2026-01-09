"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { useAdminOrderColumn } from "@/components/shared/dashboard-table/admin/admin-table-data";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { orderStatusOptions } from "@/lib/constants";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/i18n/utils";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useHomeService } from "@/services/dashboard/vendor/home/use-home-service";
import { useDashboardOrderService } from "@/services/dashboard/vendor/orders/use-order-service";
import { usePayoutService } from "@/services/dashboard/vendor/payouts";
import { useSettingsService } from "@/services/dashboard/vendor/settings/use-settings-service";
import { useUserService } from "@/services/externals/user/use-user-service";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { GiWallet } from "react-icons/gi";
import { IoRibbonOutline } from "react-icons/io5";
import { MdOutlineAddCard } from "react-icons/md";
import { PiUsersThreeLight } from "react-icons/pi";
import { RiShoppingCartLine } from "react-icons/ri";

import { DashboardHeader } from "../../_components/dashboard-header";
import { FilterDropdown } from "../../_components/dashboard-table/_components/filter-dropdown";
import { OverViewCard } from "../../_components/overview-card";
import { SectionTwo } from "./_components/currency-dropdown/section-two";
import { AnalysisSkeleton, SectionTwoSkeleton, TableSkeleton } from "./_components/page-skeleton";

const Page = () => {
  const locale = useLocale() as Locale;
  const { data: session } = useSession();

  const {
    // page: currentPage,
    search: searchQuery,
    status,
    limit,
    setSearch: setSearchQuery,
    setStatus,
    resetToFirstPage,
  } = useDashboardSearchParameters();

  const orderFilters = {
    // page: currentPage,
    ...(status !== "all" && { status: status as "pending" | "delivered" | "cancelled" }),
    ...(searchQuery && { search: searchQuery }),
    // ...(limit && { limit }),
  };

  const { useGetOverview } = useHomeService();
  const { useGetAllOrders } = useDashboardOrderService();
  const { useGetAllUsers } = useUserService();
  const { useGetPayouts } = usePayoutService();
  const { useGetSubscriptions } = useSettingsService();

  const orderColumn = useAdminOrderColumn();

  const { data: overviewData, isLoading: isOverviewLoading, isError: isOverviewError, refetch } = useGetOverview();
  const {
    data: allOrders,
    isLoading: isAllOrdersLoading,
    isError: isAllOrdersError,
    refetch: refetchOrders,
  } = useGetAllOrders(orderFilters);
  const { data: newOrders } = useGetAllOrders({ status: "pending" });

  const orders = allOrders?.data?.items || [];
  const totalPages = allOrders?.data?.metadata?.totalPages || 1;
  const hasNextPage = allOrders?.data?.metadata?.hasNextPage || false;
  const hasPreviousPage = allOrders?.data?.metadata?.hasPreviousPage || false;

  const { data: allUsers } = useGetAllUsers();
  const { data: payoutsData } = useGetPayouts();
  const { data: subscriptionsData } = useGetSubscriptions();

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    resetToFirstPage(); // Reset to first page when search changes
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as "all" | "pending" | "delivered" | "cancelled");
    resetToFirstPage(); // Reset to first page when status changes
  };

  // const handleRowClick = (order: Order) => {
  //   // Navigate to order details page
  //   window.location.href = `/admin/orders/${order.id}`;
  // };

  return (
    <main className="space-y-8">
      <DashboardHeader
        // actionComponent={<CurrencyDropdown />}
        title="Dashboard Overview"
        subtitle={`Welcome admin, ${session?.user?.name}`}
        showSubscriptionBanner={false}
        icon={<Icons.dashboard />}
      />

      {/* Overview Cards Section */}
      {isOverviewLoading ? (
        <AnalysisSkeleton />
      ) : isOverviewError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <OverViewCard
            title={"Total Revenue"}
            value={formatCurrency(overviewData?.data?.totalRevenue || 0, locale)}
            icon={<GiWallet className="size-6" />}
            iconClassName="bg-[#F2EBFB] text-[24px] text-purple"
          />
          <OverViewCard
            title={"Total Orders"}
            value={allOrders?.data.metadata.total || "0"}
            icon={<RiShoppingCartLine className="size-6" />}
            iconClassName="bg-low-blue text-[24px] blue text-primary"
          />
          <OverViewCard
            title={"Total Users"}
            value={allUsers?.data.metadata.total || "0"}
            icon={<PiUsersThreeLight className="size-6 stroke-3" />}
            iconClassName="bg-low-success text-[24px] text-mid-success"
          />
          <OverViewCard
            title={"New Orders"}
            value={newOrders?.data.metadata.total || "0"}
            icon={<RiShoppingCartLine className="size-6" />}
            iconClassName="bg-low-blue text-[24px] blue text-primary"
          />
          <OverViewCard
            title={"Pending Payouts"}
            value={payoutsData?.data.metadata.total || "0"}
            icon={<MdOutlineAddCard className="size-6" />}
            iconClassName="bg-low-danger text-[24px] text-mid-danger"
          />
          <OverViewCard
            title={"Active Subscriptions"}
            value={subscriptionsData?.data?.metadata.total || "0"}
            icon={<IoRibbonOutline className="size-6 stroke-3" />}
            iconClassName="bg-low-success text-[24px] text-mid-success"
          />
        </section>
      )}

      {/* Section Two */}
      <section>
        {isOverviewLoading ? (
          <SectionTwoSkeleton />
        ) : isOverviewError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <SectionTwo />
        )}
      </section>

      {/* Orders Table Section */}
      <section>
        <section className={`bg-background mt-6 space-y-4 rounded-lg p-6 shadow-sm`}>
          <DashboardHeader
            title="Recent Orders"
            subtitle="Track Skishop recent orders and their status"
            showSubscriptionBanner={false}
            icon={<Icons.cart className="mt-[-2] size-4" />}
            titleClassName={`!text-lg`}
            subtitleClassName={`!text-sm`}
            actionComponent={
              <div className="">
                <div className="flex items-center gap-2">
                  <SearchInput className={``} onSearch={handleSearchChange} initialValue={searchQuery} />
                  <FilterDropdown options={orderStatusOptions} value={status} onValueChange={handleStatusChange} />
                </div>
              </div>
            }
          />
          <section aria-busy={isAllOrdersLoading} aria-live="polite">
            {isAllOrdersLoading ? (
              <TableSkeleton />
            ) : isAllOrdersError ? (
              <ErrorState onRetry={refetchOrders} />
            ) : Array.isArray(orders) && orders.length > 0 ? (
              <DashboardTable
                data={orders}
                columns={orderColumn}
                totalPages={totalPages}
                itemsPerPage={limit ?? 10}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                showPagination
                pageParameter="page"
                // onRowClick={handleRowClick}
              />
            ) : (
              <div className="flex items-center justify-center p-20" role="status" aria-live="polite">
                {searchQuery || status !== "all" ? (
                  <EmptyState className={`bg-transparent`} title={`No orders match your filters.`} />
                ) : (
                  <EmptyState className={`bg-transparent`} title={`No orders match your filters.`} />
                )}
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
};

export default Page;
