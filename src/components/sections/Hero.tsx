'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroBrain from '@/components/layout/HeroBrain';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const brainOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.25], [0, -20]);

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 pointer-events-none"
      style={{
        minHeight: '100vh',
        alignItems: 'center',
        paddingTop: 64,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left column (text) */}
      <div
        className="px-5 pt-[100px] pb-6 text-left md:px-0 md:pl-20 md:pr-10 md:pt-0 md:pb-0"
        style={{ position: 'relative', zIndex: 10 }}
      >
        {/* Dark gradient, keeps text readable regardless of what's behind
            it. Desktop only: on mobile the brain sits below the text
            instead of behind it, so no wash is needed there. */}
        <div
          aria-hidden="true"
          className="hidden md:block"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '52%',
            background: 'linear-gradient(to right, rgba(8,11,20,0.98) 0%, rgba(8,11,20,0.80) 55%, rgba(8,11,20,0.20) 80%, transparent 100%)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />

        {/* Text content, the only part of the hero that intercepts clicks
            on desktop besides the brain itself; everything else stays
            pointer-events:none. */}
        <motion.div style={{ opacity: textOpacity, y: textY, position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
            style={{
              fontSize: 'clamp(3.2rem, 8vw, 6.5rem)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 0,
            }}
          >
            Owen Kim
          </motion.h1>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
            style={{
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: 440,
              marginTop: 16,
            }}
          >
            Biomedical Engineering student at the University of Waterloo,
            building wearable systems, medical devices, and machine learning
            models, translating research into systems that improve quality
            of life.
          </motion.p>

          {/* Scroll indicator — hidden on mobile, takes up space there */}
          <motion.div
            style={{ opacity: indicatorOpacity, marginTop: 48 }}
            className="hidden md:flex md:flex-col md:items-start"
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
              }}
            >
              scroll to explore
            </span>
            <svg
              className="hero-chevron-bounce"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginTop: 6 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>

        </motion.div>
      </div>

      {/* Right column (brain), a single HeroBrain instance whose style
          switches between the desktop and mobile spec, rather than
          rendering two separate instances (which would load the 33MB
          GLB model twice). */}
      <motion.div
        style={
          isDesktop
            ? {
                position: 'relative',
                height: '100vh',
                cursor: 'grab',
                opacity: brainOpacity,
                pointerEvents: 'auto',
              }
            : {
                position: 'relative',
                width: '100%',
                height: '45vh',
                opacity: 0.5,
                pointerEvents: 'auto',
              }
        }
      >
        {/* React Three Fiber's <Canvas> always sets pointer-events:auto on
            its own internal wrapper div, regardless of what an ancestor's
            pointer-events says. The brain is touch-interactive on mobile
            too (see HeroBrainInner's OrbitControls touches config), so
            `interactive` is always true here. */}
        <HeroBrain interactive={true} />
      </motion.div>
    </div>
  );
}
