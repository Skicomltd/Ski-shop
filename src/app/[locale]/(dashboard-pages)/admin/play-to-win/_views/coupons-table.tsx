"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import SkiButton from "@/components/shared/button";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { DangerConfirmationDialog } from "@/components/shared/dialog/confirmation-dialog";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { FormField as RHFField } from "@/components/shared/inputs/FormFields";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/i18n/utils";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { couponFormSchema } from "@/schemas";
import { usePlay2WinService } from "@/services/dashboard/admin/play2win/use-play2win-service";
// Coupon Create/Edit Dialog
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export const CouponsTable = ({ onCreated, onUpdated }: { onCreated?: () => void; onUpdated?: () => void }) => {
  const locale = useLocale();
  const queryClient = useQueryClient();

  const {
    page,
    limit,
    search: searchQuery,
    setSearch: setSearchQuery,
    resetToFirstPage,
  } = useDashboardSearchParameters();

  const { useGetCoupons, useDeleteCoupon } = usePlay2WinService();
  const serverFilters: Filters = useMemo(
    () => ({
      page,
      limit,
      search: searchQuery || undefined,
    }),
    [page, limit, searchQuery],
  );

  const { data, isLoading } = useGetCoupons(serverFilters);
  const coupons = (data?.data?.items as Coupon[]) || [];
  const meta = data?.data?.metadata;

  const totalPages = meta?.totalPages ?? 1;
  const hasNextPage = meta?.hasNextPage ?? false;
  const hasPreviousPage = meta?.hasPreviousPage ?? false;
  const itemsPerPage = meta?.limit ?? coupons.length;

  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { mutateAsync: deleteCoupon, isPending: isDeleting } = useDeleteCoupon();

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      if (newSearch !== searchQuery) {
        setSearchQuery(newSearch);
        resetToFirstPage();
      }
    },
    [setSearchQuery, resetToFirstPage, searchQuery],
  );

  const onDeleted = async (id: string) => {
    await deleteCoupon(id);
    setDeleteId(null);
    // Invalidate any coupons queries
    void queryClient.invalidateQueries({ queryKey: ["dashboard", "play2win", "coupons"] });
  };

  const columns: TableColumnDefinition<DataItem>[] = useMemo(
    () => [
      {
        header: "Coupon Title",
        accessorKey: "title",
        render: (_: unknown, row: DataItem) => {
          const c = row as unknown as Coupon;
          return <span className="inline-block max-w-[240px] truncate text-sm font-medium">{c.title}</span>;
        },
      },
      {
        header: "Code",
        accessorKey: "code",
        render: (_: unknown, row: DataItem) => {
          const c = row as unknown as Coupon;
          return <span className="text-sm font-medium">{c.code}</span>;
        },
      },
      {
        header: "Value",
        accessorKey: "value",
        render: (_: unknown, row: DataItem) => {
          const c = row as unknown as Coupon;
          const value = c.couponType === "discount" ? `${c.value}%` : formatCurrency(Number(c.value), locale as never);
          return <span className="text-sm font-semibold">{value}</span>;
        },
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
        render: (_: unknown, row: DataItem) => {
          const c = row as unknown as Coupon;
          return (
            <span className="text-sm">
              <span className="text-mid-success font-medium">{c.remainingQuantity}</span> out of {c.quantity}
            </span>
          );
        },
      },
      {
        header: "Expiry",
        accessorKey: "endDate",
        render: (_: unknown, row: DataItem) => {
          const c = row as unknown as Coupon;
          const d = c.endDate as unknown as string;
          const date = d ? new Date(d) : null;
          const dd = date ? String(date.getDate()).padStart(2, "0") : "";
          const mm = date ? String(date.getMonth() + 1).padStart(2, "0") : "";
          const yyyy = date ? date.getFullYear() : "";
          const out = date ? `${dd}-${mm}-${yyyy}` : "-";
          return <span className="text-xs">{out}</span>;
        },
      },
    ],
    [locale],
  );

  const rowActions = (row: DataItem) => {
    const c = row as unknown as Coupon;
    return [
      {
        label: "Edit Coupon",
        onClick: () => setEditCoupon(c),
      },
      {
        label: "Delete Coupon",
        onClick: () => setDeleteId(c.id),
      },
    ] as TableRowAction<DataItem>[];
  };

  const renderEmptyState = () => (
    <EmptyState
      images={[{ src: "/images/empty-state.svg", width: 30, height: 30, alt: "No coupons" }]}
      title="No coupons found"
      description="Create a coupon to get started with Play-2-Win."
      className="bg-mid-grey-I space-y-0 rounded-lg"
      titleClassName="!text-xl !text-accent"
      descriptionClassName="mb-4"
      actionButton={
        <CouponFormDialog
          onCompleted={() => {
            void queryClient.invalidateQueries({ queryKey: ["dashboard", "play2win", "coupons"] });
            onCreated?.();
          }}
        />
      }
    />
  );

  return (
    <>
      <section className="bg-background space-y-6 rounded-lg p-6">
        <DashboardHeader
          title="All Coupons"
          subtitle="Manage coupons available for draws"
          showSubscriptionBanner={false}
          titleClassName="!text-lg"
          subtitleClassName="!text-sm"
          icon={<Icons.promotion className="size-4" />}
          actionComponent={
            <div className="flex items-center gap-2">
              <SearchInput
                placeholder="Search voucher..."
                className=""
                onSearch={handleSearchChange}
                initialValue={searchQuery}
              />
              {/* <SkiButton variant="outline" size="lg" isLeftIconVisible icon={<LucideFilter className="size-4" />}>
                Filter
              </SkiButton> */}
            </div>
          }
        />

        <div>
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <span className="text-muted-foreground text-sm">Loading coupons...</span>
            </div>
          ) : !coupons || coupons.length === 0 ? (
            renderEmptyState()
          ) : (
            <DashboardTable
              data={coupons as unknown as DataItem[]}
              columns={columns}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              pageParameter="page"
              rowActions={rowActions}
              showPagination
            />
          )}
        </div>
      </section>

      {/* Edit Coupon */}
      {editCoupon && (
        <CouponFormDialog
          open
          coupon={editCoupon}
          onOpenChange={(open) => !open && setEditCoupon(null)}
          onCompleted={() => {
            setEditCoupon(null);
            void queryClient.invalidateQueries({ queryKey: ["dashboard", "play2win", "coupons"] });
            onUpdated?.();
          }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <DangerConfirmationDialog
          defaultOpen
          action={{
            title: "Delete Coupon",
            description: "Are you sure you want to delete this coupon? This action cannot be undone.",
            onConfirm: () => onDeleted(deleteId),
            onCancel: () => setDeleteId(null),
            pending: isDeleting,
            buttonName: "Delete",
            headerClassName: `!text-center`,
            img: `/images/error.svg`,
          }}
        >
          <span />
        </DangerConfirmationDialog>
      )}
    </>
  );
};

