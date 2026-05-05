'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { projects } from '@/data/projects';
import type { Project } from '@/types';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import ProjectModal from '@/components/ui/ProjectModal';

// ─── Constants ────────────────────────────────────────────────────────────────

type FilterKey = 'all' | Project['category'];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All'        },
  { key: 'ai-health', label: 'AI & Health' },
  { key: 'hardware',  label: 'Hardware'   },
  { key: 'software',  label: 'Software'   },
  { key: 'design',    label: 'Design'     },
];

const CATEGORY_META: Record<Project['category'], { text: string; bg: string; border: string; label: string }> = {
  'ai-health': { text: '#1D9E75', bg: 'rgba(29,158,117,0.12)',  border: 'rgba(29,158,117,0.3)',  label: 'AI & Health' },
  hardware:    { text: '#BA7517', bg: 'rgba(186,117,23,0.12)',  border: 'rgba(186,117,23,0.3)',  label: 'Hardware'    },
  software:    { text: '#7F77DD', bg: 'rgba(127,119,221,0.12)', border: 'rgba(127,119,221,0.3)', label: 'Software'    },
  design:      { text: '#D85A30', bg: 'rgba(216,90,48,0.12)',   border: 'rgba(216,90,48,0.3)',   label: 'Design'      },
};

// ─── SVG icons ────────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
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

function ArrowUpRightIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2 10L10 2M10 2H5M10 2v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" />
    </svg>
  );
}

// ─── Link pill ────────────────────────────────────────────────────────────────

function LinkPill({ link }: { link: Project['links'][number] }) {
  const pill: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 12, fontFamily: 'var(--font-jetbrains-mono, monospace)',
    textDecoration: 'none', borderRadius: 999,
    padding: '5px 12px', transition: 'opacity 150ms', whiteSpace: 'nowrap',
  };
  if (link.type === 'demo') return (
    <a href={link.href} target="_blank" rel="noopener noreferrer"
      style={{ ...pill, background: '#BA7517', color: '#fff', border: '0.5px solid #BA7517' }}>
      <ArrowUpRightIcon /> Live Demo
    </a>
  );
  if (link.type === 'github') return (
    <a href={link.href} target="_blank" rel="noopener noreferrer"
      style={{ ...pill, background: 'transparent', color: '#9898b0', border: '0.5px solid rgba(255,255,255,0.15)' }}>
      <GitHubIcon /> Code
    </a>
  );
  if (link.type === 'devpost') return (
    <a href={link.href} target="_blank" rel="noopener noreferrer"
      style={{ ...pill, background: 'transparent', color: '#7F77DD', border: '0.5px solid rgba(127,119,221,0.4)' }}>
      <ArrowUpRightIcon /> Devpost
    </a>
  );
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer"
      style={{ ...pill, background: 'transparent', color: '#9898b0', border: '0.5px solid rgba(255,255,255,0.15)' }}>
      <ArrowUpRightIcon /> View
    </a>
  );
}

// ─── Auto-slide hook ──────────────────────────────────────────────────────────

function useAutoSlide(count: number, interval: number, paused: boolean) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % count);
    }, interval);
    return () => clearInterval(timer);
  }, [count, interval, paused]);
  return current;
}

// ─── Featured card slideshow ──────────────────────────────────────────────────

const SLIDE_COUNT = 3;

