"use client";

import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { useAdminUserColumn } from "@/components/shared/dashboard-table/admin/admin-table-data";
import { DownloadCsvButton } from "@/components/shared/download-csv-button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useUserService } from "@/services/externals/user/use-user-service";

import { TableSkeleton } from "../../../_components/dashboard-table/_components/table-skeleton";

export const InactiveUsers = () => {
  const { search: searchQuery, limit, setSearch: setSearchQuery, resetToFirstPage } = useDashboardSearchParameters();

  const columns = useAdminUserColumn();
  const { useGetAllUsers } = useUserService();

  const filters: Filters = {
    status: "inactive",
    ...(searchQuery && { search: searchQuery }),
    ...(limit && { limit }),
  };

  const {
    data: userData,
    isLoading: isUsersLoading,
    isError,
  } = useGetAllUsers(filters, {
    staleTime: 0, // Always refetch when query changes
  });

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    resetToFirstPage(); // Reset to first page when search changes
  };

  if (isError) {
    return <ErrorState />;
  }

  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h6 className={`!text-lg font-semibold`}>Inactive Users</h6>
        <div className={`flex items-center gap-2`}>
          <SearchInput className={``} onSearch={handleSearchChange} />
          <DownloadCsvButton
            data={(userData?.data?.items || []) as Record<string, unknown>[]}
            filename="inactive-users"
            headers={{
              firstName: "First Name",
              lastName: "Last Name",
              email: "Email Address",
              phoneNumber: "Phone Number",
              ordersCount: "Orders",
              isEmailVerified: "Status",
            }}
          />
        </div>
      </div>
      <div>
        {isUsersLoading ? (
          <TableSkeleton />
        ) : userData?.data?.items?.length ? (
          <DashboardTable
            data={userData.data.items as Users[]}
            columns={columns}
            totalPages={userData.data.metadata.totalPages || 1}
            itemsPerPage={limit || 10}
            hasPreviousPage={userData.data.metadata.hasPreviousPage || false}
            hasNextPage={userData.data.metadata.hasNextPage || false}
            showPagination
            pageParameter="page"
          />
        ) : (
          <EmptyState
            className={`bg-transparent`}
            title={`No match found`}
            description={`No user match your filters.`}
          />
        )}
      </div>
    </section>
  );
};
