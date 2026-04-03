// ==========================================
// Home Page
// ==========================================

import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { Sparkles, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

// Perks section data
const perks = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100', color: 'text-neon-cyan' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: '256-bit SSL encryption', color: 'text-neon-green' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy', color: 'text-neon-orange' },
  { icon: Sparkles, title: 'Premium Quality', desc: 'Curated collections', color: 'text-neon-pink' },
];

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />

      {/* Perks Section */}
      <section className="py-16 border-t border-white/5">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4"
                >
                  <Icon className={`w-8 h-8 ${perk.color} shrink-0`} />
                  <div>
                    <h4 className="text-white font-semibold text-sm">{perk.title}</h4>
                    <p className="text-gray-500 text-xs">{perk.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 lg:p-12 text-center relative overflow-hidden"
          >
            {/* Glow background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none" />

            <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mb-3 relative z-10">
              Stay in the Loop
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto relative z-10">
              Subscribe to get exclusive deals, new arrivals, and style tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-1"
              />
              <button className="btn-neon whitespace-nowrap">Subscribe</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
