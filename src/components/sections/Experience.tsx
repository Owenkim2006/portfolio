'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experience, COMPANY_URLS } from '@/data/experience';
import type { ExperienceItem } from '@/types';

// ─── Left-entry animation wrapper ────────────────────────────────────────────

function SlideInLeft({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Company logo ─────────────────────────────────────────────────────────────

function CompanyLogo({ item }: { item: ExperienceItem }) {
  const [imgError, setImgError] = useState(false);

  if (item.logo && !imgError) {
    return (
      <div style={{
        width: 44, height: 44, borderRadius: 10, overflow: 'hidden',
        border: '1px solid var(--border)', background: 'white', padding: 6, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
      background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 13,
      color: 'var(--accent-light)', fontWeight: 500, flexShrink: 0,
    }}>
      {item.company.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─── Experience card ──────────────────────────────────────────────────────────

function ExperienceCard({ item }: { item: ExperienceItem }) {
  const companyUrl = COMPANY_URLS[item.id];

  const cardBody = (
    <div className="exp-card">
      <CompanyLogo item={item} />
      <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0, lineHeight: 1.35 }}>
          {item.company}
        </h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--accent-light)', margin: '3px 0 0', lineHeight: 1.4 }}>
          {item.role}
        </p>
        {/* Date sits in the timeline column on desktop; shown inline on mobile. */}
        <p className="md:hidden" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', margin: '6px 0 0' }}>
          {item.dateRange} · {item.location}
        </p>
      </div>
      {companyUrl && <span className="exp-arrow" aria-hidden="true">↗</span>}
    </div>
  );

  if (companyUrl) {
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
  const last = experience.length - 1;

  return (
    <section className="home-section">
      <style>{`
        .exp-card {
          position: relative;
          display: flex; align-items: center; gap: 14px;
          padding: 18px 22px;
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
          transition: border-color 150ms ease;
        }
        a:hover > .exp-card { border-color: var(--border-accent); }
        .exp-arrow {
          position: absolute; top: 12px; right: 14px;
          font-size: 12px; color: var(--text-muted);
        }
      `}</style>

      <div className="home-container" style={{ maxWidth: 964 }}>
        <h2 className="home-h2">Experience</h2>

        <div>
          {experience.map((item, i) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[150px_40px_minmax(0,1fr)]">

              {/* Date */}
              <div className="hidden md:block" style={{ textAlign: 'right', paddingTop: 22 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {item.dateRange}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  {item.location}
                </div>
              </div>

              {/* Timeline line + dot. The line runs dot-to-dot, so it is
                  trimmed above the first dot and below the last. */}
              <div className="hidden md:block" style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '50%', width: 2, marginLeft: -1,
                  top: i === 0 ? 30 : 0,
                  bottom: i === last ? 'auto' : 0,
                  height: i === last ? 30 : undefined,
                  background: 'var(--accent-border)',
                }} />
                <div style={{
                  position: 'absolute', left: '50%', top: 24, width: 12, height: 12, marginLeft: -6,
                  borderRadius: '50%', background: 'var(--accent)',
                  boxShadow: '0 0 0 4px var(--bg-primary)',
                }} />
              </div>

              {/* Card */}
              <div style={{ paddingBottom: i === last ? 0 : 20 }}>
                <SlideInLeft delay={i * 0.08}>
                  <ExperienceCard item={item} />
                </SlideInLeft>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
