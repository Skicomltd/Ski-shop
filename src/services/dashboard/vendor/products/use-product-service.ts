/* eslint-disable @typescript-eslint/no-explicit-any */
// use-product-service.ts
import { EditProductFormData } from "@/app/[locale]/(dashboard-pages)/_components/forms/edit-product-form";
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { SimpleProductFormData } from "@/schemas";
import { useQueryClient } from "@tanstack/react-query";

import { DashboardProductService } from "./product.service";

export const useDashboardProductService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<DashboardProductService>(
    dependencies.DASHBOARD_PRODUCT_SERVICE,
  );

  // Queries
  const useGetAllProducts = (filters: Filters, options?: any) => {
    return useServiceQuery(
      [...queryKeys.dashboard.products.list(filters)],
      (service) => service.getAllProducts(filters), // Use original filters, let service handle defaults
      { staleTime: 0, ...options },
    );
  };

  const useGetStoreInfo = (options?: any) => {
    return useServiceQuery(["store", "info"], (service) => service.getMyStore(), {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    });
  };

  const useGetSingleProduct = (id: string, options?: any) =>
    useServiceQuery([...queryKeys.dashboard.products.details(id)], (service) => service.getSingleProduct(id), {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    });

  // Mutations
  const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (service, { productData, storeID }: { productData: SimpleProductFormData; storeID: string }) =>
        service.createProduct(productData, storeID),
      {
        onSuccess: () => {
          // Invalidate and refetch products list
          queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "list"] });
        },
      },
    );
  };

  const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useServiceMutation((service, { id }: { id: string }) => service.deleteProduct(id), {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "list"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "details", id] });
      },
    });
  };

  const useEditProduct = () => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (service, { id, data }: { id: string; data: EditProductFormData }) => service.editProduct(id, data),
      {
        onSuccess: (_, { id }) => {
          // Invalidate products list and specific product details
          queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "list"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "details", id] });
        },
      },
    );
  };

  const useUpdateProductStatus = () => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (service, { id, status }: { id: string; status: "published" | "draft" }) =>
        service.updateProductStatus(id, status),
      {
        onSuccess: (_, { id }) => {
          // Invalidate products list and specific product details
          queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "list"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "details", id] });
        },
      },
    );
  };

  const useEditProductImages = () => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (service, { id, data }: { id: string; data: { image: File; url: string } }) =>
        service.editProductImages(id, data),
      {
        onSuccess: (_, { id }) => {
          // Invalidate products list and specific product details
          queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "list"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "details", id] });
        },
      },
    );
  };

  const useDeleteProductImage = () => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (service, { id, url }: { id: string; url: string }) => service.deleteProductImage(id, url),
      {
        onSuccess: (_, { id }) => {
          // Invalidate products list and specific product details
          queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "list"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard", "products", "details", id] });
        },
      },
    );
  };

  return {
    // Queries
    useGetAllProducts,
    useGetStoreInfo,
    useGetSingleProduct,
    // Mutations
    useCreateProduct,
    useDeleteProduct,
    useEditProduct,
    useUpdateProductStatus,
    useEditProductImages,
    useDeleteProductImage,
  };
};
