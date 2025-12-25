"use client";

import { GlobalSearchInput, type SearchResult } from "@/components/core/miscellaneous/search-input";
import { DialogClose } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";

import { ReusableDialog } from "../../dialog/Dialog";

export const SearchDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

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
      className={cn(
        // NOTE:
        // - Mobile: full-screen (no awkward margins, better keyboard handling).
        // - Desktop: keeps the original dropdown-like positioning under the navbar.
        "bg-background translate-y-0 overflow-hidden p-0",
        isMobile
          ? "inset-0 h-[100dvh] w-screen max-w-none translate-x-0 rounded-none"
          : "top-4 max-h-[calc(100vh-2rem)] sm:top-12 sm:max-h-[85vh] sm:max-w-2xl sm:min-w-2xl sm:rounded-lg",
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col",
          isMobile
            ? "h-full px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)]"
            : "max-h-[calc(100vh-2rem)] p-4 sm:max-h-none sm:p-0",
        )}
      >
        {isMobile && (
          <div className="flex items-center justify-end pb-3">
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close search"
                className="hover:bg-accent focus-visible:ring-ring inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
        )}
        <GlobalSearchInput
          placeholder={t("search.placeholder")}
          onSearch={handleSearch}
          onSubmit={handleSearchSubmit}
          onResultSelect={handleResultSelect}
          results={searchResults}
          isLoading={isSuggestionsLoading}
          mode={isMobile ? "inline" : "popover"}
          className="border-border w-full rounded-md border"
        />
      </div>
    </ReusableDialog>
  );
};
