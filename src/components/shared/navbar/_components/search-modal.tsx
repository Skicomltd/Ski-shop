"use client";

import { GlobalSearchInput, type SearchResult } from "@/components/core/miscellaneous/search-input";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";

import { ReusableDialog } from "../../dialog/Dialog";

export const SearchDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const t = useTranslations("shopPage");
  const locale = useLocale();
  const router = useRouter();
  const { useGetAllProducts } = useAppService();

  const trimmedSearchTerm = searchTerm.trim();

  const filters = useMemo<Filters>(
    () => ({
      // page: 1,
      limit: 50,
      ...(trimmedSearchTerm && { search: trimmedSearchTerm }),
    }),
    [trimmedSearchTerm],
  );

  const { data: suggestionData, isLoading: isSuggestionsLoading } = useGetAllProducts(filters, {
    enabled: Boolean(trimmedSearchTerm),
  });

  const suggestions: Product[] = suggestionData?.data?.items || [];

  const handleSuggestionClick = (product: Product) => {
    router.push(`/${locale}/shop/products/${product.id}`);
    setIsOpen(false);
  };

  const searchResults: SearchResult[] = suggestions.map((product) => ({
    id: String(product.id),
    title: product.name,
    description: product.category ?? undefined,
    category: product.store?.name ?? undefined,
    metadata: { product },
  }));

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleResultSelect = (result: SearchResult) => {
    const product = (result.metadata?.product || undefined) as Product | undefined;
    if (product) {
      handleSuggestionClick(product);
    }
  };

  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim();

    if (trimmed) {
      const searchParameters = new URLSearchParams();
      searchParameters.set("search", trimmed);
      searchParameters.set("page", "1");
      router.push(`/${locale}/shop?${searchParameters.toString()}`);
    } else {
      router.push(`/${locale}/shop`);
    }

    setIsOpen(false);
  };

  return (
    <ReusableDialog
      hideClose
      trigger={
        <button aria-label="Open Search Dialog" className="border-neutral-dark-2 rounded-full border p-2">
          <LuSearch size={20} />
        </button>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      // title={t("search.placeholder")}
      wrapperClassName="hidden"
      className="bg-background top-12 min-w-2xl py-0"
    >
      <div className="w-full">
        <GlobalSearchInput
          placeholder={t("search.placeholder")}
          onSearch={handleSearch}
          onSubmit={handleSearchSubmit}
          onResultSelect={handleResultSelect}
          results={searchResults}
          isLoading={isSuggestionsLoading}
          className="px-0"
        />
      </div>
    </ReusableDialog>
  );
};
