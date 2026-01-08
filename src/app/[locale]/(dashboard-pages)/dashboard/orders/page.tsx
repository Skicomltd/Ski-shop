"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useDashboardOrderService } from "@/services/dashboard/vendor/orders/use-order-service";
import { useMemo } from "react";

import { DashboardHeader } from "../../_components/dashboard-header";
import { OverViewCard } from "../../_components/overview-card";
import { AllOrders } from "./_views/all-orders";
import { PaidOrders } from "./_views/paid-orders";
import { PendingOrders } from "./_views/pending-orders";

const Page = () => {
  const { status: activeTab, setStatus } = useDashboardSearchParameters();

  const setActiveTab = (value: string) => {
    setStatus(value as "all" | "pending" | "paid" | "delivered" | "cancelled");
  };

  const { useGetAllOrders } = useDashboardOrderService();

  // Fetch all orders for overview stats
  const { data: allOrdersData } = useGetAllOrders({});
  const { data: pendingOrdersData } = useGetAllOrders({ status: "pending" });
  const { data: paidOrdersData } = useGetAllOrders({ status: "paid" });

  // Calculate stats
  const stats = useMemo(() => {
    const totalOrders = allOrdersData?.data?.metadata?.total || 0;
    const pendingOrders = pendingOrdersData?.data?.metadata?.total || 0;
    const paidOrders = paidOrdersData?.data?.metadata?.total || 0;

    return {
      totalOrders,
      pendingOrders,
      paidOrders,
    };
  }, [allOrdersData, pendingOrdersData, paidOrdersData]);

  const tabOptions = [
    { value: "all", label: "All Orders", count: stats.totalOrders },
    { value: "pending", label: "Pending Orders", count: stats.pendingOrders },
    { value: "paid", label: "Paid Orders", count: stats.paidOrders },
  ];

  return (
    <main className="space-y-8">
      <DashboardHeader
        title="Orders"
        subtitle={`Manage your orders`}
        showSubscriptionBanner
        icon={<Icons.cart className="h-6 w-6" />}
      />

      <section className="my-[38px] grid grid-cols-1 gap-[31px] lg:grid-cols-3">
        <OverViewCard
          title="All Orders"
          value={stats.totalOrders.toString()}
          icon={<Icons.cart />}
          iconClassName="bg-primary/10 text-primary text-[24px]"
        />
        <OverViewCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={<Icons.cart />}
          iconClassName="bg-low-warning/20 text-mid-warning text-[24px]"
        />
        <OverViewCard
          title="Paid Orders"
          value={stats.paidOrders.toString()}
          icon={<Icons.cart />}
          iconClassName="bg-low-success text-mid-success text-[24px]"
        />
      </section>
      <section>
        <div className="bg-background rounded-lg p-4 shadow-sm">
          {/* Mobile Dropdown */}
          <div className="block sm:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tab" />
              </SelectTrigger>
              <SelectContent>
                {tabOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-background p-0">
                {tabOptions.map((option) => (
                  <TabsTrigger
                    key={option.value}
                    value={option.value}
                    className="data-[state=active]:border-primary data-[state=active]:text-primary text-high-grey-II relative h-13 rounded-none border-0 border-b-2 px-4 text-sm font-medium !shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
                  >
                    {option.label} ({option.count})
                  </TabsTrigger>
                ))}
              </TabsList>
              <Separator className="bg-muted mt-[-1px] mb-[26px]" />
            </Tabs>
          </div>

          {/* Content */}
          <div className="mt-6">
            {activeTab === "all" && <AllOrders />}
            {activeTab === "pending" && <PendingOrders />}
            {activeTab === "paid" && <PaidOrders />}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
