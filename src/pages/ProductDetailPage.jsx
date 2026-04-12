// ==========================================
// Product Detail Page
// ==========================================
// Full product view with image, info, quantity selector,
// add-to-cart, wishlist, and related products.

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Heart, Minus, Plus,
  ArrowLeft, Package, Truck, ShieldCheck, Eye,
} from 'lucide-react';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { currentProduct: product, fetchProduct, fetchRelatedProducts, loading, error } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const { isWishlisted, toggleItem } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product details
  useEffect(() => {
    if (id) {
      fetchProduct(id);
      setQuantity(1);
    }
  }, [id, fetchProduct]);

  // Fetch related products once we have the product
  useEffect(() => {
    if (product) {
      fetchRelatedProducts(product.category, product.id).then(setRelatedProducts);
    }
  }, [product, fetchRelatedProducts]);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addItem(product, quantity);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { background: '#12121a', color: '#fff', border: '1px solid rgba(0,240,255,0.2)' },
    });
  };

  const handleWishlist = () => {
    const added = toggleItem(product);
    toast(added ? 'Added to wishlist!' : 'Removed from wishlist', {
      icon: added ? '❤️' : '💔',
      style: { background: '#12121a', color: '#fff', border: '1px solid rgba(0,240,255,0.2)' },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24">
        <LoadingSpinner size="lg" text="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <p className="text-red-400 mb-2">Product not found</p>
          <p className="text-gray-500 text-sm mb-4">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <Link to="/products" className="btn-outline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-white transition-colors capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-400">{product.name}</span>
        </div>

        {/* Product details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card overflow-hidden aspect-square"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark-600">
                <Eye className="w-20 h-20 text-gray-700" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="badge-cyan capitalize w-fit mb-3">{product.category}</span>

            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-display font-bold text-white">
                ₹{Number(product.price).toFixed(2)}
              </span>
              {isOutOfStock ? (
                <span className="badge-red">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="badge-orange">Only {product.stock} left</span>
              ) : (
                <span className="badge-green">In Stock</span>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed mb-8">
              {product.description || 'No description available for this product.'}
            </p>

            {/* Quantity selector + actions */}
            {!isOutOfStock && (
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {/* Quantity */}
                <div className="flex items-center gap-3 bg-dark-600 rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-white font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  className="btn-neon flex items-center gap-2 flex-1 justify-center"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleWishlist}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-200 ${
                    wishlisted
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-dark-600 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div className="glass-card p-4 mb-8 border border-red-500/20">
                <p className="text-red-400 text-sm font-medium">
                  This product is currently out of stock. Check back later!
                </p>
              </div>
            )}

            {/* Product features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-auto">
              {[
                { icon: Package, label: 'Quality Assured' },
                { icon: Truck, label: 'Fast Delivery' },
                { icon: ShieldCheck, label: 'Secure Purchase' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 p-3 rounded-xl bg-dark-700/50 text-gray-400 text-sm"
                >
                  <Icon className="w-4 h-4 text-neon-cyan" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
