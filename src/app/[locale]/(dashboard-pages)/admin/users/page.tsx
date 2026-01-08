"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserService } from "@/services/externals/user/use-user-service";

import { DashboardHeader } from "../../_components/dashboard-header";
import { OverViewCard } from "../../_components/overview-card";
// import { ActiveUsers } from "./_views/active-users";
import { AllUsers } from "./_views/all-users";
import { Customers } from "./_views/customers";
// import { InactiveUsers } from "./_views/inactive-users";
import { Riders } from "./_views/riders";
import { Vendors } from "./_views/vendors";

const Page = () => {
  const { useGetAllUsers } = useUserService();

  const { data: totalUsersData } = useGetAllUsers();
  const { data: customersData } = useGetAllUsers({ role: "customer" });
  const { data: vendorsData } = useGetAllUsers({ role: "vendor" });
  const { data: ridersData } = useGetAllUsers({ role: "rider" });

  return (
    <main>
      <DashboardHeader
        title="Users"
        subtitle={`Manage skishop users, buyers, vendors and riders`}
        showSubscriptionBanner={false}
        icon={<Icons.users className={`mt-[-4]`} />}
      />
      <section className="my-[38px] grid grid-cols-1 gap-[31px] lg:grid-cols-4">
        <OverViewCard
          title={"Total Users"}
          value={totalUsersData?.data.metadata.total || "0"}
          icon={<Icons.users />}
          iconClassName="bg-primary/10 text-primary text-[24px]"
        />
        <OverViewCard
          title={"Buyers"}
          value={customersData?.data.metadata.total || "0"}
          icon={<Icons.users />}
          iconClassName="bg-low-success text-mid-success text-[24px]"
        />
        <OverViewCard
          title={"Vendors"}
          value={vendorsData?.data.metadata.total || "0"}
          icon={<Icons.users />}
          iconClassName="bg-low-warning/20 text-mid-danger text-[24px]"
        />
        <OverViewCard
          title={"Riders"}
          value={ridersData?.data.metadata.total || "0"}
          icon={<Icons.rider />}
          iconClassName="bg-low-danger text-mid-danger text-[24px]"
        />
      </section>
      <section>
        <Tabs defaultValue="all" className="bg-background rounded-lg p-4 shadow-sm">
          <TabsList className="bg-background p-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-primary data-[state=active]:text-primary text-high-grey-II relative h-13 rounded-none border-0 border-b-2 px-4 text-sm font-medium !shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
            >
              All Users
            </TabsTrigger>
            {/* <TabsTrigger
              value="active"
              className="data-[state=active]:border-primary data-[state=active]:text-primary text-mid-grey-II relative h-13 rounded-none border-0 border-b-2 px-4 text-sm font-medium !shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
            >
              Active Users
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="data-[state=active]:border-primary data-[state=active]:text-primary text-mid-grey-II relative h-13 rounded-none border-0 border-b-2 px-4 text-sm font-medium !shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
            >
              Inactive Users
            </TabsTrigger> */}
            <TabsTrigger
              value="buyers"
              className="data-[state=active]:border-primary data-[state=active]:text-primary text-mid-grey-II relative h-13 rounded-none border-0 border-b-2 px-4 text-sm font-medium !shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
            >
              Buyers
            </TabsTrigger>
            <TabsTrigger
              value="vendors"
              className="data-[state=active]:border-primary data-[state=active]:text-primary text-mid-grey-II relative h-13 rounded-none border-0 border-b-2 px-4 text-sm font-medium !shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
            >
              Vendors
            </TabsTrigger>
            <TabsTrigger
              value="riders"
              className="data-[state=active]:border-primary data-[state=active]:text-primary text-mid-grey-II relative h-13 rounded-none border-0 border-b-2 px-4 text-sm font-medium !shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
            >
              Riders
            </TabsTrigger>
          </TabsList>
          <Separator className="bg-muted mt-[-1px] mb-[26px]" />
          <TabsContent value="all">
            <AllUsers />
          </TabsContent>
          {/* <TabsContent value="active">
            <ActiveUsers />
          </TabsContent>
          <TabsContent value="inactive">
            <InactiveUsers />
          </TabsContent> */}
          <TabsContent value="buyers">
            <Customers />
          </TabsContent>
          <TabsContent value="vendors">
            <Vendors />
          </TabsContent>
          <TabsContent value="riders">
            <Riders />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Page;
