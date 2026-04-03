// ==========================================
// FeaturedProducts Component
// ==========================================
// Displays a grid of featured products on the homepage.

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProductStore from '../../store/useProductStore';
import ProductCard from '../products/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FeaturedProducts() {
  const { featuredProducts, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (!featuredProducts.length) {
    return null; // Don't show section if no featured products
  }

  return (
    <section className="py-20">
      <div className="section-container">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-3">
              Featured Products
            </h2>
            <p className="text-gray-500">Hand-picked premium items just for you</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 text-neon-cyan hover:text-white transition-colors text-sm font-medium"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Products grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredProducts.slice(0, 8).map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile view all link */}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/products" className="btn-outline inline-flex items-center gap-2">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
