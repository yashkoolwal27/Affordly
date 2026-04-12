// ==========================================
// CartSummary Component
// ==========================================
// Displays order summary with subtotal, shipping, total and CTA.

import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

export default function CartSummary() {
  const { getSubtotal, getShipping, getTotal, getTotalItems } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const itemCount = getTotalItems();

  return (
    <div className="glass-card p-6 sticky top-24">
      <h3 className="font-display font-bold text-xl text-white mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal ({itemCount} items)</span>
          <span className="text-white">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-400">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-neon-cyan' : ''}>
            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
          </span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-gray-500 mt-2 text-right">
            Free shipping on orders over ₹100
          </p>
        )}

        <div className="border-t border-white/5 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-white">Total</span>
            <span className="font-display font-bold text-xl text-white">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <Link
        to="/checkout"
        className="btn-neon w-full mt-6 flex items-center justify-center gap-2"
      >
        Proceed to Checkout <ArrowRight className="w-4 h-4" />
      </Link>

      {/* Trust signals */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-neon-green" />
          Secure checkout with SSL encryption
        </div>
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 mb-2">Secure checkout powered by Razorpay</p>
          <p className="text-xs text-neon-cyan">
            Free shipping on orders over ₹100
          </p>
        </div>
      </div>
    </div>
  );
}
