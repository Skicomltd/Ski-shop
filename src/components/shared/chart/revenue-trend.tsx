"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdminService } from "@/services/dashboard/admin/use-admin-service";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Assuming AdminSalesOverviewData is available globally or import it if needed

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("NGN", "₦");
};

export function RevenueTrendOveriew() {
  const { useGetRevenueTrend } = useAdminService();
  const { data, isLoading, error } = useGetRevenueTrend();

  // Create chart data with all months, using API data where available
  const chartData = useMemo(() => {
    // Fixed list of months for the x-axis
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Create chart data with all months, using API data where available
    return months.map((month, index) => {
      const monthNumber = index + 1; // 1-12
      const apiData = data?.data?.find((item) => item.month === monthNumber);
      return {
        month,
        amount: apiData ? apiData.total : 0,
      };
    });
  }, [data?.data]);

  if (isLoading) {
    return (
      <Card className="bg-background h-full w-full border-none shadow-none">
        <CardHeader>
          <DashboardHeader
            showSubscriptionBanner={false}
            title="Revenue Trend Over Time"
            titleClassName={`text-lg  text-gray-800`}
            subtitle={`A graph of your revenue over time, this year`}
          />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex h-[300px] w-full items-center justify-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-background w-full border-none shadow-none">
        <CardHeader>
          <DashboardHeader
            showSubscriptionBanner={false}
            title="Revenue Trend Over Time"
            titleClassName={`text-lg  text-gray-800`}
            subtitle={`A graph of your revenue over time, this year`}
          />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex h-[300px] w-full items-center justify-center">Error loading data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background h-full w-full border-none shadow-sm">
      <CardHeader>
        <DashboardHeader
          showSubscriptionBanner={false}
          title="Revenue Trend Over Time"
          titleClassName={`text-lg  text-gray-800`}
          subtitle={`A graph of your revenue over time, this year`}
        />
      </CardHeader>
      <CardContent className="p-0 lg:px-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%" debounce={200}>
            <AreaChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E0E0E0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#333333", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#333333", fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value).replace("₦", "")}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    return (
                      <div className="rounded-md border border-gray-200 bg-white p-3 shadow-md">
                        <p className="font-semibold">{payload[0].payload.month}</p>
                        <p className="text-blue-600">{formatCurrency(payload[0].payload.amount)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
                activeDot={{ r: 6, fill: "#3B82F6", strokeWidth: 2, stroke: "#FFFFFF" }}
                isAnimationActive={false}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