function FeaturedCardSlideshow({ project, paused }: { project: Project; paused: boolean }) {
  const current = useAutoSlide(SLIDE_COUNT, 3000, paused);
  const patternId = `card-slide-${project.id}`;

  return (
    <div style={{ height: 160, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(18,18,31,1) 100%)',
          }}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
            <defs>
              <pattern id={`${patternId}-${current}`} width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#7F77DD" strokeWidth="0.5" opacity="0.06" />
                <circle cx="0" cy="0" r="2" fill="#7F77DD" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId}-${current})`} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CategoryIcon category={project.category} size={48} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 6, zIndex: 2,
        pointerEvents: 'none',
      }}>
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
            transition: 'background 300ms',
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── "View details" hint ──────────────────────────────────────────────────────

function ViewDetailsHint() {
  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 11, fontFamily: 'var(--font-jetbrains-mono, monospace)',
        color: '#5a5a78', opacity: 0.6, transition: 'opacity 200ms', cursor: 'pointer',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
    >
      <ExpandIcon /> View details
    </div>
  );
}

// ─── Placeholder helpers ──────────────────────────────────────────────────────

function CategoryIcon({ category, size }: { category: Project['category']; size: number }) {
  const s = { fill: 'none', stroke: '#7F77DD', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  if (category === 'ai-health') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ opacity: 0.25 }}>
        <path {...s} strokeWidth="1.5" d="M20 10C14 10 9 14 8 20C6 26 9 32 14 35C13 37 14 40 17 41C19 42 21 41 22 39C23 41 25 43 24 43C25 43 27 41 26 39C27 41 29 42 31 41C34 40 35 37 34 35C39 32 42 26 40 20C39 14 34 10 28 10C26 10 25 11 24 12C23 11 22 10 20 10Z" />
        <line {...s} strokeWidth="0.8" x1="24" y1="12" x2="24" y2="42" />
        <path {...s} strokeWidth="0.8" d="M14 26C17 24 21 24 24 25" />
        <path {...s} strokeWidth="0.8" d="M34 26C31 24 27 24 24 25" />
      </svg>
    );
  }
  if (category === 'hardware') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ opacity: 0.25 }}>
        <rect {...s} strokeWidth="1.5" x="15" y="15" width="18" height="18" />
        <line {...s} strokeWidth="1.5" x1="15" y1="20" x2="9"  y2="20" /><line {...s} strokeWidth="1.5" x1="15" y1="24" x2="9"  y2="24" /><line {...s} strokeWidth="1.5" x1="15" y1="28" x2="9"  y2="28" />
        <line {...s} strokeWidth="1.5" x1="33" y1="20" x2="39" y2="20" /><line {...s} strokeWidth="1.5" x1="33" y1="24" x2="39" y2="24" /><line {...s} strokeWidth="1.5" x1="33" y1="28" x2="39" y2="28" />
        <line {...s} strokeWidth="1.5" x1="20" y1="15" x2="20" y2="9"  /><line {...s} strokeWidth="1.5" x1="24" y1="15" x2="24" y2="9"  /><line {...s} strokeWidth="1.5" x1="28" y1="15" x2="28" y2="9"  />
        <line {...s} strokeWidth="1.5" x1="20" y1="33" x2="20" y2="39" /><line {...s} strokeWidth="1.5" x1="24" y1="33" x2="24" y2="39" /><line {...s} strokeWidth="1.5" x1="28" y1="33" x2="28" y2="39" />
      </svg>
    );
  }
  if (category === 'software') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ opacity: 0.25 }}>
        <polyline {...s} strokeWidth="2.5" points="19,14 9,24 19,34" />
        <polyline {...s} strokeWidth="2.5" points="29,14 39,24 29,34" />
        <line {...s} strokeWidth="1.5" x1="27" y1="12" x2="21" y2="36" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ opacity: 0.25 }}>
      <path {...s} strokeWidth="1.5" d="M32 10L38 16L18 36L10 38L12 30Z" />
      <line {...s} strokeWidth="0.8" x1="30" y1="12" x2="36" y2="18" />
      <line {...s} strokeWidth="1.5" x1="14" y1="34" x2="18" y2="30" />
    </svg>
  );
}

function ProjectImageArea({ project, height, iconSize }: { project: Project; height: number; iconSize: number }) {
  const patternId = `grid-${project.id}`;

  if (project.image) {
    return (
      <div style={{ height, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <Image src={project.image} alt={project.name} fill style={{ objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div style={{
      height, flexShrink: 0, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(18,18,31,1) 100%)',
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
        <defs>
          <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#7F77DD" strokeWidth="0.5" opacity="0.06" />
            <circle cx="0" cy="0" r="2" fill="#7F77DD" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CategoryIcon category={project.category} size={iconSize} />
      </div>
    </div>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────

function FeaturedCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORY_META[project.category];

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(26,26,46,0.6)',
        border: `0.5px solid ${hovered ? 'rgba(127,119,221,0.2)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'border-color 200ms, transform 200ms',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <FeaturedCardSlideshow project={project} paused={hovered} />

      <div style={{ padding: 28, position: 'relative', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Corner glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(186,117,23,0.08) 0%, transparent 70%)',
        }} />

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <span style={{
            fontSize: 10, fontFamily: 'var(--font-jetbrains-mono, monospace)',
            color: cat.text, background: cat.bg, border: `0.5px solid ${cat.border}`,
            borderRadius: 999, padding: '3px 8px',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {cat.label}
          </span>
          {project.outcomes[0] && (
            <span style={{
              fontSize: 10, fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: '#BA7517', background: 'rgba(186,117,23,0.1)',
              border: '0.5px solid rgba(186,117,23,0.35)',
              borderRadius: 999, padding: '3px 8px',
              maxWidth: 200, textAlign: 'right', lineHeight: 1.4,
            }}>
              {project.outcomes[0]}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 500, color: '#f0f0f5', margin: '16px 0 4px', letterSpacing: '-0.01em' }}>
          {project.name}
        </h3>

        <p style={{ fontSize: 14, fontWeight: 500, color: '#BA7517', marginBottom: 12 }}>
          {project.tagline}
        </p>

        <p style={{
          fontSize: 14, color: '#9898b0', lineHeight: 1.65, marginBottom: 16,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 4,
              background: 'rgba(10,10,18,0.8)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              color: '#9898b0',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Links — stop propagation so clicks don't open modal */}
        <div
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 'auto', marginBottom: 14 }}
          onClick={e => e.stopPropagation()}
        >
          {project.links.map((link) => <LinkPill key={link.href} link={link} />)}
        </div>

        <ViewDetailsHint />
      </div>
    </div>
  );
}

