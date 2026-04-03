// ==========================================
// OrderTable Component
// ==========================================
// Reusable order table for admin order management.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'badge-orange',
  processing: 'badge-cyan',
  shipped: 'badge-cyan',
  delivered: 'badge-green',
  cancelled: 'badge-red',
};

export default function OrderTable({ orders }) {
  const { updateOrderStatus } = useAdminStore();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success(`Order status updated to ${newStatus}`);
    } else {
      toast.error('Failed to update status');
    }
  };

  if (!orders.length) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="glass-card overflow-hidden">
          {/* Order header row */}
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
            onClick={() =>
              setExpandedOrder(expandedOrder === order.id ? null : order.id)
            }
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div>
                <p className="text-sm font-mono text-gray-500">
                  #{order.id.slice(0, 8)}
                </p>
                <p className="text-white text-sm font-medium">
                  {order.users?.name || 'Unknown User'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-display font-bold text-white">
                ${Number(order.total_price).toFixed(2)}
              </span>

              {/* Status dropdown */}
              <select
                value={order.status}
                onChange={(e) => {
                  e.stopPropagation();
                  handleStatusChange(order.id, e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-600 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-neon-cyan/30"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-dark-700">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              <span className={`${statusColors[order.status] || 'badge-cyan'} hidden sm:inline-flex`}>
                {order.status}
              </span>

              <span className="text-xs text-gray-500 hidden md:block">
                {new Date(order.created_at).toLocaleDateString()}
              </span>

              {expandedOrder === order.id ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>

          {/* Expanded order details */}
          <AnimatePresence>
            {expandedOrder === order.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/5 overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {/* Customer info */}
                  <div className="text-sm">
                    <span className="text-gray-500">Email: </span>
                    <span className="text-gray-300">{order.users?.email}</span>
                  </div>

                  {/* Shipping address */}
                  {order.shipping_address && (
                    <div className="text-sm">
                      <span className="text-gray-500">Ship to: </span>
                      <span className="text-gray-300">
                        {order.shipping_address.name}, {order.shipping_address.address},{' '}
                        {order.shipping_address.city} {order.shipping_address.zip}
                      </span>
                    </div>
                  )}

                  {/* Order items */}
                  <div className="space-y-2 mt-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Items</p>
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-lg bg-dark-600 overflow-hidden">
                          {item.products?.image_url ? (
                            <img
                              src={item.products.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">
                            {item.products?.name || 'Unknown Product'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm text-white font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
