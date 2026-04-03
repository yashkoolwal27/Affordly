// ==========================================
// Wishlist Page
// ==========================================
// Shows wishlisted products stored in localStorage via Zustand.

import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import useWishlistStore from '../store/useWishlistStore';
import ProductCard from '../components/products/ProductCard';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        <h1 className="text-3xl font-display font-bold text-white mb-2">My Wishlist</h1>
        <p className="text-gray-500 mb-8">
          {items.length} item{items.length !== 1 ? 's' : ''} saved
        </p>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Browse products and tap the heart icon to save items here.
            </p>
            <Link to="/products" className="btn-neon inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Browse Products
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
