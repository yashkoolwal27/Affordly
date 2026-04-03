// ==========================================
// ProductFilters Component
// ==========================================
// Sidebar filters: category, price range, in-stock toggle, and search.

import { motion } from 'framer-motion';
import { Filter, X, RotateCcw } from 'lucide-react';
import useProductStore from '../../store/useProductStore';

const categories = [
  { label: 'All', value: '' },
  { label: 'Watches', value: 'watches' },
  { label: 'Fabrics', value: 'fabrics' },
  { label: 'Shoes', value: 'shoes' },
];

export default function ProductFilters({ isOpen, onClose }) {
  const { filters, setFilters, resetFilters } = useProductStore();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        className={`
          fixed lg:sticky top-0 left-0 h-full lg:h-auto lg:top-24 z-50 lg:z-0
          w-80 lg:w-full glass-card p-6 overflow-y-auto
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white font-display font-semibold">
            <Filter className="w-5 h-5 text-neon-cyan" />
            Filters
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-3">Category</label>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilters({ category: cat.value })}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  filters.category === cat.value
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Price Range: ${filters.minPrice} — ${filters.maxPrice}
          </label>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-500">Min Price</span>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={filters.minPrice}
                onChange={(e) => setFilters({ minPrice: Number(e.target.value) })}
                className="w-full accent-neon-cyan"
              />
            </div>
            <div>
              <span className="text-xs text-gray-500">Max Price</span>
              <input
                type="range"
                min="0"
                max="10000"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                className="w-full accent-neon-cyan"
              />
            </div>
          </div>
        </div>

        {/* In stock toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({ inStock: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                filters.inStock ? 'bg-neon-cyan' : 'bg-dark-400'
              }`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  filters.inStock ? 'translate-x-4' : ''
                }`} />
              </div>
            </div>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
              In Stock Only
            </span>
          </label>
        </div>

        {/* Quick price presets */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Under $50', min: 0, max: 50 },
              { label: '$50-200', min: 50, max: 200 },
              { label: '$200-500', min: 200, max: 500 },
              { label: '$500+', min: 500, max: 10000 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setFilters({ minPrice: preset.min, maxPrice: preset.max })}
                className="px-3 py-2 text-xs text-gray-400 border border-white/5 rounded-lg hover:border-neon-cyan/30 hover:text-neon-cyan transition-all duration-200"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
