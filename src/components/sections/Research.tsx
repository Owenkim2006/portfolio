'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { research } from '@/data/research';
import type { ResearchItem } from '@/types';
import { showToast } from '@/components/ui/Toast';

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

// ─── Output type icons ────────────────────────────────────────────────────────

function DocumentIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden="true">
      <rect x="2" y="1" width="8" height="10" rx="1" />
      <line x1="4" y1="4" x2="8" y2="4" />
      <line x1="4" y1="6.5" x2="8" y2="6.5" />
      <line x1="4" y1="9" x2="6.5" y2="9" />
    </svg>
  );
}

function PosterIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" rx="1" />
      <path d="M1 8l3-3 2.5 2.5L9 5l2 3" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden="true">
      <rect x="4" y="1" width="4" height="6" rx="2" />
      <path d="M2 7a4 4 0 008 0" />
      <line x1="6" y1="11" x2="6" y2="10" />
      <line x1="4" y1="11" x2="8" y2="11" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden="true">
      <rect x="1" y="2" width="10" height="9" rx="1" />
      <line x1="1" y1="5" x2="11" y2="5" />
      <line x1="4" y1="1" x2="4" y2="3.5" />
      <line x1="8" y1="1" x2="8" y2="3.5" />
    </svg>
  );
}

const OUTPUT_ICON: Record<ResearchItem['outputs'][number]['type'], React.ReactNode> = {
  paper:      <DocumentIcon />,
  poster:     <PosterIcon />,
  talk:       <MicIcon />,
  conference: <CalendarIcon />,
};

// ─── Output pill ──────────────────────────────────────────────────────────────

function OutputPill({
  output,
  onNoHref,
}: {
  output: ResearchItem['outputs'][number];
  onNoHref: () => void;
}) {
  const pill: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 12,
    fontFamily: 'var(--font-jetbrains-mono, monospace)',
    padding: '4px 12px',
    borderRadius: 999,
    border: '0.5px solid rgba(29,158,117,0.35)',
    color: '#1D9E75',
    background: 'rgba(29,158,117,0.08)',
    textDecoration: 'none',
    transition: 'background 150ms',
    lineHeight: 1.4,
  };

  if (output.href) {
    return (
      <a href={output.href} target="_blank" rel="noopener noreferrer" style={{ ...pill, cursor: 'pointer' }}>
        {OUTPUT_ICON[output.type]}
        {output.label}
      </a>
    );
  }

  return (
    <button onClick={onNoHref} style={{ ...pill, cursor: 'pointer', border: '0.5px solid rgba(29,158,117,0.35)' }}>
      {OUTPUT_ICON[output.type]}
      {output.label}
    </button>
  );
}

// ─── Institution logo placeholder ────────────────────────────────────────────

function InstitutionLogo({ item }: { item: ResearchItem }) {
  const initials = item.institutionShort.slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: 8,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(29,158,117,0.12)',
      border: '0.5px solid rgba(29,158,117,0.25)',
    }}>
      <span style={{
        fontSize: 11,
        fontFamily: 'var(--font-jetbrains-mono, monospace)',
        fontWeight: 600,
        color: '#1D9E75',
        letterSpacing: '0.04em',
      }}>
        {initials}
      </span>
    </div>
  );
}

// ─── Research card ────────────────────────────────────────────────────────────

