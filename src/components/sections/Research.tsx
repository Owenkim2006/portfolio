'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { research } from '@/data/research';
import type { ResearchItem, ResearchStatus } from '@/types';

// ─── Left-entry animation wrapper ────────────────────────────────────────────

function SlideInLeft({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -28 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Status badge meta ────────────────────────────────────────────────────────

const STATUS_META: Record<ResearchStatus, { label: string; background: string; border: string; color: string }> = {
  review: {
    label: 'Under Review',
    background: 'rgba(108,99,255,0.10)',
    border: '1px solid var(--accent-border)',
    color: 'var(--accent-light)',
  },
  published: {
    label: 'Completed',
    background: 'rgba(29,158,117,0.08)',
    border: '1px solid rgba(29,158,117,0.25)',
    color: 'var(--teal-light)',
  },
};

const GROUPS: { status: ResearchStatus }[] = [
  { status: 'review'    },
  { status: 'published' },
];

// ─── Author list, bolds "Owen Kim" wherever it appears ───────────────────────

function AuthorList({ authors }: { authors: string[] }) {
  return (
    <>
      {authors.map((author, i) => (
        <span key={i}>
          {author === 'Owen Kim' ? (
            <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Owen Kim</strong>
          ) : (
            author
          )}
          {i < authors.length - 1 ? ', ' : ''}
        </span>
      ))}
    </>
  );
}

// ─── Research card ────────────────────────────────────────────────────────────

function ResearchCard({ item }: { item: ResearchItem }) {
  const meta = STATUS_META[item.status];
  const primaryLink = item.links[0];

  return (
    <div style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

        {/* Line 1: Title */}
        <div>
          {primaryLink?.href ? (
            <a
              href={primaryLink.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 15, fontWeight: 500, color: 'var(--accent-light)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              {item.title}
            </a>
          ) : (
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>
              {item.title}
            </span>
          )}
        </div>

        {/* Line 2: Status badge — its own line */}
        <div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            padding: '2px 8px', borderRadius: 4, display: 'inline-block',
            letterSpacing: '0.06em',
            background: meta.background, border: meta.border, color: meta.color,
          }}>
            {meta.label}
          </span>
        </div>

        {/* Line 3: Authors */}
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          <AuthorList authors={item.authors} />
        </div>

        {/* Line 4: Venue */}
        {item.venue && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {item.venue}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Research section ─────────────────────────────────────────────────────────

export default function Research() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 120 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 0,
          }}>
            Research
          </h2>
        </div>

        {/* Groups */}
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {GROUPS.map((group) => {
            const items = research.filter((r) => r.status === group.status);
            if (items.length === 0) return null;
            return (
              <div key={group.status}>
                {items.map((item, i) => (
                  <SlideInLeft key={item.id} delay={i * 0.06}>
                    <ResearchCard item={item} />
                  </SlideInLeft>
                ))}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
