'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useActiveSection } from '@/hooks/useActiveSection';

// ─── Lobe facts ───────────────────────────────────────────────────────────────

const LOBE_FACTS = [
  {
    label: 'Frontal Cortex',
    color: '#6C63FF',
    section: 'research',
    fact: 'The prefrontal cortex enables working memory and executive function, key to BCI research, where motor intentions must be decoded before conscious awareness.',
  },
  {
    label: 'Temporal Lobe',
    color: '#6C63FF',
    section: 'research',
    fact: "Seizure activity most often originates in the temporal lobe. Owen's self-supervised EEG work at Toronto Western targeted these signatures, achieving 12% F1 improvement without manual labels.",
  },
  {
    label: 'Parietal Lobe',
    color: '#6C63FF',
    section: 'research',
    fact: 'Sensorimotor integration in the parietal cortex is central to prosthetic control. Decoding parietal EEG activity lets algorithms predict intended limb movements in real time.',
  },
  {
    label: 'Occipital Lobe',
    color: '#9B94FF',
    section: 'projects',
    fact: 'Visual cortex neurons detect edges, motion, and contrast, the same features convolutional networks learn first. NeuroLink uses analogous hierarchies for EEG anomaly detection.',
  },
  {
    label: 'Cerebellum',
    color: '#4A43CC',
    section: 'experience',
    fact: 'The cerebellum holds 10× more neurons than the cortex in just 10% of brain volume. Its rapid error-correction loops inspired the feedback architecture in the NeurotechX headband.',
  },
  {
    label: 'Brainstem',
    color: '#6C63FF',
    section: 'contact',
    fact: 'The brainstem sustains the most fundamental signals: breathing, heartbeat, consciousness. Owen is always open to fundamental questions, new directions, collaborations, ideas from first principles.',
  },
] as const;

const SECTION_TO_FACT_IDX: Record<string, number> = {
  research:   1,
  projects:   3,
  experience: 4,
  contact:    5,
};

const WIDGET_SECTION_IDS = ['hero', 'projects', 'research', 'experience', 'contact'] as const;

// ─── Neuron button icon ───────────────────────────────────────────────────────

function NeuronIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="3" fill="#6C63FF" />
      <line x1="11" y1="8"  x2="11" y2="2"  stroke="#6C63FF" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11" y1="14" x2="11" y2="20" stroke="#6C63FF" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="8"  y1="11" x2="2"  y2="11" stroke="#6C63FF" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="14" y1="11" x2="20" y2="11" stroke="#6C63FF" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Close icon ───────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
      <path d="M1 1l12 12M13 1L1 13" />
    </svg>
  );
}

// ─── BrainWidget ──────────────────────────────────────────────────────────────

export default function BrainWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  const pulseTriggered = useRef(false);
  const scrollYProgress = useScrollProgress();
  const activeSection   = useActiveSection(WIDGET_SECTION_IDS, { defaultId: 'hero' });

  // ── Scroll-triggered 3× pulse ───────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, 'change', (val) => {
    if (val > 0.25 && !pulseTriggered.current && !isOpen) {
      pulseTriggered.current = true;
      setPulsing(true);
      setTimeout(() => setPulsing(false), 2100); // 3 × 0.7s
    }
  });

  // ── Auto-cycle facts every 8 s ──────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex((i) => (i + 1) % LOBE_FACTS.length);
        setFactVisible(true);
      }, 300);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  // ── Scroll-linked fact via shared useActiveSection ──────────────────────────
  useEffect(() => {
    const idx = SECTION_TO_FACT_IDX[activeSection];
    if (idx === undefined) return;
    setFactVisible(false);
    const t = setTimeout(() => { setFactIndex(idx); setFactVisible(true); }, 200);
    return () => clearTimeout(t);
  }, [activeSection]);

  const currentFact = LOBE_FACTS[factIndex];

  return (
    <>
      {/* ── Closed trigger button ────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="trigger"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.span
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    position: 'absolute',
                    right: 60,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(10,10,18,0.9)',
                    color: '#F0F2F8',
                    fontSize: 12,
                    fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    padding: '4px 8px',
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                >
                  Neuro Guide
                </motion.span>
              )}
            </AnimatePresence>

            {/* Ambient pulse ring */}
            <span style={{
              position: 'absolute',
              inset: -5,
              borderRadius: '50%',
              border: `1px solid rgba(108,99,255,${pulsing ? '0.6' : '0.25'})`,
              animation: pulsing
                ? 'widgetPulseHard 0.7s ease-in-out 3'
                : 'widgetPulseIdle 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }} />

            {/* Button */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open Neuro Guide"
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(18,18,31,0.95)',
                border: '1px solid rgba(108,99,255,0.35)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <NeuronIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Expanded panel ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 12 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            layout
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: 'min(300px, calc(100vw - 32px))',
              background: 'rgba(14,14,26,0.97)',
              border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: 16,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              zIndex: 50,
              overflow: 'hidden',
              transformOrigin: 'bottom right',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ── Panel header ─────────────────────────────────────────────── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: '0.5px solid rgba(108,99,255,0.12)',
              flexShrink: 0,
            }}>
              {/* Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6C63FF', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#F0F2F8' }}>Neuro Guide</span>
              </div>

              {/* Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Neuro Guide"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#4A5270',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4,
                    marginLeft: 2,
                    borderRadius: 4,
                    transition: 'color 150ms',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F0F2F8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#4A5270'; }}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* ── Facts ────────────────────────────────────────────────────── */}
            <div style={{
              padding: '28px 16px 20px',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: 280,
            }}>
                <motion.div
                  key={factIndex}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: factVisible ? 1 : 0, y: factVisible ? 0 : -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <p style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    color: currentFact.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 6,
                  }}>
                    {currentFact.label}
                  </p>
                  <p style={{
                    fontSize: 12.5,
                    color: '#8B93B0',
                    lineHeight: 1.65,
                  }}>
                    {currentFact.fact}
                  </p>
                </motion.div>

                {/* Dot indicators */}
                <div style={{ display: 'flex', gap: 5, marginTop: 20, justifyContent: 'center' }}>
                  {LOBE_FACTS.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setFactVisible(false);
                        setTimeout(() => { setFactIndex(i); setFactVisible(true); }, 200);
                      }}
                      aria-label={f.label}
                      style={{
                        width: i === factIndex ? 16 : 5,
                        height: 5,
                        borderRadius: 999,
                        background: i === factIndex ? f.color : 'rgba(255,255,255,0.15)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 250ms',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes widgetPulseIdle {
          0%, 100% { transform: scale(1);   opacity: 0.5; }
          50%       { transform: scale(1.2); opacity: 0.15; }
        }
        @keyframes widgetPulseHard {
          0%   { transform: scale(1);   opacity: 0.7; }
          50%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1);   opacity: 0.7; }
        }
      `}</style>
    </>
  );
}
