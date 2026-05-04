'use client';

import { useState, useEffect } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import BrainBackground from '@/components/layout/BrainBackground';

const NAVBAR_H = 68;

const PILLS = [
  { label: 'SickKids · R&D Engineer',      color: '#D85A30' },
  { label: 'Harvard Medical · Tearney Lab', color: '#1D9E75' },
  { label: 'UWaterloo · Critical ML Lab',   color: '#7F77DD' },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll();

  const brainOpacity  = useTransform(scrollYProgress, [0, 0.4],  [0.85, 0]);
  const brainScale    = useTransform(scrollYProgress, [0, 0.4],  [1, 0.88]);
  const brainY        = useTransform(scrollYProgress, [0, 0.4],  [0, 40]);
  const textOpacity   = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const textY         = useTransform(scrollYProgress, [0, 0.25], [0, -24]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section
      className="relative grid grid-cols-1 md:grid-cols-2 overflow-hidden"
      style={{ minHeight: '100vh', paddingTop: NAVBAR_H }}
    >
      {/* ── Left column — text ─────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col justify-center"
        style={{
          padding: isMobile ? '48px 32px 0' : `0 48px 0 64px`,
          textAlign: isMobile ? 'center' : 'left',
          opacity: isMobile ? undefined : textOpacity,
          y: isMobile ? undefined : textY,
        }}
      >
        <motion.p
          className="font-mono text-xs tracking-widest uppercase mb-5 text-neural-purple"
          {...fade(0.1)}
        >
          Available · Fall 2026
        </motion.p>

        <motion.h1
          className="font-medium leading-none mb-5 text-text-primary"
          style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
          {...fade(0.2)}
        >
          Owen Kim
        </motion.h1>

        <motion.h2
          className="text-lg md:text-xl mb-6 leading-snug text-text-secondary"
          {...fade(0.3)}
        >
          Biomedical Engineer · Neuroengineering · Machine Learning
        </motion.h2>

        <motion.p
          className="text-base leading-relaxed mb-8 text-text-secondary"
          style={{ maxWidth: isMobile ? '100%' : 460 }}
          {...fade(0.4)}
        >
          Biomedical Engineering student at the University of Waterloo (GPA 3.9/4.0)
          exploring the intersection of neuroengineering and machine learning — building
          diagnostic AI and medical devices that translate biological signals into
          clinical impact.
        </motion.p>

        {/* Affiliation pills */}
        <motion.div
          className="flex flex-wrap gap-2"
          style={{ justifyContent: isMobile ? 'center' : 'flex-start' }}
          {...fade(0.5)}
        >
          {PILLS.map(({ label, color }) => (
            <span
              key={label}
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
                padding: '4px 12px',
                borderRadius: 999,
                color,
                background: `${color}1A`,
                border: `0.5px solid ${color}4D`,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right column — brain ───────────────────────────────────────────── */}
      <motion.div
        className="relative md:h-screen"
        style={isMobile ? {
          height: '45vh',
          opacity: 0.55,
        } : {
          opacity: brainOpacity,
          scale: brainScale,
          y: brainY,
        }}
      >
        <div style={{
          position: 'absolute',
          inset: '-20% -10%',
          zIndex: 5,
          pointerEvents: 'none',
        }}>
          <BrainBackground />
        </div>
      </motion.div>

      {/* ── Scroll indicator ───────────────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 10,
          opacity: indicatorOpacity,
          pointerEvents: 'none',
        }}
      >
        <motion.span
          className="font-mono text-xs text-text-muted tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="text-text-muted"
        >
          <svg
            width={12} height={8} viewBox="0 0 12 8"
            fill="none" stroke="currentColor" strokeWidth={1.5}
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 1l5 5 5-5" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
