"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Clock, Loader2, Search, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GoLinkExternal } from "react-icons/go";
import { MdCancel } from "react-icons/md";
import { useDebounce } from "use-debounce";

interface SearchInputProperties {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number; // debounce delay in ms
  className?: string;
  /** @deprecated Prefer `disabled` */
  isDisabled?: boolean;
  disabled?: boolean;
  /**
   * Initial value for the input (e.g. from URL query params). The component
   * keeps its own internal state but will sync when this changes.
   */
  initialValue?: string;
}

export const SearchInput = ({
  placeholder = "Search...",
  onSearch,
  delay = 300,
  className = "",
  isDisabled = false,
  disabled,
  initialValue,
}: SearchInputProperties) => {
  const [searchQuery, setSearchQuery] = useState(initialValue ?? "");
  const [debouncedQuery] = useDebounce(searchQuery, delay);

  // Avoid infinite request loops when parent recreates `onSearch` each render.
  const onSearchReference = useRef(onSearch);
  const lastEmittedQueryReference = useRef<string | null>(null);

  useEffect(() => {
    onSearchReference.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const next = initialValue ?? "";
    setSearchQuery((previous) => (previous === next ? previous : next));
  }, [initialValue]);

  useEffect(() => {
    if (lastEmittedQueryReference.current === debouncedQuery) return;
    lastEmittedQueryReference.current = debouncedQuery;
    onSearchReference.current(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
      <Input
        disabled={disabled ?? isDisabled}
        type="search"
        placeholder={placeholder}
        className="bg-muted h-9 border-none pr-4 pl-10 shadow-none"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </div>
  );
};

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  url?: string;
  metadata?: Record<string, unknown>;
}

interface GlobalSearchInputProperties {
  className?: string;
  placeholder?: string;
  /**
   * How the results are presented.
   * - `popover` (default): results appear in a Radix popover.
   * - `inline`: results render directly under the input (better for mobile modals).
   */
  mode?: "popover" | "inline";
  onSearch?: (query: string) => void;
  /**
   * Called when the user submits the current query explicitly (e.g. presses Enter
   * without a specific result selected). This allows parent components to perform
   * full-page navigations or more complex searches.
   */
  onSubmit?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  isLoading?: boolean;
  disabled?: boolean;
  recentSearches?: string[];
  onClearRecent?: () => void;
  emptyMessage?: string;
  delay?: number;
  /** Optional className override for the results dropdown container. */
  popoverContentClassName?: string;
}

function highlightQuery(text: string, query: string) {
  if (!text || !query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) return text;

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + query.length);
  const after = text.slice(matchIndex + query.length);

  return (
    <>
      {before}
      <span className="bg-accent font-semibold text-black">{match}</span>
      {after}
    </>
  );
}

