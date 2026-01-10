"use client";

import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useCallback } from "react";

export const useDashboardSearchParameters = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger);
  const [perPage, setPerPage] = useQueryState("perPage", parseAsInteger);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [limit, setLimit] = useQueryState("limit", parseAsInteger);
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringEnum(["all", "delivered", "pending", "cancelled", "paid", "active", "inactive"]),
  );
  const [productStatus, setProductStatus] = useQueryState(
    "productStatus",
    parseAsStringEnum(["all", "published", "draft"]),
  );
  const [role, setRole] = useQueryState("role", parseAsStringEnum(["all", "customer", "vendor", "rider"]));

  return {
    // Current values
    page: page ?? 1,
    perPage: perPage ?? undefined,
    search: search ?? "",
    limit: limit ?? undefined,
    status: status ?? "all",
    productStatus: productStatus ?? "all",
    role: role ?? undefined,
    // Setters
    setPage,
    setPerPage,
    setLimit,
    setSearch: useCallback(
      (value: string | null) => {
        // Remove search parameter if value is empty
        if (!value || value.trim() === "") {
          setSearch(null);
        } else {
          setSearch(value);
        }
      },
      [setSearch],
    ),
    setStatus,
    setProductStatus,
    setRole,
    // Utility functions
    resetFilters: () => {
      setSearch(null);
      setStatus(null);
      setPage(null);
      setLimit(null);
      setProductStatus(null);
      setRole(null);
    },

    resetToFirstPage: useCallback(() => {
      setPage(null);
    }, [setPage]),
  };
};
