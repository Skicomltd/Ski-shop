import { getLocaleFromPath, getLocalizedPath, usePathname, useRouter } from "@/lib/i18n/navigation";
import { queryClient } from "@/lib/react-query/query-client";
import { queryKeys } from "@/lib/react-query/query-keys";
import {
  addToLocalSavedProducts,
  clearLocalSavedProducts,
  getLocalSavedProducts,
  LOCAL_SAVED_UPDATED_EVENT,
  removeFromLocalSavedProducts,
  setLocalSavedProducts,
} from "@/lib/saved/local-saved";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Prevent duplicate syncs across React StrictMode remounts (dev) and multiple hook instances.
let guestSavedSyncInFlight = false;

export const useSaveProduct = (productId: string, product?: Product) => {
  const { useGetSavedProducts, useSaveProduct, useRemoveFromFavorites } = useAppService();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname || "/");
  const loginHref = getLocalizedPath("/login", locale);

  const [localSavedState, setLocalSavedState] = useState(() => getLocalSavedProducts());
  const hasSyncedReference = useRef(false);
  const isSyncingReference = useRef(false);

  // Keep multiple instances in sync (product cards, saved-items page, etc.)
  useEffect(() => {
    const syncFromStorage = () => setLocalSavedState(getLocalSavedProducts());

    if (typeof window === "undefined") return;

    const onStorage = (event: StorageEvent) => {
      if (event.key === "skicom_guest_saved_products") syncFromStorage();
    };

    window.addEventListener(LOCAL_SAVED_UPDATED_EVENT, syncFromStorage);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(LOCAL_SAVED_UPDATED_EVENT, syncFromStorage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Get saved products to check if current product is saved - only when authenticated
  const { data: savedProductsData, isLoading: isLoadingSavedProducts } = useGetSavedProducts({
    enabled: isAuthenticated,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const savedProductIds = savedProductsData?.data?.items?.map((product: Product) => product.id) || [];
  const localSavedIds = localSavedState.items.map((item) => item.productId);
  const isSaved = productId
    ? isAuthenticated
      ? savedProductIds.includes(productId)
      : localSavedIds.includes(productId)
    : false;

  // Save product mutation
  const { mutate: saveProduct, isPending: isSaving } = useSaveProduct({
    onSuccess: () => {
      if (!isSyncingReference.current) toast.success("Saved to your wishlist");
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
      if (!isSyncingReference.current) toast.success("Removed from saved items");
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

  // Sync local saved products to server when user logs in
  useEffect(() => {
    const syncLocalSavedToServer = async () => {
      // Prevent multiple syncs
      if (!isAuthenticated || hasSyncedReference.current || guestSavedSyncInFlight) return;

      const localSaved = getLocalSavedProducts();
      if (localSaved.items.length === 0) return;

      // Don't start sync if already loading server saved products
      if (isLoadingSavedProducts) return;

      hasSyncedReference.current = true;
      isSyncingReference.current = true;
      guestSavedSyncInFlight = true;

      // Clear immediately to avoid StrictMode double-run duplicating server saves.
      // We'll restore failed ones (if any) after the sync.
      clearLocalSavedProducts();
      setLocalSavedState({ items: [], updatedAt: new Date().toISOString() });

      try {
        const itemsToSync = [...localSaved.items];
        const syncResults = { success: [] as string[], failed: [] as string[] };

        for (const item of itemsToSync) {
          // Skip if already saved on server
          if (savedProductIds.includes(item.productId)) {
            syncResults.success.push(item.productId);
            continue;
          }

          try {
            await new Promise<void>((resolve, reject) => {
              saveProduct(
                { productId: item.productId },
                {
                  onSuccess: () => {
                    syncResults.success.push(item.productId);
                    resolve();
                  },
                  onError: (error) => {
                    syncResults.failed.push(item.productId);
                    reject(error);
                  },
                },
              );
            });
          } catch {
            // Continue with next item
          }
        }

        // After all sync attempts, clear localStorage completely (prevents endless retries)
        if (syncResults.failed.length > 0) {
          const restored = setLocalSavedProducts(syncResults.failed);
          setLocalSavedState(restored);
        }

        // Refetch saved products list
        await queryClient.invalidateQueries({ queryKey: queryKeys.product.saved() });

        if (syncResults.success.length > 0) {
          toast.success(`${syncResults.success.length} saved item(s) synced to your account!`);
        }
        if (syncResults.failed.length > 0) {
          toast.warning(`${syncResults.failed.length} saved item(s) couldn't be synced`);
        }
      } catch {
        toast.error("Failed to sync saved items. Please try again.");
        hasSyncedReference.current = false;
      } finally {
        isSyncingReference.current = false;
        guestSavedSyncInFlight = false;
      }
    };

    syncLocalSavedToServer();
  }, [isAuthenticated, isLoadingSavedProducts, saveProduct, savedProductIds]);

  // Reset sync flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasSyncedReference.current = false;
    }
  }, [isAuthenticated]);

  // Toggle save/unsave
  const toggleSave = useCallback(() => {
    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    if (!isAuthenticated) {
      const newIsSaved = !isSaved;
      if (newIsSaved) {
        const updated = addToLocalSavedProducts(productId);
        setLocalSavedState(updated);
        toast.success("Saved", {
          description: "Item saved, login to see saved items",
          action: {
            label: "Login",
            onClick: () => router.push(loginHref),
          },
        });
      } else {
        const updated = removeFromLocalSavedProducts(productId);
        setLocalSavedState(updated);
        toast.message("Removed from saved items");
      }
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
  }, [productId, isAuthenticated, isSaved, loginHref, product, removeFromFavorites, router, saveProduct]);

  return {
    isSaved,
    isPending: isAuthenticated ? isSaving || isRemoving : false,
    toggleSave,
  };
};
