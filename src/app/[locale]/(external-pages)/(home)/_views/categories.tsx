"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { UniversalSwiper } from "@/components/shared/carousel";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCategory } from "@/lib/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import Link from "next/link";

interface CategoryItemProperties {
  title: string;
  image: string;
  href: string;
}

const CategoryItem = ({ title, image, href }: CategoryItemProperties) => {
  return (
    <Link href={href}>
      <div
        className="flex h-[200px] items-center justify-center overflow-hidden rounded-lg bg-cover bg-center px-10 md:h-[400px]"
        style={{ backgroundImage: `url(${image})` }}
      >
        <span className="text-center !text-xs font-semibold tracking-[1px] text-white lg:!text-xl lg:tracking-normal">
          {title}
        </span>
      </div>
    </Link>
  );
};

const CategorySkeleton = () => (
  <div className="aspect-[3/4] space-y-3 rounded-lg">
    <Skeleton className="h-full w-full rounded-lg" />
  </div>
);

export const Categories = () => {
  const { useGetAllProductCategory } = useAppService();
  const { data: categoriesResponse, isLoading, isError, refetch } = useGetAllProductCategory();

  const categoryImages = [
    "https://res.cloudinary.com/kingsleysolomon/image/upload/v1767042747/skicom/acy6r3gqyetxcghfyxlv.png",
    "https://res.cloudinary.com/kingsleysolomon/image/upload/v1767042747/skicom/fhepjmapqqt46a5leibn.png",
    "https://res.cloudinary.com/kingsleysolomon/image/upload/v1767042749/skicom/gcd8pkx2hvotfwij61hz.png",
    "https://res.cloudinary.com/kingsleysolomon/image/upload/v1767042747/skicom/acy6r3gqyetxcghfyxlv.png",
    "https://res.cloudinary.com/kingsleysolomon/image/upload/v1767042747/skicom/zeprdyempmavqdvl1k2w.png",
    "https://res.cloudinary.com/kingsleysolomon/image/upload/v1767042747/skicom/zeprdyempmavqdvl1k2w.png",
    "https://res.cloudinary.com/kingsleysolomon/image/upload/v1767042748/skicom/tns0s6h7ginairv3egta.png",
    "https://res.cloudinary.com/kingsleysolomon/image/upload/v1767042748/skicom/tns0s6h7ginairv3egta.png",
  ];

  const categories =
    categoriesResponse?.data?.map((category, index) => {
      const formattedTitle = formatCategory(category);
      return {
        title: formattedTitle,
        image: categoryImages[index % categoryImages.length],
        href: `/shop?category=${encodeURIComponent(category)}`,
      };
    }) || [];

  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <CategorySkeleton key={index} />
      ))}
    </div>
  );

  const renderCategoryItems = () => (
    <UniversalSwiper
      className={``}
      swiperClassName={``}
      items={categories}
      renderItem={(category) => <CategoryItem title={category.title} image={category.image} href={category.href} />}
      swiperOptions={{
        spaceBetween: 24,
      }}
      showPagination
      breakpoints={{
        0: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
      }}
    />
  );

  const renderEmptyState = () => <EmptyState title={`Category list is empty`} />;

  const renderErrorState = () => (
    <ErrorState description={`Categories not found`} retryText={"retry"} onRetry={() => refetch()} />
  );

  const renderCategoriesGrid = () => {
    if (isLoading) {
      return renderLoadingSkeletons();
    }

    if (categories.length === 0) {
      return renderEmptyState();
    }

    if (isError) {
      return renderErrorState();
    }

    return renderCategoryItems();
  };

  return (
    <Wrapper className="gap-6 py-0">
      <div className="flex items-baseline justify-center">
        <h2
          className={cn("!text-xl lg:!text-4xl lg:!leading-[41.62px] lg:!tracking-[1px]")}
        >{`Browse Our Categories`}</h2>
      </div>
      {renderCategoriesGrid()}
    </Wrapper>
  );
};
