"use client";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import { BackButton } from "@/components/shared/back-button";
import SkiButton from "@/components/shared/button";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { EmptyState } from "@/components/shared/empty-state";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency, formatDate } from "@/lib/i18n/utils";
import { Editor } from "@/lib/rich-text-editor";
import { useDashboardProductService } from "@/services/dashboard/vendor/products/use-product-service";
import { SerializedEditorState } from "lexical";
import { EyeOff, Megaphone, Star } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DashboardHeader } from "../../../_components/dashboard-header";
import { ProductActionsDropdown } from "../../../dashboard/products/_components/product-actions-dropdown";
import { PromoteProductModal } from "../../../dashboard/products/_components/promote-product-modal";
import ProductDetailSkeleton from "./_components/product-detail-skeleton";

// Helper function to determine if a product is from a star seller
const isStarSeller = (product: Product) => {
  // Check if store name contains star seller indicators
  const starSellerIndicators = ["star", "premium", "verified", "gold"];
  const storeName = product.store.name.toLowerCase();

  return starSellerIndicators.some((indicator) => storeName.includes(indicator));
};

const toSerializedEditorState = (description?: string): SerializedEditorState | undefined => {
  if (!description) return undefined;

  try {
    const parsed: unknown = JSON.parse(description);
    if (parsed && typeof parsed === "object" && "root" in parsed) return parsed as SerializedEditorState;
  } catch {
    // legacy plain text
  }

  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: description,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  } as unknown as SerializedEditorState;
};

