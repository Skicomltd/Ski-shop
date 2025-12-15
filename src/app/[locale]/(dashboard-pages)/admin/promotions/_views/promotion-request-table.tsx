"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
// import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency, formatDate } from "@/lib/i18n/utils";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { usePromotionService } from "@/services/dashboard/vendor/promotions/use-promotion-service";
import { useLocale } from "next-intl";
import { useMemo } from "react";

import { DashboardHeader } from "../../../_components/dashboard-header";

export const PromotionRequestsTable: React.FC = () => {
  const { search: searchQuery } = useDashboardSearchParameters();
  const locale = useLocale() as Locale;
  const { useGetAllAvailablePromotions } = usePromotionService();

  const { data } = useGetAllAvailablePromotions();
  const promotions = useMemo(() => (data?.data?.items ?? []) as Promotion[], [data]);

  const filteredPromotions = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return promotions;
    return promotions.filter((promotion: Promotion) => {
      const name = (promotion.name || "").toLowerCase();
      const type = (promotion.type || "").toLowerCase();
      return name.includes(q) || type.includes(q);
    });
  }, [promotions, searchQuery]);

  const totalPromotions = filteredPromotions.length;
  const totalPages = 1;
  const hasNextPage = false;
  const hasPreviousPage = false;

  const columns = useMemo<TableColumnDefinition<DataItem>[]>(() => {
    return [
      {
        header: "Promotion Name",
        accessorKey: "name",
        render: (_value: unknown, row: DataItem) => {
          const promotion = row as unknown as Promotion;
          return (
            <span
              className="inline-block max-w-[200px] cursor-help truncate text-xs font-medium"
              title={promotion.name}
            >
              {promotion.name}
            </span>
          );
        },
      },
      {
        header: "Type",
        accessorKey: "type",
        render: (_value: unknown, row: DataItem) => {
          const promotion = row as unknown as Promotion;
          return (
            <span className="bg-primary/10 text-primary inline-block rounded-full px-2 py-1 text-xs font-medium capitalize">
              {promotion.type}
            </span>
          );
        },
      },
      {
        header: "Duration",
        accessorKey: "duration",
        render: (_value: unknown, row: DataItem) => {
          const promotion = row as unknown as Promotion;
          return <span className="text-xs font-semibold">{promotion.duration} Days</span>;
        },
      },
      {
        header: "Amount",
        accessorKey: "amount",
        render: (_value: unknown, row: DataItem) => {
          const promotion = row as unknown as Promotion;
          return <span className="text-xs font-medium">{formatCurrency(promotion.amount ?? 0, locale)}</span>;
        },
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        render: (_value: unknown, row: DataItem) => {
          const promotion = row as unknown as Promotion;
          return <span className="text-xs">{formatDate(promotion.createdAt, locale)}</span>;
        },
      },
    ];
  }, [locale]);

  // const handleSearchChange = useCallback(
  //   (newSearch: string) => {
  //     if (newSearch !== searchQuery) {
  //       setSearchQuery(newSearch);
  //       resetToFirstPage();
  //     }
  //   },
  //   [setSearchQuery, resetToFirstPage, searchQuery],
  // );

  const renderEmptyState = () => (
    <EmptyState
      images={[{ src: "/images/empty-state.svg", width: 30, height: 30, alt: "No available promotions" }]}
      title="No available promotions found"
      description="There are no promotions matching your criteria."
      className="bg-mid-grey-I space-y-0 rounded-lg"
      titleClassName="!text-2xl"
      descriptionClassName="text-base mb-4"
      actionButton={
        <button
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary/90 text-background rounded-md px-4 py-2"
        >
          Refresh
        </button>
      }
    />
  );

  const renderAvailablePromotionsTable = () => (
    <section className={`bg-background space-y-6 rounded-lg p-6`}>
      <DashboardHeader
        title="Available Promotions"
        subtitle="View all available promotion packages"
        showSubscriptionBanner={false}
        titleClassName={`!text-lg`}
        subtitleClassName={`!text-sm`}
        icon={<Icons.promotion className={`size-6`} />}
        // actionComponent={
        //   <div className="flex items-center gap-2">
        //     <SearchInput className="" onSearch={handleSearchChange} initialValue={searchQuery} />
        //   </div>
        // }
      />
      <div>
        {!filteredPromotions || filteredPromotions.length === 0 ? (
          renderEmptyState()
        ) : (
          <DashboardTable
            data={filteredPromotions as unknown as DataItem[]}
            columns={columns}
            totalPages={totalPages}
            itemsPerPage={totalPromotions}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            showPagination={false}
            pageParameter="page"
          />
        )}
      </div>
    </section>
  );

  return renderAvailablePromotionsTable();
};
