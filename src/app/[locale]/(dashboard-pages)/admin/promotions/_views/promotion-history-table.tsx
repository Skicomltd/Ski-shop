/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import SkiButton from "@/components/shared/button";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { DownloadCsvButton } from "@/components/shared/download-csv-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/utils";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { usePromotionService } from "@/services/dashboard/vendor/promotions/use-promotion-service";
import { useLocale } from "next-intl";
import { useCallback, useMemo } from "react";

import { DashboardHeader } from "../../../_components/dashboard-header";

export const PromotionHistoryTable: React.FC = () => {
  const {
    page,
    limit,
    status,
    search: searchQuery,
    setSearch: setSearchQuery,
    resetToFirstPage,
  } = useDashboardSearchParameters();
  const locale = useLocale() as Locale;

  const { useGetAdsHistory } = usePromotionService();

  const serverFilters: Filters = useMemo(
    () => ({
      page,
      limit,
      // only pass status when not "all" to avoid filtering unintentionally
      status: status && status !== "all" ? status : undefined,
      search: searchQuery || undefined,
    }),
    [page, limit, status, searchQuery],
  );

  const { data } = useGetAdsHistory(serverFilters);
  const campaigns = data?.data?.items ?? [];
  const meta = data?.data?.metadata;

  const filteredHistory = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return campaigns;
    return campaigns.filter((r: Campaign) => {
      const vendorName =
        (r.vendor?.firstName ? `${r.vendor.firstName} ${r.vendor.lastName ?? ""}`.trim() : r.store?.name) || "";
      return (
        vendorName.toLowerCase().includes(q) ||
        (r.product?.name || "").toLowerCase().includes(q) ||
        (r.status || "").toLowerCase().includes(q)
      );
    });
  }, [campaigns, searchQuery]);

  const totalPages = meta?.totalPages ?? 1;
  const hasNextPage = meta?.hasNextPage ?? false;
  const hasPreviousPage = meta?.hasPreviousPage ?? false;
  const itemsPerPage = meta?.limit ?? filteredHistory.length;

  const columns: TableColumnDefinition<DataItem>[] = useMemo(() => {
    const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
    return [
      {
        header: "Vendor's Name",
        accessorKey: "vendor",
        render: (_value: unknown, row: DataItem) => {
          const c = row as unknown as Campaign;
          const name =
            (c.vendor?.firstName ? `${c.vendor.firstName} ${c.vendor.lastName ?? ""}`.trim() : c.store?.name) || "N/A";
          return (
            <span className="inline-block max-w-[150px] cursor-help truncate text-xs font-medium" title={name}>
              {name}
            </span>
          );
        },
      },
      {
        header: "Products",
        accessorKey: "product",
        render: (_value: unknown, row: DataItem) => {
          const c = row as unknown as Campaign;
          const productName = c.product?.name || "N/A";
          return (
            <span className="inline-block max-w-[160px] cursor-help truncate text-xs font-medium" title={productName}>
              {productName}
            </span>
          );
        },
      },
      {
        header: "Duration",
        accessorKey: "duration",
        render: (_value: unknown, row: DataItem) => {
          const c = row as unknown as Campaign;
          return <span className="text-xs font-semibold">{c.duration} Days</span>;
        },
      },
      {
        header: "Start Date",
        accessorKey: "startDate",
        render: (_value: unknown, row: DataItem) => {
          const c = row as unknown as Campaign;
          return <span className="text-xs">{formatDate(c.startDate, locale)}</span>;
        },
      },
      {
        header: "Expiry Date",
        accessorKey: "endDate",
        render: (_value: unknown, row: DataItem) => {
          const c = row as unknown as Campaign;
          return <span className="text-xs">{formatDate(c.endDate, locale)}</span>;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        render: (_value: unknown, row: DataItem) => {
          const c = row as unknown as Campaign;
          return (
            <span
              className={`rounded-full px-2 py-1 text-xs capitalize ${
                c.status === "active" ? "bg-low-success text-mid-success" : "bg-red-100 text-red-600"
              }`}
            >
              {cap(c.status)}
            </span>
          );
        },
      },
    ];
  }, [locale]);

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      if (newSearch !== searchQuery) {
        setSearchQuery(newSearch);
        resetToFirstPage();
      }
    },
    [setSearchQuery, resetToFirstPage, searchQuery],
  );

  const csvRows = useMemo(
    () =>
      (filteredHistory || []).map((r: Campaign) => {
        const vendorName =
          (r.vendor?.firstName ? `${r.vendor.firstName} ${r.vendor.lastName ?? ""}`.trim() : r.store?.name) || "N/A";
        return {
          vendorName,
          productName: r.product?.name || "N/A",
          duration: r.duration,
          startDate: r.startDate,
          expiryDate: r.endDate,
          status: r.status,
        };
      }),
    [filteredHistory],
  );

  const renderEmptyState = () => (
    <EmptyState
      images={[{ src: "/images/empty-state.svg", width: 30, height: 30, alt: "No promotions history" }]}
      title="No promotions history found"
      description="There are no promotions matching your criteria."
      className="bg-mid-grey-I space-y-0 rounded-lg"
      titleClassName="!text-2xl"
      descriptionClassName="text-base mb-4"
      actionButton={
        <SkiButton onClick={() => window.location.reload()} variant="primary">
          Refresh
        </SkiButton>
      }
    />
  );

  const renderPromotionHistoryTable = () => (
    <section className="bg-background space-y-6 rounded-lg p-6">
      <DashboardHeader
        title="Promotions History"
        subtitle="Track all promotions lifecycle"
        showSubscriptionBanner={false}
        icon={<Icons.promotion className="size-6" />}
        titleClassName="!text-lg"
        subtitleClassName="!text-sm"
        actionComponent={
          <div className="flex items-center gap-2">
            <SearchInput className="" onSearch={handleSearchChange} initialValue={searchQuery} />
            <DownloadCsvButton
              data={csvRows as unknown as Record<string, unknown>[]}
              filename="promotions-history"
              headers={{
                vendorName: "Vendor's Name",
                productName: "Products",
                duration: "Duration (Days)",
                startDate: "Start Date",
                expiryDate: "Expiry Date",
                status: "Status",
              }}
            />
          </div>
        }
      />

      <div>
        {!filteredHistory || filteredHistory.length === 0 ? (
          renderEmptyState()
        ) : (
          <DashboardTable
            data={filteredHistory as unknown as DataItem[]}
            columns={columns}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            showPagination={false}
            pageParameter="page"
          />
        )}
      </div>
    </section>
  );

  return renderPromotionHistoryTable();
};
