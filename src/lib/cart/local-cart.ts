/* eslint-disable no-console */
/**
 * Local Cart Management System
 * Handles cart operations for non-authenticated users using localStorage
 */

const CART_STORAGE_KEY = "skicom_guest_cart";

export interface LocalCartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface LocalCart {
  items: LocalCartItem[];
  updatedAt: string;
}

/**
 * Get the guest cart from localStorage
 */
export const getLocalCart = (): LocalCart => {
  if (typeof window === "undefined") {
    return { items: [], updatedAt: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return { items: [], updatedAt: new Date().toISOString() };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading local cart:", error);
    return { items: [], updatedAt: new Date().toISOString() };
  }
};

/**
 * Save the guest cart to localStorage
 */
export const saveLocalCart = (cart: LocalCart): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving local cart:", error);
  }
};

/**
 * Add item to guest cart
 */
export const addToLocalCart = (productId: string, quantity: number = 1): LocalCart => {
  const cart = getLocalCart();
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      addedAt: new Date().toISOString(),
    });
  }

  cart.updatedAt = new Date().toISOString();
  saveLocalCart(cart);
  return cart;
};

/**
 * Update item quantity in guest cart
 */
export const updateLocalCartItem = (productId: string, quantity: number): LocalCart => {
  const cart = getLocalCart();
  const item = cart.items.find((item) => item.productId === productId);

  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }
    cart.updatedAt = new Date().toISOString();
    saveLocalCart(cart);
  }

  return cart;
};

/**
 * Remove item from guest cart
 */
export const removeFromLocalCart = (productId: string): LocalCart => {
  const cart = getLocalCart();
  cart.items = cart.items.filter((item) => item.productId !== productId);
  cart.updatedAt = new Date().toISOString();
  saveLocalCart(cart);
  return cart;
};

/**
 * Clear the entire guest cart
 */
export const clearLocalCart = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing local cart:", error);
  }
};

/**
 * Get total item count in guest cart
 */
export const getLocalCartItemCount = (): number => {
  const cart = getLocalCart();
  return cart.items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Check if a product is in the guest cart
 */
export const isInLocalCart = (productId: string): boolean => {
  const cart = getLocalCart();
  return cart.items.some((item) => item.productId === productId);
};

/**
 * Get quantity of a specific product in guest cart
 */
export const getLocalCartItemQuantity = (productId: string): number => {
  const cart = getLocalCart();
  const item = cart.items.find((item) => item.productId === productId);
  return item?.quantity || 0;
};
