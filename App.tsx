import React, { Suspense, lazy, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp, ToastContainer } from './store/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Eager load auth pages (small)
import { SignInPage, SignUpPage } from './pages/AuthPages';

// Loading fallback
const PageLoader: React.FC = () => {
  const { isDark } = useApp();
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-5 shadow-lg shadow-gold/20 animate-pulse">
          <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <span className={`font-extrabold tracking-tight text-sm ${isDark ? 'text-white' : 'text-black'}`}>FITNESS</span>
          <span className="text-[8px] font-semibold tracking-[0.3em] text-gold">EASE</span>
        </div>
        <div className="flex gap-1.5 justify-center mt-4">
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

// Simple pages
const OrdersPage: React.FC = () => {
  const { isDark, orders } = useApp();
  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'}`}>
      <div className={`${isDark ? 'bg-dark-surface border-dark-border' : 'bg-cream/30 border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold">My Orders</h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/50 border border-gray-100'}`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                  <div>
                    <p className="font-mono text-sm font-bold">{order.id}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-bold text-gold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/5">
                      <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="text-xs font-medium truncate max-w-[150px]">{item.product.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SimplePage: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  const { isDark } = useApp();
  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'}`}>
      <div className={`${isDark ? 'bg-dark-surface border-dark-border' : 'bg-cream/30 border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
          <p className={`text-sm sm:text-base max-w-lg mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

// Animated Routes
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/about" element={<SimplePage title="About Fitness Ease" subtitle="We're on a mission to make premium fitness equipment accessible to everyone. Founded by fitness enthusiasts, for fitness enthusiasts. Based in Dikhan, Kpk." />} />
            <Route path="/contact" element={<SimplePage title="Contact Us" subtitle="Get in touch with our team at hello@fitnessease.com or call +92 XXX-XXXXXXX. We're here to help! Located in Dikhan, Kpk." />} />
            <Route path="/blog" element={<SimplePage title="Blog" subtitle="Coming soon — expert training tips, nutrition guides, and product reviews." />} />
            <Route path="*" element={<SimplePage title="Page Not Found" subtitle="The page you're looking for doesn't exist." />} />
          </Routes>
        </motion.div>
      </Suspense>
    </AnimatePresence>
  );
};

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// App Content
const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <Router>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && (
        <>
          <ScrollToTop />
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </>
      )}
      <ToastContainer />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
