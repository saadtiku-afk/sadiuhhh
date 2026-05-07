import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { heroSlides } from '../data/products';

const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[current];

  const getCtaLink = (cta: string) => {
    if (cta.includes('Supplements')) return '/shop?category=Supplements';
    if (cta.includes('Equipment')) return '/shop?category=Machines';
    return '/shop';
  };

  return (
    <div className="relative w-full h-[65vh] sm:h-[75vh] lg:h-[92vh] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="max-w-2xl"
            >
              {/* Gold accent line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 72 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-[2px] gold-gradient rounded-full mb-8"
              />

              {/* Logo mark */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-gold/30">
                  <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.35em] text-gold uppercase">Premium Fitness</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-7xl font-extrabold text-white leading-[1.05] mb-3 tracking-tight">
                {slide.title}
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-7xl font-extrabold mb-8 tracking-tight">
                <span className="gold-text">{slide.titleHighlight}</span>
              </h1>

              <p className="text-gray-300/90 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-lg font-light">
                {slide.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(getCtaLink(slide.cta))}
                  className="px-8 py-4 sm:px-10 sm:py-5 gold-gradient text-white font-semibold rounded-2xl flex items-center justify-center gap-2.5 hover:shadow-2xl hover:shadow-gold/25 transition-all duration-500 text-sm sm:text-base tracking-wide"
                >
                  {slide.cta} <ArrowRight size={18} strokeWidth={2} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/shop')}
                  className={`px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-semibold border border-white/15 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-500 text-sm sm:text-base tracking-wide`}
                >
                  View All Products
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 sm:right-8 lg:right-12 bottom-1/2 translate-y-1/2 flex flex-col gap-3 z-20">
        <button
          onClick={prevSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 glass-effect text-white/70 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 glass-effect text-white/70 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-[3px] rounded-full transition-all duration-700 ease-out ${
              i === current ? 'w-10 gold-gradient' : 'w-5 bg-white/25 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default HeroSlider;
