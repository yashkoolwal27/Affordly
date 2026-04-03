// ==========================================
// Auth Store (Zustand)
// ==========================================
// Manages user authentication state, login, signup, logout,
// and user profile fetching from Supabase.

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAuthStore = create((set, get) => ({
  // State
  user: null,           // Supabase auth user object
  profile: null,        // User profile from 'users' table (includes role)
  loading: true,        // Initial auth check loading
  error: null,

  // Initialize auth — call once on app mount
  initialize: async () => {
    try {
      set({ loading: true, error: null });

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ user: session.user, profile, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          set({ user: session.user, profile });
        } else {
          set({ user: null, profile: null });
        }
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Sign up with email & password
  signUp: async (email, password, name) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // Create user profile in 'users' table
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          name,
          role: 'customer',
        });
        if (profileError) throw profileError;

        // Fetch the new profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({ user: data.user, profile, loading: false });
      }

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // Login with email & password
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Fetch profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({ user: data.user, profile, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, error: null });
  },

  // Check if current user is admin
  isAdmin: () => {
    return get().profile?.role === 'admin';
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
