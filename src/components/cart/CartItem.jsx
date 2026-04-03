// ==========================================
// CartItem Component
// ==========================================
// Single cart item row with image, quantity controls, and remove button.

import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card p-4 flex gap-4"
    >
      {/* Product image */}
      <Link to={`/products/${product.id}`} className="shrink-0">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-dark-600">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <Eye className="w-6 h-6" />
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              to={`/products/${product.id}`}
              className="font-semibold text-white hover:text-neon-cyan transition-colors truncate block"
            >
              {product.name}
            </Link>
            <span className="text-xs text-gray-500 capitalize">{product.category}</span>
          </div>

          <button
            onClick={() => removeItem(product.id)}
            className="text-gray-500 hover:text-red-400 transition-colors p-1"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 rounded-lg bg-dark-500 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-white font-medium text-sm">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="w-8 h-8 rounded-lg bg-dark-500 text-gray-400 hover:text-white flex items-center justify-center transition-colors disabled:opacity-30"
            >
              <Plus className="w-3 h-3" />
            </button>
            {product.stock <= 5 && (
              <span className="text-xs text-neon-orange ml-1">
                {product.stock} avail.
              </span>
            )}
          </div>

          {/* Price */}
          <span className="font-display font-bold text-white">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
