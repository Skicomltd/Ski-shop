"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
// import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { EmptyState } from "@/components/shared/empty-state";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency, formatDate } from "@/lib/i18n/utils";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { usePromotionService } from "@/services/dashboard/vendor/promotions/use-promotion-service";
import { Edit, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { DashboardHeader } from "../../../_components/dashboard-header";

interface PromotionRequestsTableProperties {
  onEditPromotion?: (promotion: Promotion) => void;
}

export const PromotionRequestsTable: React.FC<PromotionRequestsTableProperties> = ({ onEditPromotion }) => {
  const { search: searchQuery } = useDashboardSearchParameters();
  const locale = useLocale() as Locale;
  const { useGetAllAvailablePromotions, useDeletePromotion } = usePromotionService();

  const { data, refetch } = useGetAllAvailablePromotions();
  const deleteMutation = useDeletePromotion();

  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedPromotion) return;
    try {
      await deleteMutation.mutateAsync(selectedPromotion.id);
      toast.success("Promotion deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedPromotion(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete promotion", {
        description: (error as Error)?.message ?? "Unknown error",
      });
    }
  }, [deleteMutation, selectedPromotion, refetch]);

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
    <section className={`bg-background space-y-6 rounded-lg p-6 shadow-sm`}>
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
            rowActions={(row) => {
              const promotion = row as unknown as Promotion;
              return [
                {
                  label: "Edit",
                  icon: <Edit className="h-4 w-4" />,
                  onClick: () => {
                    if (onEditPromotion) onEditPromotion(promotion);
                  },
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: () => {
                    setSelectedPromotion(promotion);
                    setIsDeleteModalOpen(true);
                  },
                },
              ];
            }}
          />
        )}
      </div>

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPromotion(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        type="warning"
        title="Delete promotion"
        description="Are you sure you want to delete this promotion package? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );

  return renderAvailablePromotionsTable();
};
