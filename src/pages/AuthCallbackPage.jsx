// ==========================================
// Auth Callback Page
// ==========================================
// Supabase redirects here after Google OAuth sign-in.
// We wait for the session to be set, then navigate home.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically handles the OAuth token exchange from the URL hash.
    // We listen for the SIGNED_IN event and then redirect home.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe();
        navigate('/', { replace: true });
      }
    });

    // Fallback: if session already exists (page refresh), go home
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" text="Signing you in with Google..." />
        <p className="text-gray-500 text-sm">Please wait, setting up your account...</p>
      </div>
    </div>
  );
}
