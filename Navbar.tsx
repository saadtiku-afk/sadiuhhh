import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Heart, User, Sun, Moon, Search, LogOut, Shield } from 'lucide-react';
import { useApp } from '../store/AppContext';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme, cartCount, isAuthenticated, user, logout, wishlist } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? isDark
              ? 'bg-dark-bg/80 glass-effect shadow-2xl shadow-black/30'
              : 'bg-white/80 glass-effect shadow-2xl shadow-black/[0.03]'
            : isDark ? 'bg-transparent' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-shadow duration-500">
                  <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-base sm:text-xl font-extrabold tracking-tight leading-none ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  FITNESS
                </span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-gold leading-none mt-0.5">
                  EASE
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-[13px] font-semibold tracking-wide uppercase transition-colors duration-300 ${
                    isActive(link.path)
                      ? 'text-gold'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] gold-gradient rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button onClick={() => navigate('/shop')} className={`p-2.5 rounded-2xl transition-all duration-300 ${isDark ? 'hover:bg-dark-card text-gray-400 hover:text-white' : 'hover:bg-gray-50 text-gray-500 hover:text-black'}`}>
                <Search size={17} strokeWidth={1.8} />
              </button>
              <button onClick={toggleTheme} className={`p-2.5 rounded-2xl transition-all duration-300 ${isDark ? 'hover:bg-dark-card text-gray-400 hover:text-white' : 'hover:bg-gray-50 text-gray-500 hover:text-black'}`}>
                {isDark ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
              </button>
              <Link to="/shop?wishlist=true" className={`p-2.5 rounded-2xl transition-all duration-300 relative ${isDark ? 'hover:bg-dark-card text-gray-400 hover:text-white' : 'hover:bg-gray-50 text-gray-500 hover:text-black'}`}>
                <Heart size={17} strokeWidth={1.8} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 gold-gradient text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className={`p-2.5 rounded-2xl transition-all duration-300 relative ${isDark ? 'hover:bg-dark-card text-gray-400 hover:text-white' : 'hover:bg-gray-50 text-gray-500 hover:text-black'}`}>
                <ShoppingBag size={17} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 gold-gradient text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-dark-border' : 'bg-gray-200'}`} />

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all duration-300 ${
                      isDark ? 'hover:bg-dark-card text-gray-300' : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl gold-gradient flex items-center justify-center shadow-md shadow-gold/20">
                      <span className="text-white text-xs font-bold">{user?.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-[13px] font-medium">{user?.name}</span>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 top-14 w-52 rounded-2xl shadow-2xl border overflow-hidden ${
                          isDark ? 'bg-dark-card border-dark-border shadow-black/40' : 'bg-white border-gray-100 shadow-black/10'
                        }`}
                      >
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className={`flex items-center gap-2.5 px-5 py-3.5 text-sm font-medium transition-colors ${
                              isDark ? 'hover:bg-dark-surface text-gold' : 'hover:bg-cream text-gold-dark'
                            }`}
                          >
                            <Shield size={16} /> Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/orders"
                          className={`flex items-center gap-2.5 px-5 py-3.5 text-sm transition-colors ${
                            isDark ? 'hover:bg-dark-surface text-gray-300' : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <ShoppingBag size={16} /> My Orders
                        </Link>
                        <div className={`border-t ${isDark ? 'border-dark-border' : 'border-gray-100'}`} />
                        <button
                          onClick={logout}
                          className={`w-full flex items-center gap-2.5 px-5 py-3.5 text-sm transition-colors ${
                            isDark ? 'hover:bg-dark-surface text-red-400' : 'hover:bg-gray-50 text-red-500'
                          }`}
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="flex items-center gap-2 px-5 py-2.5 gold-gradient text-white text-[13px] font-semibold rounded-2xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <User size={15} /> Sign In
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-1">
              <button onClick={toggleTheme} className={`p-2 rounded-xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link to="/cart" className={`p-2 rounded-xl relative ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 gold-gradient text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] ${
                isDark ? 'bg-dark-bg' : 'bg-white'
              } shadow-2xl`}
            >
              <div className="p-6 pt-24">
                {/* Logo in mobile menu */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200 dark:border-dark-border">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-gold/20">
                    <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className={`font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>FITNESS</span>
                    <span className="text-[10px] font-semibold tracking-[0.3em] text-gold ml-1">EASE</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`px-4 py-3.5 rounded-2xl text-base font-medium transition-all duration-300 ${
                          isActive(link.path)
                            ? 'gold-gradient text-white shadow-lg shadow-gold/20'
                            : isDark ? 'text-gray-300 hover:bg-dark-card' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className={`my-6 border-t ${isDark ? 'border-dark-border' : 'border-gray-100'}`} />

                <div className="flex flex-col gap-1">
                  {isAuthenticated ? (
                    <>
                      <div className={`px-4 py-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span className="text-[10px] uppercase tracking-widest font-semibold">Signed in as</span>
                        <p className={`font-semibold mt-1 text-sm ${isDark ? 'text-white' : 'text-black'}`}>{user?.name}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className={`px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 ${isDark ? 'text-gold hover:bg-dark-card' : 'text-gold-dark hover:bg-cream'}`}>
                          <Shield size={18} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/shop?wishlist=true" className={`px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 ${isDark ? 'text-gray-300 hover:bg-dark-card' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Heart size={18} /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                      </Link>
                      <button onClick={logout} className="px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                        <LogOut size={18} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" className="px-4 py-3.5 gold-gradient text-white text-center rounded-2xl font-semibold shadow-lg shadow-gold/20">
                        Sign In
                      </Link>
                      <Link to="/signup" className={`px-4 py-3.5 text-center rounded-2xl font-medium ${isDark ? 'text-gray-300 hover:bg-dark-card' : 'text-gray-600 hover:bg-gray-50'}`}>
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default Navbar;
