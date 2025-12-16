"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import { UniversalSwiper } from "@/components/shared/carousel";
import { ErrorState } from "@/components/shared/empty-state";
import { Ratings } from "@/components/shared/ratings";
import { SetToolTip } from "@/components/shared/tool-tip";
import { cn } from "@/lib/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { StarFilledIcon } from "@radix-ui/react-icons";

const truncateStoreName = (name: string, maxLength = 18) => {
  if (!name) return "";
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
};

export const TopVendors = () => {
  const { useGetAllProducts } = useAppService();
  const { isLoading, isError, data, refetch } = useGetAllProducts({ flag: "top" });

  const products: Product[] = data?.data?.items || [];

  if (isError) {
    return <ErrorState className={`mx-auto mb-10 max-w-[1240px]`} retryText={"retry"} onRetry={() => refetch()} />;
  }

  if (products.length === 0) {
    return null;
    // return <EmptyState className={`mx-auto mb-10 max-w-[1240px]`} />;
  }

  return (
    <Wrapper className={`min-h-[308px] gap-6 py-0`}>
      <section>
        <h2 className={cn("!text-lg lg:!text-4xl lg:!leading-[41.62px] lg:!tracking-[1px]")}>Top Vendors</h2>
      </section>
      {isLoading ? (
        <TopVendorsSkeleton />
      ) : (
        <UniversalSwiper
          items={products}
          renderItem={(product: Product) => (
            <section className={`flex flex-col items-center gap-2 text-center`}>
              <div className={`bg-mid-grey-I size-[120px] overflow-hidden rounded-full p-4`}>
                <BlurImage
                  width={120}
                  height={120}
                  className={`scale-150 object-cover`}
                  src={product.images[0]}
                  alt={product.name}
                />
              </div>
              <SetToolTip content={product.store?.name || ""}>
                <p className="text-center">{truncateStoreName(product.store?.name || "")}</p>
              </SetToolTip>
              <div className={`flex items-center gap-4`}>
                <Ratings rating={product?.rating} />
                <p>({`${product?.rating}` || 0})</p>
              </div>
            </section>
          )}
          swiperOptions={{
            spaceBetween: 24,
          }}
          showPagination
          showNavigation
          breakpoints={{
            0: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 6 },
          }}
        />
      )}
    </Wrapper>
  );
};

export const TopVendorsSkeleton = () => {
  return (
    <Wrapper className="gap-6 py-0">
      <div className="flex justify-between gap-6 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex min-w-[150px] flex-col items-center gap-4">
            {/* Image placeholder */}
            <div className="h-[120px] w-[120px] animate-pulse rounded-full bg-gray-200" />

            {/* Title placeholder */}
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

            {/* Rating placeholder */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index_) => (
                  <StarFilledIcon key={index_} className={`text-gray-200`} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
