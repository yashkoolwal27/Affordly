import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import useSellerStore from '../../store/useSellerStore';
import SellerProductForm from './SellerProductForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function SellerProducts() {
  const { products, loading, fetchMyProducts, deleteProduct } = useSellerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success('Product deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete product');
      }
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner text="Loading your products..." />;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 pt-24 md:pt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">My Products</h1>
          <p className="text-gray-400">Manage your store inventory</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-neon flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-gray-400">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="glass-card overflow-hidden group">
              <div className="aspect-[4/3] relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(product)}
                    className="p-2 rounded-lg bg-black/50 backdrop-blur-md text-white hover:text-neon-cyan transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg bg-black/50 backdrop-blur-md text-white hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-white truncate">{product.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{product.category}</p>
                  </div>
                  <p className="text-neon-green font-bold">₹{product.price}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                  <span className="text-gray-400">Stock</span>
                  <span className={product.stock > 10 ? 'text-green-400' : 'text-red-400'}>
                    {product.stock} units
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <SellerProductForm
        isOpen={isFormOpen}
        onClose={closeForm}
        editProduct={editingProduct}
      />
    </div>
  );
}
