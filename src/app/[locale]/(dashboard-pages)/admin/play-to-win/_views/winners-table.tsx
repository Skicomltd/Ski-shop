/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import SkiButton from "@/components/shared/button";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { DownloadCsvButton } from "@/components/shared/download-csv-button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/i18n/utils";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { usePlay2WinService } from "@/services/dashboard/admin/play2win/use-play2win-service";
import { useLocale } from "next-intl";
import { useCallback, useMemo } from "react";

export const WinnersTable = () => {
  const locale = useLocale();

  const {
    page,
    limit,
    search: searchQuery,
    setSearch: setSearchQuery,
    resetToFirstPage,
  } = useDashboardSearchParameters();

  const { useGetWinners } = usePlay2WinService();

  const serverFilters: Filters = useMemo(
    () => ({
      page,
      limit,
      search: searchQuery || undefined,
    }),
    [page, limit, searchQuery],
  );

  const { data, isLoading } = useGetWinners(serverFilters);
  const winners = (data?.data?.items as Winner[]) || [];
  const meta = data?.data?.metadata;

  const totalPages = meta?.totalPages ?? 1;
  const hasNextPage = meta?.hasNextPage ?? false;
  const hasPreviousPage = meta?.hasPreviousPage ?? false;
  const itemsPerPage = meta?.limit ?? winners.length;

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      if (newSearch !== searchQuery) {
        setSearchQuery(newSearch);
        resetToFirstPage();
      }
    },
    [setSearchQuery, resetToFirstPage, searchQuery],
  );

  const columns: TableColumnDefinition<DataItem>[] = useMemo(
    () => [
      {
        header: "User Name",
        accessorKey: "userName",
        render: (_: unknown, row: DataItem) => {
          const w = row as unknown as Winner;
          const name = w.userName || `${w.user?.firstName ?? ""} ${w.user?.lastName ?? ""}`.trim() || "N/A";
          return <span className="inline-block max-w-[200px] truncate text-sm font-medium">{name}</span>;
        },
      },
      {
        header: "Prize",
        accessorKey: "prizeValue",
        render: (_: unknown, row: DataItem) => {
          const w = row as unknown as Winner;
          const value = w.prizeValue ?? "-";
          return <span className="text-sm font-semibold">{value}</span>;
        },
      },
      {
        header: "Coupon Code",
        accessorKey: "couponCode",
        render: (_: unknown, row: DataItem) => {
          const w = row as unknown as Winner;
          return <code className="bg-muted rounded px-2 py-1 text-xs">{w.couponCode ?? "-"}</code>;
        },
      },
      {
        header: "Coupon Title",
        accessorKey: "couponTitle",
        render: (_: unknown, row: DataItem) => {
          const w = row as unknown as Winner;
          return <span className="inline-block max-w-[220px] truncate text-xs">{w.couponTitle ?? "-"}</span>;
        },
      },
      {
        header: "Date & Time",
        accessorKey: "dateTime",
        render: (_: unknown, row: DataItem) => {
          const w = row as unknown as Winner;
          const date = w.dateTime || w.createdAt || "";
          return <span className="text-xs">{date ? formatDate(date, locale as never) : "-"}</span>;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        render: (_: unknown, row: DataItem) => {
          const w = row as unknown as Winner;
          const status = (w.status ?? "redeemed") as string;
          const cls =
            status === "redeemed"
              ? "bg-low-success text-mid-success"
              : status === "processing"
                ? "bg-blue-100 text-blue-700"
                : status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700";
          return <span className={`rounded-full px-2 py-1 text-xs capitalize ${cls}`}>{status || "pending"}</span>;
        },
      },
    ],
    [locale],
  );

  const csvRows = useMemo(
    () =>
      (winners || []).map((w) => ({
        userName: w.userName || `${w.user?.firstName ?? ""} ${w.user?.lastName ?? ""}`.trim(),
        prizeValue: w.prizeValue ?? "",
        couponCode: w.couponCode ?? "",
        couponTitle: w.couponTitle ?? "",
        dateTime: w.dateTime ?? w.createdAt ?? "",
        status: w.status ?? "",
      })),
    [winners],
  );

  const renderEmptyState = () => (
    <EmptyState
      images={[{ src: "/images/empty-state.svg", width: 30, height: 30, alt: "No winners" }]}
      title="No winners found"
      description="Winners will appear here once a draw is completed."
      className="bg-mid-grey-I space-y-0 rounded-lg"
      titleClassName="!text-xl !text-accent"
      descriptionClassName="mb-4"
      actionButton={<SkiButton variant={`primary`}>Refresh</SkiButton>}
    />
  );

  return (
    <section className="bg-background space-y-6 rounded-lg p-6">
      <DashboardHeader
        title="Winners Log"
        subtitle="Latest winners and their prizes"
        showSubscriptionBanner={false}
        titleClassName="!text-lg"
        subtitleClassName="!text-sm"
        icon={<Icons.promotion className="size-6" />}
        actionComponent={
          <div className="flex items-center gap-2">
            <SearchInput className="" onSearch={handleSearchChange} initialValue={searchQuery} />
            <DownloadCsvButton
              data={csvRows as unknown as Record<string, unknown>[]}
              filename="play2win-winners"
              headers={{
                userName: "User Name",
                prizeValue: "Prize",
                couponCode: "Coupon Code",
                couponTitle: "Coupon Title",
                dateTime: "Date",
                status: "Status",
              }}
            />
          </div>
        }
      />

      <div>
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <span className="text-muted-foreground text-sm">Loading winners...</span>
          </div>
        ) : !winners || winners.length === 0 ? (
          renderEmptyState()
        ) : (
          <DashboardTable
            data={winners as unknown as DataItem[]}
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
};
