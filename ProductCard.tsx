import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { isDark, addToCart, toggleWishlist, isInWishlist } = useApp();
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className={`rounded-3xl overflow-hidden transition-all duration-500 group-hover:-translate-y-1 ${
        isDark
          ? 'bg-dark-card border border-dark-border group-hover:border-gold/20'
          : 'bg-white border border-gray-100/80 group-hover:border-gold/20 group-hover:luxury-shadow'
      }`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-surface dark:to-dark-card">
          <Link to={`/product/${product.id}`}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-red-500/30">
                -{discount}%
              </span>
            )}
            {product.bestSeller && (
              <span className="px-2.5 py-1 gold-gradient text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-gold/30">
                Best Seller
              </span>
            )}
            {product.featured && !product.bestSeller && (
              <span className="px-2.5 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-blue-500/30">
                Featured
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleWishlist(product.id)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                inWishlist
                  ? 'bg-red-500 text-white shadow-red-500/30'
                  : isDark ? 'bg-dark-bg/60 glass-subtle text-white/80 hover:bg-red-500 hover:text-white' : 'bg-white/80 glass-subtle text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
            </motion.button>
            <Link to={`/product/${product.id}`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${
                  isDark ? 'bg-dark-bg/60 glass-subtle text-white/80' : 'bg-white/80 glass-subtle text-gray-600'
                }`}
              >
                <Eye size={15} />
              </motion.div>
            </Link>
          </div>

          {/* Quick Add - slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => addToCart(product)}
              className="w-full py-3 gold-gradient text-white text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/30 transition-shadow"
            >
              <ShoppingBag size={14} /> Add to Cart
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 pb-5">
          <Link to={`/product/${product.id}`}>
            <p className={`text-[10px] uppercase tracking-[0.15em] font-semibold mb-1.5 ${
              isDark ? 'text-gold' : 'text-gold-dark'
            }`}>
              {product.category}
            </p>
            <h3 className={`font-semibold text-sm mb-2.5 line-clamp-2 leading-snug transition-colors duration-300 ${
              isDark ? 'text-white group-hover:text-gold' : 'text-black group-hover:text-gold-dark'
            }`}>
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : isDark ? 'text-gray-600' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className={`text-xs line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          {product.stock < 10 && (
            <p className="text-[11px] text-red-500 mt-2 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Only {product.stock} left
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

// Skeleton Loader
export const ProductSkeleton: React.FC = () => {
  const { isDark } = useApp();
  return (
    <div className={`rounded-3xl overflow-hidden ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
      <div className="aspect-square skeleton" />
      <div className="p-4 pb-5 space-y-3">
        <div className="h-2.5 w-14 skeleton rounded-full" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="flex gap-1">
          <div className="h-3 w-20 skeleton rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 skeleton rounded" />
          <div className="h-4 w-20 skeleton rounded" />
        </div>
      </div>
    </div>
  );
};
