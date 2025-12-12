# Unified Cart System

## Overview
The unified cart system provides a seamless shopping experience for both guest (non-authenticated) and authenticated users. Guest users can add items to their cart which are stored locally, and when they log in, their cart is automatically synced to the server.

## Features

### ✅ Guest Cart (Local Storage)
- Add products to cart without authentication
- Persistent cart across browser sessions
- Update quantities and remove items
- View cart item count

### ✅ Authenticated Cart (Server)
- Server-side cart management
- Synced across devices
- Persistent cart data

### ✅ Automatic Sync
- When a guest user logs in, their local cart is automatically synced to the server
- Seamless transition with toast notifications
- No data loss during authentication

## Usage

### AddToCartButton Component
```tsx
import { AddToCartButton } from "@/components/shared/add-to-cart-button";

<AddToCartButton 
  productId="123"
  quantity={1}
  fullWidth
  isIconVisible
/>
```

### useUnifiedCart Hook
```tsx
import { useUnifiedCart } from "@/hooks/use-unified-cart";

const { 
  cartItems, 
  cartItemCount, 
  addToCart, 
  updateCartItem, 
  removeFromCart,
  clearCart,
  isLoading,
  isPending,
  isAuthenticated
} = useUnifiedCart();

// Add to cart (works for both guest and authenticated)
addToCart("product-id", 1);

// Update quantity
updateCartItem("product-id", 3);

// Remove from cart
removeFromCart("product-id");
```

## Architecture

### Local Cart (`/src/lib/cart/local-cart.ts`)
- Manages localStorage operations
- CRUD operations for guest cart
- Type-safe interfaces

### Unified Cart Hook (`/src/hooks/use-unified-cart.tsx`)
- Abstracts cart logic for both user types
- Handles automatic sync on login
- Provides unified API

### Add to Cart Button (`/src/components/shared/add-to-cart-button/`)
- User-friendly button component
- Works for both guest and authenticated users
- Handles loading states and error handling

## Benefits

1. **Better UX**: Users can start shopping immediately without creating an account
2. **Increased Conversions**: Reduced friction in the buying process
3. **Professional**: Industry-standard e-commerce pattern
4. **Seamless**: Automatic cart sync when users log in
5. **Type-Safe**: Full TypeScript support
6. **Persistent**: Cart data preserved across sessions

## Technical Details

### Storage Key
- Local cart stored at: `skicom_guest_cart`

### Data Structure
```typescript
interface LocalCart {
  items: {
    productId: string;
    quantity: number;
    addedAt: string;
  }[];
  updatedAt: string;
}
```

### Sync Process
1. User logs in
2. System reads local cart from localStorage
3. Each item is added to server cart via API
4. Local cart is cleared after successful sync
5. User sees success notification
