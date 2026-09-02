'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/projects';
import type { Project } from '@/types';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import ProjectIllustration from '@/components/ui/ProjectIllustration';

// ─── Constants ────────────────────────────────────────────────────────────────

type FilterKey =
  | 'all'
  | 'Machine Learning'
  | 'Electronics'
  | 'Hardware'
  | 'Health'
  | 'Software'
  | 'Design'
  | 'Research';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',               label: 'All'               },
  { key: 'Machine Learning',  label: 'Machine Learning'  },
  { key: 'Electronics',       label: 'Electronics'       },
  { key: 'Hardware',          label: 'Hardware'          },
  { key: 'Health',            label: 'Health'            },
  { key: 'Software',          label: 'Software'          },
  { key: 'Design',            label: 'Design'            },
  { key: 'Research',          label: 'Research'          },
];

// ─── Arrow ────────────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width={13} height={13} viewBox="0 0 14 14" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

// ─── Focal image area ─────────────────────────────────────────────────────────

function FocalImage({ project }: { project: Project }) {
  const cardImage = project.thumbnail ?? project.images?.[0];

  return (
    <div style={{
      width: '100%', height: 120,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      position: 'relative', overflow: 'hidden',
      flexShrink: 0,
    }}>
      {cardImage ? (
        <Image
          src={cardImage}
          alt={project.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 1100px"
          unoptimized={cardImage.endsWith('.gif')}
        />
      ) : (
        <ProjectIllustration
          projectId={project.id}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimateOnScroll delay={index * 0.06}>
      <Link
        href={`/projects/${project.id}`}
        style={{ textDecoration: 'none', display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          background: 'var(--bg-card)',
          border: `1px solid ${hovered ? 'var(--border-accent)' : 'var(--border)'}`,
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'border-color 200ms ease, transform 200ms ease',
          transform: hovered ? 'translateY(-2px)' : 'none',
          position: 'relative',
        }}>
          {project.wip && (
            <span style={{
              position: 'absolute',
              top: 14,
              right: 14,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.08em',
              padding: '3px 8px',
              borderRadius: 4,
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              color: '#fbbf24',
              zIndex: 1,
            }}>
              IN PROGRESS
            </span>
          )}

          {/* Focal image */}
          <FocalImage project={project} />

          {/* Content */}
          <div style={{ padding: 18 }}>

            <h3 style={{
              fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
              fontWeight: 500, letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              margin: '0 0 4px', lineHeight: 1.15,
            }}>
              {project.name}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--accent-light)', margin: '0 0 12px', fontWeight: 500 }}>
              {project.tagline}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {project.tags.slice(0, 4).map((tag) => (
                <span key={tag} style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </AnimateOnScroll>
  );
}

// ─── Compact row ──────────────────────────────────────────────────────────────

function CompactRow({ project, globalIndex, listIndex }: { project: Project; globalIndex: number; listIndex: number }) {
  const [hovered, setHovered] = useState(false);
  const cardImage = project.thumbnail ?? project.images?.[0];

  return (
    <AnimateOnScroll delay={listIndex * 0.04}>
      <Link
        href={`/projects/${project.id}`}
        style={{ textDecoration: 'none', display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '36px 40px 1fr auto',
          gap: 16, alignItems: 'center',
          padding: '16px 20px',
          background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
          border: `1px solid ${hovered ? 'var(--border-accent)' : 'var(--border)'}`,
          borderRadius: 12,
          marginBottom: 8,
          transition: 'background 200ms ease, border-color 200ms ease',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem', color: 'var(--text-muted)',
          }}>
            {String(globalIndex).padStart(2, '0')}
          </span>
          <div style={{
            width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
            background: 'var(--bg-surface)', position: 'relative',
          }}>
            {cardImage ? (
              <Image
                src={cardImage}
                alt={project.name}
                fill
                style={{ objectFit: 'contain' }}
                sizes="40px"
                unoptimized={cardImage.endsWith('.gif')}
              />
            ) : (
              <ProjectIllustration
                projectId={project.id}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            )}
          </div>
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 2px' }}>
              {project.name}
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>{project.tagline}</p>
          </div>
          <span style={{ color: hovered ? 'var(--accent-light)' : 'var(--text-muted)', transition: 'color 200ms ease' }}>
            <ArrowRight />
          </span>
        </div>
      </Link>
    </AnimateOnScroll>
  );
}

// ─── Projects section ─────────────────────────────────────────────────────────

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.tags.includes(activeFilter));

  const featured = filtered.filter((p) =>  p.featured);
  const compact  = filtered.filter((p) => !p.featured);

  return (
    <section style={{ padding: '120px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 72, position: 'relative' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 500, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', lineHeight: 1.15, margin: '0 0 16px',
          }}>
            Projects
          </h2>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 56 }}>
          {FILTERS.map(({ key, label }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  padding: '5px 14px', borderRadius: 999, fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border-hover)'}`,
                  color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-subtle)' : 'transparent',
                  cursor: 'pointer', transition: 'all 150ms ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ color: 'var(--text-muted)', fontSize: 14, padding: '48px 0' }}>
              No projects in this category.
            </motion.p>
          ) : (
            <motion.div key="content" layout>

              {featured.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {featured.map((project, i) => (
                    <motion.div key={project.id} layout>
                      <FeaturedCard project={project} index={i} />
                    </motion.div>
                  ))}
                </div>
              )}

              {compact.length > 0 && (
                <div style={{ marginTop: featured.length > 0 ? 16 : 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {compact.map((project, i) => (
                    <motion.div key={project.id} layout>
                      <CompactRow
                        project={project}
                        listIndex={i}
                        globalIndex={featured.length + i + 1}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
