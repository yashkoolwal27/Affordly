import { useEffect } from 'react';
import useSellerStore from '../../store/useSellerStore';
import StatsCard from '../../components/admin/StatsCard'; // We can safely reuse this UI component
import { Package, ShoppingBag, Banknote } from 'lucide-react';

export default function SellerDashboard() {
  const { stats, fetchStats, loading } = useSellerStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-white pt-24 md:pt-10">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Seller Dashboard</h1>
        <p className="text-gray-400">Overview of your store's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Active Products"
          value={stats.totalProducts}
          icon={Package}
          color="cyan"
          loading={loading}
        />
        <StatsCard
          title="Orders Items Sold"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="My Revenue"
          value={`\u20B9${stats.totalRevenue.toFixed(2)}`}
          icon={Banknote}
          color="orange"
          loading={loading}
        />
      </div>

    </div>
  );
}
