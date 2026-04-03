// ==========================================
// Admin Orders Page
// ==========================================
// Full order management with status updates.

import { useEffect } from 'react';
import useAdminStore from '../../store/useAdminStore';
import OrderTable from '../../components/admin/OrderTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminOrders() {
  const { orders, loading, fetchAllOrders } = useAdminStore();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  if (loading && !orders.length) {
    return <LoadingSpinner size="lg" text="Loading orders..." />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Orders</h1>
        <p className="text-gray-500 text-sm">{orders.length} total orders</p>
      </div>

      <OrderTable orders={orders} />
    </div>
  );
}
