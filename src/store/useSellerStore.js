// ==========================================
// Seller Store (Zustand)
// ==========================================
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import useAuthStore from './useAuthStore';

const useSellerStore = create((set, get) => ({
  products: [],
  orders: [],
  stats: { totalProducts: 0, totalOrders: 0, totalRevenue: 0 },
  loading: false,
  error: null,

  fetchStats: async () => {
    try {
      set({ loading: true });
      const user = useAuthStore.getState().user;
      if (!user) return;

      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id);

      // Seller orders
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('price, quantity, order_id, products!inner(seller_id)')
        .eq('products.seller_id', user.id);

      const uniqueOrders = new Set(orderItems?.map(i => i.order_id));
      const totalOrders = uniqueOrders.size;
      const totalRevenue = (orderItems || []).reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

      set({
        stats: { totalProducts: totalProducts || 0, totalOrders, totalRevenue },
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchMyProducts: async () => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
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

  addProduct: async (productData) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;

      const { data, error } = await supabase
        .from('products')
        .insert({ ...productData, seller_id: user.id })
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ products: [data, ...state.products], loading: false }));
      return { success: true, product: data };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  updateProduct: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('seller_id', user.id)
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

  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('seller_id', user.id);

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

  fetchMyOrders: async () => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;

      // Notice we use the `orders` from the RLS policy we created and filter it
      // actually the RLS policy naturally restricts it to orders with the seller's items
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users:user_id (name, email),
          order_items!inner (
            *,
            products!inner (id, name, image_url, seller_id)
          )
        `)
        .eq('order_items.products.seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Post-process to sum up only THIS seller's total revenue for the order
      const processedOrders = data?.map(order => {
        const myItems = order.order_items.filter(item => item.products.seller_id === user.id);
        const myTotal = myItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
          ...order,
          order_items: myItems,
          seller_total: myTotal
        };
      });

      set({ orders: processedOrders || [], loading: false });
    } catch (err) {
      console.error(err);
      set({ error: err.message, loading: false });
    }
  },
}));

export default useSellerStore;
