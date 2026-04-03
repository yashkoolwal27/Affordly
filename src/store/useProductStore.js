// ==========================================
// Product Store (Zustand)
// ==========================================
// Handles product fetching, filtering, search, and pagination
// from Supabase 'products' table.

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const PRODUCTS_PER_PAGE = 12;

const useProductStore = create((set, get) => ({
  // State
  products: [],
  featuredProducts: [],
  currentProduct: null,
  loading: false,
  error: null,

  // Pagination
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,

  // Filters
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    inStock: false,
    search: '',
  },

  // Set filters (merges with existing)
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // Reset to page 1 when filters change
    }));
  },

  // Reset filters
  resetFilters: () => {
    set({
      filters: { category: '', minPrice: 0, maxPrice: 10000, inStock: false, search: '' },
      currentPage: 1,
    });
  },

  // Set current page
  setPage: (page) => set({ currentPage: page }),

  // Fetch products with filters and pagination
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const { filters, currentPage } = get();

      // Build query
      let query = supabase.from('products').select('*', { count: 'exact' });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.minPrice > 0) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice < 10000) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.inStock) {
        query = query.gt('stock', 0);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Pagination
      const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const to = from + PRODUCTS_PER_PAGE - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;

      set({
        products: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / PRODUCTS_PER_PAGE),
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Fetch featured products (for homepage)
  fetchFeaturedProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(8);
      if (error) throw error;
      set({ featuredProducts: data || [] });
    } catch (err) {
      console.error('Error fetching featured products:', err);
    }
  },

  // Fetch a single product by ID
  fetchProduct: async (id) => {
    try {
      set({ loading: true, error: null, currentProduct: null });
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      set({ currentProduct: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Fetch related products (same category, excluding current)
  fetchRelatedProducts: async (category, excludeId) => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', excludeId)
        .limit(4);
      return data || [];
    } catch {
      return [];
    }
  },
}));

export default useProductStore;
