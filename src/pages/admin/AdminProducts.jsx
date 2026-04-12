// ==========================================
// Admin Products Page
// ==========================================
// Product management: list, add, edit, delete.

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import ProductForm from '../../components/admin/ProductForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const { products, loading, fetchAllProducts, deleteProduct } = useAdminStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    const result = await deleteProduct(id);
    if (result.success) {
      toast.success('Product deleted');
    } else {
      toast.error('Failed to delete product');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditProduct(null);
  };

  // Filter products by search
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !products.length) {
    return <LoadingSpinner size="lg" text="Loading products..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <button onClick={handleAdd} className="btn-neon flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-11"
        />
      </div>

      {/* Product table */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider p-4">Product</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider p-4 hidden sm:table-cell">Category</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider p-4">Price</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider p-4 hidden md:table-cell">Stock</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider p-4 hidden lg:table-cell">Featured</th>
                  <th className="text-right text-xs text-gray-500 uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark-600 overflow-hidden shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <span className="text-white text-sm font-medium truncate max-w-[200px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="badge-cyan capitalize text-xs">{product.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">₹{Number(product.price).toFixed(2)}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-sm ${product.stock <= 0 ? 'text-red-400' : product.stock <= 5 ? 'text-neon-orange' : 'text-gray-400'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {product.featured ? (
                        <span className="badge-green text-xs">Yes</span>
                      ) : (
                        <span className="text-gray-600 text-xs">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="w-8 h-8 rounded-lg bg-dark-500 text-gray-400 hover:text-neon-cyan flex items-center justify-center transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="w-8 h-8 rounded-lg bg-dark-500 text-gray-400 hover:text-red-400 flex items-center justify-center transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product form modal */}
      <ProductForm
        isOpen={formOpen}
        onClose={handleFormClose}
        editProduct={editProduct}
      />
    </div>
  );
}