export function GlobalSearchInput({
  className,
  placeholder = "Search anything...",
  mode = "popover",
  onSearch,
  onSubmit,
  onResultSelect,
  results = [],
  isLoading = false,
  disabled = false,
  recentSearches = [],
  onClearRecent,
  emptyMessage = "Try searching with different keywords.",
  delay = 300,
  popoverContentClassName,
}: GlobalSearchInputProperties) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, delay);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch?.(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      setOpen(true);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
    setSearchQuery("");
    setOpen(false);
    inputReference.current?.blur();
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    inputReference.current?.focus();
    onSearch?.(query);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    const totalResults = results.length;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setSelectedIndex((previous) => (previous < totalResults - 1 ? previous + 1 : previous));
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setSelectedIndex((previous) => (previous > 0 ? previous - 1 : -1));
        break;
      }
      case "Enter": {
        event.preventDefault();
        const trimmedQuery = searchQuery.trim();

        if (selectedIndex >= 0 && results[selectedIndex]) {
          // When a result is highlighted, prefer selecting that result.
          handleResultClick(results[selectedIndex]);
        } else if (trimmedQuery && onSubmit) {
          // Fallback: submit the raw query to the parent when no specific
          // result is selected. This mirrors a traditional search bar
          // behavior (press Enter to search).
          onSubmit(trimmedQuery);
          setOpen(false);
          setSearchQuery("");
          inputReference.current?.blur();
        }
        break;
      }
      case "Escape": {
        event.preventDefault();
        setOpen(false);
        setSearchQuery("");
        inputReference.current?.blur();
        break;
      }
    }
  };

  const showDropdown = open && (searchQuery.trim() !== "" || recentSearches.length > 0);
  const hasResults = results.length > 0;
  const showRecent = searchQuery.trim() === "" && recentSearches.length > 0;

  const resultsContent = (
    <div
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      className="max-h-[calc(100dvh-12rem)] overflow-y-auto overscroll-contain sm:max-h-[500px]"
    >
      {showRecent && (
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-muted-foreground text-xs font-medium">Recent Searches</span>
            {onClearRecent && (
              <button
                type="button"
                onClick={onClearRecent}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-1">
            {recentSearches.map((query, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleRecentSearchClick(query)}
                className="hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm transition-colors"
              >
                <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{query}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {searchQuery.trim() && !isLoading && !hasResults && (
        <EmptyState
          className="text-primary flex min-h-[calc(100dvh-12rem)] items-center justify-center md:min-h-[500px]"
          // icon={<Search className="text-primary" />}
          title="No results found."
          description={emptyMessage}
        />
      )}

      {searchQuery.trim() && hasResults && (
        <div className="p-2">
          <div className="space-y-1">
            {results.map((result, index) => (
              <section key={result.id}>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "hover:bg-primary/10 flex w-full items-center gap-3 rounded-sm px-2 py-2.5 text-left transition-colors",
                      selectedIndex === index && "bg-accent",
                    )}
                  >
                    <Search className="text-muted-foreground h-4 w-4 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{highlightQuery(result.title, searchQuery.trim())}</p>
                      {/* {result.description && <p className="text-muted-foreground text-xs">{result.description}</p>} */}
                    </div>
                    <span>
                      <GoLinkExternal className="text-primary size-3 shrink-0 stroke-1" />
                    </span>
                  </button>
                </div>
                <hr className="my-1 opacity-40" />
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (mode === "inline") {
    return (
      <div className="w-full">
        <div
          className={cn(
            "relative flex h-12 w-full items-center gap-2 rounded-md bg-transparent px-3 transition-colors",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <Input
            ref={inputReference}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            disabled={disabled}
            className="placeholder:text-muted-foreground h-full flex-1 border-none bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none dark:bg-transparent"
          />
          {isLoading && <Loader2 className="text-muted-foreground h-4 w-4 shrink-0 animate-spin" />}
          {searchQuery && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                inputReference.current?.focus();
              }}
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            >
              <MdCancel className="text-primary h-5 w-5" />
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="border-border bg-background mt-2 overflow-hidden rounded-md border">{resultsContent}</div>
        )}

        {!showDropdown && (
          <div className="text-muted-foreground mt-50 space-y-2 text-center text-sm lg:text-lg">
            <p className="!text-primary !font-semibold tracking-wide">Search the best of Skishop</p>
            <p className="text-xs">
              Find products by name, category, or store. Start typing above to discover new items tailored to you.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Popover open={showDropdown} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "relative flex h-12 w-full items-center gap-2 rounded-md bg-transparent px-3 transition-colors",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <Input
            ref={inputReference}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            disabled={disabled}
            className="placeholder:text-muted-foreground h-full flex-1 border-none bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none dark:bg-transparent"
          />
          {isLoading && <Loader2 className="text-muted-foreground h-4 w-4 shrink-0 animate-spin" />}
          {searchQuery && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                inputReference.current?.focus();
              }}
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            >
              <MdCancel className="text-primary h-5 w-5" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        // sideOffset={16}
        // align="start"
        className={cn("min-w-2xl p-0", popoverContentClassName)}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {resultsContent}
      </PopoverContent>
    </Popover>
  );
}
