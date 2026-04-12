// ==========================================
// Admin Dashboard Page
// ==========================================
// Overview with stats cards and recent orders.

import { useEffect } from 'react';
import { Package, ShoppingBag, IndianRupee, Users } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import StatsCard from '../../components/admin/StatsCard';
import OrderTable from '../../components/admin/OrderTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboard() {
  const { stats, orders, loading, fetchStats, fetchAllOrders } = useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchAllOrders();
  }, [fetchStats, fetchAllOrders]);

  if (loading && !orders.length) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="cyan"
          index={0}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="green"
          index={1}
        />
        <StatsCard
          title="Revenue"
          value={`₹${stats.totalRevenue.toFixed(2)}`}
          icon={IndianRupee}
          color="orange"
          index={2}
        />
        <StatsCard
          title="Customers"
          value={stats.totalUsers}
          icon={Users}
          color="pink"
          index={3}
        />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-display font-semibold text-white mb-4">Recent Orders</h2>
        <OrderTable orders={orders.slice(0, 10)} />
      </div>
    </div>
  );
}
