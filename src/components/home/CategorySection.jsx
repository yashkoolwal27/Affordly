// ==========================================
// CategorySection Component
// ==========================================
// Shows 3 category cards (Watches, Fabrics, Shoes)
// with neon accent colors and hover effects.

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Watch, Shirt, Footprints } from 'lucide-react';

const categories = [
  {
    name: 'Watches',
    slug: 'watches',
    description: 'Precision timepieces for every occasion',
    icon: Watch,
    color: 'neon-cyan',
    gradient: 'from-neon-cyan/20 to-neon-cyan/5',
    border: 'border-neon-cyan/20 hover:border-neon-cyan/50',
    glow: 'hover:shadow-neon-cyan',
    textColor: 'text-neon-cyan',
  },
  {
    name: 'Fabrics',
    slug: 'fabrics',
    description: 'Premium textiles & designer clothing',
    icon: Shirt,
    color: 'neon-green',
    gradient: 'from-neon-green/20 to-neon-green/5',
    border: 'border-neon-green/20 hover:border-neon-green/50',
    glow: 'hover:shadow-neon-green',
    textColor: 'text-neon-green',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Step into luxury & comfort',
    icon: Footprints,
    color: 'neon-orange',
    gradient: 'from-neon-orange/20 to-neon-orange/5',
    border: 'border-neon-orange/20 hover:border-neon-orange/50',
    glow: 'hover:shadow-neon-orange',
    textColor: 'text-neon-orange',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CategorySection() {
  return (
    <section className="py-20">
      <div className="section-container">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Explore our curated collections across three premium categories
          </p>
        </motion.div>

        {/* Category cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.slug} variants={cardVariants}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className={`group block glass-card p-8 ${cat.border} ${cat.glow} transition-all duration-500`}
                  id={`category-${cat.slug}`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${cat.textColor}`} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{cat.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                    Browse collection
                    <motion.span
                      className="inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      →
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
