'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useActiveSection } from '@/hooks/useActiveSection';

const SECTIONS = [
  { id: 'hero',       label: 'Home',       color: '#7F77DD' },
  { id: 'projects',   label: 'Projects',   color: '#BA7517' },
  { id: 'research',   label: 'Research',   color: '#1D9E75' },
  { id: 'experience', label: 'Experience', color: '#D85A30' },
  { id: 'contact',    label: 'Contact',    color: '#7F77DD' },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

export default function SectionDotNav() {
  const active  = useActiveSection(SECTION_IDS, { defaultId: 'hero' });
  const [hovered, setHovered] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="hidden lg:flex flex-col gap-3 fixed right-4 z-40"
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
              style={{ background: 'rgba(10,10,18,0.9)', color: '#f0f0f5' }}
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
              style={{ background: isActive ? color : 'rgba(255,255,255,0.2)' }}
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
