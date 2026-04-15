import { useEffect } from 'react';
import useSellerStore from '../../store/useSellerStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SellerOrders() {
  const { orders, loading, fetchMyOrders } = useSellerStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  if (loading && orders.length === 0) {
    return <LoadingSpinner text="Loading your orders..." />;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 pt-24 md:pt-10">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">My Orders</h1>
        <p className="text-gray-400">Orders containing your products</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap">Order ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 whitespace-nowrap">Your Items</th>
                <th className="px-6 py-4 whitespace-nowrap">Your Revenue</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 rounded-tr-xl whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No orders found for your products yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const customerName = order.shipping_address?.fullName || order.users?.name || 'Customer';
                  const date = new Date(order.created_at).toLocaleDateString() || 'N/A';
                  
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{customerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.order_items.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <span className="w-6 h-6 rounded bg-dark-800 flex items-center justify-center text-xs">
                                {item.quantity}x
                              </span>
                              <span className="truncate max-w-[150px]">{item.products?.name || 'Product'}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neon-green font-medium whitespace-nowrap">
                        ₹{order.seller_total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{date}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
