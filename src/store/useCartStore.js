// ==========================================
// Cart Store (Zustand)
// ==========================================
// Manages shopping cart with localStorage persistence.
// Handles add, remove, update quantity, and totals.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],    // Array of { product, quantity }

      // Add item to cart (or increase quantity if exists)
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.product.id === product.id);

        if (existing) {
          // Don't exceed stock
          const newQty = Math.min(existing.quantity + quantity, product.stock);
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQty }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: Math.min(quantity, product.stock) }] });
        }
      },

      // Remove item from cart
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      // Update quantity for a specific item
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, item.product.stock) }
              : item
          ),
        });
      },

      // Clear entire cart
      clearCart: () => set({ items: [] }),

      // Get total number of items
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get subtotal price
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      // Get shipping cost (free over ₹100)
      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 100 ? 0 : 9.99;
      },

      // Get total price including shipping
      getTotal: () => {
        return get().getSubtotal() + get().getShipping();
      },
    }),
    {
      name: 'neonkart-cart', // localStorage key
    }
  )
);

export default useCartStore;
