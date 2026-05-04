'use client';

import { motion } from 'framer-motion';

interface Props {
  label: string;
  accent: string;       // CSS color string or var(--...)
  offsetX: string;      // CSS offset from center, e.g. '-280px'
  offsetY: string;
  index: number;        // stagger delay source
  onClick: () => void;
}

export default function NodeButton({ label, accent, offsetX, offsetY, index, onClick }: Props) {
  const pulseDuration = 2.4 + index * 0.25;

  return (
    <motion.button
      className="absolute font-mono"
      style={{
        left: `calc(50% + ${offsetX})`,
        top:  `calc(50% + ${offsetY})`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 + index * 0.12, type: 'spring', damping: 18, stiffness: 220 }}
      whileHover={{ scale: 1.14 }}
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2.5">
        {/* Orbital rings */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer slow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${accent}` }}
            animate={{ scale: [1, 1.8], opacity: [0.45, 0] }}
            transition={{ duration: pulseDuration, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.6 }}
          />
          {/* Inner faster ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${accent}`, opacity: 0.35 }}
            animate={{ scale: [1, 1.4], opacity: [0.35, 0] }}
            transition={{ duration: pulseDuration * 0.65, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />

          {/* Core node */}
          <div
            className="relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200"
            style={{
              borderColor: accent,
              background: 'rgba(10,10,18,0.85)',
              boxShadow: `0 0 18px 2px ${accent}30`,
            }}
          >
            {/* Centre dot */}
            <motion.div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: accent }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: pulseDuration * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Label */}
        <span
          className="text-xs tracking-widest uppercase leading-none"
          style={{ color: accent }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}
