import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0=enter, 1=logo reveal, 2=text, 3=exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 2400);
    const t4 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-gold/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Radial gold glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase >= 1 ? 1 : 0,
              opacity: phase >= 1 ? 0.15 : 0,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(201,169,110,0.3) 0%, transparent 70%)',
            }}
          />

          {/* Thin gold ring animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase >= 1 ? [0, 2.5] : 0,
              opacity: phase >= 1 ? [0.6, 0] : 0,
            }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute w-32 h-32 rounded-full border border-gold/40"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase >= 1 ? [0, 3.5] : 0,
              opacity: phase >= 1 ? [0.4, 0] : 0,
            }}
            transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
            className="absolute w-32 h-32 rounded-full border border-gold/30"
          />

          {/* Logo container */}
          <div className="relative flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{
                scale: phase >= 1 ? 1 : 0,
                rotate: phase >= 1 ? 0 : -180,
                opacity: phase >= 1 ? 1 : 0,
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-2xl shadow-gold/40 ring-2 ring-gold/20 ring-offset-4 ring-offset-black">
                <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
              </div>
              {/* Glow behind logo */}
              <div className="absolute inset-0 rounded-3xl bg-gold/20 blur-2xl -z-10" />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20, letterSpacing: '0.5em' }}
              animate={{
                opacity: phase >= 2 ? 1 : 0,
                y: phase >= 2 ? 0 : 20,
                letterSpacing: phase >= 2 ? '0.35em' : '0.5em',
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex items-center gap-2"
            >
              <span className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                FITNESS
              </span>
              <span className="text-gold text-[10px] sm:text-xs font-semibold tracking-[0.35em]">
                EASE
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: phase >= 2 ? 0.5 : 0,
                y: phase >= 2 ? 0 : 10,
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-[0.4em] mt-4 font-medium"
            >
              Premium Fitness Equipment
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full gold-gradient rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
