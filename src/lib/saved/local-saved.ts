/* eslint-disable no-console */
/**
 * Local Saved Products Management System
 * Handles save/favorite operations for non-authenticated users using localStorage
 */

const SAVED_STORAGE_KEY = "skicom_guest_saved_products";

// Used to broadcast changes so multiple components/hooks stay in sync
export const LOCAL_SAVED_UPDATED_EVENT = "skicom_guest_saved_products_updated";

export interface LocalSavedItem {
  productId: string;
  addedAt: string;
}

export interface LocalSavedProducts {
  items: LocalSavedItem[];
  updatedAt: string;
}

/**
 * Get saved products from localStorage
 */
export const getLocalSavedProducts = (): LocalSavedProducts => {
  if (typeof window === "undefined") {
    return { items: [], updatedAt: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!stored) {
      return { items: [], updatedAt: new Date().toISOString() };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading local saved products:", error);
    return { items: [], updatedAt: new Date().toISOString() };
  }
};

/**
 * Save saved products to localStorage
 */
export const saveLocalSavedProducts = (saved: LocalSavedProducts): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved));
    // Notify listeners (other hook instances, saved-items page, etc.)
    window.dispatchEvent(new Event(LOCAL_SAVED_UPDATED_EVENT));
  } catch (error) {
    console.error("Error saving local saved products:", error);
  }
};

/**
 * Replace local saved list (useful for restoring failed sync items)
 */
export const setLocalSavedProducts = (productIds: string[]): LocalSavedProducts => {
  const uniqueIds = [...new Set(productIds)];
  const next: LocalSavedProducts = {
    items: uniqueIds.map((productId) => ({ productId, addedAt: new Date().toISOString() })),
    updatedAt: new Date().toISOString(),
  };
  saveLocalSavedProducts(next);
  return next;
};

/**
 * Add product to saved list (idempotent)
 */
export const addToLocalSavedProducts = (productId: string): LocalSavedProducts => {
  const saved = getLocalSavedProducts();

  const existing = saved.items.find((item) => item.productId === productId);
  if (!existing) {
    saved.items.push({ productId, addedAt: new Date().toISOString() });
  }

  saved.updatedAt = new Date().toISOString();
  saveLocalSavedProducts(saved);
  return saved;
};

/**
 * Remove product from saved list
 */
export const removeFromLocalSavedProducts = (productId: string): LocalSavedProducts => {
  const saved = getLocalSavedProducts();
  saved.items = saved.items.filter((item) => item.productId !== productId);
  saved.updatedAt = new Date().toISOString();
  saveLocalSavedProducts(saved);
  return saved;
};

/**
 * Clear entire saved list
 */
export const clearLocalSavedProducts = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SAVED_STORAGE_KEY);
    window.dispatchEvent(new Event(LOCAL_SAVED_UPDATED_EVENT));
  } catch (error) {
    console.error("Error clearing local saved products:", error);
  }
};

/**
 * Check if product is saved locally
 */
export const isInLocalSavedProducts = (productId: string): boolean => {
  const saved = getLocalSavedProducts();
  return saved.items.some((item) => item.productId === productId);
};

/**
 * Count locally-saved products
 */
export const getLocalSavedProductsCount = (): number => {
  const saved = getLocalSavedProducts();
  return saved.items.length;
};
