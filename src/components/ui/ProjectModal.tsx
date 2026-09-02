'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import type { Project } from '@/types';

// ─── Shared constants ─────────────────────────────────────────────────────────

// Single accent, category is conveyed by label text, not color.
const CATEGORY_META: Record<Project['category'], { text: string; bg: string; border: string; label: string }> = {
  'ai-health': { text: '#9B94FF', bg: 'rgba(108,99,255,0.12)', border: 'rgba(108,99,255,0.3)', label: 'AI & Health' },
  hardware:    { text: '#9B94FF', bg: 'rgba(108,99,255,0.12)', border: 'rgba(108,99,255,0.3)', label: 'Hardware'    },
  software:    { text: '#9B94FF', bg: 'rgba(108,99,255,0.12)', border: 'rgba(108,99,255,0.3)', label: 'Software'    },
  design:      { text: '#9B94FF', bg: 'rgba(108,99,255,0.12)', border: 'rgba(108,99,255,0.3)', label: 'Design'      },
};

// ─── Link pill ────────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
               0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
               -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
               .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
               -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
               .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
               .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
               0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2 10L10 2M10 2H5M10 2v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkPill({ link }: { link: Project['links'][number] }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 13, fontFamily: 'var(--font-jetbrains-mono, monospace)',
    textDecoration: 'none', borderRadius: 999,
    padding: '8px 16px', transition: 'opacity 150ms', whiteSpace: 'nowrap',
  };
  if (link.type === 'demo') return (
    <a href={link.href} target="_blank" rel="noopener noreferrer"
      style={{ ...base, background: '#6C63FF', color: '#fff', border: '0.5px solid #6C63FF' }}>
      <ExternalIcon /> Live Demo
    </a>
  );
  if (link.type === 'github') return (
    <a href={link.href} target="_blank" rel="noopener noreferrer"
      style={{ ...base, background: 'transparent', color: '#8B93B0', border: '0.5px solid rgba(255,255,255,0.15)' }}>
      <GitHubIcon /> Code
    </a>
  );
  if (link.type === 'devpost') return (
    <a href={link.href} target="_blank" rel="noopener noreferrer"
      style={{ ...base, background: 'transparent', color: '#9B94FF', border: '0.5px solid rgba(108,99,255,0.4)' }}>
      <ExternalIcon /> Devpost
    </a>
  );
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer"
      style={{ ...base, background: 'transparent', color: '#8B93B0', border: '0.5px solid rgba(255,255,255,0.15)' }}>
      <ExternalIcon /> View
    </a>
  );
}

// ─── Slideshow ────────────────────────────────────────────────────────────────

