"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useAppService } from "@/services/externals/app/use-app-service";

// import { useTranslations } from "next-intl";

import { ShopCard } from "../_components/shop-card/shop-card";
import { ShopCardSkeleton } from "./popular-products";

export const InterestedProducts = () => {
  const { useGetAllProducts } = useAppService();
  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useGetAllProducts({
    page: 1,
    limit: 4,
    flag: "interested",
  });
  // const t = useTranslations("home.interestedProducts");

  const products = productData?.data?.items || [];

  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <ShopCardSkeleton key={index} />
      ))}
    </div>
  );

  const renderProductCards = () => (
    <div className="xs:grid-cols-2 grid grid-cols-1 gap-1 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product: Product) => (
        <ShopCard
          key={product.id.toString()}
          id={product.id.toString()}
          category={product.category || "Uncategorized"}
          title={product.name}
          rating={3}
          price={product.price}
          discount={product.discountPrice || 0}
          image={product.images?.[0] || "/placeholder-product.jpg"}
          name={product.user?.name || product.store?.name || "Skicom"}
        />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <EmptyState
      title="No products found"
      description="There are no products that match your interests. Check back later for new recommendations."
    />
  );

  const renderErrorState = () => <ErrorState onRetry={() => refetch()} />;

  const renderProductsGrid = () => {
    if (isLoading) {
      return renderLoadingSkeletons();
    }

    if (products.length === 0) {
      return renderEmptyState();
    }

    if (isError) {
      return renderErrorState();
    }

    return renderProductCards();
  };

  return (
    <Wrapper className="min-h-[480px] py-16">
      <div className="flex items-baseline justify-between">
        <h2 className="!text-lg font-semibold sm:!text-4xl">{`Intrested Products`}</h2>
      </div>
      {renderProductsGrid()}
    </Wrapper>
  );
};
