import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useApp } from '../store/AppContext';

const Footer: React.FC = () => {
  const { isDark } = useApp();

  const footerLinks = {
    Shop: [
      { name: 'All Products', path: '/shop' },
      { name: 'Dumbbells', path: '/shop?category=Dumbbells' },
      { name: 'Gym Wear', path: '/shop?category=Gym+Wear' },
      { name: 'Supplements', path: '/shop?category=Supplements' },
      { name: 'Machines', path: '/shop?category=Machines' },
      { name: 'Accessories', path: '/shop?category=Accessories' },
    ],
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact', path: '/contact' },
    ],
    Support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Shipping', path: '/shipping' },
      { name: 'Returns', path: '/returns' },
      { name: 'Track Order', path: '/orders' },
    ],
  };

  const socials = ['IG', 'X', 'FB', 'YT'];

  return (
    <footer className={`${isDark ? 'bg-dark-surface' : 'bg-[#0A0A0A]'} text-white`}>
      {/* Newsletter */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <p className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em] mb-3">Newsletter</p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">Stay in the <span className="gold-text">Loop</span></h3>
              <p className="text-gray-400 text-sm sm:text-base max-w-md">Subscribe for exclusive drops, training tips, and early access to new collections.</p>
            </div>
            <div className="flex w-full lg:w-auto max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 lg:w-80 px-5 py-4 bg-white/[0.06] border border-white/[0.08] rounded-l-2xl text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 text-sm transition-colors"
              />
              <button className="px-8 py-4 gold-gradient text-white font-semibold rounded-r-2xl hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-shadow duration-500">
                <img src="/logo.png" alt="FE" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white">FITNESS</span>
                <span className="text-[10px] font-semibold tracking-[0.3em] text-gold ml-1.5">EASE</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Premium gym equipment and fitness accessories designed for champions. Elevate every workout with world-class gear.
            </p>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <MapPin size={14} className="text-gold" />
                </div>
                <span>Dikhan, Kpk, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <Phone size={14} className="text-gold" />
                </div>
                <span>+92 XXX-XXXXXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <Mail size={14} className="text-gold" />
                </div>
                <span>hello@fitnessease.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white mb-5 text-[11px] uppercase tracking-[0.2em]">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-gold transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} Fitness Ease. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-gold/15 flex items-center justify-center text-gray-500 hover:text-gold transition-all duration-300 text-[10px] font-bold"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
