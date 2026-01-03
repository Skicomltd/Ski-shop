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
      <div className="group relative h-[200px] overflow-hidden rounded-lg md:h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-[1.2]"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="relative flex h-full w-full items-center justify-center bg-black/30 px-10">
          <span className="text-center !text-xs font-semibold tracking-[1px] text-white lg:!text-xl lg:tracking-normal">
            {title}
          </span>
        </div>
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
    // 1) Sales / Hot Deals
    "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1215&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 2) Gold Finds
    "https://plus.unsplash.com/premium_photo-1681276170281-cf50a487a1b7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 3) Luxury
    "https://plus.unsplash.com/premium_photo-1683141052679-942eb9e77760?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 4) Bottega
    "https://plus.unsplash.com/premium_photo-1664202525979-80d1da46b34b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 5) Perfume & Oils
    "https://images.unsplash.com/photo-1621814374283-57cc5d0d39c2?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 6) Sequoia (Bath & Body)
    "https://plus.unsplash.com/premium_photo-1661597147106-317716ec77b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 7) Gym/Fitness
    "https://images.unsplash.com/photo-1669989179336-b2234d2878df?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 8) Furniture / Home Decor
    "https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 9) Kitchen
    "https://plus.unsplash.com/premium_photo-1678375722686-c7ea507c3003?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 10) Gadgets
    "https://images.unsplash.com/photo-1602248145578-9e5bc50c77b3?q=80&w=726&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 11) Men's Fashion
    "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 12) Women's Fashion
    "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 13) Basics
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 14) Jewelry
    "https://plus.unsplash.com/premium_photo-1681276170281-cf50a487a1b7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 15) Art
    "https://images.unsplash.com/photo-1601887389937-0b02c26b602c?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 16) Kids
    "https://images.unsplash.com/photo-1559454403-b8fb88521f11?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 17) Tools and Kits
    "https://plus.unsplash.com/premium_photo-1749687932602-93068c7af537?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 18) Hair & Cosmetics
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 19) Appliances
    "https://plus.unsplash.com/premium_photo-1711477326406-2b53375330f7?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 20) Computer / Gaming
    "https://images.unsplash.com/photo-1542729716-6d1890d980ee?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 21) Watch & Accessories
    "https://images.unsplash.com/photo-1603035944709-d8b69bae588a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 22) Educational
    "https://images.unsplash.com/photo-1706250718869-677489d2691d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 23) Pet Supplies
    "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 24) Toys
    "https://images.unsplash.com/photo-1603558431750-dfa36513aee6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // 25) Automobiles / Parts
    "https://images.unsplash.com/photo-1611633235555-45e252fe48c8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const categories =
    categoriesResponse?.data?.map((category, index) => {
      const formattedTitle = formatCategory(category);
      return {
        title: formattedTitle,
        image: categoryImages[index % categoryImages.length],
        // image: category.image,
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
