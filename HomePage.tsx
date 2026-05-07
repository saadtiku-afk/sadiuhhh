import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, TrendingUp, Star } from 'lucide-react';
import { useApp } from '../store/AppContext';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { categories, blogPosts } from '../data/products';

const HomePage: React.FC = () => {
  const { isDark, products } = useApp();
  const bestSellers = products.filter(p => p.bestSeller).slice(0, 8);
  const featured = products.filter(p => p.featured).slice(0, 4);

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: RotateCcw, title: '30-Day Returns', desc: 'Hassle-free returns' },
    { icon: Headphones, title: '24/7 Support', desc: 'Expert assistance' },
  ];

  return (
    <div className={isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'}>
      {/* Hero */}
      <HeroSlider />

      {/* Features Bar */}
      <div className={`${isDark ? 'bg-dark-surface border-dark-border' : 'bg-cream/50 border-gray-100'} border-y`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0">
                  <feature.icon size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">{feature.title}</h4>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-gold text-xs sm:text-sm font-semibold uppercase tracking-widest">Collections</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">Shop by Category</h2>
          <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Find the perfect equipment for your fitness goals
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <span className="text-2xl sm:text-3xl mb-1 block">{cat.icon}</span>
                    <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg">{cat.name}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-0.5">{cat.count} Products</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className={`${isDark ? 'bg-dark-surface' : 'bg-cream/30'} py-12 sm:py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4"
          >
            <div>
              <span className="text-gold text-xs sm:text-sm font-semibold uppercase tracking-widest">Top Picks</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">Best Sellers</h2>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-gold font-medium text-sm hover:gap-3 transition-all"
            >
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=80"
            alt="Trending"
            className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="p-6 sm:p-10 lg:p-16 max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-gold" size={20} />
                <span className="text-gold text-sm font-semibold uppercase tracking-widest">Limited Offer</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Up to <span className="gold-text">30% Off</span><br />Premium Equipment
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mb-6 lg:mb-8">
                Transform your home gym with professional-grade equipment at unbeatable prices. Sale ends soon!
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm sm:text-base"
                >
                  Shop the Sale <ArrowRight size={18} />
                </Link>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className={`${isDark ? 'bg-dark-surface' : 'bg-cream/30'} py-12 sm:py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="text-gold text-xs sm:text-sm font-semibold uppercase tracking-widest">Handpicked</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">Featured Products</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-gold text-xs sm:text-sm font-semibold uppercase tracking-widest">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">What Our Customers Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { name: 'Alex Thompson', role: 'Personal Trainer', text: 'Fitness Ease has completely transformed my home gym. The quality of their equipment is unmatched. Highly recommended for serious athletes.', rating: 5 },
            { name: 'Sarah Mitchell', role: 'CrossFit Athlete', text: 'Amazing products and even better customer service. The dumbbells I ordered arrived perfectly packaged and the quality exceeds the price.', rating: 5 },
            { name: 'David Park', role: 'Fitness Enthusiast', text: 'Finally found a brand that delivers premium quality at fair prices. The supplement line is top-notch and ships super fast.', rating: 5 },
          ].map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={16} className="text-gold fill-gold" />
                ))}
              </div>
              <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog Preview */}
      <section className={`${isDark ? 'bg-dark-surface' : 'bg-cream/30'} py-12 sm:py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4"
          >
            <div>
              <span className="text-gold text-xs sm:text-sm font-semibold uppercase tracking-widest">Our Blog</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">Latest Articles</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`group rounded-2xl overflow-hidden ${
                  isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">{post.category}</span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{post.date}</span>
                  </div>
                  <h3 className={`font-bold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-gold transition-colors ${
                    isDark ? 'text-white' : 'text-black'
                  }`}>
                    {post.title}
                  </h3>
                  <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {post.excerpt}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`text-center p-8 sm:p-12 lg:p-16 rounded-3xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/50'}`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your <span className="gold-text">Fitness Journey</span>?
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Join thousands of athletes who trust Fitness Ease for their premium fitness equipment and supplements.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Shop Now <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
