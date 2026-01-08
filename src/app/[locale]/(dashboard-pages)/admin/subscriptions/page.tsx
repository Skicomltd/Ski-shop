"use client";

import Loading from "@/app/Loading";
import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import SkiButton from "@/components/shared/button";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { DownloadCsvButton } from "@/components/shared/download-csv-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Locale } from "@/lib/i18n/config";
// import { formatCurrency } from "@/lib/i18n/utils";
// import { orderStatusOptions } from "@/lib/constants";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useSettingsService } from "@/services/dashboard/vendor/settings/use-settings-service";
// import { useLocale } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GiWallet } from "react-icons/gi";
import { toast } from "sonner";

import { DashboardHeader } from "../../_components/dashboard-header";
// import { FilterDropdown } from "../../_components/dashboard-table/_components/filter-dropdown";
import { OverViewCard } from "../../_components/overview-card";
import { TableSkeleton } from "../home/_components/page-skeleton";
import { useSubscriptionHistoryColumns } from "./_components/subscription-history-columns";

type CreatePlanFormValues = {
  name: string;
  interval: "monthly" | "quarterly" | "yearly";
  amount: number;
  savingPercentage: number;
};

const Page = () => {
  // const locale = useLocale();
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const {
    // page: currentPage,
    search: searchQuery,
    // status,

    setSearch: setSearchQuery,
    // setStatus,
    resetToFirstPage,
  } = useDashboardSearchParameters();

  const { useGetSubscriptions, useCreatePlan } = useSettingsService();

  const createPlanMutation = useCreatePlan();

  const createPlanForm = useForm<CreatePlanFormValues>({
    defaultValues: {
      name: "",
      interval: "monthly",
      amount: 0,
      savingPercentage: 0,
    },
  });

  const {
    data: subscriptionHistory,
    isLoading: isSubscriptionHistoryLoading,
    isError: isSubscriptionHistoryError,
  } = useGetSubscriptions({ vendorId: "" });

  const subscriptionHistoryColumns = useSubscriptionHistoryColumns();

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    resetToFirstPage(); // Reset to first page when search changes
  };

  const handleCreatePlanSubmit = (values: CreatePlanFormValues) => {
    const payload = {
      name: values.name.trim(),
      interval: values.interval,
      amount: Number(values.amount),
      savingPercentage: Number(values.savingPercentage),
    };

    createPlanMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Plan created successfully");
        setIsCreatePlanOpen(false);
        createPlanForm.reset({
          name: "",
          interval: "monthly",
          amount: 0,
          savingPercentage: 0,
        });
      },
      onError: (error: Error) => {
        toast.error("Failed to create plan", {
          description: error.message,
        });
      },
    });
  };

  // const handleStatusChange = (newStatus: string) => {
  //   setStatus(newStatus as "all" | "pending" | "delivered" | "cancelled");
  //   resetToFirstPage(); // Reset to first page when status changes
  // };

  // const handleRowClick = (order: Order) => {
  //   // Navigate to order details page
  //   window.location.href = `/admin/orders/${order.id}`;
  // };

  return (
    <main className="space-y-8">
      <DashboardHeader
        title="Subscriptions"
        subtitle="Track Skishop subscriptions"
        showSubscriptionBanner={false}
        icon={<Icons.ribbonOutline className="size-6" />}
        actionComponent={
          <SkiButton variant="primary" size="xl" onClick={() => setIsCreatePlanOpen(true)}>
            Create Plan
          </SkiButton>
        }
      />
      {/* Overview Cards Section */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <OverViewCard
          title={"Total Star Sellers"}
          value={"-"}
          icon={<GiWallet />}
          iconClassName="bg-[#F2EBFB] text-[24px] text-purple"
        />
        <OverViewCard
          title={"Monthly Active Plans"}
          value={"-"}
          icon={<GiWallet />}
          iconClassName="bg-low-blue text-[24px] blue text-primary"
        />
        <OverViewCard
          title={"Yearly Active Plans"}
          value={"-"}
          icon={<GiWallet />}
          iconClassName="bg-low-success text-[24px] text-mid-success"
        />
        <OverViewCard
          title={"Subscription Revenue"}
          // value={formatCurrency(5000, locale as Locale)}
          value={"-"}
          icon={<GiWallet />}
          iconClassName="bg-low-warning/20 text-[24px] text-mid-warning"
        />
      </section>

      {/* Subscription History Table Section */}
      <section>
        {isSubscriptionHistoryLoading ? (
          <TableSkeleton />
        ) : isSubscriptionHistoryError ? (
          <EmptyState
            title="Error loading subscription history"
            description="There was a problem fetching the subscription history data. Please try again later."
            className="min-h-fit space-y-0 rounded-lg bg-red-50 p-6"
            titleClassName={`!text-lg font-bold !text-mid-danger`}
            descriptionClassName={`!text-mid-danger`}
            images={[]}
          />
        ) : (
          <section className={`bg-background mt-6 space-y-4 rounded-lg p-6 shadow-sm`}>
            <DashboardHeader
              title="Subscription History"
              subtitle="Track Skishop subscription history"
              showSubscriptionBanner={false}
              icon={<Icons.ribbonOutline className="mt-[-2] size-4" />}
              titleClassName={`!text-lg`}
              subtitleClassName={`!text-sm`}
              actionComponent={
                <div className="flex items-center gap-2">
                  <SearchInput className={``} onSearch={handleSearchChange} initialValue={searchQuery} />
                  <DownloadCsvButton
                    data={(subscriptionHistory?.data || []) as Record<string, unknown>[]}
                    filename="subscription-history"
                    headers={{
                      vendorName: "Vendor Name",
                      planType: "Plan Type",
                      amount: "Amount",
                      startDate: "Start Date",
                      endDate: "End Date",
                      status: "Status",
                    }}
                  />
                </div>
              }
            />

            <section>
              {isSubscriptionHistoryError ? (
                <Loading text="Loading subscription history..." className="w-fill h-fit p-20" />
              ) : subscriptionHistory?.data?.metadata.total ? (
                <DashboardTable
                  data={subscriptionHistory.data.items}
                  columns={subscriptionHistoryColumns}
                  // No pagination for subscription history
                  showPagination
                />
              ) : (
                <EmptyState
                  images={[
                    { src: "/images/empty-state.svg", width: 30, height: 30, alt: "No subscriptions available" },
                  ]}
                  title="No subscriptions available"
                  description="There are no subscriptions available at the moment."
                  className="bg-mid-grey-I space-y-0 rounded-lg"
                  titleClassName="!text-2xl"
                  descriptionClassName="text-base mb-4"
                  actionButton={
                    <SkiButton onClick={() => window.location.reload()} variant={`primary`}>
                      Refresh
                    </SkiButton>
                  }
                />
              )}
            </section>
          </section>
        )}
      </section>

      <ReusableDialog
        open={isCreatePlanOpen}
        onOpenChange={setIsCreatePlanOpen}
        title="Create subscription plan"
        description="Configure a new subscription plan for vendors."
        className="sm:max-w-md"
        headerClassName="!text-xl font-semibold"
      >
        <Form {...createPlanForm}>
          <form onSubmit={createPlanForm.handleSubmit(handleCreatePlanSubmit)} className="mt-4 w-full space-y-4">
            <FormField
              control={createPlanForm.control}
              name="name"
              rules={{ required: "Plan name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Monthly Plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createPlanForm.control}
              name="interval"
              rules={{ required: "Interval is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing interval</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={createPlanForm.control}
                name="amount"
                rules={{
                  required: "Amount is required",
                  min: { value: 1, message: "Amount must be greater than 0" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (NGN)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="100"
                        {...field}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createPlanForm.control}
                name="savingPercentage"
                rules={{
                  required: "Saving percentage is required",
                  min: { value: 0, message: "Cannot be negative" },
                  max: { value: 100, message: "Cannot be more than 100%" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saving %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step="1"
                        {...field}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <SkiButton variant="outline" size="xl" type="button" onClick={() => setIsCreatePlanOpen(false)}>
                Cancel
              </SkiButton>
              <SkiButton variant="primary" size="xl" type="submit" isLoading={createPlanMutation.isPending}>
                Create Plan
              </SkiButton>
            </div>
          </form>
        </Form>
      </ReusableDialog>
    </main>
  );
};

export default Page;
