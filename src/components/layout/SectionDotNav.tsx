'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useActiveSection } from '@/hooks/useActiveSection';

const SECTIONS = [
  { id: 'hero',       label: 'Home',       color: 'var(--accent)' },
  { id: 'projects',   label: 'Projects',   color: 'var(--accent)' },
  { id: 'experience', label: 'Experience', color: 'var(--accent)' },
  { id: 'research',   label: 'Research',   color: 'var(--accent)' },
  { id: 'contact',    label: 'Contact',    color: 'var(--accent)' },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

export default function SectionDotNav() {
  const active  = useActiveSection(SECTION_IDS, {
    defaultId: 'hero',
    threshold: 0.3,
    rootMargin: '-20% 0px -20% 0px',
  });
  const [hovered, setHovered] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="hidden lg:flex flex-col gap-3 fixed right-4 z-40 pointer-events-auto"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      {SECTIONS.map(({ id, label, color }) => {
        const isActive  = active === id;
        const isHovered = hovered === id;

        return (
          <div
            key={id}
            className="relative flex items-center justify-end"
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Label tooltip */}
            <motion.span
              className="absolute right-5 font-mono text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap"
              style={{ background: 'rgba(8,11,20,0.9)', color: 'var(--text-primary)' }}
              initial={{ opacity: 0, x: 4 }}
              animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 4 }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.span>

            {/* Dot / pill */}
            <motion.button
              onClick={() => scrollTo(id)}
              aria-label={`Scroll to ${label}`}
              layout
              style={{ background: isActive ? color : 'rgba(255,255,255,0.15)' }}
              animate={{
                width:  6,
                height: isActive ? 20 : 6,
                borderRadius: 9999,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="cursor-pointer border-0 p-0"
            />
          </div>
        );
      })}
    </div>
  );
}
