// ==========================================
// StatsCard Component
// ==========================================
// Reusable stat card for admin dashboard.

import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color = 'cyan', index = 0 }) {
  const colorMap = {
    cyan: {
      bg: 'bg-neon-cyan/10',
      text: 'text-neon-cyan',
      border: 'border-neon-cyan/20',
      glow: 'hover:shadow-neon-cyan',
    },
    green: {
      bg: 'bg-neon-green/10',
      text: 'text-neon-green',
      border: 'border-neon-green/20',
      glow: 'hover:shadow-neon-green',
    },
    orange: {
      bg: 'bg-neon-orange/10',
      text: 'text-neon-orange',
      border: 'border-neon-orange/20',
      glow: 'hover:shadow-neon-orange',
    },
    pink: {
      bg: 'bg-neon-pink/10',
      text: 'text-neon-pink',
      border: 'border-neon-pink/20',
    },
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card p-6 border ${c.border} ${c.glow} transition-all duration-300 cursor-default`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400 font-medium">{title}</span>
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
      </div>
      <p className="text-3xl font-display font-bold text-white">{value}</p>
    </motion.div>
  );
}
