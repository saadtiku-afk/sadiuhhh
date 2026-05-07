import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Users, ShoppingCart, DollarSign, Plus, Edit3, Trash2, X, TrendingUp, Upload, Image, Film } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Product } from '../types';

const AdminDashboard: React.FC = () => {
  const { isDark, user, products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Product form state
  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'Dumbbells' as string,
    images: [] as string[], video: '', stock: '', rating: '4.5', featured: false, bestSeller: false,
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'} px-4`}>
        <p className="text-6xl mb-4">🔐</p>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>You need admin privileges to access this page</p>
        <button onClick={() => navigate('/signin')} className="px-6 py-3 gold-gradient text-white font-medium rounded-xl text-sm">
          Sign In as Admin
        </button>
      </div>
    );
  }

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', originalPrice: '', category: 'Dumbbells', images: [], video: '', stock: '', rating: '4.5', featured: false, bestSeller: false });
    setEditingProduct(null);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      images: [...product.images],
      video: product.video || '',
      stock: product.stock.toString(),
      rating: product.rating.toString(),
      featured: product.featured,
      bestSeller: product.bestSeller,
    });
    setShowProductModal(true);
  };

  // Handle image files from gallery
  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setForm(prev => ({ ...prev, images: [...prev.images, result] }));
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset input
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Handle video file from gallery
  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        setForm(prev => ({ ...prev, video: result }));
      }
    };
    reader.readAsDataURL(file);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removeVideo = () => {
    setForm(prev => ({ ...prev, video: '' }));
  };

  const handleSaveProduct = () => {
    if (!form.name || !form.price || !form.stock) return;
    if (form.images.length === 0) return;

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      category: form.category as Product['category'],
      images: form.images,
      video: form.video || undefined,
      stock: parseInt(form.stock),
      rating: parseFloat(form.rating),
      reviewCount: editingProduct?.reviewCount || 0,
      featured: form.featured,
      bestSeller: form.bestSeller,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    setShowProductModal(false);
    resetForm();
  };

  const stats = [
    { icon: DollarSign, label: 'Revenue', value: `$${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}`, change: '+12.5%' },
    { icon: ShoppingCart, label: 'Orders', value: orders.length.toString(), change: '+8.2%' },
    { icon: Package, label: 'Products', value: products.length.toString(), change: '+3' },
    { icon: Users, label: 'Customers', value: '1,247', change: '+5.1%' },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'products' as const, label: 'Products' },
    { id: 'orders' as const, label: 'Orders' },
  ];

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-gold transition-colors ${
    isDark ? 'bg-dark-card border-dark-border text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'
  }`;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-dark-surface border-dark-border' : 'bg-cream/30 border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back, {user.name}</p>
            </div>
            <div className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'gold-gradient text-white'
                      : isDark ? 'bg-dark-card text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-5 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/50 border border-gray-100'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                      <stat.icon size={18} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                      <TrendingUp size={12} /> {stat.change}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  <p className="text-xl font-bold mt-1">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className={`rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/50 border border-gray-100'}`}>
              <div className="p-5 border-b border-gray-200 dark:border-dark-border">
                <h3 className="font-bold text-lg">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
                      <th className="text-left p-4 font-medium text-gray-500">Order ID</th>
                      <th className="text-left p-4 font-medium text-gray-500">Date</th>
                      <th className="text-left p-4 font-medium text-gray-500">Items</th>
                      <th className="text-left p-4 font-medium text-gray-500">Total</th>
                      <th className="text-left p-4 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-gray-400">No orders yet</td></tr>
                    ) : (
                      orders.slice(0, 5).map(order => (
                        <tr key={order.id} className={`border-b last:border-0 ${isDark ? 'border-dark-border' : 'border-gray-50'}`}>
                          <td className="p-4 font-mono text-xs">{order.id}</td>
                          <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="p-4">{order.items.length} items</td>
                          <td className="p-4 font-medium text-gold">${order.total.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">All Products ({products.length})</h3>
              <button
                onClick={() => { resetForm(); setShowProductModal(true); }}
                className="px-4 py-2.5 gold-gradient text-white text-sm font-medium rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {products.map(product => (
                <div
                  key={product.id}
                  className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/50 border border-gray-100'}`}
                >
                  <img src={product.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                      {product.featured && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">Featured</span>}
                      {product.bestSeller && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">Best Seller</span>}
                    </div>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{product.category} • Stock: {product.stock}</p>
                    <p className="font-bold text-gold text-sm mt-1">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(product)}
                      className={`p-2.5 rounded-lg ${isDark ? 'hover:bg-dark-surface text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-black'} transition-colors`}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="p-2.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    {deleteConfirm === product.id && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => { deleteProduct(product.id); setDeleteConfirm(null); }} className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg">Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} className={`px-3 py-1.5 text-xs font-medium rounded-lg ${isDark ? 'bg-dark-surface text-gray-300' : 'bg-gray-100 text-gray-600'}`}>No</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-bold text-lg mb-6">Manage Orders ({orders.length})</h3>
            {orders.length === 0 ? (
              <div className={`p-12 rounded-2xl text-center ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/50'}`}>
                <ShoppingCart size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className={`p-5 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/50 border border-gray-100'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="font-mono text-sm font-bold">{order.id}</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(order.date).toLocaleDateString()} • {order.items.length} items
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gold">${order.total.toFixed(2)}</span>
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as 'pending' | 'processing' | 'shipped' | 'delivered')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${isDark ? 'bg-dark-surface border-dark-border text-white' : 'bg-white border-gray-200'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map(item => (
                        <div key={item.product.id} className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/5">
                          <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                          <span className="text-xs">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setShowProductModal(false); resetForm(); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 ${
                isDark ? 'bg-dark-bg border border-dark-border' : 'bg-white border border-gray-100'
              } shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => { setShowProductModal(false); resetForm(); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5 block">Product Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5 block">Category *</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                      {['Dumbbells', 'Gym Wear', 'Supplements', 'Machines', 'Accessories'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Product description"
                    rows={3}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5 block">Price *</label>
                    <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5 block">Original Price</label>
                    <input type="number" step="0.01" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="0.00" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5 block">Stock *</label>
                    <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" className={inputClass} />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 block">
                    Product Images * <span className="text-gold normal-case tracking-normal">(Select from gallery)</span>
                  </label>

                  {/* Upload button */}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFiles}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                      isDark
                        ? 'border-dark-border hover:border-gold/40 hover:bg-dark-card'
                        : 'border-gray-200 hover:border-gold/40 hover:bg-cream/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-dark-surface' : 'bg-gray-100'}`}>
                      <Image size={22} className="text-gold" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Click to upload images</p>
                      <p className="text-xs text-gray-500 mt-0.5">PNG, JPG, WEBP up to 10MB each</p>
                    </div>
                  </label>

                  {/* Image Previews */}
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-gold/50 transition-colors">
                          <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-lg"
                          >
                            ×
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-gold text-white text-[8px] font-bold rounded uppercase">Main</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Upload Section */}
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 block">
                    Product Video <span className="text-gold normal-case tracking-normal">(Optional)</span>
                  </label>

                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFile}
                    className="hidden"
                    id="video-upload"
                  />

                  {form.video ? (
                    <div className={`relative rounded-2xl overflow-hidden border ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                      <video src={form.video} controls className="w-full max-h-48 object-cover rounded-2xl" />
                      <button
                        onClick={removeVideo}
                        className="absolute top-2 right-2 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="video-upload"
                      className={`flex items-center justify-center gap-3 p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                        isDark
                          ? 'border-dark-border hover:border-gold/40 hover:bg-dark-card'
                          : 'border-gray-200 hover:border-gold/40 hover:bg-cream/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-dark-surface' : 'bg-gray-100'}`}>
                        <Film size={18} className="text-gold" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Click to upload video</p>
                        <p className="text-xs text-gray-500 mt-0.5">MP4, MOV, WEBM up to 50MB</p>
                      </div>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5 block">Rating</label>
                    <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className={inputClass} />
                  </div>
                  <div className="flex flex-col justify-end gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 accent-[#C9A96E]" />
                      <span className="text-sm">Featured Product</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.bestSeller} onChange={e => setForm({ ...form, bestSeller: e.target.checked })} className="w-4 h-4 rounded border-gray-300 accent-[#C9A96E]" />
                      <span className="text-sm">Best Seller</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => { setShowProductModal(false); resetForm(); }}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-medium border ${
                      isDark ? 'border-dark-border text-gray-300' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={form.images.length === 0}
                    className="flex-1 py-3.5 gold-gradient text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
