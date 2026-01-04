/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/**
 * Unified Cart Hook
 * Manages cart for both authenticated and guest users
 * Syncs local cart to server when user logs in
 */

import {
  addToLocalCart,
  clearLocalCart,
  getLocalCart,
  removeFromLocalCart,
  updateLocalCartItem,
} from "@/lib/cart/local-cart";
import { getLocaleFromPath, getLocalizedPath } from "@/lib/i18n/navigation";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useUnifiedCart = () => {
  const { status } = useSession();
  const { useGetCart, useAddToCart, useUpdateCartItem, useRemoveFromCart } = useAppService();
  const [localCartState, setLocalCartState] = useState(() => getLocalCart());
  const hasSyncedReference = useRef(false);

  const isAuthenticated = status === "authenticated";

  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname || "/");
  const loginHref = getLocalizedPath("/login", locale);

  // Server cart queries (only for authenticated users)
  const {
    data: serverCartData,
    isLoading: isLoadingServerCart,
    refetch: refetchServerCart,
  } = useGetCart({
    enabled: isAuthenticated,
  });

  const { mutate: addToServerCart, isPending: isAddingToServer } = useAddToCart();
  const { mutate: updateServerCartItem, isPending: isUpdatingServer } = useUpdateCartItem();
  const { mutate: removeFromServerCart, isPending: isRemovingFromServer } = useRemoveFromCart();

  // Sync local cart to server when user logs in
  useEffect(() => {
    const syncLocalCartToServer = async () => {
      // Prevent multiple syncs
      if (!isAuthenticated || hasSyncedReference.current) return;

      const localCart = getLocalCart();
      if (localCart.items.length === 0) return;

      // Don't start sync if already loading server cart
      if (isLoadingServerCart) return;

      hasSyncedReference.current = true;

      try {
        const itemsToSync = [...localCart.items]; // Create a copy to avoid mutation issues
        const syncResults = {
          success: [] as string[],
          failed: [] as string[],
        };

        console.log(`Starting cart sync for ${itemsToSync.length} items`);

        // Sync all items sequentially
        for (const item of itemsToSync) {
          try {
            await new Promise<void>((resolve, reject) => {
              addToServerCart(
                { productId: item.productId, quantity: item.quantity },
                {
                  onSuccess: () => {
                    syncResults.success.push(item.productId);
                    console.log(`Successfully synced product: ${item.productId}`);
                    resolve();
                  },
                  onError: (error) => {
                    syncResults.failed.push(item.productId);
                    console.error(`Failed to sync product: ${item.productId}`, error);
                    reject(error);
                  },
                },
              );
            });
          } catch (error) {
            // Continue with next item even if one fails
            console.error(`Failed to sync product ${item.productId}:`, error);
          }
        }

        console.log(`Sync complete. Success: ${syncResults.success.length}, Failed: ${syncResults.failed.length}`);

        // After all sync attempts, clear localStorage completely
        clearLocalCart();
        setLocalCartState({ items: [], updatedAt: new Date().toISOString() });

        // Refetch server cart to get updated data
        await refetchServerCart();

        // Show appropriate toast message
        if (syncResults.success.length > 0) {
          toast.success(`${syncResults.success.length} item(s) synced to your cart!`);
        }
        if (syncResults.failed.length > 0) {
          toast.warning(`${syncResults.failed.length} item(s) couldn't be synced`);
        }
      } catch (error) {
        console.error("Error syncing cart:", error);
        toast.error("Failed to sync cart. Please try again.");
        // Reset sync flag on error to allow retry
        hasSyncedReference.current = false;
      }
    };

    syncLocalCartToServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoadingServerCart]);

  // Reset sync flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasSyncedReference.current = false;
    }
  }, [isAuthenticated]);

  // Industry-standard approach: Clear localStorage immediately when authenticated
  // This ensures backend is the single source of truth for authenticated users
  useEffect(() => {
    if (isAuthenticated && !isLoadingServerCart && serverCartData) {
      const localCart = getLocalCart();

      // Clear localStorage completely for authenticated users to prevent conflicts
      if (localCart.items.length > 0) {
        clearLocalCart();
        setLocalCartState({ items: [], updatedAt: new Date().toISOString() });
      }
    }
  }, [isAuthenticated, isLoadingServerCart, serverCartData]);

  // Get cart items based on authentication status
  const cartItems = isAuthenticated ? serverCartData?.data?.items || [] : localCartState.items;

  const cartItemCount = isAuthenticated
    ? serverCartData?.data?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0
    : localCartState.items.reduce((total, item) => total + item.quantity, 0);

  // Add to cart (works for both guest and authenticated users)
  const addToCart = (productId: string, quantity: number = 1) => {
    if (isAuthenticated) {
      addToServerCart(
        { productId, quantity },
        {
          onSuccess: () => {
            toast.success("Added to cart successfully");
          },
          onError: () => {
            toast.error("Failed to add item to cart");
          },
        },
      );
    } else {
      const updatedCart = addToLocalCart(productId, quantity);
      setLocalCartState(updatedCart);
      toast.success("Saved", {
        description: "Item saved, login to see item in cart",
        action: {
          label: "Login",
          onClick: () => router.push(loginHref),
        },
      });
    }
  };

  // Update cart item quantity
  const updateCartItem = (productId: string, quantity: number) => {
    if (isAuthenticated) {
      // Find the cart item ID from server cart
      const cartItem = serverCartData?.data?.items?.find((item: any) => item.product?.id === productId);
      if (cartItem) {
        updateServerCartItem(
          { itemId: cartItem.id, quantity },
          {
            onSuccess: () => {
              toast.success("Cart updated successfully");
            },
            onError: () => {
              toast.error("Failed to update cart");
            },
          },
        );
      }
    } else {
      const updatedCart = updateLocalCartItem(productId, quantity);
      setLocalCartState(updatedCart);
      toast.success("Cart updated successfully");
    }
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    if (isAuthenticated) {
      // Find the cart item ID from server cart
      const cartItem = serverCartData?.data?.items?.find((item: any) => item.product?.id === productId);
      if (cartItem) {
        removeFromServerCart(cartItem.id, {
          onSuccess: () => {
            toast.success("Item removed from cart");
          },
          onError: () => {
            toast.error("Failed to remove item");
          },
        });
      }
    } else {
      const updatedCart = removeFromLocalCart(productId);
      setLocalCartState(updatedCart);
      toast.success("Item removed from cart");
    }
  };

  // Clear entire cart
  const clearCart = () => {
    if (isAuthenticated) {
      // Remove all items from server cart
      const items = serverCartData?.data?.items || [];
      for (const item of items) {
        removeFromServerCart(item.id);
      }
      // Ensure localStorage is also cleared
      clearLocalCart();
      setLocalCartState({ items: [], updatedAt: new Date().toISOString() });
    } else {
      clearLocalCart();
      setLocalCartState({ items: [], updatedAt: new Date().toISOString() });
    }
    toast.success("Cart cleared");
  };

  const isLoading = isAuthenticated ? isLoadingServerCart : false;
  const isPending = isAddingToServer || isUpdatingServer || isRemovingFromServer;

  return {
    cartItems,
    cartItemCount,
    isLoading,
    isPending,
    isAuthenticated,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
};
