/* eslint-disable @typescript-eslint/no-explicit-any */
// services/app/use-app-service.ts
import { queryClient } from "@/lib/react-query/query-client";
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { AppService } from "./app.service";

export const useAppService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<AppService>(dependencies.APP_SERVICE);

  // Queries
  const useGetAllProducts = (filters: Filters, options?: any) => {
    return useServiceQuery(
      [...queryKeys.product.list(filters)],
      (service) => service.getAllProducts(filters), // Use original filters, let service handle defaults
      { staleTime: 0, ...options },
    );
  };

  const useGetAllhandPickedProducts = (filters: Filters, options?: any) => {
    return useServiceQuery([...queryKeys.product.list()], (service) => service.getAllhandPickedProducts(filters), {
      staleTime: 0,
      ...options,
    });
  };

  const useGetSimilarProducts = (productId: string, filters: Filters, options?: any) => {
    return useServiceQuery(
      [...queryKeys.product.similar(productId, filters)],
      (service) => service.getSimilarProducts(productId, filters),
      { staleTime: 0, ...options },
    );
  };

  const useGetSingleProduct = (id: string, options?: any) =>
    useServiceQuery([...queryKeys.product.details(id)], (service) => service.getSingleProduct(id), options);

  const useGetAllProductCategory = (options?: any) =>
    useServiceQuery([...queryKeys.product.categories()], (service) => service.getAllProductCategory(), options);

  const useGetSavedProducts = (options?: any) =>
    useServiceQuery([...queryKeys.product.saved()], (service) => service.getSavedProducts(), {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      ...options,
    });

  const useGetCart = (options?: any) =>
    useServiceQuery(
      [...queryKeys.cart.list()],
      async (service) => {
        try {
          const response = await service.getCart();
          // Ensure response has proper structure even if empty
          return response || { data: { items: [], metadata: { total: 0 } } };
        } catch {
          // Return empty cart structure on error
          return { data: { items: [], metadata: { total: 0 } } };
        }
      },
      {
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        ...options,
      },
    );

  // const useGetCart = (options?: any) =>
  //   useServiceQuery(
  //     [...queryKeys.cart.list()],
  //     (service) => service.getCart(),
  //     { staleTime: 1000 * 60 * 5, ...options }, // 5 minutes cache
  //   );

  const useGetCartItem = (itemId: string, options?: any) =>
    useServiceQuery([...queryKeys.cart.item(itemId)], (service) => service.getCartById(itemId), options);

  // Mutations
  const useAddToCart = (options?: any) =>
    useServiceMutation((service, data: { productId: string; quantity: number }) => service.addToCart(data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.list() });
      },
      ...options,
    });

  const useUpdateCartItem = (options?: any) =>
    useServiceMutation((service, data: { itemId: string; quantity: number }) => service.updateCartItem(data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.list() });
      },
      ...options,
    });

  const useRemoveFromCart = (options?: any) =>
    useServiceMutation((service, itemId: string) => service.removeFromCart(itemId), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.list() });
      },
      ...options,
    });

  const useCheckoutCart = (options?: any) =>
    useServiceMutation(
      (
        service,
        data: {
          paymentMethod: "paystack" | "paymentOnDelivery";
          shippingFee: number;
          shippingAddress?: {
            address: string;
            email?: string;
            name: string;
            phoneNumber: string;
            state: string;
          };
          voucherId?: string;
        },
      ) => service.checkoutCart(data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.cart.list() });
          queryClient.removeQueries({ queryKey: queryKeys.cart.list() });
        },
        ...options,
      },
    );

  const useGetOrders = (options?: any) =>
    useServiceQuery([...queryKeys.order.list()], (service) => service.order(), {
      ...options,
    });

  const useGetOrderById = (id: string, options?: any) =>
    useServiceQuery([...queryKeys.order.details(id)], (service) => service.getOrderById(id), options);

  const useSaveProduct = (options?: any) =>
    useServiceMutation((service, data: { productId: string }) => service.saveProduct(data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.product.saved() });
      },
      ...options,
    });

  const useRemoveFromFavorites = (options?: any) =>
    useServiceMutation((service, productId: string) => service.removeFromFavorites(productId), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.product.saved() });
      },
      ...options,
    });

  const useGetTopVendors = (options?: any) =>
    useServiceQuery([...queryKeys.vendor.top()], (service) => service.getTopVendors(), options);

  const useReviewProduct = (options?: any) =>
    useServiceMutation(
      (service, data: { productId: string; comment: string; rating: number }) => service.reviewProduct(data),
      {
        onSuccess: (result, variables) => {
          queryClient.invalidateQueries({ queryKey: queryKeys.product.details(variables.productId) });
          queryClient.invalidateQueries({ queryKey: queryKeys.product.list() });
        },
        ...options,
      },
    );

  const useGetReviewByProductId = (productId: string, options?: any) =>
    useServiceQuery(
      [...queryKeys.review.details(productId)],
      (service) => service.getReviewByProductId(productId),
      options,
    );

  const useGetAllReviews = (filters: Filters, options?: any) =>
    useServiceQuery([...queryKeys.review.list(filters)], (service) => service.getAllReviews(filters), options);

  const useDeleteReview = (options?: any) =>
    useServiceMutation((service, reviewId: string) => service.deleteReview(reviewId), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.review.list({}) });
      },
      ...options,
    });

  // Delivery info
  const useGetDeliveryInfo = (options?: any) =>
    useServiceMutation((service, data: { dropOffState: string }) => service.getDeliveryInfo(data), {
      ...options,
    });

  return {
    // Product Queries
    useGetAllProducts,
    useGetAllhandPickedProducts,
    useGetSimilarProducts,
    useGetSingleProduct,
    useGetAllProductCategory,
    useGetSavedProducts,

    // Cart Queries
    useGetCart,
    useGetCartItem,

    // Cart Mutations
    useAddToCart,
    useUpdateCartItem,
    useRemoveFromCart,
    useCheckoutCart,

    // Order Queries
    useGetOrders,
    useGetOrderById,

    // Product Mutations
    useSaveProduct,
    useRemoveFromFavorites,

    // Vendor Queries
    useGetTopVendors,

    // Review Queries
    useReviewProduct,
    useGetReviewByProductId,
    useGetAllReviews,
    useDeleteReview,
    useGetDeliveryInfo,
  };
};
