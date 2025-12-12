import { queryClient } from "@/lib/react-query/query-client";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { toast } from "sonner";

export const useSaveProduct = (productId: string, product?: Product) => {
  const { useGetSavedProducts, useSaveProduct, useRemoveFromFavorites } = useAppService();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Get saved products to check if current product is saved - only when authenticated
  const { data: savedProductsData } = useGetSavedProducts({ enabled: isAuthenticated });
  const savedProductIds = savedProductsData?.data?.items?.map((product: Product) => product.id) || [];
  const isSaved = productId ? savedProductIds.includes(productId) : false;

  // Save product mutation
  const { mutate: saveProduct, isPending: isSaving } = useSaveProduct({
    onSuccess: () => {
      toast.success("Product saved successfully");
    },
    onError: () => {
      // Revert query data
      if (product) {
        queryClient.setQueryData(
          queryKeys.product.saved(),
          (oldData: { data: { items: Product[]; metadata: { total: number } } } | undefined) => {
            if (!oldData) return oldData;
            const newItems = oldData.data.items.filter((p: Product) => p.id !== productId);
            return {
              ...oldData,
              data: {
                ...oldData.data,
                items: newItems,
                metadata: {
                  ...oldData.data.metadata,
                  total: newItems.length,
                },
              },
            };
          },
        );
      }
      toast.error("Failed to save product");
    },
  });

  // Remove from favorites mutation
  const { mutate: removeFromFavorites, isPending: isRemoving } = useRemoveFromFavorites({
    onSuccess: () => {
      toast.success("Product removed from favorites");
    },
    onError: () => {
      // Revert query data
      if (product) {
        queryClient.setQueryData(
          queryKeys.product.saved(),
          (oldData: { data: { items: Product[]; metadata: { total: number } } } | undefined) => {
            if (!oldData) return oldData;
            const newItems = oldData.data.items.some((p: Product) => p.id === productId)
              ? oldData.data.items
              : [...oldData.data.items, product];
            return {
              ...oldData,
              data: {
                ...oldData.data,
                items: newItems,
                metadata: {
                  ...oldData.data.metadata,
                  total: newItems.length,
                },
              },
            };
          },
        );
      }
      toast.error("Failed to remove product from favorites");
    },
  });

  // Toggle save/unsave
  const toggleSave = useCallback(() => {
    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    const newIsSaved = !isSaved;

    // Optimistic update for query data
    if (newIsSaved) {
      // Adding to saved
      if (product) {
        queryClient.setQueryData(
          queryKeys.product.saved(),
          (oldData: { data: { items: Product[]; metadata: { total: number } } } | undefined) => {
            if (!oldData) return oldData;
            const newItems = oldData.data.items.some((p: Product) => p.id === productId)
              ? oldData.data.items
              : [...oldData.data.items, product];
            return {
              ...oldData,
              data: {
                ...oldData.data,
                items: newItems,
                metadata: {
                  ...oldData.data.metadata,
                  total: newItems.length,
                },
              },
            };
          },
        );
      }
      saveProduct({ productId });
    } else {
      // Removing from saved
      queryClient.setQueryData(
        queryKeys.product.saved(),
        (oldData: { data: { items: Product[]; metadata: { total: number } } } | undefined) => {
          if (!oldData) return oldData;
          const newItems = oldData.data.items.filter((p: Product) => p.id !== productId);
          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: newItems,
              metadata: {
                ...oldData.data.metadata,
                total: newItems.length,
              },
            },
          };
        },
      );
      removeFromFavorites(productId);
    }
  }, [productId, isSaved, product, saveProduct, removeFromFavorites]);

  return {
    isSaved,
    isPending: isSaving || isRemoving,
    toggleSave,
  };
};
