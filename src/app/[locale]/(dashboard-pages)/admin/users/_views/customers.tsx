"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { useAdminUserColumn } from "@/components/shared/dashboard-table/admin/admin-table-data";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { DownloadCsvButton } from "@/components/shared/download-csv-button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useUserService } from "@/services/externals/user/use-user-service";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { DashboardHeader } from "../../../_components/dashboard-header";
import { TableSkeleton } from "../../../_components/dashboard-table/_components/table-skeleton";

export const Customers = () => {
  const {
    search: searchQuery,
    limit,
    page,
    setSearch: setSearchQuery,
    resetToFirstPage,
  } = useDashboardSearchParameters();

  const router = useRouter();
  const parameters = useParams();
  const locale = parameters.locale as string;

  const columns = useAdminUserColumn();
  const { useGetAllUsers, useDeleteUser } = useUserService();

  const filters = useMemo(
    () => ({
      role: "customer",
      page,
      limit: 10,
      ...(searchQuery && { search: searchQuery }),
    }),
    [page, searchQuery],
  );

  const {
    data: userData,
    isLoading: isUsersLoading,
    isError,
    refetch,
  } = useGetAllUsers(filters, {
    staleTime: 0, // Always refetch when query changes
  });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    resetToFirstPage(); // Reset to first page when search changes
  };

  const handleRowClick = (row: Users) => {
    router.push(`/${locale}/admin/users/${row.id}`);
  };
  const [userToDelete, setUserToDelete] = useState<Users | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const openDeleteDialog = (user: Users) => {
    setUserToDelete(user);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete?.id) return;

    deleteUser(userToDelete.id as string, {
      onSuccess: () => {
        void refetch();
        setIsDeleteAlertOpen(false);
        setUserToDelete(null);
      },
    });
  };

  if (isError) {
    return <ErrorState />;
  }

  return (
    <section>
      <div className="mb-2">
        <DashboardHeader
          title="Customers"
          subtitle="View all skishop customers information"
          showSubscriptionBanner={false}
          icon={<Icons.users className={`mt-[-4]`} />}
          titleClassName={`!text-lg`}
          subtitleClassName={`!text-sm`}
          actionComponent={
            <div className={`flex items-center gap-2`}>
              <SearchInput className={``} onSearch={handleSearchChange} initialValue={searchQuery} />
              <DownloadCsvButton
                data={(userData?.data?.items || []) as Record<string, unknown>[]}
                filename="customers"
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
          }
        />
      </div>
      <div>
        {isUsersLoading ? (
          <TableSkeleton />
        ) : userData?.data?.items?.length ? (
          <>
            <DashboardTable
              data={userData.data.items as Users[]}
              columns={columns}
              totalPages={userData.data.metadata.totalPages || 1}
              itemsPerPage={limit || 10}
              hasPreviousPage={userData.data.metadata.hasPreviousPage || false}
              hasNextPage={userData.data.metadata.hasNextPage || false}
              showPagination
              pageParameter="page"
              onRowClick={handleRowClick}
              rowActions={(user: Users) => [
                {
                  label: "Delete user",
                  onClick: () => openDeleteDialog(user),
                },
              ]}
            />
            <AlertModal
              isOpen={isDeleteAlertOpen}
              onClose={() => {
                if (isDeleting) return;
                setIsDeleteAlertOpen(false);
                setUserToDelete(null);
              }}
              onConfirm={handleConfirmDelete}
              loading={isDeleting}
              type="warning"
              title="Delete user"
              description={`Are you sure you want to delete ${userToDelete?.firstName ?? "this"} ${userToDelete?.lastName ?? "user"}? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
            />
          </>
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
