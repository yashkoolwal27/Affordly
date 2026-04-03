// ==========================================
// Cart Page
// ==========================================

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

export default function CartPage() {
  const { items, clearCart } = useCartStore();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">Shopping Cart</h1>
            <p className="text-gray-500">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="btn-danger flex items-center gap-2 text-sm">
              <Trash2 className="w-4 h-4" /> Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty cart */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products" className="btn-neon inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Browse Products
            </Link>
          </motion.div>
        ) : (
          /* Cart with items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </AnimatePresence>

              {/* Continue shopping */}
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-neon-cyan transition-colors mt-4"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>

            {/* Summary sidebar */}
            <div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
