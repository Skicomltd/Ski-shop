"use client";

import { PromoteProductModal } from "@/app/[locale]/(dashboard-pages)/dashboard/products/_components/promote-product-modal";
import { Icons } from "@/components/core/miscellaneous/icons";
import SkiButton from "@/components/shared/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardProductService } from "@/services/dashboard/vendor/products/use-product-service";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DashboardHeader } from "../../_components/dashboard-header";
import { ProductPromotionCard } from "./_components/product-card";

const Page = () => {
  const { useGetAllProducts } = useDashboardProductService();
  const { data: products, isLoading, isError, refetch } = useGetAllProducts({});
  const router = useRouter();
  const locale = useLocale();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);

  const handlePromoteProduct = (product: { id: string; name: string; price: number }) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleViewActiveCampaigns = () => {
    router.push(`/${locale}/dashboard/promotions/active-campaigns`);
  };

  const items = products?.data?.items || [];

  return (
    <main className="space-y-8">
      <DashboardHeader
        actionComponent={
          <SkiButton variant="primary" onClick={handleViewActiveCampaigns}>
            Active Campaigns
          </SkiButton>
        }
        title="Promotions"
        subtitle={`Manage your promotions, create new promotions and view active campaigns`}
        showSubscriptionBanner
        icon={<Icons.promotion />}
      />

      {/* Products for Promotion */}
      <div className="space-y-4">
        <DashboardHeader
          title="Promote Your Products"
          subtitle={`Promote your products to increase your sales`}
          titleClassName={"!text-xl !font-bold"}
          subtitleClassName={`!text-sm`}
          showSubscriptionBanner={false}
        />
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-background rounded-lg border p-3">
                <div className="mb-3">
                  <Skeleton className="h-40 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !items || items.length === 0 ? (
          <EmptyState
            title="No products found"
            description="There are no products available for promotion."
            descriptionClassName="text-base mb-4"
            className="bg-background dark:bg-muted"
            actionButton={
              <SkiButton variant="primary" size="lg" onClick={() => refetch()}>
                Refresh
              </SkiButton>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <ProductPromotionCard key={product.id} product={product} onPromote={handlePromoteProduct} />
            ))}
          </div>
        )}
      </div>

      {/* Promotion Modal */}
      {selectedProduct && (
        <PromoteProductModal isOpen={isModalOpen} onClose={handleCloseModal} product={selectedProduct} />
      )}
    </main>
  );
};

export default Page;