function ResearchCard({
  item,
  onNoHref,
}: {
  item: ResearchItem;
  onNoHref: () => void;
}) {
  return (
    <div
      id={`research-${item.id}`}
      style={{
        background: 'rgba(26,26,46,0.5)',
        border: '0.5px solid rgba(255,255,255,0.07)',
        borderLeft: '2px solid #1D9E75',
        borderRadius: '0 12px 12px 0',
        padding: '24px 28px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <InstitutionLogo item={item} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: '#f0f0f5', lineHeight: 1.4, marginBottom: 4 }}>
              {item.title}
            </h3>
            <p style={{ fontSize: 14, color: '#1D9E75' }}>
              {item.role}
            </p>
            <p style={{ fontSize: 13, color: '#9898b0', marginTop: 2 }}>
              {item.institution}
            </p>
          </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          {/* Status badge */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            padding: '3px 10px',
            borderRadius: 999,
            background: item.status === 'current' ? 'rgba(29,158,117,0.12)' : 'rgba(255,255,255,0.05)',
            border: `0.5px solid ${item.status === 'current' ? 'rgba(29,158,117,0.3)' : 'rgba(255,255,255,0.1)'}`,
            color: item.status === 'current' ? '#1D9E75' : '#9898b0',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: item.status === 'current' ? '#1D9E75' : '#5a5a78',
              flexShrink: 0,
            }} />
            {item.status === 'current' ? 'Current' : 'Completed'}
          </span>
          {/* Date */}
          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            color: '#5a5a78',
          }}>
            {item.dateRange}
          </span>
        </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: '#9898b0', lineHeight: 1.7, margin: '16px 0' }}>
        {item.description}
      </p>

      {/* Highlight callout */}
      {item.highlight && (
        <div style={{
          background: 'rgba(29,158,117,0.08)',
          borderLeft: '2px solid #1D9E75',
          borderRadius: '0 6px 6px 0',
          padding: '10px 16px',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 14, color: '#9898b0', fontStyle: 'italic', lineHeight: 1.6 }}>
            {item.highlight}
          </p>
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {item.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: 10,
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            padding: '2px 8px',
            borderRadius: 4,
            background: 'rgba(10,10,18,0.8)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            color: '#9898b0',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Outputs */}
      {item.outputs.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {item.outputs.map((output, i) => (
            <OutputPill key={i} output={output} onNoHref={onNoHref} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Decorative neuron SVG ────────────────────────────────────────────────────

function NeuronDecoration() {
  return (
    <svg
      width={80}
      height={80}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      style={{ color: '#1D9E75', opacity: 0.4 }}
    >
      {/* Cell body */}
      <circle cx="40" cy="40" r="5" fill="currentColor" />
      {/* Dendrites */}
      <line x1="40" y1="35" x2="40" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="40" y1="14" x2="30" y2="6"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="40" y1="14" x2="50" y2="8"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="40" y1="24" x2="26" y2="18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="37" y1="37" x2="18" y2="28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="18" y1="28" x2="10" y2="20" stroke="currentColor" strokeWidth="1"   strokeLinecap="round" />
      <line x1="18" y1="28" x2="12" y2="36" stroke="currentColor" strokeWidth="1"   strokeLinecap="round" />
      <line x1="37" y1="43" x2="20" y2="52" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="20" y1="52" x2="14" y2="60" stroke="currentColor" strokeWidth="1"   strokeLinecap="round" />
      <line x1="43" y1="37" x2="62" y2="28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="62" y1="28" x2="70" y2="20" stroke="currentColor" strokeWidth="1"   strokeLinecap="round" />
      <line x1="62" y1="28" x2="68" y2="36" stroke="currentColor" strokeWidth="1"   strokeLinecap="round" />
      {/* Axon */}
      <line x1="40" y1="45" x2="40" y2="66" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="40" y1="66" x2="32" y2="74" stroke="currentColor" strokeWidth="1"   strokeLinecap="round" />
      <line x1="40" y1="66" x2="48" y2="74" stroke="currentColor" strokeWidth="1"   strokeLinecap="round" />
      {/* Terminal dots */}
      <circle cx="30"  cy="6"  r="1.5" fill="currentColor" />
      <circle cx="50"  cy="8"  r="1.5" fill="currentColor" />
      <circle cx="26"  cy="18" r="1.5" fill="currentColor" />
      <circle cx="10"  cy="20" r="1.5" fill="currentColor" />
      <circle cx="12"  cy="36" r="1.5" fill="currentColor" />
      <circle cx="14"  cy="60" r="1.5" fill="currentColor" />
      <circle cx="70"  cy="20" r="1.5" fill="currentColor" />
      <circle cx="68"  cy="36" r="1.5" fill="currentColor" />
      <circle cx="32"  cy="74" r="1.5" fill="currentColor" />
      <circle cx="48"  cy="74" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ─── Sidebar institution entry ────────────────────────────────────────────────

function InstitutionEntry({
  item,
  isActive,
  onClick,
}: {
  item: ResearchItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        textAlign: 'left',
      }}
    >
      {/* Dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: isActive ? '#1D9E75' : 'rgba(255,255,255,0.2)',
        flexShrink: 0,
        transition: 'background 200ms',
      }} />

      {/* Animated bar */}
      <motion.div
        animate={{ width: isActive ? 32 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ height: 1, background: '#1D9E75', flexShrink: 0, overflow: 'hidden' }}
      />

      {/* Label */}
      <span style={{
        fontSize: 13,
        fontFamily: 'var(--font-jetbrains-mono, monospace)',
        color: isActive ? '#f0f0f5' : '#5a5a78',
        transition: 'color 200ms',
        lineHeight: 1.4,
      }}>
        {item.institutionShort}
      </span>
    </button>
  );
}

// ─── Research section ─────────────────────────────────────────────────────────

export default function Research() {
  const [activeId, setActiveId] = useState<string>(research[0]?.id ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    research.forEach(({ id }) => {
      const el = document.getElementById(`research-${id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold: 0.4 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToCard = (id: string) => {
    document.getElementById(`research-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section style={{ padding: '120px 0', background: 'rgba(29,158,117,0.02)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#1D9E75',
            marginBottom: 12,
          }}>
            Research
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 500,
            color: '#f0f0f5',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Mapping signals to clinical insight
          </h2>
          <p style={{ color: '#9898b0', fontSize: 16, marginTop: 8, maxWidth: 540 }}>
            From EEG decoding to self-supervised learning — building diagnostic tools
            that bridge biology and computation
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:grid lg:items-start gap-12 lg:gap-16"
          style={{ gridTemplateColumns: '260px 1fr' }}>

          {/* LEFT: sticky sidebar */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {research.map((item) => (
                <InstitutionEntry
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  onClick={() => scrollToCard(item.id)}
                />
              ))}
            </div>
            <div style={{ marginTop: 48 }}>
              <NeuronDecoration />
            </div>
          </div>

          {/* RIGHT: cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {research.map((item, i) => (
              <SlideInLeft key={item.id} delay={i * 0.1}>
                <ResearchCard item={item} onNoHref={() => showToast('Coming soon')} />
              </SlideInLeft>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
