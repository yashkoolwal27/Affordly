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
          // Fetch existing profile
          let { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // If no profile exists (e.g. first-time Google OAuth user), create one
          if (!profile) {
            const { data: newProfile } = await supabase
              .from('users')
              .upsert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name ||
                      session.user.user_metadata?.name ||
                      session.user.email?.split('@')[0],
                role: 'customer',
              }, { onConflict: 'id' })
              .select()
              .single();
            profile = newProfile;
          }

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
  signUp: async (email, password, name, role = 'customer', seller_category = null) => {
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
          role,
          seller_category,
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

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      // Browser will redirect to Google — loading state stays until redirect
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

  // Check if current user is seller
  isSeller: () => {
    return get().profile?.role === 'seller';
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
