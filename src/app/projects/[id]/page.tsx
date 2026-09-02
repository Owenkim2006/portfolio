import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import Slideshow from '@/components/ui/Slideshow';

const ACCENT = '#9B94FF';

// ─── Static params + metadata ─────────────────────────────────────────────────

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.name}, Owen Kim`,
    description: project.description,
  };
}

// ─── Category meta ────────────────────────────────────────────────────────────

// Single accent, category is conveyed by label text, not color.
const CATEGORY_META = {
  'ai-health': { text: '#9B94FF', bg: 'rgba(108,99,255,0.08)', border: 'rgba(108,99,255,0.2)', label: 'AI & Health' },
  hardware:    { text: '#9B94FF', bg: 'rgba(108,99,255,0.08)', border: 'rgba(108,99,255,0.2)', label: 'Hardware'    },
  software:    { text: '#9B94FF', bg: 'rgba(108,99,255,0.08)', border: 'rgba(108,99,255,0.2)', label: 'Software'    },
  design:      { text: '#9B94FF', bg: 'rgba(108,99,255,0.08)', border: 'rgba(108,99,255,0.2)', label: 'Design'      },
} as const;

// ─── Link icons ───────────────────────────────────────────────────────────────

function ExternalArrow() {
  return (
    <svg width={11} height={11} viewBox="0 0 12 12" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2 10L10 2M10 2H5M10 2v5" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const cat = CATEGORY_META[project.category];

  return (
    <main style={{ minHeight: '100vh', background: '#080b14' }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,11,20,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            fontSize: 14, fontWeight: 500, letterSpacing: '0.1em',
            color: '#6C63FF', textDecoration: 'none',
          }}>
            OK.
          </Link>
          <Link href="/#projects" style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            fontSize: 12, color: '#4A5270', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 150ms',
          }}>
            ← All projects
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: cat.text, background: cat.bg,
              border: `1px solid ${cat.border}`,
              borderRadius: 999, padding: '3px 10px',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {cat.label}
            </span>
            {project.wip && (
              <span style={{
                fontSize: 11, fontFamily: 'var(--font-jetbrains-mono, monospace)',
                color: '#fbbf24', background: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                borderRadius: 999, padding: '3px 10px',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                In Progress
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
            fontWeight: 500, letterSpacing: '-0.03em',
            color: '#F0F2F8', margin: '0 0 12px', lineHeight: 1.05,
          }}>
            {project.name}
          </h1>

          <p style={{ fontSize: 18, color: ACCENT, margin: 0, fontWeight: 500 }}>
            {project.tagline}
          </p>
        </div>

        {/* Image slideshow */}
        <Slideshow images={project.images ?? []} name={project.name} />

        {/* Content grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 300px',
          gap: '0 80px',
          alignItems: 'start',
        }}>

          {/* Left: description + highlights */}
          <div>
            <p style={{
              fontSize: 16, color: '#F0F2F8', lineHeight: 1.8,
              marginBottom: 48, fontWeight: 400,
            }}>
              {project.longDescription ?? project.description}
            </p>

            {project.highlights && project.highlights.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <p style={{
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                  fontSize: 11, color: '#9B94FF',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  marginBottom: 20,
                }}>
                  Technical highlights
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {project.highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{
                        flexShrink: 0, width: 1, alignSelf: 'stretch',
                        background: ACCENT, opacity: 0.4,
                        marginTop: 2,
                      }} />
                      <span style={{ fontSize: 15, color: '#8B93B0', lineHeight: 1.65 }}>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.gif && (
              <div style={{ marginBottom: 40 }}>
                <h2 style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: 16,
                }}>
                  Demo
                </h2>
                <div style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <img
                    src={project.gif}
                    alt={`${project.name} demo`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: 480,
                      objectFit: 'contain',
                      display: 'block',
                      background: 'var(--bg-card)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar: outcomes + stack + links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

            {/* Outcomes */}
            {project.outcomes.length > 0 && (
              <div>
                <p style={{
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                  fontSize: 11, color: '#9B94FF',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
                }}>
                  Outcomes
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {project.outcomes.map((o, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: ACCENT, flexShrink: 0, marginTop: 6, opacity: 0.6,
                      }} />
                      <span style={{ fontSize: 13, color: '#8B93B0', lineHeight: 1.55 }}>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stack */}
            <div>
              <p style={{
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
                fontSize: 11, color: '#9B94FF',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14,
              }}>
                Stack
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: 11, fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    padding: '3px 10px', borderRadius: 4,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#8B93B0',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {project.links.length > 0 && (
              <div>
                <p style={{
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                  fontSize: 11, color: '#9B94FF',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14,
                }}>
                  Links
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        fontSize: 13, fontFamily: 'var(--font-jetbrains-mono, monospace)',
                        color: '#6C63FF', textDecoration: 'none',
                      }}
                    >
                      <ExternalArrow /> {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{
          marginTop: 96, paddingTop: 32,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Link href="/#projects" style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            fontSize: 13, color: '#4A5270', textDecoration: 'none',
          }}>
            ← Back to projects
          </Link>
          <Link href="/#contact" style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            fontSize: 13, color: '#4A5270', textDecoration: 'none',
          }}>
            Get in touch →
          </Link>
        </div>

      </div>
    </main>
  );
}
