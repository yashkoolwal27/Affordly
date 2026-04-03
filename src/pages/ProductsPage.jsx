// ==========================================
// Products Page
// ==========================================
// Product listing with sidebar filters, search, and pagination.

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const {
    products, loading, error,
    currentPage, totalPages, totalCount,
    filters, setFilters, setPage, fetchProducts,
  } = useProductStore();

  // Apply URL params as filters on mount
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    if (category || search) {
      setFilters({ category, search });
      setLocalSearch(search);
    }
  }, [searchParams, setFilters]);

  // Fetch products whenever filters or page change
  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage, fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ search: localSearch });
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-2">
            {filters.category
              ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}`
              : 'All Products'}
          </h1>
          <p className="text-gray-500">
            {totalCount} product{totalCount !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Search bar + filter toggle */}
        <div className="flex gap-3 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search products..."
              className="input-field pl-12"
              id="products-search"
            />
          </form>
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden btn-outline !px-4 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <div className="hidden lg:block w-64 shrink-0">
            <ProductFilters isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
          </div>

          {/* Mobile filters */}
          <div className="lg:hidden">
            <ProductFilters isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
          </div>

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner text="Loading products..." />
            ) : error ? (
              <div className="glass-card p-12 text-center">
                <p className="text-red-400 mb-2">Error loading products</p>
                <p className="text-gray-500 text-sm">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-400 mb-2">No products found</p>
                <p className="text-gray-600 text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn-ghost !p-2 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-neon-cyan text-dark-900'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn-ghost !p-2 disabled:opacity-30"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
