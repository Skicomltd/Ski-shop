"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import SkiButton from "@/components/shared/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { getLocalSavedProducts, LOCAL_SAVED_UPDATED_EVENT } from "@/lib/saved/local-saved";
import { cn } from "@/lib/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { ProductBreadcrumb } from "../../../(home)/_components/product-breadcrumb";
import { ShopCard } from "../../../(home)/_components/shop-card/shop-card";

const SavedItems = ({ headerStyle }: { title: string; headerStyle?: string; hasAction?: boolean }) => {
  const { useGetSavedProducts } = useAppService();
  const { status } = useSession();
  const { isLoading, isError, data, refetch } = useGetSavedProducts({ enabled: status === "authenticated" });

  const [localSavedState, setLocalSavedState] = useState(() => getLocalSavedProducts());

  // Keep in sync with product cards / detail page
  useEffect(() => {
    const syncFromStorage = () => setLocalSavedState(getLocalSavedProducts());

    if (typeof window === "undefined") return;

    const onStorage = (event: StorageEvent) => {
      if (event.key === "skicom_guest_saved_products") syncFromStorage();
    };

    window.addEventListener(LOCAL_SAVED_UPDATED_EVENT, syncFromStorage);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(LOCAL_SAVED_UPDATED_EVENT, syncFromStorage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const guestSavedCount = localSavedState.items.length;

  const isAuthenticated = status === "authenticated";

  const uniqueServerSavedProducts = useMemo(() => {
    const products = data?.data?.items || [];
    const uniqueById = new Map<string, Product>();
    for (const p of products) uniqueById.set(p.id, p);
    return [...uniqueById.values()];
  }, [data?.data?.items]);

  const hasSavedItems = isAuthenticated ? uniqueServerSavedProducts.length > 0 : guestSavedCount > 0;

  return (
    <section className="min-h-[480px] pt-18 lg:pt-[10rem]">
      <ProductBreadcrumb productTitle={`Saved Items`} />
      <Wrapper>
        <div className={cn(`mb-8 flex items-baseline justify-between`, headerStyle)}>
          <h2 className={cn("!text-lg lg:!text-3xl", headerStyle)}>Saved Items</h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index: number) => (
              <ShopCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && <ErrorState onRetry={() => refetch()} />}

        {/* Empty State */}
        {!isLoading && !isError && !hasSavedItems && (
          <EmptyState
            title={"No saved items yet"}
            description={"Start saving your favorite products to see them here."}
            descriptionClassName={`mb-2`}
            actionButton={
              <SkiButton size={`lg`} href="/shop" variant="primary">
                Browse Products
              </SkiButton>
            }
          />
        )}

        {/* Guest: inform + sign in CTA */}
        {!isAuthenticated && guestSavedCount > 0 && (
          <EmptyState
            title={`You have ${guestSavedCount} saved item(s)`}
            description={"Sign in to view them here and sync across devices."}
            descriptionClassName={`mb-2`}
            actionButton={
              <SkiButton size={`lg`} href="/login" variant="primary">
                Sign in
              </SkiButton>
            }
          />
        )}

        {/* Products Grid */}
        {!isLoading && !isError && hasSavedItems && (
          <div className="xs:grid-cols-2 grid grid-cols-1 gap-1 md:grid-cols-3 lg:grid-cols-4">
            {isAuthenticated
              ? uniqueServerSavedProducts.map((product: Product) => (
                  <ShopCard
                    key={product.id}
                    id={product.id}
                    category={product.category}
                    title={product.name}
                    rating={product.rating || 0}
                    price={product.price}
                    discount={product.discountPrice || 0}
                    image={product.images?.[0] || "/images/empty-state.png"}
                    name={product.user?.name || "Skicom"}
                    showSaveButton={true}
                  />
                ))
              : null}
          </div>
        )}
      </Wrapper>
    </section>
  );
};

const ShopCardSkeleton = () => (
  <div className="animate-pulse space-y-3 rounded-lg border p-4">
    <div className="h-72 rounded-md bg-gray-200"></div>
    <div className="h-4 rounded bg-gray-200"></div>
    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
  </div>
);

export default SavedItems;