function PlaceholderSlide({ index, category, projectId }: {
  index: number;
  category: Project['category'];
  projectId: string;
}) {
  const cat = CATEGORY_META[category];
  const patternId = `modal-grid-${projectId}-${index}`;

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: `linear-gradient(135deg, rgba(14,14,26,0.95) 0%, rgba(20,20,38,1) 100%)`,
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
        <defs>
          <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={cat.text} strokeWidth="0.5" opacity="0.08" />
            <circle cx="0" cy="0" r="1.5" fill={cat.text} opacity="0.12" />
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
          background: `${cat.bg}`, border: `1px solid ${cat.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-jetbrains-mono, monospace)',
          fontSize: 16, fontWeight: 500, color: cat.text,
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

function ChevronLeft() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 3L5 8l5 5" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

function ImageSlideshow({ project, currentSlide, setCurrentSlide }: {
  project: Project;
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}) {
  const hasImages = (project.images?.length ?? 0) > 0;
  const totalSlides = hasImages ? project.images!.length : 3;

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
    <div style={{ height: 260, borderRadius: 12, overflow: 'hidden', position: 'relative', marginBottom: 24 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.22 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {hasImages ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={project.images![currentSlide]}
                alt={`${project.name} screenshot ${currentSlide + 1}`}
                fill
                style={{ objectFit: 'cover', borderRadius: 8 }}
                sizes="(max-width: 768px) 92vw, 720px"
              />
            </div>
          ) : (
            <PlaceholderSlide index={currentSlide} category={project.category} projectId={project.id} />
          )}
        </motion.div>
      </AnimatePresence>

      <button aria-label="Previous slide" onClick={prev}
        style={{ ...arrowBtn, left: 10 }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.8)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}>
        <ChevronLeft />
      </button>

      <button aria-label="Next slide" onClick={next}
        style={{ ...arrowBtn, right: 10 }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.8)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}>
        <ChevronRight />
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

// ─── ProjectModal ─────────────────────────────────────────────────────────────

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => { setCurrentSlide(0); }, [project?.id]);

  const handlersRef = useRef({ onClose, setCurrentSlide });
  handlersRef.current = { onClose, setCurrentSlide };

  useEffect(() => {
    if (!project) return;

    const hasImages = (project.images?.length ?? 0) > 0;
    const totalSlides = hasImages ? project.images!.length : 3;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')       handlersRef.current.onClose();
      if (e.key === 'ArrowLeft')    handlersRef.current.setCurrentSlide(s => (s - 1 + totalSlides) % totalSlides);
      if (e.key === 'ArrowRight')   handlersRef.current.setCurrentSlide(s => (s + 1) % totalSlides);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project]);

  if (!project) return null;

  const cat = CATEGORY_META[project.category];
  const prefersReduced = useReducedMotion();

  // Backdrop fades only, never transform so layout centering is unaffected.
  const backdropTransition = prefersReduced
    ? { duration: 0.15 }
    : { type: 'spring' as const, bounce: 0, duration: 0.25 };

  // Panel: damping 0.8 / response 0.3, slight overshoot because the modal
  // carries momentum from the click that opened it (Apple: drawer/sheet spec).
  // Exit is critically damped (no bounce), dismissal has no input momentum.
  const panelEnter = prefersReduced
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.94, y: 16 };
  const panelExit = prefersReduced
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.96, y: 8, transition: { type: 'spring' as const, bounce: 0, duration: 0.2 } };
  const panelTransition = prefersReduced
    ? { duration: 0.15 }
    : { type: 'spring' as const, bounce: 0.2, duration: 0.3 };

  return (
    // Backdrop, fullscreen flex container for centering.
    // Only animates opacity so its layout is never transformed.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={backdropTransition}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        background: 'rgba(4,5,10,0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Panel, scale/y animation only, no centering transforms */}
      <motion.div
        initial={panelEnter}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={panelExit}
        transition={panelTransition}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(720px, 100%)',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: 20,
          padding: 32,
        }}
      >
        {/* 1. Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
            <span style={{
              display: 'inline-block', marginBottom: 10,
              fontSize: 10, fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: cat.text, background: cat.bg, border: `0.5px solid ${cat.border}`,
              borderRadius: 999, padding: '3px 8px',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {cat.label}
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 500, color: '#F0F2F8', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              {project.name}
            </h2>
            <p style={{ fontSize: 14, color: '#9B94FF', margin: 0 }}>{project.tagline}</p>
          </div>
          <button
            aria-label="Close modal"
            onClick={onClose}
            style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: '#8B93B0', fontSize: 18, cursor: 'pointer',
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
        <ImageSlideshow
          project={project}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

        {/* 3. Long description */}
        {project.longDescription && (
          <p style={{ fontSize: 14, color: '#8B93B0', lineHeight: 1.75, marginBottom: 20 }}>
            {project.longDescription}
          </p>
        )}

        {/* 4. Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
              fontSize: 11, color: '#4A5270', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: 12,
            }}>
              Highlights
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.highlights.map((h, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
                    background: cat.text, marginTop: 5,
                  }} />
                  <span style={{ fontSize: 14, color: '#8B93B0', lineHeight: 1.55 }}>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. Tech stack tags */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            fontSize: 11, color: '#4A5270', textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: 10,
          }}>
            Stack
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontFamily: 'var(--font-jetbrains-mono, monospace)',
                padding: '3px 10px', borderRadius: 4,
                background: 'rgba(10,10,18,0.8)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                color: '#8B93B0',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 6. Links */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {project.links.map(link => <LinkPill key={link.href} link={link} />)}
        </div>
      </motion.div>
    </motion.div>
  );
}
