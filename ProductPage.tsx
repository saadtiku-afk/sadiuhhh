import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Minus, Plus, ChevronRight, Play, Truck, Shield, RotateCcw } from 'lucide-react';
import { useApp } from '../store/AppContext';
import ProductCard from '../components/ProductCard';
import { sampleReviews } from '../data/products';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark, products, addToCart, toggleWishlist, isInWishlist } = useApp();
  const product = products.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [showVideo, setShowVideo] = useState(false);

  if (!product) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'}`}>
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <Link to="/shop" className="text-gold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'}`}>
      {/* Breadcrumb */}
      <div className={`${isDark ? 'bg-dark-surface border-dark-border' : 'bg-cream/30 border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}>Home</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link to="/shop" className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}>Shop</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}>{product.category}</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gold font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
              {showVideo && product.video ? (
                <video
                  src={product.video}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg">-{discount}%</span>
                )}
                {product.bestSeller && (
                  <span className="px-3 py-1.5 gold-gradient text-white text-xs font-bold rounded-lg">Best Seller</span>
                )}
              </div>

              {product.video && (
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/50 glass-effect text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <Play size={18} fill="white" />
                </button>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedImage(i); setShowVideo(false); }}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i && !showVideo ? 'border-gold' : isDark ? 'border-dark-border' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {product.video && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex items-center justify-center transition-colors ${
                    showVideo ? 'border-gold' : isDark ? 'border-dark-border bg-dark-card' : 'border-gray-200 bg-gray-100'
                  }`}
                >
                  <Play size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">{product.category}</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-gray-300'} />
                ))}
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className={`text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-md">
                  Save ${(product.originalPrice! - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 10 ? 'text-emerald-500' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Quantity:</span>
              <div className={`flex items-center rounded-xl border ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`w-10 h-10 flex items-center justify-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className={`w-10 h-10 flex items-center justify-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => { addToCart(product, quantity); }}
                disabled={product.stock === 0}
                className="flex-1 py-4 gold-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} /> Add to Cart — ${(product.price * quantity).toFixed(2)}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-colors ${
                  inWishlist ? 'bg-red-500 border-red-500 text-white' : isDark ? 'border-dark-border text-gray-300 hover:border-red-500 hover:text-red-500' : 'border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: 'Warranty' },
                { icon: RotateCcw, label: '30-Day Returns' },
              ].map((f, i) => (
                <div key={i} className={`p-3 rounded-xl text-center ${isDark ? 'bg-dark-card' : 'bg-cream/50'}`}>
                  <f.icon size={20} className="mx-auto mb-1 text-gold" />
                  <span className="text-xs font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12 sm:mt-16">
          <div className="flex gap-6 border-b border-gray-200 dark:border-dark-border mb-6">
            {(['description', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab ? 'border-gold text-gold' : isDark ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviewCount})` : tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`prose max-w-none ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <p className="text-sm sm:text-base leading-relaxed">{product.description}</p>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-cream/50'}`}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Category</p>
                  <p className="font-semibold mt-1">{product.category}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-cream/50'}`}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Rating</p>
                  <p className="font-semibold mt-1">{product.rating}/5</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-cream/50'}`}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Stock</p>
                  <p className="font-semibold mt-1">{product.stock} units</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-cream/50'}`}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">SKU</p>
                  <p className="font-semibold mt-1">FE-{product.id.padStart(4, '0')}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {sampleReviews.map(review => (
                <div key={review.id} className={`p-4 sm:p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/30'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{review.userName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.userName}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'text-gold fill-gold' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{review.comment}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
