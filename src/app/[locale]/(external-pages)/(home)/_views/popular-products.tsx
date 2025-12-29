"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { ErrorState } from "@/components/shared/empty-state";
import { LocaleLink } from "@/components/shared/locale-link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

import { ShopCard } from "../_components/shop-card/shop-card";

interface ProductGridProperties {
  title?: string | ReactNode;
  headerStyle?: string;
  hasAction?: boolean;
  actionText?: string;
  actionHref?: string;
  wrapperClassName?: string;
  gridClassName?: string;
  limit?: number;
  // Data fetching options
  dataSource?: "products" | "handpicked";
  flag?: string;
  storeId?: string;
  // Custom rendering
  customHeader?: ReactNode;
  hideIfEmpty?: boolean;
}

export const ProductGrid = ({
  title,
  headerStyle,
  hasAction = true,
  actionText,
  actionHref,
  wrapperClassName,
  gridClassName,
  limit = 4,
  dataSource = "products",
  flag,
  storeId,
  customHeader,
  hideIfEmpty = true,
}: ProductGridProperties) => {
  const { useGetAllProducts, useGetAllhandPickedProducts } = useAppService();
  const t = useTranslations("home.popularProducts");

  // Conditionally use the appropriate hook based on dataSource
  const productsQuery = useGetAllProducts(
    {
      ...(storeId && { storeId }),
      flag,
      limit,
    },
    { enabled: dataSource === "products" },
  );

  const handpickedQuery = useGetAllhandPickedProducts({ limit }, { enabled: dataSource === "handpicked" });

  const { isLoading, isError, data, refetch } = dataSource === "handpicked" ? handpickedQuery : productsQuery;

  const products = data?.data?.items || [];

  const computedActionHref = (() => {
    // If a custom href is provided, always respect it
    if (actionHref) return actionHref;

    const parameters = new URLSearchParams();

    // When viewing handpicked products, route to the shop with a handpicked flag
    if (dataSource === "handpicked") {
      parameters.set("flag", "handpicked");
    } else if (flag) {
      // For other product flags (e.g. featured, top, blackFriday), propagate the flag
      parameters.set("flag", flag);
    }

    // Propagate store context (e.g. "Skishop products") to the shop page
    if (storeId) {
      parameters.set("storeId", storeId);
    }

    const queryString = parameters.toString();
    return queryString ? `/shop?${queryString}` : "/shop";
  })();

  const renderLoadingSkeletons = () => (
    <div
      className={cn(
        "xs:grid-cols-2 grid grid-cols-1 gap-1 sm:grid-cols-3 md:gap-2 lg:grid-cols-4 lg:gap-4",
        gridClassName,
      )}
    >
      {Array.from({ length: limit }).map((_, index) => (
        <ShopCardSkeleton key={index} />
      ))}
    </div>
  );

  const renderProductCards = () => (
    <div
      className={cn(
        "xs:grid-cols-2 grid grid-cols-1 gap-1 sm:grid-cols-3 md:gap-2 lg:grid-cols-4 lg:gap-4",
        gridClassName,
      )}
    >
      {products.slice(0, limit).map((product: Product) => (
        <ShopCard
          key={product.id.toString()}
          id={product.id.toString()}
          category={product.category}
          title={product.name}
          rating={product.rating}
          price={product.price}
          discount={product.discountPrice || 0}
          image={product.images[0]}
          name={product.store?.name || "Skicom"}
        />
      ))}
    </div>
  );

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

  // If hideIfEmpty is true and there are no products, render nothing
  if (hideIfEmpty && !isLoading && products.length === 0) {
    return null;
  }

  return (
    <Wrapper className={cn("min-h-[480px] gap-6 py-0", wrapperClassName)}>
      {customHeader ?? (
        <div className={cn("flex items-baseline justify-between", headerStyle)}>
          {typeof title === "string" ? (
            <h2 className={cn("!text-xl lg:!text-4xl lg:!leading-[41.62px] lg:!tracking-[1px]", headerStyle)}>
              {title}
            </h2>
          ) : (
            title
          )}
          {hasAction && (
            <LocaleLink href={computedActionHref} className="text-primary font-medium lg:text-2xl">
              {actionText || t("seeAll")}
            </LocaleLink>
          )}
        </div>
      )}
      {renderProductsGrid()}
    </Wrapper>
  );
};

export const ShopCardSkeleton = () => (
  <div className="border-border animate-pulse space-y-3 rounded-lg border p-4">
    <Skeleton className="h-40 rounded-md lg:h-70"></Skeleton>
    <Skeleton className="h-4 rounded" />
    <Skeleton className="h-4 w-3/4 rounded"></Skeleton>
    <Skeleton className="h-4 w-1/2 rounded"></Skeleton>
  </div>
);

// Export legacy component name for backward compatibility
export const PopularProducts = ProductGrid;
