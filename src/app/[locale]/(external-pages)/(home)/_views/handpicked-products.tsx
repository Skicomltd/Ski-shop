"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { ErrorState } from "@/components/shared/empty-state";
import { LocaleLink } from "@/components/shared/locale-link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useTranslations } from "next-intl";

import { ShopCard } from "../_components/shop-card/shop-card";

export const HandpickedProducts = ({
  title,
  headerStyle,
  hasAction = true,
  // storeId,
}: {
  title: string;
  fullList?: string;
  headerStyle?: string;
  hasAction?: boolean;
  flag?: string;
  // storeId?: string;
}) => {
  const { useGetAllhandPickedProducts } = useAppService();
  const { isLoading, isError, data, refetch } = useGetAllhandPickedProducts({
    // ...(storeId && { storeId }),
    limit: 4,
  });
  const t = useTranslations("home.popularProducts");

  const products = data?.data?.items || [];

  const renderLoadingSkeletons = () => (
    <div className="xs:grid-cols-2 grid grid-cols-1 gap-1 sm:grid-cols-3 md:gap-2 lg:grid-cols-4 lg:gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <ShopCardSkeleton key={index} />
      ))}
    </div>
  );

  const renderProductCards = () => (
    <div className="xs:grid-cols-2 grid grid-cols-1 gap-1 sm:grid-cols-3 md:gap-2 lg:grid-cols-4 lg:gap-4">
      {products.map((product: Product) => (
        <ShopCard
          key={product.id.toString()}
          id={product.id.toString()}
          category={product.category}
          title={product.name}
          rating={product.rating}
          price={product.price}
          discount={product.discountPrice || 0}
          image={product.images[0]}
          name={product.store.name || "Skicom"}
        />
      ))}
    </div>
  );

  // const renderEmptyState = () => <EmptyState />;

  const renderErrorState = () => (
    <ErrorState description={t("failedToLoad")} retryText={t("retry")} onRetry={() => refetch()} />
  );

  const renderProductsGrid = () => {
    if (isLoading) {
      return renderLoadingSkeletons();
    }
    if (isError) {
      return renderErrorState();
    }
    if (!isLoading && products.length === 0) {
      return null;
    }
    return renderProductCards();
  };
  // If not loading and there are no products, render nothing (hide title/actions too)
  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <Wrapper className="min-h-[480px] gap-6 py-0">
      <div className={cn(`flex items-baseline justify-between`, headerStyle)}>
        <h2 className={cn("!text-xl lg:!text-4xl lg:!leading-[41.62px] lg:!tracking-[1px]", headerStyle)}>{title}</h2>
        {hasAction && (
          <LocaleLink href={`/shop`} className="text-primary font-medium lg:text-2xl">
            {t("seeAll")}
          </LocaleLink>
        )}
      </div>
      {renderProductsGrid()}
    </Wrapper>
  );
};

export const ShopCardSkeleton = () => (
  <div className="border-border animate-pulse space-y-3 rounded-lg border p-4">
    <Skeleton className="h-40 rounded-md"></Skeleton>
    <Skeleton className="h-4 rounded" />
    <Skeleton className="h-4 w-3/4 rounded"></Skeleton>
    <Skeleton className="h-4 w-1/2 rounded"></Skeleton>
  </div>
);
