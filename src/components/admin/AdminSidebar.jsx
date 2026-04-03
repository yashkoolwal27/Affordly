// ==========================================
// AdminSidebar Component
// ==========================================
// Left sidebar for admin panel navigation.

import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { name: 'Products', to: '/admin/products', icon: Package },
  { name: 'Orders', to: '/admin/orders', icon: ShoppingBag },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-0 w-64
          bg-dark-800 border-r border-white/5 p-4 flex flex-col
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-orange to-neon-cyan flex items-center justify-center">
              <span className="text-dark-900 font-display font-bold text-sm">A</span>
            </div>
            <span className="font-display font-bold text-lg text-white">Admin</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Back to store */}
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </aside>
    </>
  );
}
