"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import SkiButton from "@/components/shared/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Paginations } from "@/components/shared/pagination/pagination";
import { CustomSelect } from "@/components/shared/select-dropdown";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { PiFunnel } from "react-icons/pi";
import { useDebounce } from "use-debounce";

import { MobileDownloadBanner } from "../_components/mobile-download-banner";
import { ShopCardSkeleton } from "../_components/shop-card-skeleton";
import { ShopCard } from "../(home)/_components/shop-card/shop-card";
import { OptionsSelector } from "./_components/option/options";
import { Hero } from "./_views/hero";

const Page = () => {
  const { useGetAllProducts, useGetAllProductCategory, useGetTopVendors, useGetAllhandPickedProducts } =
    useAppService();
  const t = useTranslations("shopPage");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sortOldest = t("search.sort.oldest");
  const sortNewest = t("search.sort.newest");

  // Use nuqs for URL parameter management
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [search, setSearch] = useQueryState("search");
  const [category, setCategory] = useQueryState("category");
  const [storeId, setStoreId] = useQueryState("storeId");
  const [sortBy, setSortBy] = useQueryState("sortBy", { defaultValue: "DESC" });
  const [rating, setRatings] = useQueryState("ratings");
  const [limit] = useQueryState("limit", { defaultValue: "12" });
  const [vendor] = useQueryState("vendor");
  const [flag] = useQueryState("flag");

  // Debounce search input for better UX
  const [debouncedSearch] = useDebounce(search || "", 500);

  const {
    data: categoriesData,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading,
  } = useGetAllProductCategory({ enabled: true });

  const {
    data: topVendorsData,
    isLoading: isTopVendorsLoading,
    isError: isTopVendorsError,
  } = useGetTopVendors({
    enabled: true,
  });

  // Prepare filters for API call
  const isHandpickedMode = flag === "handpicked";

  const productFilters = useMemo<Filters>(() => {
    return {
      page: page ? Number.parseInt(page) : 1,
      ...(category && category !== t("filters.allCategories") && { categories: category }),
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(storeId && { storeId }),
      ...(sortBy && { sortBy }),
      ...(rating && { rating }),
      // Pass flag to the generic products endpoint, except when we are in handpicked mode
      ...(flag && flag !== "handpicked" && { flag }),
      ...(limit && { limit: Number.parseInt(limit) }),
    };
  }, [page, category, debouncedSearch, storeId, sortBy, rating, limit, flag, t]);

  // For handpicked view, we intentionally omit the limit so that the backend returns all
  // handpicked products ("see all" behaviour).
  const handpickedFilters = useMemo<Filters>(() => {
    return {
      ...(category && category !== t("filters.allCategories") && { categories: category }),
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(storeId && { storeId }),
      ...(sortBy && { sortBy }),
      ...(rating && { rating }),
    };
  }, [category, debouncedSearch, storeId, sortBy, rating, t]);

  // Queries
  const {
    data: handpickedData,
    isLoading: isLoadingHandpicked,
    isError: isHandpickedError,
    refetch: refetchHandpicked,
  } = useGetAllhandPickedProducts(handpickedFilters, { enabled: isHandpickedMode });

  const {
    data: productData,
    isLoading: isLoadingProducts,
    isError: isProductError,
    refetch: refetchProducts,
  } = useGetAllProducts(productFilters, { enabled: !isHandpickedMode });

  // Handle vendor query param
  useEffect(() => {
    if (vendor && topVendorsData?.data?.items) {
      const foundVendor = topVendorsData.data.items.find((v) => v.name === vendor);
      if (foundVendor) {
        setStoreId(foundVendor.id);
      }
    }
  }, [vendor, topVendorsData, setStoreId]);

  // Derived state
  const activeData = isHandpickedMode ? handpickedData : productData;
  const isLoading = isHandpickedMode ? isLoadingHandpicked : isLoadingProducts;
  const isError = isHandpickedMode ? isHandpickedError : isProductError;
  const refetch = isHandpickedMode ? refetchHandpicked : refetchProducts;

  const products = activeData?.data?.items || [];
  const totalProducts = activeData?.data?.metadata.total || 0;
  const totalPages = activeData?.data?.metadata.totalPages || 0;
  const categories = categoriesData?.data || [];

  // Handle category change
  const handleCategoryChange = async (value: string) => {
    setCategory(value === t("filters.allCategories") ? null : value);
    setPage("1"); // Reset to first page when changing category
    setDrawerOpen(false); // Close drawer on mobile
  };

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value || null);
    setPage("1"); // Reset to first page when searching
  };

  // Handle vendor change
  const handleVendorChange = (value: string) => {
    setStoreId(value === t("filters.allVendor") ? null : value);
    setPage("1"); // Reset to first page when changing vendor
    setDrawerOpen(false); // Close drawer on mobile
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    switch (value) {
      case sortOldest: {
        setSortBy("ASC");
        setRatings(null);
        break;
      }
      case sortNewest: {
        setSortBy("DESC");
        setRatings(null);
        break;
      }
      // case "1 star": {
      //   setRatings("1");
      //   setSortBy(null);
      //   break;
      // }
      // case "2 stars": {
      //   setRatings("2");
      //   setSortBy(null);
      //   break;
      // }
      // case "3 stars": {
      //   setRatings("3");
      //   setSortBy(null);
      //   break;
      // }
      // case "4 stars": {
      //   setRatings("4");
      //   setSortBy(null);
      //   break;
      // }
      // case "5 stars": {
      //   setRatings("5");
      //   setSortBy(null);
      //   break;
      // }
      // No default
    }
    setPage("1"); // Reset to first page when changing sort
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
    window.scrollTo({ top: 0 });
  };

  if (isCategoriesError || isTopVendorsError) return;

  // Determine current value for sort dropdown
  const currentValue =
    sortBy === "ASC"
      ? sortOldest
      : sortBy === "DESC"
        ? sortNewest
        : rating
          ? `${rating} star${rating === "1" ? "" : "s"}`
          : sortNewest;

  return (
    <>
      <Hero />
      <Wrapper className="my-6 sm:my-12 lg:my-16">
        {isError ? (
          <ErrorState className={`mx-auto max-w-[1240px]`} onRetry={() => refetch()} />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between sm:mb-6 lg:hidden">
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <SkiButton
                    variant="outline"
                    icon={<PiFunnel className="h-4 w-4" />}
                    isLeftIconVisible
                    className="rounded-lg"
                    size="sm"
                  >
                    {t("filters.title") || "Filters"}
                  </SkiButton>
                </DrawerTrigger>
                <DrawerContent className="h-[80vh] sm:h-[85vh]">
                  <DrawerHeader>
                    <DrawerTitle>{t("filters.title") || "Filters"}</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-6">
                      {/* Categories */}
                      {!isCategoriesLoading && (
                        <OptionsSelector
                          title={t("filters.categories")}
                          categories={[t("filters.allCategories"), ...categories]}
                          value={category || t("filters.allCategories")}
                          onChange={handleCategoryChange}
                        />
                      )}

                      {/* Vendors */}
                      {!isTopVendorsLoading && (
                        <OptionsSelector
                          title={t("filters.vendor")}
                          categories={[
                            t("filters.allVendor"),
                            ...(topVendorsData?.data?.items.map((vendor) => ({
                              value: vendor.id,
                              label: vendor.name,
                            })) || []),
                          ]}
                          value={storeId || t("filters.allVendor")}
                          onChange={handleVendorChange}
                        />
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
              <div className="text-sm text-gray-600 lg:text-base">
                {totalProducts} {t("activeFilters.resultsFound")}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
              {/* Filters sidebar - Hidden on mobile, shown on desktop */}
              <section className="hidden space-y-6 lg:sticky lg:top-8 lg:col-span-2 lg:block lg:space-y-10 lg:self-start">
                {isCategoriesLoading ? (
                  <div className="space-y-2">
                    <h6 className="!font-bold uppercase">{t("filters.categories")}</h6>
                    <div className="space-y-4">
                      {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="bg-muted h-4 w-4 animate-pulse rounded-full" />
                          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <OptionsSelector
                    title={t("filters.categories")}
                    categories={[t("filters.allCategories"), ...categories]}
                    value={category || t("filters.allCategories")}
                    onChange={handleCategoryChange}
                  />
                )}
                {isTopVendorsLoading ? (
                  <div className="space-y-2">
                    <h6 className="!font-bold uppercase">{t("filters.vendor")}</h6>
                    <div className="space-y-4">
                      {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="bg-muted h-4 w-4 animate-pulse rounded-full" />
                          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <OptionsSelector
                    title={t("filters.vendor")}
                    categories={[
                      t("filters.allVendor"),
                      ...(topVendorsData?.data?.items.map((vendor) => ({
                        value: vendor.id,
                        label: vendor.name,
                      })) || []),
                    ]}
                    value={storeId || t("filters.allVendor")}
                    onChange={handleVendorChange}
                  />
                )}
              </section>

              {/* Main content */}
              <section className="lg:col-span-10">
                {/* Search and sort header */}
                <article className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between lg:mb-8">
                  <div className="w-full sm:w-[20rem]">
                    <Input
                      name="search"
                      placeholder={t("search.placeholder")}
                      value={search || ""}
                      onChange={handleSearch}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4">
                    {/* <p className="!m-0 hidden text-sm text-gray-600 sm:block sm:text-base">{t("search.sortBy")}</p> */}
                    {/* <p className="!m-0 hidden text-sm text-gray-600 sm:block sm:text-base">{t("search.filterLabel")}</p> */}
                    <CustomSelect
                      options={[sortOldest, sortNewest]}
                      placeholder={t("search.chooseSortOption")}
                      value={currentValue}
                      onChange={handleSortChange}
                    />
                  </div>
                </article>

                {/* Active filters info */}
                <article className="bg-high-grey-I my-4 flex flex-col gap-3 rounded-md p-4 sm:flex-row sm:items-center sm:justify-between md:my-6 lg:my-8 dark:bg-[#111111]">
                  <div>
                    <span className="text-mid-grey-II text-sm lg:text-base">{t("activeFilters.title")} </span>
                    <span className="space-x-4 text-sm lg:text-base">
                      {category || t("filters.allCategories")} /{" "}
                      {(() => {
                        if (!storeId || storeId === t("filters.allVendor")) {
                          return t("filters.allVendor");
                        }
                        const selectedVendor = topVendorsData?.data?.items.find((vendor) => vendor.id === storeId);
                        return selectedVendor?.name || storeId;
                      })()}
                      {debouncedSearch && ` / ${t("search.searchLabel")}: ${debouncedSearch}`}
                    </span>
                  </div>
                  <div>
                    <p className="text-mid-grey-II !m-0 text-sm lg:text-base">
                      <span className="text-high-grey-II text-sm font-semibold lg:text-base">{totalProducts}</span>{" "}
                      {t("activeFilters.resultsFound")}
                    </p>
                  </div>
                </article>

                {/* Products grid */}
                <section className="mb-6 sm:mb-8 lg:mb-12">
                  <div className="xs:grid-cols-2 grid grid-cols-1 gap-1 sm:grid-cols-3 md:gap-2 lg:grid-cols-4 lg:gap-4">
                    {isLoading && Array.from({ length: 12 }).map((_, index) => <ShopCardSkeleton key={index} />)}

                    {!isLoading && !products?.length && (
                      <div className="col-span-full py-10 text-center">
                        <EmptyState />
                      </div>
                    )}

                    {!isLoading &&
                      products.map((product: Product) => (
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

                  {/* Pagination */}
                  {!isLoading && totalPages > 1 && (
                    <div className="mt-6 sm:mt-10 lg:mt-12">
                      <Paginations
                        currentPage={page ? Number.parseInt(page) : 1}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </section>
              </section>
            </div>
          </>
        )}
        {/* Mobile Filters Toggle */}
      </Wrapper>

      <MobileDownloadBanner />
    </>
  );
};

export default Page;
