"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import SkiButton from "@/components/shared/button";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";

import { TableSkeleton } from "../../home/page-skeleton";
import { useWithdrawalHistoryColumns } from "./withdrawal-history-columns";

interface WithdrawalHistoryTableProperties {
  data: WithdrawalTransaction[];
  totalPages?: number;
  itemsPerPage?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  showPagination?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRowClick?: (transaction: WithdrawalTransaction) => void;
  onRefresh?: () => void;
}

export const WithdrawalHistoryTable = ({
  data,
  totalPages = 1,
  itemsPerPage = 10,
  hasNextPage = false,
  hasPreviousPage = false,
  showPagination = false,
  isLoading = false,
  isError = false,
  onRowClick,
  onRefresh,
}: WithdrawalHistoryTableProperties) => {
  const withdrawalColumns = useWithdrawalHistoryColumns();

  const renderTableHeader = () => (
    <div className="mb-6">
      <h5 className="flex items-center gap-2 !text-2xl font-semibold">
        <Icons.billing /> Withdrawal History
      </h5>
      <p className="mt-1 text-sm text-gray-500">Track your withdrawal transactions and their status</p>
    </div>
  );

  const renderLoadingSkeleton = () => <TableSkeleton />;

  const renderErrorState = () => <ErrorState onRetry={onRefresh} />;

  const renderEmptyState = () => (
    <EmptyState
      title="No withdrawals found"
      description="There are no withdrawals matching your criteria."
      descriptionClassName="text-base mb-4"
      actionButton={
        onRefresh && (
          <SkiButton variant={`primary`} size={`lg`} onClick={onRefresh}>
            Refresh
          </SkiButton>
        )
      }
    />
  );

  const renderWithdrawalTable = () => (
    <DashboardTable
      data={data}
      columns={withdrawalColumns}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      showPagination={showPagination}
      onRowClick={onRowClick}
    />
  );

  const renderTableContent = () => {
    if (isLoading) {
      return renderLoadingSkeleton();
    }

    if (isError) {
      return renderErrorState();
    }

    if (!data || data.length === 0) {
      return renderEmptyState();
    }

    return renderWithdrawalTable();
  };

  const renderWithdrawalHistoryTable = () => (
    <div className="bg-background rounded-lg p-6 shadow-sm">
      {renderTableHeader()}
      {renderTableContent()}
    </div>
  );

  return renderWithdrawalHistoryTable();
};
