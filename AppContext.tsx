import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, Toast, ShippingInfo } from '../types';
import { products as initialProducts } from '../data/products';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  // Orders
  orders: Order[];
  placeOrder: (shippingInfo: ShippingInfo) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  // Theme
  isDark: boolean;
  toggleTheme: () => void;
  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  // Mobile Cart
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = (): AppState => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// Load from localStorage
const loadState = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => loadState('fe_user', null));
  const [cart, setCart] = useState<CartItem[]>(() => loadState('fe_cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadState('fe_wishlist', []));
  const [products, setProducts] = useState<Product[]>(() => loadState('fe_products', initialProducts));
  const [orders, setOrders] = useState<Order[]>(() => loadState('fe_orders', []));
  const [isDark, setIsDark] = useState<boolean>(() => loadState('fe_dark', false));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(() => loadState('fe_users', [
    { id: 'admin1', name: 'Admin', email: 'saadtiku@gmail.com', password: 'admin123', role: 'admin' as const },
  ]));

  // Persist state
  useEffect(() => { localStorage.setItem('fe_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('fe_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('fe_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('fe_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('fe_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('fe_dark', JSON.stringify(isDark)); }, [isDark]);
  useEffect(() => { localStorage.setItem('fe_users', JSON.stringify(users)); }, [users]);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

  // Toast
  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Auth
  const login = useCallback((email: string, password: string): boolean => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      showToast(`Welcome back, ${found.name}!`);
      return true;
    }
    showToast('Invalid email or password', 'error');
    return false;
  }, [users, showToast]);

  const signup = useCallback((name: string, email: string, password: string): boolean => {
    if (users.find(u => u.email === email)) {
      showToast('Email already exists', 'error');
      return false;
    }
    const isAdmin = email === 'saadtiku@gmail.com';
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: isAdmin ? 'admin' : 'user',
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    showToast('Account created successfully!');
    return true;
  }, [users, showToast]);

  const logout = useCallback(() => {
    setUser(null);
    showToast('Logged out successfully', 'info');
  }, [showToast]);

  // Cart
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`${product.name} added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // Wishlist
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const isIn = prev.includes(productId);
      if (isIn) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      }
      showToast('Added to wishlist');
      return [...prev, productId];
    });
  }, [showToast]);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  // Products
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
    showToast('Product added successfully');
  }, [showToast]);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    showToast('Product updated successfully');
  }, [showToast]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deleted successfully', 'info');
  }, [showToast]);

  // Orders
  const placeOrder = useCallback((shippingInfo: ShippingInfo): Order => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      userId: user?.id || 'guest',
      items: [...cart],
      total: cartTotal,
      status: 'pending',
      date: new Date().toISOString(),
      shippingInfo,
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    showToast('Order placed successfully!');
    return order;
  }, [user, cart, cartTotal, showToast]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast('Order status updated');
  }, [showToast]);

  const value: AppState = {
    user, isAuthenticated: !!user, login, signup, logout,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
    wishlist, toggleWishlist, isInWishlist,
    products, addProduct, updateProduct, deleteProduct,
    orders, placeOrder, updateOrderStatus,
    isDark, toggleTheme,
    toasts, showToast, removeToast,
    isCartOpen, setIsCartOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Toast Container Component
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();
  const colors = {
    success: 'from-emerald-600 to-emerald-500',
    error: 'from-red-600 to-red-500',
    info: 'from-blue-600 to-blue-500',
    warning: 'from-amber-600 to-amber-500',
  };
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`bg-gradient-to-r ${colors[toast.type]} text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 pointer-events-auto`}
          style={{ animation: 'slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
          <span className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {icons[toast.type]}
          </span>
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-white/60 hover:text-white transition-colors flex-shrink-0 text-lg leading-none">×</button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
