// ==========================================
// HeroSection Component
// ==========================================
// Full-width animated hero with gradient background,
// floating elements, and CTA buttons.

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-green/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-orange/5 rounded-full blur-[150px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm text-neon-cyan font-medium">New Collection 2026</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            Elevate Your
            <br />
            <span className="gradient-text">Style Game</span>
            <br />
            with Premium Picks
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-400 max-w-xl mb-8 leading-relaxed"
          >
            Discover curated collections of luxury watches, premium fabrics,
            and designer shoes. Experience shopping reimagined with a futuristic edge.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/products" className="btn-neon flex items-center gap-2 text-base">
              <ShoppingBag className="w-5 h-5" />
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products?category=watches" className="btn-outline flex items-center gap-2 text-base">
              Explore Watches
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-8 mt-12 pt-8 border-t border-white/5"
          >
            {[
              { value: '500+', label: 'Products' },
              { value: '10K+', label: 'Customers' },
              { value: '4.9', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="hidden lg:block absolute right-16 top-1/4 w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/5 border border-neon-cyan/20 backdrop-blur-sm"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="hidden lg:block absolute right-48 bottom-1/3 w-16 h-16 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-green/5 border border-neon-green/20 backdrop-blur-sm"
      />
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="hidden lg:block absolute right-32 top-1/2 w-12 h-12 rounded-xl bg-gradient-to-br from-neon-orange/20 to-neon-orange/5 border border-neon-orange/20 backdrop-blur-sm rotate-12"
      />
    </section>
  );
}
