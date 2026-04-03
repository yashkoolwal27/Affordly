// ==========================================
// Footer Component
// ==========================================
// Site footer with branding, links, and social icons.

import { Link } from 'react-router-dom';
import { Globe, User, Mail, Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { name: 'All Products', to: '/products' },
      { name: 'Watches', to: '/products?category=watches' },
      { name: 'Fabrics', to: '/products?category=fabrics' },
      { name: 'Shoes', to: '/products?category=shoes' },
    ],
    Account: [
      { name: 'Sign In', to: '/auth' },
      { name: 'My Orders', to: '/orders' },
      { name: 'Wishlist', to: '/wishlist' },
      { name: 'Cart', to: '/cart' },
    ],
    Company: [
      { name: 'About Us', to: '#' },
      { name: 'Contact', to: '#' },
      { name: 'Privacy Policy', to: '#' },
      { name: 'Terms of Service', to: '#' },
    ],
  };

  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-20">
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center">
                <span className="text-dark-900 font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Neon<span className="text-neon-cyan">Kart</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Premium e-commerce store featuring the finest watches, fabrics, and shoes.
              Built with cutting-edge technology and stunning design.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, User, Mail, Zap].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-dark-600 flex items-center justify-center text-gray-500 hover:text-neon-cyan hover:bg-dark-500 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-neon-cyan transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} Affordly. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Zap className="w-3 h-3 text-neon-cyan" />
            Powered by React + Supabase
          </div>
        </div>
      </div>
    </footer>
  );
}