type CouponForm = {
  title: string;
  couponType: CouponType;
  value: number;
  quantity: number;
  startDate: string;
  endDate: string;
};

export const CouponFormDialog = ({
  trigger,
  open,
  onOpenChange,
  coupon,
  onCompleted,
}: {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  coupon?: Coupon | null;
  onCompleted?: () => void;
}) => {
  const isEdit = !!coupon?.id;
  const { useCreateCoupon, useUpdateCoupon } = usePlay2WinService();
  const { mutateAsync: createCoupon, isPending: isCreating } = useCreateCoupon();
  const { mutateAsync: updateCoupon, isPending: isUpdating } = useUpdateCoupon();

  const methods = useForm<CouponForm>({
    resolver: zodResolver(couponFormSchema as never),
    mode: "onSubmit",
    defaultValues: {
      title: coupon?.title ?? "",
      couponType: (coupon?.couponType ?? "discount") as CouponType,
      value: Number(coupon?.value ?? 0),
      quantity: Number(coupon?.quantity ?? 1),
      startDate: (coupon?.startDate as unknown as string) ?? "",
      endDate: (coupon?.endDate as unknown as string) ?? "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid, errors },
    reset,
    register,
  } = methods;

  const handleClose = () => {
    reset();
    onOpenChange?.(false);
  };

  const onSubmit = async (formData: CouponForm) => {
    await (isEdit && coupon ? updateCoupon({ id: coupon.id, data: formData }) : createCoupon(formData));
    onCompleted?.();
    handleClose();
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={(o: boolean) => {
        onOpenChange?.(o);
        if (!o && !isEdit) reset();
      }}
      trigger={trigger ?? <div />}
      title={isEdit ? "Edit Coupon" : "Add Coupon"}
      headerClassName="!text-2xl font-semibold"
      description={`Create a coupon or a voucher for the play to win promo`}
      descriptionClassName={`text-left`}
      className="space-y-4 sm:max-w-lg"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-4">
          <div>
            <RHFField name="title" label="Coupon Title" placeholder="Enter coupon title" className={`h-14`} />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <RHFField
              name="couponType"
              label="Value Type"
              type="select"
              options={[
                { value: "discount", label: "Discount (%)" },
                { value: "amount", label: "Amount (₦)" },
              ]}
              placeholder="Select type"
              className={`!h-14`}
            />
            {errors.couponType && <p className="mt-1 text-sm text-red-500">{errors.couponType.message}</p>}
          </div>
          <div>
            <RHFField
              name="value"
              label="Value"
              type="number"
              placeholder="Enter amount/percentage"
              className={`h-14`}
            />
            {errors.value && <p className="mt-1 text-sm text-red-500">{errors.value.message}</p>}
          </div>
          <div>
            <RHFField name="quantity" label="Quantity" type="number" placeholder="Enter quantity" className={`h-14`} />
            {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>}
          </div>
          {/* Dates: kept as text (YYYY-MM-DD) to align with existing FormField type support */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Start Date</label>
              <Input placeholder="YYYY-MM-DD" {...register("startDate")} className={`h-14 shadow-none`} />
              {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">End Date</label>
              <Input placeholder="YYYY-MM-DD" {...register("endDate")} className={`h-14 shadow-none`} />
              {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SkiButton
              type="submit"
              variant="primary"
              isDisabled={!isValid || isCreating || isUpdating}
              isLoading={isCreating || isUpdating}
              className={`w-full`}
            >
              {isEdit ? "Save Changes" : "Add"}
            </SkiButton>
            <SkiButton
              isDisabled={!isValid || isCreating || isUpdating}
              className={`w-full`}
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </SkiButton>
          </div>
        </form>
      </FormProvider>
    </ReusableDialog>
  );
};
