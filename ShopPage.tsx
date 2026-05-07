import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';
import { useApp } from '../store/AppContext';
import ProductCard, { ProductSkeleton } from '../components/ProductCard';
import { SortOption, CategoryType } from '../types';

const ShopPage: React.FC = () => {
  const { isDark, products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showWishlist, setShowWishlist] = useState(searchParams.get('wishlist') === 'true');
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const allCategories: string[] = ['All', 'Dumbbells', 'Gym Wear', 'Supplements', 'Machines', 'Accessories'];

  const filtered = useMemo(() => {
    let result = [...products];

    if (showWishlist) {
      // This is handled via the wishlist filter - we need wishlist items
      return result;
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }

    return result;
  }, [products, search, selectedCategory, priceRange, minRating, sortBy, showWishlist]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setPriceRange([0, 5000]);
    setMinRating(0);
    setSortBy('featured');
    setShowWishlist(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-dark-surface border-dark-border' : 'bg-cream/30 border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {showWishlist ? 'My Wishlist' : 'Shop All'}
            </h1>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {showWishlist ? 'Products you\'ve saved for later' : `${filtered.length} products found`}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-gold transition-colors ${
                isDark ? 'bg-dark-card border-dark-border text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'
              }`}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                showFilters
                  ? 'gold-gradient text-white border-transparent'
                  : isDark ? 'border-dark-border text-gray-300 hover:border-gold' : 'border-gray-200 text-gray-600 hover:border-gold'
              }`}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-gold ${
                isDark ? 'bg-dark-card border-dark-border text-white' : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="name">Name A-Z</option>
            </select>

            <div className={`hidden lg:flex rounded-xl border overflow-hidden ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
              <button
                onClick={() => setGridCols(3)}
                className={`p-3 ${gridCols === 3 ? 'gold-gradient text-white' : isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-3 ${gridCols === 4 ? 'gold-gradient text-white' : isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setShowWishlist(false); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat && !showWishlist
                  ? 'gold-gradient text-white'
                  : isDark ? 'bg-dark-card text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowWishlist(!showWishlist)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              showWishlist
                ? 'bg-red-500 text-white'
                : isDark ? 'bg-dark-card text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-black'
            }`}
          >
            ❤️ Wishlist
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/30 border border-gray-100'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-gold hover:underline">Clear All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 block">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-dark-surface border-dark-border text-white' : 'bg-white border-gray-200'}`}
                    placeholder="Min"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-dark-surface border-dark-border text-white' : 'bg-white border-gray-200'}`}
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 block">Minimum Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(minRating === r ? 0 : r)}
                      className={`px-3 py-2 rounded-lg text-sm ${minRating >= r ? 'gold-gradient text-white' : isDark ? 'bg-dark-surface text-gray-400' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {r}★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 block">Quick Filters</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setPriceRange([0, 50]); }}
                    className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-dark-surface text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-black'}`}
                  >
                    Under $50
                  </button>
                  <button
                    onClick={() => { setPriceRange([50, 200]); }}
                    className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-dark-surface text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-black'}`}
                  >
                    $50 - $200
                  </button>
                  <button
                    onClick={() => { setPriceRange([200, 5000]); }}
                    className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-dark-surface text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-black'}`}
                  >
                    $200+
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="px-6 py-3 gold-gradient text-white font-medium rounded-xl text-sm">
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${
            gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}>
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
