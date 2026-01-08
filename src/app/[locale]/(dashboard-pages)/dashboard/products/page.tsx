"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import SkiButton from "@/components/shared/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useDashboardProductService } from "@/services/dashboard/vendor/products/use-product-service";
import { LucidePlusCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { TbShoppingBag } from "react-icons/tb";

import { DashboardHeader } from "../../_components/dashboard-header";
import { OverViewCard } from "../../_components/overview-card";
import { AllProducts } from "./_views/all-products";
// import { OutOfStockProducts } from "./_views/out-of-stock-products";
import { PublishedProducts } from "./_views/published-products";
import { UnpublishedProducts } from "./_views/unpublished-products";

const Page = () => {
  const locale = useLocale();
  const { productStatus: activeTab, setProductStatus } = useDashboardSearchParameters();

  const setActiveTab = (value: string) => {
    setProductStatus(value as "all" | "published" | "draft");
  };

  const { useGetAllProducts } = useDashboardProductService();

  // Fetch all products for overview stats
  const { data: allProductsData } = useGetAllProducts({});
  const { data: publishedProductsData } = useGetAllProducts({ status: "published" });
  const { data: draftProductsData } = useGetAllProducts({ status: "draft" });

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = allProductsData?.data?.metadata?.total || 0;
    const publishedProducts = publishedProductsData?.data?.metadata?.total || 0;
    const draftProducts = draftProductsData?.data?.metadata?.total || 0;
    const outOfStockProducts = allProductsData?.data?.items?.filter((product) => product.stockCount === 0).length || 0;

    return {
      totalProducts,
      publishedProducts,
      draftProducts,
      outOfStockProducts,
    };
  }, [allProductsData, publishedProductsData, draftProductsData]);

  const tabOptions = [
    { value: "all", label: "All Products", count: stats.totalProducts },
    { value: "published", label: "Published Products", count: stats.publishedProducts },
    { value: "draft", label: "Draft Products", count: stats.draftProducts },
    { value: "out-of-stock", label: "Out of Stock Products", count: stats.outOfStockProducts },
  ];

  return (
    <main className="space-y-8">
      <DashboardHeader
        actionComponent={
          <SkiButton
            href={`/${locale}/dashboard/products/new`}
            isLeftIconVisible
            icon={<LucidePlusCircle />}
            variant="primary"
            className="rounded-full"
          >
            Add New Product
          </SkiButton>
        }
        title="Products"
        subtitle={`Manage your products`}
        showSubscriptionBanner
        icon={<Icons.product />}
      />
      <section className="grid grid-cols-1 gap-[31px] lg:grid-cols-2">
        <OverViewCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          icon={<TbShoppingBag />}
          iconClassName="bg-primary/10 text-primary text-[24px]"
        />
        <OverViewCard
          title="Published Products"
          value={stats.publishedProducts.toString()}
          icon={<TbShoppingBag />}
          iconClassName="bg-low-success text-mid-success text-[24px]"
        />
        <OverViewCard
          title="Draft Products"
          value={stats.draftProducts.toString()}
          icon={<TbShoppingBag />}
          iconClassName="bg-low-danger text-mid-danger text-[24px]"
        />
        <OverViewCard
          title="Out of Stock Products"
          value={stats.outOfStockProducts.toString()}
          icon={<TbShoppingBag />}
          iconClassName="bg-low-warning/20 text-mid-warning text-[24px]"
        />
      </section>
      <section>
        <div className="bg-background rounded-lg p-4">
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
                    className="data-[state=active]:border-primary data-[state=active]:text-primary text-mid-grey-II relative h-13 rounded-none border-0 border-b-2 px-4 text-sm font-medium !shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent"
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
            {activeTab === "all" && <AllProducts />}
            {activeTab === "published" && <PublishedProducts />}
            {activeTab === "draft" && <UnpublishedProducts />}
            {/* {activeTab === "out-of-stock" && <OutOfStockProducts />} */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
