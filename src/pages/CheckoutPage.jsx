// ==========================================
// Checkout Page
// ==========================================
// Shipping form + order summary, places order via Supabase.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useOrderStore from '../store/useOrderStore';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getSubtotal, getShipping, getTotal, clearCart } = useCartStore();
  const { placeOrder, loading } = useOrderStore();

  const [formData, setFormData] = useState({
    name: '', address: '', city: '', zip: '', phone: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Redirect if cart is empty
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400 mb-4">Your cart is empty</p>
          <Link to="/products" className="btn-neon inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Shop Now
          </Link>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400 mb-4">Please sign in to checkout</p>
          <Link to="/auth" className="btn-neon">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await placeOrder(user.id, items, formData, getTotal());

    if (result.success) {
      clearCart();
      setOrderPlaced(true);
      toast.success('Order placed successfully!', {
        icon: '🎉',
        style: { background: '#12121a', color: '#fff', border: '1px solid rgba(57,255,20,0.3)' },
      });
    } else {
      toast.error(result.error || 'Failed to place order');
    }
  };

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Order Placed!
          </h2>
          <p className="text-gray-400 mb-6">
            Thank you for your purchase. You can track your order in the Orders page.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/orders" className="btn-neon">View Orders</Link>
            <Link to="/products" className="btn-outline">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-6">
              <h2 className="text-xl font-display font-semibold text-white mb-6">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="input-field"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      required
                      className="input-field"
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-neon w-full mt-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><ShieldCheck className="w-5 h-5" /> Place Order — ${getTotal().toFixed(2)}</>
                )}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="glass-card p-6 h-fit sticky top-24">
            <h3 className="text-lg font-display font-semibold text-white mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-dark-600 overflow-hidden shrink-0">
                    {item.product.image_url && (
                      <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className={getShipping() === 0 ? 'text-neon-green' : ''}>
                  {getShipping() === 0 ? 'FREE' : `$${getShipping().toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-white text-base pt-2 border-t border-white/5">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
