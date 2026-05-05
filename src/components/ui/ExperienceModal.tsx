'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { ExperienceItem } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_META: Record<ExperienceItem['type'], { label: string; text: string; bg: string; border: string }> = {
  research: { label: 'Research', text: '#1D9E75', bg: 'rgba(29,158,117,0.12)', border: 'rgba(29,158,117,0.3)' },
  software: { label: 'Software', text: '#BA7517', bg: 'rgba(186,117,23,0.12)', border: 'rgba(186,117,23,0.3)' },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg width={7} height={11} viewBox="0 0 7 11" fill="none"
      stroke="#D85A30" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
      <path d="M1 1l5 4.5L1 10" />
    </svg>
  );
}

function SlidePrev() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none"
      stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 3L5 8l5 5" />
    </svg>
  );
}

function SlideNext() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none"
      stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

// ─── Placeholder slide ────────────────────────────────────────────────────────

function PlaceholderSlide({ index, id }: { index: number; id: string }) {
  const patternId = `exp-modal-grid-${id}-${index}`;
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: 'linear-gradient(135deg, rgba(14,14,26,0.95) 0%, rgba(20,20,38,1) 100%)',
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
        <defs>
          <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#D85A30" strokeWidth="0.5" opacity="0.08" />
            <circle cx="0" cy="0" r="1.5" fill="#D85A30" opacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(216,90,48,0.12)', border: '1px solid rgba(216,90,48,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-jetbrains-mono, monospace)', fontSize: 16, fontWeight: 500, color: '#D85A30',
        }}>
          {index + 1}
        </div>
        <p style={{
          fontFamily: 'var(--font-jetbrains-mono, monospace)',
          fontSize: 11, color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Image {index + 1}
        </p>
      </div>
    </div>
  );
}

// ─── Slideshow ────────────────────────────────────────────────────────────────

function ExpSlideshow({ exp, currentSlide, setCurrentSlide }: {
  exp: ExperienceItem;
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}) {
  const hasImages  = (exp.images?.length ?? 0) > 0;
  const totalSlides = hasImages ? exp.images!.length : 3;

  const prev = () => setCurrentSlide(s => (s - 1 + totalSlides) % totalSlides);
  const next = () => setCurrentSlide(s => (s + 1) % totalSlides);

  const arrowBtn: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: 32, height: 32, borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2, transition: 'background 150ms',
  };

  return (
    <div style={{ height: 240, borderRadius: 12, overflow: 'hidden', position: 'relative', marginBottom: 24 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.22 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {hasImages ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={exp.images![currentSlide]}
                alt={`${exp.company} image ${currentSlide + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 92vw, 720px"
              />
            </div>
          ) : (
            <PlaceholderSlide index={currentSlide} id={exp.id} />
          )}
        </motion.div>
      </AnimatePresence>

      <button aria-label="Previous slide" onClick={prev}
        style={{ ...arrowBtn, left: 10 }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.8)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}>
        <SlidePrev />
      </button>

      <button aria-label="Next slide" onClick={next}
        style={{ ...arrowBtn, right: 10 }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.8)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}>
        <SlideNext />
      </button>

      <div style={{
        position: 'absolute', bottom: 10, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 6, zIndex: 2,
      }}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => setCurrentSlide(i)}
            style={{
              width: 6, height: 6, borderRadius: '50%', border: 'none', padding: 0,
              cursor: 'pointer', transition: 'background 200ms',
              background: i === currentSlide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
            }} />
        ))}
      </div>
    </div>
  );
}

// ─── ExperienceModal ──────────────────────────────────────────────────────────

interface Props {
  experience: ExperienceItem | null;
  onClose: () => void;
}

export default function ExperienceModal({ experience, onClose }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => { setCurrentSlide(0); }, [experience?.id]);

  const handlersRef = useRef({ onClose, setCurrentSlide });
  handlersRef.current = { onClose, setCurrentSlide };

  useEffect(() => {
    if (!experience) return;
    const hasImages  = (experience.images?.length ?? 0) > 0;
    const totalSlides = hasImages ? experience.images!.length : 3;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     handlersRef.current.onClose();
      if (e.key === 'ArrowLeft')  handlersRef.current.setCurrentSlide(s => (s - 1 + totalSlides) % totalSlides);
      if (e.key === 'ArrowRight') handlersRef.current.setCurrentSlide(s => (s + 1) % totalSlides);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [experience]);

  if (!experience) return null;

  const typeMeta = TYPE_META[experience.type];
  const hasLogo  = !!experience.logo;

  return (
    // Backdrop — fullscreen flex container for centering, only opacity animated
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        background: 'rgba(5,5,15,0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Panel — scale/y animation, no centering transform */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(720px, 100%)',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: 'rgba(14,14,26,0.98)',
          border: '1px solid rgba(216,90,48,0.15)',
          borderRadius: 20,
          padding: 32,
        }}
      >
        {/* 1. Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
          {/* Logo */}
          <div style={{
            width: 56, height: 56, borderRadius: 12, flexShrink: 0,
            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)',
            background: hasLogo ? 'white' : 'rgba(216,90,48,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {hasLogo ? (
              <Image
                src={experience.logo!}
                alt={experience.company}
                width={56}
                height={56}
                style={{ objectFit: 'contain', padding: 6 }}
              />
            ) : (
              <span style={{
                fontSize: 15, fontFamily: 'var(--font-jetbrains-mono, monospace)',
                fontWeight: 600, color: '#D85A30',
              }}>
                {experience.company.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 22, fontWeight: 500, color: '#f0f0f5', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              {experience.company}
            </h2>
            <p style={{ fontSize: 14, color: '#D85A30', margin: '0 0 4px' }}>
              {experience.role}
            </p>
            <p style={{
              fontSize: 11, fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: '#5a5a78', margin: '0 0 10px',
            }}>
              {experience.dateRange} · {experience.location}
            </p>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-jetbrains-mono, monospace)',
              padding: '3px 10px', borderRadius: 999,
              color: typeMeta.text, background: typeMeta.bg, border: `0.5px solid ${typeMeta.border}`,
            }}>
              {typeMeta.label}
            </span>
          </div>

          {/* Close */}
          <button
            aria-label="Close modal"
            onClick={onClose}
            style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: '#9898b0', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            ×
          </button>
        </div>

        {/* 2. Image slideshow */}
        <ExpSlideshow
          exp={experience}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

        {/* 3. Description */}
        <p style={{ fontSize: 14, color: '#9898b0', lineHeight: 1.75, marginBottom: 20 }}>
          {experience.description}
        </p>

        {/* 4. Key outcomes */}
        {experience.wins.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
              fontSize: 11, color: '#5a5a78', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: 12,
            }}>
              Key outcomes
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {experience.wins.map((win, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <ChevronRight />
                  <span style={{ fontSize: 14, color: '#9898b0', lineHeight: 1.55 }}>{win}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Stack tags */}
        {experience.stack.length > 0 && (
          <div>
            <p style={{
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
              fontSize: 11, color: '#5a5a78', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: 8,
            }}>
              Stack
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {experience.stack.map(tech => (
                <span key={tech} style={{
                  fontSize: 11, fontFamily: 'var(--font-jetbrains-mono, monospace)',
                  padding: '3px 10px', borderRadius: 4,
                  background: 'rgba(10,10,18,0.8)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  color: '#9898b0',
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
