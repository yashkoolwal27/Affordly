// ==========================================
// Wishlist Store (Zustand)
// ==========================================
// Simple wishlist with localStorage persistence.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // Array of product objects

      // Add to wishlist
      addItem: (product) => {
        const exists = get().items.find((item) => item.id === product.id);
        if (!exists) {
          set({ items: [...get().items, product] });
        }
      },

      // Remove from wishlist
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      // Toggle wishlist (add/remove)
      toggleItem: (product) => {
        const exists = get().items.find((item) => item.id === product.id);
        if (exists) {
          get().removeItem(product.id);
          return false; // Removed
        } else {
          get().addItem(product);
          return true; // Added
        }
      },

      // Check if item is wishlisted
      isWishlisted: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: 'neonkart-wishlist',
    }
  )
);

export default useWishlistStore;
