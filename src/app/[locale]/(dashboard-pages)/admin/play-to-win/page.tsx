"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import { OverViewCard } from "@/app/[locale]/(dashboard-pages)/_components/overview-card";
import { Icons } from "@/components/core/miscellaneous/icons";
import SkiButton from "@/components/shared/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { CouponFormDialog, CouponsTable } from "./_views/coupons-table";
import { FeedbackDialog } from "./_views/feedback-dialog";
import { WinnersTable } from "./_views/winners-table";

const Play2WinAdminPage = () => {
  // Mock stats (can be wired later if backend exposes them)
  const stats = {
    couponsCreated: 150,
    couponsRemaining: 70,
    totalWinners: 80,
    nextDrawCycle: "—",
  };

  const queryClient = useQueryClient();
  // Local tab state (use URL param later if needed)
  const [activeTab, setActiveTab] = useState<"coupons" | "winners">("coupons");

  // Feedback dialog state (placeholder wiring)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ title: string; description?: string; variant?: "success" | "info" }>({
    title: "",
    description: "",
    variant: "success",
  });

  const tabOptions = useMemo(
    () => [
      { value: "coupons", label: "All Coupons" },
      { value: "winners", label: "Winners Log" },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Play-2-Win"
        subtitle="Manage coupons, run draws and view winners"
        showSubscriptionBanner={false}
        icon={<Icons.promotion className="size-6" />}
        actionComponent={
          <CouponFormDialog
            trigger={
              <SkiButton variant="primary" isLeftIconVisible icon={<Icons.plus />}>
                Add New Coupon
              </SkiButton>
            }
            onCompleted={() => {
              setFeedback({
                title: "Added Successfully",
                description: "Coupon has been added to Play to Win",
                variant: "success",
              });
              setIsFeedbackOpen(true);
              void queryClient.invalidateQueries({ queryKey: ["dashboard", "play2win", "coupons"] });
            }}
          />
        }
      />

      {/* Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        <OverViewCard
          title="Coupons Created"
          value={stats.couponsCreated}
          icon={<Icons.promotion className="size-6" />}
          iconClassName="bg-primary/10"
        />
        <OverViewCard
          title="Coupons Remaining"
          value={stats.couponsRemaining}
          icon={<Icons.promotion className="size-6" />}
          iconClassName="bg-green-100"
        />
        <OverViewCard
          title="Total Winners"
          value={stats.totalWinners}
          icon={<Icons.ribbonOutline className="size-6 stroke-3" />}
          iconClassName="bg-yellow-100"
        />
        <OverViewCard
          title="Next Draw Cycle"
          value={stats.nextDrawCycle}
          icon={<Icons.chart className="size-6 stroke-3" />}
          iconClassName="bg-blue-100"
        />
      </div>

      {/* Tabs (mobile Select + desktop Tabs) */}
      <section>
        <div className="bg-background rounded-lg p-4 shadow-sm">
          {/* Mobile Dropdown */}
          <div className="block sm:hidden">
            <Select value={activeTab} onValueChange={(v) => setActiveTab(v as "coupons" | "winners")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tab" />
              </SelectTrigger>
              <SelectContent>
                {tabOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "coupons" | "winners")} className="w-full">
              <TabsList className="bg-background p-0">
                {tabOptions.map((option) => (
                  <TabsTrigger
                    key={option.value}
                    value={option.value}
                    className="data-[state=active]:border-primary data-[state=active]:text-primary text-mid-grey-II relative h-13 rounded-none border-0 border-b-2 px-4 text-sm font-medium !shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
                  >
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Separator className="bg-muted mt-[-1px]" />
            </Tabs>
          </div>

          {/* Content */}
          <div className="mt-6">
            {activeTab === "coupons" && (
              <CouponsTable
                onCreated={() => {
                  setFeedback({
                    title: "Added Successfully",
                    description: "Coupon has been added to Play to Win",
                    variant: "success",
                  });
                  setIsFeedbackOpen(true);
                }}
                onUpdated={() => {
                  setFeedback({
                    title: "Changed Successfully",
                    description: "Changes have been made to coupon",
                    variant: "success",
                  });
                  setIsFeedbackOpen(true);
                }}
              />
            )}
            {activeTab === "winners" && <WinnersTable />}
          </div>
        </div>
      </section>

      <FeedbackDialog
        isOpen={isFeedbackOpen}
        onOpenChange={setIsFeedbackOpen}
        title={feedback.title}
        description={feedback.description}
        variant={feedback.variant}
      />
    </div>
  );
};

export default Play2WinAdminPage;
