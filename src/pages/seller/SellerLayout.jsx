import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Store } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const navItems = [
  { path: '/seller', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/seller/products', icon: Package, label: 'My Products' },
  { path: '/seller/orders', icon: ShoppingBag, label: 'My Orders' },
];

export default function SellerLayout() {
  const { profile } = useAuthStore();

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col md:flex-row pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-dark-800 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-emerald-500 flex items-center justify-center text-dark-900 font-bold font-display">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white leading-tight">Seller Center</h2>
              <span className="text-xs text-neon-green capitalize">{profile?.seller_category || 'General'} Store</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 pb-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-neon-green/10 text-neon-green'
                    : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
