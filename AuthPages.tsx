import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const SignInPage: React.FC = () => {
  const { isDark, login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      if (email === 'saadtiku@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  const inputClass = `w-full pl-12 pr-4 py-4 rounded-2xl border text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all duration-300 ${
    isDark ? 'bg-dark-card border-dark-border text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'
  }`;

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-dark-bg' : 'bg-[#FAFAFA]'}`}>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&q=80"
            alt="Fitness"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-gold/30">
              <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white">FITNESS</span>
              <span className="text-[10px] font-semibold tracking-[0.3em] text-gold ml-1.5">EASE</span>
            </div>
          </Link>
          <div className="max-w-md">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Your journey to <span className="gold-text">greatness</span> starts here.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Join thousands of athletes who trust Fitness Ease for premium equipment, supplements, and gear.
            </p>
            <div className="flex items-center gap-6 mt-10">
              <div>
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-xs text-gray-400 mt-1">Happy Customers</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-xs text-gray-400 mt-1">Products</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-white">4.9</p>
                <p className="text-xs text-gray-400 mt-1">Avg Rating</p>
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-xs">© 2024 Fitness Ease. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className={`${isDark ? '' : ''}`}>
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-gold/30">
                  <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>FITNESS</span>
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-gold ml-1.5">EASE</span>
                </div>
              </Link>
            </div>

            <div className={`p-8 sm:p-10 rounded-3xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-2xl shadow-black/[0.03]'}`}>
              <div className="mb-8">
                <p className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em] mb-2">Welcome Back</p>
                <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Sign In</h1>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Enter your credentials to access your account</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 mb-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail size={17} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} strokeWidth={1.8} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <Lock size={17} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} strokeWidth={1.8} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#C9A96E]" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Remember me</span>
                  </label>
                  <a href="#" className="text-xs text-gold hover:underline font-medium">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-2 gold-gradient text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300 hover:-translate-y-0.5 text-sm"
                >
                  Sign In <ArrowRight size={16} />
                </button>
              </form>
            </div>

            <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-gold font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const SignUpPage: React.FC = () => {
  const { isDark, signup, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const success = signup(name, email, password);
    if (success) {
      if (email === 'saadtiku@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError('Email already exists');
    }
  };

  const inputClass = `w-full pl-12 pr-4 py-4 rounded-2xl border text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all duration-300 ${
    isDark ? 'bg-dark-card border-dark-border text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'
  }`;

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-dark-bg' : 'bg-[#FAFAFA]'}`}>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&q=80"
            alt="Fitness"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-gold/30">
              <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white">FITNESS</span>
              <span className="text-[10px] font-semibold tracking-[0.3em] text-gold ml-1.5">EASE</span>
            </div>
          </Link>
          <div className="max-w-md">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Join the <span className="gold-text">elite</span> fitness community.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Create your account and get access to exclusive products, early drops, and members-only pricing.
            </p>
          </div>
          <p className="text-gray-500 text-xs">© 2024 Fitness Ease. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-gold/30">
                <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>FITNESS</span>
                <span className="text-[10px] font-semibold tracking-[0.3em] text-gold ml-1.5">EASE</span>
              </div>
            </Link>
          </div>

          <div className={`p-8 sm:p-10 rounded-3xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-2xl shadow-black/[0.03]'}`}>
            <div className="mb-8">
              <p className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em] mb-2">Get Started</p>
              <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Create Account</h1>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Join the Fitness Ease community today</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User size={17} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Mail size={17} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} strokeWidth={1.8} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Lock size={17} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} strokeWidth={1.8} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <div className="relative">
                <Lock size={17} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} strokeWidth={1.8} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-2 gold-gradient text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300 hover:-translate-y-0.5 text-sm"
              >
                Create Account <ArrowRight size={16} />
              </button>
            </form>
          </div>

          <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Already have an account?{' '}
            <Link to="/signin" className="text-gold font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