// ─── Compact card ─────────────────────────────────────────────────────────────

function CompactCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const primaryLink = project.links[0];

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(18,18,31,0.8)',
        border: `0.5px solid ${hovered ? 'rgba(127,119,221,0.3)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 200ms',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      <ProjectImageArea project={project} height={100} iconSize={32} />

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f5', marginBottom: 4 }}>
          {project.name}
        </p>
        <p style={{ fontSize: 12, color: '#9898b0', marginBottom: 12, lineHeight: 1.5 }}>
          {project.tagline}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              fontSize: 10, padding: '2px 6px', borderRadius: 4,
              background: 'rgba(10,10,18,0.8)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              color: '#9898b0',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Primary link — stop propagation */}
        {primaryLink && (
          <a
            href={primaryLink.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: hovered ? '#f0f0f5' : '#9898b0',
              textDecoration: 'none', transition: 'color 200ms',
              marginBottom: 10,
            }}
          >
            <ArrowUpRightIcon /> {primaryLink.label}
          </a>
        )}

        <div style={{ marginTop: 'auto' }}>
          <ViewDetailsHint />
        </div>
      </div>
    </div>
  );
}

// ─── Projects section ─────────────────────────────────────────────────────────

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Scroll lock while modal is open
  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  const featured = filtered.filter((p) =>  p.featured);
  const compact  = filtered.filter((p) => !p.featured);

  return (
    <section style={{ padding: '120px 0', background: 'transparent' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#BA7517', marginBottom: 12,
          }}>
            Projects
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500,
            color: '#f0f0f5', letterSpacing: '-0.02em',
            lineHeight: 1.1, margin: 0,
          }}>
            From signal to system
          </h2>
          <p style={{ color: '#9898b0', fontSize: 16, marginTop: 8 }}>
            Building at the intersection of neuroengineering, AI, and product
          </p>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
          {FILTERS.map(({ key, label }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  padding: '6px 16px', borderRadius: 999, fontSize: 14,
                  border: `0.5px solid ${isActive ? '#BA7517' : 'rgba(255,255,255,0.12)'}`,
                  color: isActive ? '#BA7517' : '#9898b0',
                  background: isActive ? 'rgba(186,117,23,0.1)' : 'transparent',
                  cursor: 'pointer', transition: 'all 200ms',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: '#5a5a78', fontSize: 14, textAlign: 'center', padding: '48px 0' }}
            >
              No projects in this category
            </motion.p>
          ) : (
            <motion.div key="content" layout>

              {featured.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
                  gap: 24,
                  marginBottom: compact.length > 0 ? 32 : 0,
                }}>
                  {featured.map((project, i) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <AnimateOnScroll delay={i * 0.08}>
                        <FeaturedCard
                          project={project}
                          onOpen={() => setSelectedProject(project)}
                        />
                      </AnimateOnScroll>
                    </motion.div>
                  ))}
                </div>
              )}

              {compact.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 16,
                }}>
                  {compact.map((project, i) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <AnimateOnScroll delay={i * 0.05}>
                        <CompactCard
                          project={project}
                          onOpen={() => setSelectedProject(project)}
                        />
                      </AnimateOnScroll>
                    </motion.div>
                  ))}
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
