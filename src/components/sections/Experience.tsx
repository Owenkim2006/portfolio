'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experience } from '@/data/experience';
import type { ExperienceItem } from '@/types';

const COMPANY_URLS: Record<string, string> = {
  'sickkids': 'https://pcigiti.com/',
  'uwaterloo-research': 'https://sirisharambhatla.com/criticalml/',
  'harvard': 'http://www.tearneylab.org/',
};

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
    <svg width={7} height={11} viewBox="0 0 7 11" fill="none"
      stroke="#9B94FF" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
      <path d="M1 1l5 4.5L1 10" />
    </svg>
  );
}

// ─── Type badge ───────────────────────────────────────────────────────────────
// Single accent, job type is conveyed by label text, not color.

const TYPE_META: Record<ExperienceItem['type'], { label: string }> = {
  research: { label: 'Research' },
  software: { label: 'Software' },
};

function TypeBadge({ type }: { type: ExperienceItem['type'] }) {
  const m = TYPE_META[type];
  return (
    <span style={{
      fontSize: '0.6875rem',
      fontFamily: 'var(--font-mono)',
      padding: '3px 10px',
      borderRadius: 999,
      color: 'var(--accent-light)', background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
      whiteSpace: 'nowrap',
    }}>
      {m.label}
    </span>
  );
}

// ─── Company logo ─────────────────────────────────────────────────────────────

function CompanyLogo({ item }: { item: ExperienceItem }) {
  const [imgError, setImgError] = useState(false);

  if (item.logo && !imgError) {
    return (
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'white',
        padding: 6,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={item.logo}
          alt={item.company}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: 44, height: 44, borderRadius: 10,
      background: 'var(--accent-subtle)',
      border: '1px solid var(--accent-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 13,
      color: 'var(--accent-light)', fontWeight: 500, flexShrink: 0,
    }}>
      {item.company.slice(0, 2).toUpperCase()}
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
      initial={{ backgroundColor: 'var(--bg-primary)' }}
      animate={{ backgroundColor: inView ? '#6C63FF' : 'var(--bg-primary)' }}
      transition={{ duration: 0.35, delay: 0.15 }}
      style={{
        position: 'absolute', left: 12, top: 24,
        width: 16, height: 16, borderRadius: '50%',
        border: '2px solid #6C63FF', zIndex: 1,
      }}
    />
  );
}

// ─── Experience card ──────────────────────────────────────────────────────────

function ExperienceCard({ item }: { item: ExperienceItem }) {
  const [hovered, setHovered] = useState(false);
  const companyUrl = COMPANY_URLS[item.id];
  const isFullLink = !!companyUrl;

  const cardBody = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--border-accent)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '22px 24px',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'border-color 200ms ease, transform 200ms ease',
        display: 'flex',
        flexDirection: 'column',
        cursor: isFullLink ? 'pointer' : 'default',
        position: 'relative',
      }}
    >
      {isFullLink && (
        <span style={{
          position: 'absolute', top: 16, right: 16,
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
        }}>
          ↗
        </span>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <CompanyLogo item={item} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
              {item.company}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--accent-light)', marginTop: 2 }}>
              {item.role}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
            <TypeBadge type={item.type} />
            <p style={{
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)', textAlign: 'right', lineHeight: 1.6,
            }}>
              {item.dateRange}<br />{item.location}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '14px 0' }}>
        {item.description}
      </p>

      {/* Wins */}
      {item.wins.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)', textTransform: 'uppercase',
            letterSpacing: '0.12em', marginBottom: 8,
          }}>
            Key outcomes
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 7, listStyle: 'none', margin: 0, padding: 0 }}>
            {item.wins.map((win, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <ChevronRight />
                <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{win}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stack tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {item.stack.map((tech) => (
          <span key={tech} style={{
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            padding: '3px 8px', borderRadius: 4,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );

  if (isFullLink) {
    return (
      <a href={companyUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        {cardBody}
      </a>
    );
  }

  return cardBody;
}

// ─── Experience section ───────────────────────────────────────────────────────

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [axonHeight, setAxonHeight] = useState(0);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setAxonHeight(entries[0].contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section style={{ padding: '120px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 500,
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 16px',
          }}>
            Experience
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div ref={timelineRef} style={{ position: 'relative' }}>

            {/* Neural axon timeline */}
            {axonHeight > 0 && (
              <svg
                aria-hidden="true"
                className="hidden md:block"
                style={{ position: 'absolute', left: 8, top: 0, width: 24, height: axonHeight, overflow: 'visible' }}
              >
                <line x1="12" y1="0" x2="12" y2={axonHeight} stroke="url(#axon-grad)" strokeWidth="1.2" />
                <path d="M12 120 Q20 115 28 118" fill="none" stroke="#6C63FF" strokeWidth="0.5" opacity="0.3" />
                <path d="M12 120 Q4 115 -4 118" fill="none" stroke="#6C63FF" strokeWidth="0.5" opacity="0.3" />
                <path d="M12 280 Q22 274 30 277" fill="none" stroke="#6C63FF" strokeWidth="0.5" opacity="0.3" />
                <path d="M12 280 Q2 274 -6 277" fill="none" stroke="#6C63FF" strokeWidth="0.5" opacity="0.3" />
                <defs>
                  <linearGradient id="axon-grad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="8%" stopColor="#6C63FF" stopOpacity="0.5" />
                    <stop offset="92%" stopColor="#6C63FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <circle r="3" fill="#9B94FF" opacity="0">
                  <animateMotion dur="4s" repeatCount="indefinite" begin="1s">
                    <mpath href="#axon-line" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;0.8;0.8;0" dur="4s" repeatCount="indefinite" begin="1s" />
                </circle>
                <path id="axon-line" d={`M12 0 L12 ${axonHeight}`} fill="none" stroke="none" />
              </svg>
            )}

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
