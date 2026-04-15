// ==========================================
// Navbar Component
// ==========================================
// Main navigation bar with logo, links, search, cart badge,
// user menu, and mobile responsive drawer.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Package,
  Shield,
  Store,
  ChevronDown,
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, profile, logout, isAdmin, isSeller } = useAuthStore();
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const wishlistItems = useWishlistStore((s) => s.items);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: '3D Showcase', to: '/showcase' },
    { name: 'Products', to: '/products' },
    { name: 'Watches', to: '/products?category=watches' },
    { name: 'Fabrics', to: '/products?category=fabrics' },
    { name: 'Shoes', to: '/products?category=shoes' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center">
              <span className="text-dark-900 font-display font-bold text-sm">A</span>
            </div>
            <span className="font-display font-bold text-xl text-white group-hover:text-neon-cyan transition-colors">
              Afford<span className="text-neon-cyan">ly</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="btn-ghost p-2"
              id="nav-search-toggle"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="btn-ghost p-2 relative" id="nav-wishlist">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-pink text-[10px] font-bold rounded-full flex items-center justify-center text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="btn-ghost p-2 relative" id="nav-cart">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-neon-cyan text-[10px] font-bold rounded-full flex items-center justify-center text-dark-900"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="btn-ghost p-2 flex items-center gap-1"
                  id="nav-user-menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center">
                    <span className="text-dark-900 text-xs font-bold">
                      {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 glass-card p-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm font-medium text-white">{profile?.name}</p>
                        <p className="text-xs text-gray-500">{profile?.email}</p>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>

                      {isAdmin() && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neon-orange hover:bg-neon-orange/5 rounded-lg transition-all"
                        >
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}

                      {isSeller() && (
                        <Link
                          to="/seller"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neon-green hover:bg-neon-green/5 rounded-lg transition-all"
                        >
                          <Store className="w-4 h-4" /> Seller Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/5 rounded-lg transition-all w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth" className="btn-neon text-sm !px-4 !py-2" id="nav-login">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden btn-ghost p-2"
              id="nav-mobile-toggle"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar (expandable) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="pb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="input-field pl-12"
                    autoFocus
                    id="nav-search-input"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 overflow-hidden"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
