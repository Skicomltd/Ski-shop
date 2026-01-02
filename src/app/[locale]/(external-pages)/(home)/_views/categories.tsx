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
    // 1) Sales / Hot Deals
    "https://source.unsplash.com/featured/1200x800/?sale,discount,shopping",
    // 2) Gold Finds
    "https://source.unsplash.com/featured/1200x800/?gold,bullion,metal",
    // 3) Luxury
    "https://source.unsplash.com/featured/1200x800/?luxury,lifestyle,designer",
    // 4) Bottega
    "https://source.unsplash.com/featured/1200x800/?woven,leather,handbag",
    // 5) Perfume & Oils
    "https://source.unsplash.com/featured/1200x800/?perfume,fragrance,bottle",
    // 6) Sequoia (Bath & Body)
    "https://source.unsplash.com/featured/1200x800/?bath,spa,bodycare",
    // 7) Gym/Fitness
    "https://source.unsplash.com/featured/1200x800/?gym,fitness,workout",
    // 8) Furniture / Home Decor
    "https://source.unsplash.com/featured/1200x800/?interior,home-decor,furniture",
    // 9) Kitchen
    "https://source.unsplash.com/featured/1200x800/?kitchen,cooking,cookware",
    // 10) Gadgets
    "https://source.unsplash.com/featured/1200x800/?gadgets,technology,electronics",
    // 11) Men's Fashion
    "https://source.unsplash.com/featured/1200x800/?mens-fashion,suit,style",
    // 12) Women's Fashion
    "https://source.unsplash.com/featured/1200x800/?womens-fashion,dress,style",
    // 13) Basics
    "https://source.unsplash.com/featured/1200x800/?tshirt,basic,clothing",
    // 14) Jewelry
    "https://source.unsplash.com/featured/1200x800/?jewelry,necklace,ring",
    // 15) Art
    "https://source.unsplash.com/featured/1200x800/?art,painting,canvas",
    // 16) Kids
    "https://source.unsplash.com/featured/1200x800/?kids,children,play",
    // 17) Tools and Kits
    "https://source.unsplash.com/featured/1200x800/?tools,toolbox,hardware",
    // 18) Hair & Cosmetics
    "https://source.unsplash.com/featured/1200x800/?makeup,cosmetics,skincare",
    // 19) Appliances
    "https://source.unsplash.com/featured/1200x800/?appliances,kitchen-appliances,home",
    // 20) Computer / Gaming
    "https://source.unsplash.com/featured/1200x800/?gaming,computer,keyboard",
    // 21) Watch & Accessories
    "https://source.unsplash.com/featured/1200x800/?watch,wristwatch,accessories",
    // 22) Educational
    "https://source.unsplash.com/featured/1200x800/?education,books,learning",
    // 23) Pet Supplies
    "https://source.unsplash.com/featured/1200x800/?pet,dog,cat",
    // 24) Toys
    "https://source.unsplash.com/featured/1200x800/?toys,lego,play",
    // 25) Automobiles / Parts
    "https://source.unsplash.com/featured/1200x800/?car,engine,auto-parts",
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
