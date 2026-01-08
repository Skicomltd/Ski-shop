"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { DashboardTable } from "@/components/shared/dashboard-table";
import { useProductColumn } from "@/components/shared/dashboard-table/table-data";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { DownloadCsvButton } from "@/components/shared/download-csv-button";
import { EmptyState, ErrorState, FilteredEmptyState } from "@/components/shared/empty-state";
import { useDashboardSearchParameters } from "@/lib/nuqs/use-dashboard-search-parameters";
import { useDashboardProductService } from "@/services/dashboard/vendor/products/use-product-service";
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { DashboardHeader } from "../../../_components/dashboard-header";
import { TableSkeleton } from "../../home/page-skeleton";

export const OutOfStockProducts = () => {
  const productColumn = useProductColumn();
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const { search: searchQuery, page, setSearch: setSearchQuery, resetToFirstPage } = useDashboardSearchParameters();

  const filters = useMemo(
    () => ({
      page,
      limit: 10,
      sort: "newest",
      ...(searchQuery && { search: searchQuery }),
    }),
    [page, searchQuery],
  );

  // Initialize product service
  const { useGetAllProducts, useDeleteProduct, useUpdateProductStatus } = useDashboardProductService();

  // Fetch all products data
  const {
    data: productData,
    isLoading: isProductsLoading,
    isError,
    refetch,
  } = useGetAllProducts(filters, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      // Prevent rapid search changes that could cause throttling
      if (newSearch !== searchQuery) {
        setSearchQuery(newSearch);
        resetToFirstPage(); // Reset to first page when search changes
      }
    },
    [setSearchQuery, resetToFirstPage, searchQuery],
  );

  const handleRowClick = useCallback(
    (product: Product) => {
      if (session?.user?.role?.name === "vendor") {
        router.push(`/${locale}/dashboard/products/${product.id}`);
      } else {
        router.push(`/${locale}/admin/products/${product.id}`);
      }
    },
    [router, locale, session?.user?.role?.name],
  );

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Mutations
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: updateProductStatus } = useUpdateProductStatus();

  // Action handlers
  const handleEditProduct = useCallback(
    (product: Product) => {
      if (session?.user?.role?.name === "vendor") {
        router.push(`/${locale}/dashboard/products/${product.id}/edit`);
      } else {
        router.push(`/${locale}/admin/products/${product.id}/edit`);
      }
    },
    [session?.user?.role?.name, router, locale],
  );

  const handleUnpublishProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setUnpublishModalOpen(true);
  }, []);

  const handlePublishProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setPublishModalOpen(true);
  }, []);

  const handleDeleteProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmUnpublish = useCallback(async () => {
    if (selectedProduct) {
      try {
        await updateProductStatus({ id: selectedProduct.id, status: "draft" });
        toast.success("Product unpublished successfully");
        refetch();
        setUnpublishModalOpen(false);
        setSelectedProduct(null);
      } catch {
        toast.error("Failed to unpublish product");
      }
    }
  }, [selectedProduct, updateProductStatus, refetch]);

  const handleConfirmPublish = useCallback(async () => {
    if (selectedProduct) {
      try {
        await updateProductStatus({ id: selectedProduct.id, status: "published" });
        toast.success("Product published successfully");
        refetch();
        setPublishModalOpen(false);
        setSelectedProduct(null);
      } catch {
        toast.error("Failed to publish product");
      }
    }
  }, [selectedProduct, updateProductStatus, refetch]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedProduct) {
      try {
        await deleteProduct({ id: selectedProduct.id });
        toast.success("Product deleted successfully");
        refetch();
        setDeleteModalOpen(false);
        setSelectedProduct(null);
      } catch {
        toast.error("Failed to delete product");
      }
    }
  }, [selectedProduct, deleteProduct, refetch]);

  // Filter out-of-stock products
  const outOfStockProducts = useMemo(() => {
    return productData?.data?.items?.filter((product) => product.stockCount === 0) || [];
  }, [productData?.data?.items]);

  // Calculate pagination for out-of-stock products
  const totalOutOfStock = outOfStockProducts.length;
  const itemsPerPage = 10; // Assuming 10 items per page
  const totalPages = Math.max(1, Math.ceil(totalOutOfStock / itemsPerPage));
  const currentPage = page ?? 1;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}

      <DashboardHeader
        actionComponent={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
            <div className="w-full sm:w-64">
              <SearchInput className="w-full" onSearch={handleSearchChange} initialValue={searchQuery} delay={500} />
            </div>
            {(session?.user?.role?.name === "admin" || session?.user?.role?.name === "vendor") && (
              <DownloadCsvButton
                data={outOfStockProducts}
                filename="out-of-stock-products.csv"
                headers={{
                  name: "Product Name",
                  category: "Category",
                  price: "Price",
                  stockCount: "Stock",
                  createdAt: "Date Added",
                  status: "Status",
                }}
              />
            )}
          </div>
        }
        title="Out of Stock Products"
        subtitle={`View all out of stock skishop products`}
        showSubscriptionBanner={false}
        titleClassName={`!text-lg`}
        subtitleClassName={`!text-sm`}
        icon={<Icons.product className={`mt-[-4] size-4`} />}
      />

      {/* Content */}
      <section className="min-h-[400px]">
        {isProductsLoading ? (
          <TableSkeleton />
        ) : outOfStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <DashboardTable
              data={outOfStockProducts}
              columns={productColumn}
              totalPages={totalPages}
              itemsPerPage={totalOutOfStock}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              showPagination={totalOutOfStock > itemsPerPage}
              pageParameter="page"
              onRowClick={handleRowClick}
              rowActions={(product: Product) => [
                {
                  label: "Edit",
                  icon: <Edit className="h-4 w-4" />,
                  onClick: () => handleEditProduct(product),
                },
                ...(product.status === "published"
                  ? [
                      {
                        label: "Unpublish",
                        icon: <EyeOff className="h-4 w-4" />,
                        onClick: () => handleUnpublishProduct(product),
                      },
                    ]
                  : []),
                ...(product.status === "draft"
                  ? [
                      {
                        label: "Publish",
                        icon: <Eye className="h-4 w-4" />,
                        onClick: () => handlePublishProduct(product),
                      },
                    ]
                  : []),
                {
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: () => handleDeleteProduct(product),
                  variant: "destructive",
                },
              ]}
            />
          </div>
        ) : searchQuery ? (
          <FilteredEmptyState
            onReset={() => {
              setSearchQuery("");
              resetToFirstPage();
            }}
          />
        ) : (
          <EmptyState
            button={{
              text: "View All Products",
              onClick: () => {
                router.push(`/${locale}/dashboard/products`);
              },
            }}
          />
        )}
      </section>
      {/* Unpublish Confirmation Modal */}
      <AlertModal
        isOpen={unpublishModalOpen}
        onClose={() => setUnpublishModalOpen(false)}
        onConfirm={handleConfirmUnpublish}
        type="warning"
        title="Unpublish Product"
        description="Are you sure you want to unpublish this product? It will no longer be visible to customers."
        confirmText="Unpublish"
        cancelText="Cancel"
      />

      {/* Publish Confirmation Modal */}
      <AlertModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
        type="success"
        title="Publish Product"
        description="Are you sure you want to publish this product? It will become visible to customers."
        confirmText="Publish"
        cancelText="Cancel"
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        type="error"
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};
