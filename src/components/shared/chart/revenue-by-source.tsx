"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdminService } from "@/services/dashboard/admin/use-admin-service";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const RevenueBySource = () => {
  const { useGetRevenueOverview } = useAdminService();
  const { data, isLoading, error } = useGetRevenueOverview();

  const overview = data?.data;

  const pieData = useMemo(
    () => [
      { name: "Subscriptions", value: overview?.subscriptions || 0, color: "lch(29 41.99 271.87)" },
      { name: "Promotions", value: overview?.promotionAds || 0, color: "lch(35 46.61 142.58)" },
      { name: "Commissions", value: overview?.commisions || 0, color: "lch(80 46.8 60.34)" },
    ],
    [overview?.subscriptions, overview?.promotionAds, overview?.commisions],
  );

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <Card className="bg-background h-full w-full border-none shadow-none">
        <CardHeader>
          <DashboardHeader
            showSubscriptionBanner={false}
            title="Revenue by Source"
            titleClassName={`text-lg  text-gray-800`}
            subtitle={`A graph of your revenue by source`}
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
            title="Revenue by Source"
            titleClassName={`text-lg  text-gray-800`}
            subtitle={`A graph of your revenue by source`}
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
          title="Revenue by Source"
          titleClassName={`text-lg  text-gray-800`}
          subtitle={`A graph of your revenue by source`}
        />
      </CardHeader>
      <CardContent className="p-0 lg:px-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%" debounce={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                isAnimationActive={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-md border border-gray-200 bg-white p-3 shadow-md">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-blue-600">₦{data.value.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {total > 0 ? ((data.value / total) * 100).toFixed(1) : 0}% of total
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center">
          {pieData.map((item) => (
            <span key={item.name} className="mr-4 flex items-center text-[12px]">
              <div className="mr-2 inline h-[12px] w-[12px] rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueBySource;
