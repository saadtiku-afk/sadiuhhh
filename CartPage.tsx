import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useApp } from '../store/AppContext';

const CartPage: React.FC = () => {
  const { isDark, cart, removeFromCart, updateCartQuantity, cartTotal, cartCount, clearCart, setIsCartOpen } = useApp();

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'} px-4`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-cream dark:bg-dark-card flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gold" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Looks like you haven't added anything yet
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            Start Shopping <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'}`}>
      <div className={`${isDark ? 'bg-dark-surface border-dark-border' : 'bg-cream/30 border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className={`flex gap-4 p-4 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`}
                >
                  <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/product/${item.product.id}`}>
                          <h3 className="font-semibold text-sm sm:text-base hover:text-gold transition-colors line-clamp-2">{item.product.name}</h3>
                        </Link>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.product.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className={`flex items-center rounded-lg border ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-gold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Clear Cart
              </button>
              <Link to="/shop" className="text-sm text-gold hover:underline font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className={`sticky top-24 p-6 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/50 border border-gray-100'}`}>
              <h3 className="font-bold text-lg mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Shipping</span>
                  <span className="font-medium">{shipping === 0 ? <span className="text-emerald-500">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className={`border-t pt-3 ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-gold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {cartTotal < 100 && (
                <div className={`p-3 rounded-xl mb-4 text-center ${isDark ? 'bg-dark-surface' : 'bg-cream'}`}>
                  <p className="text-xs text-gray-500">Add <span className="font-bold text-gold">${(100 - cartTotal).toFixed(2)}</span> more for free shipping</p>
                </div>
              )}

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-gold ${
                    isDark ? 'bg-dark-surface border-dark-border text-white' : 'bg-white border-gray-200'
                  }`}
                />
                <button className="px-4 py-2.5 rounded-xl border border-gold text-gold text-sm font-medium hover:bg-gold hover:text-white transition-colors">
                  Apply
                </button>
              </div>

              <Link
                to="/checkout"
                className="w-full py-4 gold-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-4">
                <span className="text-xs text-gray-400">🔒 Secure Checkout</span>
                <span className="text-xs text-gray-400">💳 Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
