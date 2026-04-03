// ==========================================
// Admin Store (Zustand)
// ==========================================
// Admin-specific operations: product CRUD, order management,
// dashboard stats, and image upload to Supabase Storage.

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAdminStore = create((set, get) => ({
  // State
  products: [],
  orders: [],
  stats: { totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalUsers: 0 },
  loading: false,
  error: null,

  // ---- Dashboard Stats ----
  fetchStats: async () => {
    try {
      set({ loading: true });

      // Total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Total revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_price');
      const totalRevenue = (revenueData || []).reduce((sum, o) => sum + Number(o.total_price), 0);

      // Total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      set({
        stats: {
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          totalRevenue,
          totalUsers: totalUsers || 0,
        },
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ---- Product Management ----

  // Fetch all products (admin view — no pagination)
  fetchAllProducts: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ products: data || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Upload product image to Supabase Storage
  uploadImage: async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return { success: true, url: urlData.publicUrl };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Add a new product
  addProduct: async (productData) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        products: [data, ...state.products],
        loading: false,
      }));

      return { success: true, product: data };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // Update an existing product
  updateProduct: async (id, updates) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? data : p)),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // ---- Order Management ----

  // Fetch all orders (admin)
  fetchAllOrders: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users:user_id (name, email),
          order_items (
            *,
            products:product_id (name, image_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: data || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status } : o
        ),
      }));

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
}));

export default useAdminStore;
