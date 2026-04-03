// ==========================================
// LoadingSpinner Component
// ==========================================
// Reusable loading spinner with neon glow animation.

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={`${sizes[size]} text-neon-cyan`} />
      </motion.div>
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
}
