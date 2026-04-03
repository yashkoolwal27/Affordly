// ==========================================
// Order Store (Zustand)
// ==========================================
// Handles order creation, stock decrementation,
// and order history fetching from Supabase.

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useOrderStore = create((set, get) => ({
  // State
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // Place a new order with stock validation
  placeOrder: async (userId, cartItems, shippingInfo, totalPrice) => {
    try {
      set({ loading: true, error: null });

      // 1. Validate stock for all items
      for (const item of cartItems) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product.id)
          .single();

        if (!product || product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${item.product.name}". Available: ${product?.stock || 0}`
          );
        }
      }

      // 2. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_price: totalPrice,
          status: 'pending',
          shipping_address: shippingInfo,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4. Decrement stock for each product
      for (const item of cartItems) {
        const { error: stockError } = await supabase.rpc('decrement_stock', {
          product_id: item.product.id,
          quantity: item.quantity,
        });

        // Fallback if RPC doesn't exist — manual update
        if (stockError) {
          await supabase
            .from('products')
            .update({ stock: item.product.stock - item.quantity })
            .eq('id', item.product.id);
        }
      }

      set({ currentOrder: order, loading: false });
      return { success: true, order };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // Fetch order history for a user
  fetchOrders: async (userId) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products:product_id (name, image_url, category)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: data || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Clear current order
  clearCurrentOrder: () => set({ currentOrder: null }),
}));

export default useOrderStore;
