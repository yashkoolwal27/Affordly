// ==========================================
// Auth Page (Login + Signup)
// ==========================================
// Tabbed authentication with Supabase Auth.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, signUp, signInWithGoogle, loading, user } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'customer', seller_category: 'watches',
  });

  // If already logged in, redirect
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Welcome back!', {
          icon: '👋',
          style: { background: '#12121a', color: '#fff', border: '1px solid rgba(0,240,255,0.2)' },
        });
        navigate('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } else {
      if (!formData.name.trim()) {
        toast.error('Please enter your name');
        return;
      }
      const result = await signUp(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.role, 
        formData.role === 'seller' ? formData.seller_category : null
      );
      if (result.success) {
        toast.success('Account created! Welcome to Affordly!', {
          icon: '🎉',
          style: { background: '#12121a', color: '#fff', border: '1px solid rgba(57,255,20,0.3)' },
        });
        navigate('/');
      } else {
        toast.error(result.error || 'Signup failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center">
            <span className="text-dark-900 font-display font-bold">A</span>
          </div>
          <span className="font-display font-bold text-2xl text-white">
            Afford<span className="text-neon-cyan">ly</span>
          </span>
        </Link>

        {/* Tabs */}
        <div className="flex mb-6 bg-dark-600 rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isLogin
                ? 'bg-neon-cyan text-dark-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              !isLogin
                ? 'bg-neon-cyan text-dark-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Google SVG Icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (signup only) */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <div className="relative mb-4">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field pl-11"
                  placeholder="John Doe"
                />
              </div>

              {/* Account Type Selection */}
              <label className="block text-sm text-gray-400 mb-1">Account Type</label>
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.role === 'customer' 
                      ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5' 
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.role === 'seller' 
                      ? 'border-neon-green text-neon-green bg-neon-green/5' 
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  Seller
                </button>
              </div>

              {/* Seller Category */}
              {formData.role === 'seller' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4"
                >
                  <label className="block text-sm text-gray-400 mb-1">Primary Category</label>
                  <select
                    value={formData.seller_category}
                    onChange={(e) => setFormData({ ...formData, seller_category: e.target.value })}
                    className="input-field w-full appearance-none bg-dark-600"
                  >
                    <option value="watches">Watches</option>
                    <option value="shoes">Shoes</option>
                    <option value="fabrics">Fabrics</option>
                    <option value="corsets">Corsets</option>
                  </select>
                </motion.div>
              )}
            </motion.div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="input-field pl-11"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="input-field pl-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-neon-cyan transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
