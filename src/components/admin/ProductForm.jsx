// ==========================================
// ProductForm Component
// ==========================================
// Modal form for adding/editing products with image upload.

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAdminStore from '../../store/useAdminStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['watches', 'fabrics', 'shoes'];

export default function ProductForm({ isOpen, onClose, editProduct = null }) {
  const { addProduct, updateProduct, uploadImage } = useAdminStore();

  const [formData, setFormData] = useState({
    name: '',
    category: 'watches',
    price: '',
    stock: '',
    description: '',
    image_url: '',
    featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        category: editProduct.category || 'watches',
        price: editProduct.price?.toString() || '',
        stock: editProduct.stock?.toString() || '',
        description: editProduct.description || '',
        image_url: editProduct.image_url || '',
        featured: editProduct.featured || false,
      });
      setImagePreview(editProduct.image_url || '');
    } else {
      setFormData({
        name: '', category: 'watches', price: '', stock: '',
        description: '', image_url: '', featured: false,
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [editProduct, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if new file selected
      if (imageFile) {
        const result = await uploadImage(imageFile);
        if (!result.success) throw new Error(result.error);
        imageUrl = result.url;
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        description: formData.description,
        image_url: imageUrl,
        featured: formData.featured,
      };

      if (editProduct) {
        const result = await updateProduct(editProduct.id, productData);
        if (!result.success) throw new Error(result.error);
        toast.success('Product updated!');
      } else {
        const result = await addProduct(productData);
        if (!result.success) throw new Error(result.error);
        toast.success('Product added!');
      }

      onClose();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-white">
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                    placeholder="e.g. Chronos Pro Watch"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-dark-700">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input-field"
                      required
                      placeholder="99.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="input-field"
                      required
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-[100px] resize-none"
                    rows={3}
                    placeholder="Product description..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Product Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover border border-white/10"
                      />
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-3 border border-dashed border-white/10 rounded-xl text-gray-400 hover:border-neon-cyan/30 hover:text-neon-cyan transition-all duration-200">
                        <Upload className="w-5 h-5" />
                        <span className="text-sm">
                          {imageFile ? imageFile.name : 'Choose image...'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Featured toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-neon-cyan"
                  />
                  <span className="text-sm text-gray-400">Mark as Featured</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-neon w-full flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
