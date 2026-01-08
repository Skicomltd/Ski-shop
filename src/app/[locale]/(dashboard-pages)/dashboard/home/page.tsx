"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { useOrderColumn } from "@/components/shared/dashboard-table/table-data";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { orderStatusOptions } from "@/lib/constants";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useDashboardOrderService } from "@/services/dashboard/vendor/orders/use-order-service";
import { useDashboardProductService } from "@/services/dashboard/vendor/products/use-product-service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { GiWallet } from "react-icons/gi";
import { IoBag } from "react-icons/io5";
import { RiShoppingCartLine } from "react-icons/ri";

import { DashboardHeader } from "../../_components/dashboard-header";
import { FilterDropdown } from "../../_components/dashboard-table/_components/filter-dropdown";
import { OverViewCard } from "../../_components/overview-card";
import { CurrencyDropdown } from "./_components/currency-dropdown";
import { AnalysisSkeleton, TableSkeleton } from "./page-skeleton";

const Page = () => {
  const router = useRouter();
  const orderColumn = useOrderColumn();
  const {
    search: searchQuery,
    status,
    limit,
    // page,
    setSearch: setSearchQuery,
    setStatus,
    resetToFirstPage,
  } = useDashboardSearchParameters();
  const { data: session } = useSession();
  const filters = useMemo(
    () => ({
      // page,
      ...(status !== "all" && { status: status as "delivered" | "pending" | "cancelled" }),
      ...(searchQuery && { search: searchQuery }),
      ...(limit && { limit }),
    }),
    [status, searchQuery, limit],
  );

  const { useGetAllProducts } = useDashboardProductService();
  const { useGetAllOrders } = useDashboardOrderService();
  const { data: productData, isLoading: isProductsLoading, isError: isProductsError } = useGetAllProducts(filters);
  const { data: orderData, refetch } = useGetAllOrders(filters);

  // Extract data from the correct structure
  const totalProducts = productData?.data?.metadata?.total || 0;
  const orders = orderData?.data?.items || [];
  const totalOrders = orderData?.data?.metadata?.total || 0;
  const totalPagesOrders = orderData?.data?.metadata?.totalPages || 0;
  const hasNextPageOrders = orderData?.data?.metadata?.hasNextPage || false;
  const hasPreviousPageOrders = orderData?.data?.metadata?.hasPreviousPage || false;

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      if (newSearch !== searchQuery) {
        setSearchQuery(newSearch);
        resetToFirstPage();
      }
    },
    [setSearchQuery, resetToFirstPage, searchQuery],
  );

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      if (newStatus !== status) {
        setStatus(newStatus as "all" | "delivered" | "pending" | "cancelled");
        resetToFirstPage();
      }
    },
    [setStatus, resetToFirstPage, status],
  );

  const renderDashboardHeader = () => (
    <DashboardHeader
      actionComponent={<CurrencyDropdown />}
      title="Dashboard Overview"
      subtitle={`Welcome to your dashboard, ${session?.user?.name}`}
      showSubscriptionBanner
      icon={<Icons.dashboard />}
    />
  );

  const renderOverviewLoadingSkeleton = () => <AnalysisSkeleton />;

  const renderOverviewErrorState = () => <ErrorState onRetry={() => refetch()} />;

  const renderOverviewCards = () => (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <OverViewCard
        title="Total Sales"
        value={"0"}
        icon={<GiWallet />}
        iconClassName="bg-low-blue dark:bg-[#111111] text-[24px] text-primary"
      />
      <OverViewCard
        title="Total Orders"
        value={totalOrders || "0"}
        icon={<RiShoppingCartLine />}
        iconClassName="bg-low-blue dark:bg-[#111111] text-[24px] text-primary"
      />
      <OverViewCard
        title="Total Products"
        value={totalProducts || "0"}
        icon={<IoBag />}
        iconClassName="bg-low-success dark:bg-[#111111] text-[24px] text-mid-success"
      />
    </section>
  );

  const renderOverviewSection = () => {
    if (isProductsLoading) {
      return renderOverviewLoadingSkeleton();
    }

    if (isProductsError) {
      return renderOverviewErrorState();
    }

    return renderOverviewCards();
  };

  const renderOrdersTableHeader = () => (
    <section className="flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center">
      <div className="mb-6">
        <h5 className="flex items-center gap-2 !text-2xl font-semibold">Recent Orders</h5>
        <p className="mt-1 text-sm text-gray-500">Track your recent orders and their status</p>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <SearchInput onSearch={handleSearchChange} initialValue={searchQuery} delay={500} />
          <FilterDropdown options={orderStatusOptions} value={status} onValueChange={handleStatusChange} />
        </div>
      </div>
    </section>
  );

  const renderOrdersTableLoadingSkeleton = () => <TableSkeleton />;

  const renderOrdersTableErrorState = () => <ErrorState onRetry={() => refetch()} />;

  const renderOrdersTable = () => (
    <DashboardTable
      data={orders}
      columns={orderColumn}
      totalPages={totalPagesOrders}
      itemsPerPage={totalOrders}
      hasPreviousPage={hasPreviousPageOrders}
      hasNextPage={hasNextPageOrders}
      showPagination
      pageParameter="page"
    />
  );

  const renderOrdersEmptyState = () => (
    <EmptyState
      title="No products found"
      description="There are no order available."
      descriptionClassName={`mb-2`}
      button={{
        text: "Add Product",
        onClick: () => router.push("/dashboard/products/new"),
      }}
    />
  );

  const renderOrdersTableContent = () => {
    if (isProductsLoading) {
      return renderOrdersTableLoadingSkeleton();
    }

    if (isProductsError) {
      return renderOrdersTableErrorState();
    }

    if (orders.length > 0) {
      return renderOrdersTable();
    }

    return renderOrdersEmptyState();
  };

  const renderOrdersTableSection = () => (
    <section>
      <section className="bg-background space-y-4 rounded-lg p-6 shadow-sm">
        {renderOrdersTableHeader()}
        <section>{renderOrdersTableContent()}</section>
      </section>
    </section>
  );

  return (
    <main className="space-y-8">
      {renderDashboardHeader()}
      {renderOverviewSection()}
      {renderOrdersTableSection()}
    </main>
  );
};

export default Page;
