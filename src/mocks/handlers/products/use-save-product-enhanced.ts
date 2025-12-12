/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-array-for-each */
import { useSavedProductsStorage } from "@/mocks/handlers/products/use-saved-products-storage";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useSaveProductEnhanced = (productId: string, product?: Product) => {
  const { useGetSavedProducts, useSaveProduct, useRemoveFromFavorites } = useAppService();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const {
    savedProducts,
    isLoaded: isStorageLoaded,
    isProductSaved: isProductSavedInStorage,
    addSavedProduct,
    removeSavedProduct,
  } = useSavedProductsStorage();

  // Get saved products from API to check if current product is saved - only when authenticated
  const { data: savedProductsData } = useGetSavedProducts({ enabled: isAuthenticated });
  const savedProductIds = savedProductsData?.data?.items?.map((product: Product) => product.id) || [];
  const isSavedInAPI = productId ? savedProductIds.includes(productId) : false;

  // Use localStorage as the source of truth for immediate UI updates
  const isSavedInStorage = isProductSavedInStorage(productId);

  // Local state for optimistic updates
  const [localIsSaved, setLocalIsSaved] = useState(isSavedInStorage);

  // Update local state when storage state changes
  useEffect(() => {
    if (isStorageLoaded) {
      setLocalIsSaved(isSavedInStorage);
    }
  }, [isSavedInStorage, isStorageLoaded]);

  // Sync localStorage with API data when API data loads
  useEffect(() => {
    if (savedProductsData?.data?.items && isStorageLoaded) {
      const apiProductIds = new Set(savedProductsData.data.items.map((p: Product) => p.id));
      const storageProductIds = new Set(savedProducts.map((p) => p.id));

      // Add products that exist in API but not in storage
      savedProductsData.data.items.forEach((apiProduct: Product) => {
        if (!storageProductIds.has(apiProduct.id)) {
          addSavedProduct(apiProduct);
        }
      });

      // Remove products that exist in storage but not in API
      savedProducts.forEach((storageProduct) => {
        if (!apiProductIds.has(storageProduct.id)) {
          removeSavedProduct(storageProduct.id);
        }
      });
    }
  }, [savedProductsData, isStorageLoaded, savedProducts, addSavedProduct, removeSavedProduct]);

  // Save product mutation
  const { mutate: saveProduct, isPending: isSaving } = useSaveProduct({
    onSuccess: () => {
      if (product) {
        addSavedProduct(product);
      }
      toast.success("Product saved successfully");
    },
    onError: () => {
      setLocalIsSaved(false); // Revert optimistic update
      toast.error("Failed to save product");
    },
  });

  // Remove from favorites mutation
  const { mutate: removeFromFavorites, isPending: isRemoving } = useRemoveFromFavorites({
    onSuccess: () => {
      removeSavedProduct(productId);
      toast.success("Product removed from favorites");
    },
    onError: () => {
      setLocalIsSaved(true); // Revert optimistic update
      toast.error("Failed to remove product from favorites");
    },
  });

  // Toggle save/unsave
  const toggleSave = useCallback(() => {
    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    // Optimistic update
    setLocalIsSaved(!localIsSaved);

    if (localIsSaved) {
      // Remove from favorites
      removeFromFavorites(productId);
    } else {
      // Save product
      saveProduct({ productId });
    }
  }, [productId, localIsSaved, saveProduct, removeFromFavorites]);

  return {
    isSaved: localIsSaved,
    isPending: isSaving || isRemoving,
    toggleSave,
    isStorageLoaded,
    savedProductsCount: savedProducts.length,
  };
};
