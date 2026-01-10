"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { BackButton } from "@/components/shared/back-button";
import SkiButton from "@/components/shared/button";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { useAdminOrderHistoryColumn } from "@/components/shared/dashboard-table/admin/admin-table-data";
import { Details } from "@/components/shared/details";
import { DownloadCsvButton } from "@/components/shared/download-csv-button";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterDropdown } from "@/components/shared/filter-dropdown";
import { orderStatusOptions } from "@/lib/constants";
import { formatDate } from "@/lib/i18n/utils";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useDashboardOrderService } from "@/services/dashboard/vendor/orders/use-order-service";
import { useDashboardProductService } from "@/services/dashboard/vendor/products/use-product-service";
import { useSettingsService } from "@/services/dashboard/vendor/settings/use-settings-service";

import { TableSkeleton } from "../../../../home/_components/page-skeleton";

const VendorsView = ({ id, profile }: { id: string; profile: Users }) => {
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
  const { useGetSubscriptions } = useSettingsService();
  const { useGetAllProducts } = useDashboardProductService();

  const {
    data: allOrders,
    isLoading: isAllOrdersLoading,
    isError: isAllOrdersError,
  } = useGetAllOrders({ ...orderFilters, buyerId: id });
  const { data: subscriptionsData } = useGetSubscriptions({ vendorId: id });
  const { data: productsData } = useGetAllProducts({ status: "published" });

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
        title={`Vendor's Profile - ${profile?.firstName} ${profile?.lastName}`}
        showSubscriptionBanner={false}
        icon={<BackButton />}
        actionComponent={
          <DownloadCsvButton
            data={(orders || []) as Record<string, unknown>[]}
            filename={`user-sales-${profile?.firstName || "user"}-${profile?.lastName || ""}`}
            headers={{
              reference: "Profile ID",
              createdAt: "Date and Time",
              // deliveryStatus: "Delivery Status",
            }}
          />
        }
      />
      <section className="space-y-6">
        <Details.Section className="shadow-sm" title="Profile Overview">
          <Details.Grid className={``}>
            <Details.Item label="Store Name" value={`${profile?.firstName} ${profile?.lastName}`} />
            <Details.Item label="Email Address" value={profile?.email} />
            <Details.Item label="Phone Number" value={profile?.phoneNumber} />
            <Details.Item label="Date Joined" value={formatDate(profile?.createdAt)} />
            <Details.Item label="Orders" value={profile?.ordersCount ?? "—"} />
            <Details.Item
              className={profile.kycStatus === "verified" ? "text-green-500" : "text-red-500"}
              label="KYC Status"
              value={profile?.kycStatus ?? "—"}
            />
            <Details.Item
              className={profile.subscriptionStatus === "active" ? "text-green-500" : "text-red-500"}
              label="Subscription Status"
              value={profile?.subscriptionStatus ?? "-"}
            />
            <Details.Item label="Last Activity" value={formatDate(profile?.lastTimeActivity)} />
          </Details.Grid>
        </Details.Section>

        <Details.Section
          className={`item-center flex shadow-sm`}
          action={
            <SkiButton variant={`primary`} size={`sm`}>
              Verify Vendor
            </SkiButton>
          }
          title="Business & KYC Information"
        >
          <Details.Grid className={``}>
            <Details.Item label="Business Name (as registered)" value={"_"} />
            <Details.Item label="CAC Reg. No" value={"_"} />
            <Details.Item label="KYC Type" value={`_`} />
            <Details.Item label="Identification Number" value={`_`} />
          </Details.Grid>
        </Details.Section>

        <Details.Section className="shadow-sm" title="Subscription Information">
          <Details.Grid className={``}>
            <Details.Item label="Status" value={subscriptionsData?.data.items[0]?.status ?? "—"} />
            <Details.Item label="Plan Type" value={subscriptionsData?.data.items[0]?.planType ?? "-"} />
            <Details.Item label="Payment Status" value={"-"} />
            <Details.Item
              label="Start Date"
              value={
                subscriptionsData?.data.items[0]?.startDate
                  ? formatDate(subscriptionsData.data.items[0].startDate)
                  : "-"
              }
            />
            <Details.Item
              label="End Date"
              value={
                subscriptionsData?.data.items[0]?.endDate ? formatDate(subscriptionsData.data.items[0].endDate) : "-"
              }
            />
          </Details.Grid>
        </Details.Section>
        <Details.Section className="shadow-sm" title="Products & Sales Performance">
          <Details.Grid className={``}>
            <Details.Item label="Total Products" value={productsData?.data.metadata.total ?? "_"} />
            {/* <Details.Item label="Total Product Published" value={productsData?.data.metadata.published ?? "_"} /> */}
            <Details.Item label="Total Sales" value={"_"} />
            <Details.Item label="Total Orders" value={"_"} />
            <Details.Item label="Last Order" value={"_"} />
            <Details.Item label="Average Order Value" value={"_"} />
          </Details.Grid>
        </Details.Section>
        <Details.Section className="shadow-sm" title="Payouts Overview">
          <Details.Grid className={``}>
            <Details.Item label="Wallet Balance" value={"_"} />
            <Details.Item label="Total Withdrawals" value={"_"} />
            <Details.Item label="Pending Withdrawals" value={`_`} />
            <Details.Item label="Last Payout" value={`_`} />
          </Details.Grid>
        </Details.Section>

        <section>
          {isAllOrdersLoading ? (
            <TableSkeleton />
          ) : isAllOrdersError ? (
            <EmptyState
              title="Error loading orders"
              description="There was a problem fetching the orders data. Please try again later."
              className="min-h-fit space-y-0 rounded-lg bg-red-50 p-6"
              titleClassName={`!text-lg font-bold !text-mid-danger`}
              descriptionClassName={`!text-mid-danger`}
              images={[]}
            />
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
                    <p>No sales found.</p>
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

export default VendorsView;
