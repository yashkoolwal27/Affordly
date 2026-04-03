// ==========================================
// ProductCard Component
// ==========================================
// Reusable product card with image, price, stock badge,
// wishlist toggle, and add-to-cart action.

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { isWishlisted, toggleItem } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { background: '#12121a', color: '#fff', border: '1px solid rgba(0,240,255,0.2)' },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleItem(product);
    if (added) {
      toast.success('Added to wishlist!', {
        icon: '❤️',
        style: { background: '#12121a', color: '#fff', border: '1px solid rgba(0,240,255,0.2)' },
      });
    } else {
      toast('Removed from wishlist', {
        icon: '💔',
        style: { background: '#12121a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block"
      id={`product-card-${product.id}`}
    >
      <motion.div
        whileHover={{ y: -4 }}
        className="glass-card overflow-hidden neon-border"
      >
        {/* Image */}
        <div className="relative aspect-square bg-dark-600 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <Eye className="w-12 h-12" />
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
              <span className="badge-red text-sm font-semibold px-4 py-1.5">Out of Stock</span>
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-3 left-3 badge-cyan capitalize">
            {product.category}
          </span>

          {/* Action buttons (shown on hover) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                wishlisted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-dark-700/80 text-gray-400 hover:text-white border border-white/10'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white group-hover:text-neon-cyan transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-1">{product.description}</p>

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-xl font-display font-bold text-white">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="ml-2 text-xs text-neon-orange">Only {product.stock} left</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-10 h-10 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 flex items-center justify-center hover:bg-neon-cyan hover:text-dark-900 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
