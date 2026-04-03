// ==========================================
// Order History Page
// ==========================================
// List of past orders for the logged-in user.

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useOrderStore from '../store/useOrderStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statusColors = {
  pending: 'badge-orange',
  processing: 'badge-cyan',
  shipped: 'badge-cyan',
  delivered: 'badge-green',
  cancelled: 'badge-red',
};

export default function OrderHistoryPage() {
  const { user } = useAuthStore();
  const { orders, loading, fetchOrders } = useOrderStore();
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders(user.id);
    }
  }, [user, fetchOrders]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24">
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-white mb-2">My Orders</h1>
        <p className="text-gray-500 mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-white mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
            <Link to="/products" className="btn-neon">Shop Now</Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card overflow-hidden"
              >
                {/* Order header */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() =>
                    setExpandedOrder(expandedOrder === order.id ? null : order.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-neon-cyan" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={statusColors[order.status] || 'badge-cyan'}>
                      {order.status}
                    </span>
                    <span className="text-white font-display font-bold">
                      ${Number(order.total_price).toFixed(2)}
                    </span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-white/5 p-5"
                  >
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
                      >
                        <div className="w-12 h-12 rounded-lg bg-dark-600 overflow-hidden">
                          {item.products?.image_url ? (
                            <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{item.products?.name || 'Product'}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm text-white font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