export default function ProductDetailPage() {
  // const { data: session } = useSession();
  const parameters = useParams();
  const locale = useLocale();
  const router = useRouter();
  const productId = parameters.id as string;
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch product by ID
  const { useGetSingleProduct, useDeleteProduct, useUpdateProductStatus, useEditProduct } =
    useDashboardProductService();
  const { data: productResponse, isLoading, isError, refetch } = useGetSingleProduct(productId);
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: updateProductStatus } = useUpdateProductStatus();
  const { mutateAsync: editProduct } = useEditProduct();
  const product = productResponse?.data;
  const descriptionState = useMemo(() => toSerializedEditorState(product?.description), [product?.description]);

  // Determine if this is a star seller product
  const isStarSellerProduct = product ? isStarSeller(product) : false;

  const handlePromoteProduct = () => {
    setIsPromoteModalOpen(true);
  };

  const handleUnpublishProduct = async () => {
    // Handle unpublish product action
    if (product) {
      try {
        await updateProductStatus({ id: product.id, status: "draft" });
        toast.success("Product unpublished successfully");
        refetch();
      } catch {
        toast.error("Failed to unpublish product");
      }
    }
  };

  const handleEditProduct = () => {
    // Handle edit product action
    if (product) {
      router.push(`/${locale}/admin/products/${product.id}/edit`);
    }
  };

  const handleDeleteProduct = async () => {
    // Handle delete product action
    if (product) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (product) {
      try {
        await deleteProduct({ id: product.id });
        toast.success("Product deleted successfully");
        router.push(`/${locale}/admin/products`);
      } catch {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleMarkOutOfStock = async () => {
    const submitData = {
      stockCount: 0,
    };
    // Handle mark out of stock action
    if (product) {
      await editProduct(
        { id: product.id, data: submitData },
        {
          onSuccess: (response) => {
            if (response?.success) {
              toast.success("Product marked as out of stock");
              refetch();
            }
          },
        },
      );
    }
  };

  // Show loading state
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Show error state
  if (isError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <EmptyState
          images={[
            {
              src: "/images/empty-state.svg",
              alt: "Product not found",
              width: 80,
              height: 80,
            },
          ]}
          description="Failed to load product details"
          descriptionClassName="text-mid-danger"
          className="bg-low-warning/5 space-y-0 rounded-lg"
          actionButton={
            <SkiButton
              onClick={() => refetch()}
              variant="outline"
              className="border-mid-danger text-mid-danger hover:bg-mid-danger/10 mt-4 border"
            >
              Retry
            </SkiButton>
          }
        />
      </div>
    );
  }

  const images = product.images;
  const weight = (product as unknown as { weight?: number | string }).weight;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="">
        <DashboardHeader
          actionComponent={
            <div className="flex items-center space-x-2">
              {/* Star Seller Badge */}
              {isStarSellerProduct && (
                <SkiButton isIconOnly size={`icon`} icon={<Star className="h-4 w-4 fill-current" />} />
              )}
              <ProductActionsDropdown
                product={product}
                onEdit={handleEditProduct}
                onPromote={handlePromoteProduct}
                onUnpublish={handleUnpublishProduct}
                onMarkOutOfStock={handleMarkOutOfStock}
                onDelete={handleDeleteProduct}
              />
            </div>
          }
          title="Product Details"
          subtitle={`${product.name} details`}
          showSubscriptionBanner={false}
          icon={<BackButton />}
        />
      </div>

      {/* Main Content */}
      <div className="">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Star Seller Background Banner */}
              {isStarSellerProduct && (
                <div className="absolute inset-0 bg-[url('/images/star-seller.svg')] bg-cover bg-no-repeat opacity-20" />
              )}

              {images.length > 0 ? (
                <BlurImage src={images[0]} alt={product.name} fill className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100">
                  <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              {/* Star Seller Badge on Image */}
              {isStarSellerProduct && (
                <div className="absolute top-3 left-3 flex items-center space-x-1 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Star Seller</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-blue-300"
                  >
                    <BlurImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Information */}
          <div className="border-border bg-background space-y-6 rounded-lg border p-6">
            {/* Product Title and Category */}
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-500 capitalize">{product.category}</p>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {product.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div>
                <h4 className="mb-2 !text-lg font-semibold text-gray-900">Description</h4>
                {descriptionState ? (
                  <Editor
                    readOnly
                    hideToolbar
                    editorSerializedState={descriptionState}
                    placeholder=""
                    containerClassName="border-0 bg-transparent"
                    contentClassName="prose prose-sm max-w-none min-h-0 rounded-none bg-transparent px-0 py-0 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Weight:</span>
                  <p className="font-medium text-gray-900">{weight ?? "-"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Store:</span>
                  <p className="font-medium text-gray-900">{product.store.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Added by:</span>
                  <p className="font-medium text-gray-900">{product.user.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium text-gray-900">{formatDate(product.createdAt, locale as Locale)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Last updated:</span>
                  <p className="font-medium text-gray-900">{formatDate(product.createdAt, locale as Locale)}</p>
                </div>
              </div>
            </div>
            {/* <div className="space-y-3">
              <h3 className="!text-lg font-semibold text-gray-900">Specifications</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-gray-400"></span>
                  RAM: 16GB
                </li>
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-gray-400"></span>
                  Hard Drive: 256GB SSD
                </li>
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-gray-400"></span>
                  Screen Size: 13.3 inches
                </li>
              </ul>
            </div> */}

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-primary text-3xl font-bold">
                  {formatCurrency(product.discountPrice || product.price, locale as Locale)}
                </span>
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="text-mid-danger text-lg line-through">
                    {formatCurrency(product.price, locale as Locale)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{product.stockCount} Units Available</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <SkiButton
                onClick={handlePromoteProduct}
                isDisabled={product.status === "draft" || product.stockCount === 0}
                className="bg-primary hover:bg-primary/70 w-full px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Megaphone className="mr-2 h-4 w-4" />
                Promote Product
              </SkiButton>
              <SkiButton
                onClick={handleUnpublishProduct}
                isDisabled={product.status === "draft"}
                variant="outline"
                className="border-mid-danger text-mid-danger hover:bg-mid-danger/10 w-full px-6 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish Product
              </SkiButton>
            </div>

            {/* Additional Actions */}
            {/* <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleEditProduct}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50"
                  title="Edit Product"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={handleMarkOutOfStock}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-yellow-300 text-yellow-600 transition-colors hover:bg-yellow-50"
                  title="Mark as Out of Stock"
                >
                  <Package className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="border-mid-danger text-mid-danger hover:bg-mid-danger/10 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Promote Product Modal */}
      <PromoteProductModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
        }}
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        type="warning"
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
