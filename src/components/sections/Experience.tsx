'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experience } from '@/data/experience';
import type { ExperienceItem } from '@/types';

// ─── Left-entry animation wrapper ────────────────────────────────────────────

function SlideInLeft({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg
      width={7}
      height={11}
      viewBox="0 0 7 11"
      fill="none"
      stroke="#D85A30"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 3 }}
    >
      <path d="M1 1l5 4.5L1 10" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Type badge ───────────────────────────────────────────────────────────────

const TYPE_META: Record<ExperienceItem['type'], { label: string; text: string; bg: string; border: string }> = {
  research: { label: 'Research', text: '#1D9E75', bg: 'rgba(29,158,117,0.12)',  border: 'rgba(29,158,117,0.3)'  },
  industry: { label: 'Industry', text: '#BA7517', bg: 'rgba(186,117,23,0.12)',  border: 'rgba(186,117,23,0.3)'  },
  startup:  { label: 'Startup',  text: '#D85A30', bg: 'rgba(216,90,48,0.12)',   border: 'rgba(216,90,48,0.3)'   },
};

function TypeBadge({ type }: { type: ExperienceItem['type'] }) {
  const m = TYPE_META[type];
  return (
    <span style={{
      fontSize: 11,
      fontFamily: 'var(--font-jetbrains-mono, monospace)',
      padding: '3px 10px',
      borderRadius: 999,
      color: m.text,
      background: m.bg,
      border: `0.5px solid ${m.border}`,
      whiteSpace: 'nowrap',
    }}>
      {m.label}
    </span>
  );
}

// ─── Company logo placeholder ────────────────────────────────────────────────

function CompanyLogo({ item }: { item: ExperienceItem }) {
  const accentColor = item.color ?? TYPE_META[item.type].text;
  const initials = item.company.slice(0, 2).toUpperCase();

  if (item.logo) {
    return (
      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
        <img src={item.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div style={{
      width: 44,
      height: 44,
      borderRadius: 10,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hexToRgba(accentColor, 0.15),
      border: `1px solid ${hexToRgba(accentColor, 0.3)}`,
    }}>
      <span style={{
        fontSize: 13,
        fontFamily: 'var(--font-jetbrains-mono, monospace)',
        fontWeight: 500,
        color: accentColor,
        letterSpacing: '0.02em',
      }}>
        {initials}
      </span>
    </div>
  );
}

// ─── Animated timeline dot ────────────────────────────────────────────────────

function TimelineDot() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ backgroundColor: '#0a0a12' }}
      animate={{ backgroundColor: inView ? '#D85A30' : '#0a0a12' }}
      transition={{ duration: 0.35, delay: 0.15 }}
      style={{
        position: 'absolute',
        left: 12,
        top: 24,
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '2px solid #D85A30',
        zIndex: 1,
      }}
    />
  );
}

// ─── Experience card ──────────────────────────────────────────────────────────

function ExperienceCard({ item }: { item: ExperienceItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(26,26,46,0.5)',
        border: `0.5px solid ${hovered ? 'rgba(216,90,48,0.25)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12,
        padding: '22px 24px',
        transform: hovered ? 'translateY(-1px)' : 'none',
        transition: 'border-color 200ms, transform 200ms',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <CompanyLogo item={item} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: '#f0f0f5', margin: 0 }}>
              {item.company}
            </h3>
            <p style={{ fontSize: 14, color: '#D85A30', marginTop: 2 }}>
              {item.role}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
            <TypeBadge type={item.type} />
            <p style={{
              fontSize: 11,
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: '#5a5a78',
              textAlign: 'right',
              lineHeight: 1.6,
            }}>
              {item.dateRange}<br />{item.location}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: '#9898b0', lineHeight: 1.7, margin: '14px 0' }}>
        {item.description}
      </p>

      {/* Wins */}
      {item.wins.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{
            fontSize: 11,
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            color: '#5a5a78',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}>
            Key outcomes
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 7, listStyle: 'none', margin: 0, padding: 0 }}>
            {item.wins.map((win, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <ChevronRight />
                <span style={{ fontSize: 14, color: '#9898b0', lineHeight: 1.5 }}>{win}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stack tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
        {item.stack.map((tech) => (
          <span key={tech} style={{
            fontSize: 10,
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            padding: '2px 8px',
            borderRadius: 4,
            background: 'rgba(10,10,18,0.8)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            color: '#9898b0',
          }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Experience section ───────────────────────────────────────────────────────

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section style={{ padding: '120px 0', background: 'rgba(216,90,48,0.02)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#D85A30',
            marginBottom: 12,
          }}>
            Experience
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 500,
            color: '#f0f0f5',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Where the work happened
          </h2>
          <p style={{ color: '#9898b0', fontSize: 16, marginTop: 8, maxWidth: 540 }}>
            Research labs, startups, and hospitals — building real things
            in high-stakes environments
          </p>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div ref={sectionRef} style={{ position: 'relative' }}>

            {/* Animated vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: lineInView ? 1 : 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: 19,
                top: 0,
                bottom: 0,
                width: 1,
                background: 'linear-gradient(to bottom, transparent, rgba(216,90,48,0.4) 10%, rgba(216,90,48,0.4) 90%, transparent)',
                transformOrigin: 'top',
                pointerEvents: 'none',
              }}
            />

            {/* Cards */}
            {experience.map((item, i) => (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  paddingLeft: 48,
                  marginBottom: i < experience.length - 1 ? 40 : 0,
                }}
              >
                <TimelineDot />
                <SlideInLeft delay={i * 0.12}>
                  <ExperienceCard item={item} />
                </SlideInLeft>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
