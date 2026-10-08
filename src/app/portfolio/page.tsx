'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { research } from '@/data/research';
import { experience } from '@/data/experience';
import { PF } from '@/lib/portfolioTheme';

// ─── Unified item type ────────────────────────────────────────────────────────

type PortfolioItem = {
  id: string;
  href: string;
  name: string;
  tagline: string;
  thumbnail?: string;
};

// Some thumbnails are very large GIFs; cards fall back to the first still image.
const isGif = (src?: string) => !!src && src.toLowerCase().endsWith('.gif');

function fromProject(id: string): PortfolioItem | null {
  const p = projects.find((x) => x.id === id);
  if (!p) return null;
  const thumb = p.thumbnail ?? p.images?.[0];
  return {
    id: p.id,
    href: `/projects/${p.id}`,
    name: p.name,
    tagline: p.tagline,
    thumbnail: isGif(thumb) ? p.images?.find((src) => !isGif(src)) : thumb,
  };
}

function fromExperience(id: string): PortfolioItem | null {
  const e = experience.find((x) => x.id === id);
  if (!e) return null;
  return {
    id: e.id,
    href: `/experience/${e.id}`,
    name: e.company,
    tagline: `${e.role} · ${e.dateRange}`,
    thumbnail: e.logo,
  };
}

function fromResearch(id: string): PortfolioItem | null {
  const r = research.find((x) => x.id === id);
  if (!r) return null;
  return {
    id: r.id,
    href: `/research/${r.id}`,
    name: r.title,
    tagline: r.authors.slice(0, 2).join(', ') + (r.authors.length > 2 ? ' et al.' : ''),
  };
}

// Hand-ordered: most recent / most important first.
const ITEMS: PortfolioItem[] = [
  fromExperience('sickkids'),
  fromExperience('uwaterloo-research'),
  fromExperience('harvard'),
  fromProject('emg-prosthetic'),
  fromResearch('dicoh'),
  fromResearch('harvard-parkinsons'),
  fromProject('cardioglasses'),
  fromProject('united-mobility'),
  fromProject('kidsability'),
  fromProject('analog-audio-amp'),
].filter((it): it is PortfolioItem => it !== null);

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ item }: { item: PortfolioItem }) {
  const [imgError, setImgError] = useState(false);
  const showImage = item.thumbnail && !imgError;

  return (
    <Link href={item.href} className="pf-card" style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        height: 220, width: '100%', overflow: 'hidden', background: PF.accentLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {showImage ? (
          <img
            src={item.thumbnail}
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <span style={{ fontSize: 64, fontWeight: 700, color: PF.accent, opacity: 0.2 }}>
            {item.name.charAt(0)}
          </span>
        )}
      </div>

      <div style={{ padding: '18px 20px', borderTop: `1px solid ${PF.accentLight}` }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: PF.textPrimary, marginBottom: 6 }}>
          {item.name}
        </div>
        <div style={{
          fontSize: 13, color: PF.textSecondary, lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.tagline}
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  return (
    <div style={{
      // Sits above the global NeuronCanvas rendered by the root layout.
      position: 'relative', zIndex: 1,
      background: PF.pageBg, minHeight: '100vh',
      fontFamily: PF.fontSans, color: PF.textPrimary,
    }}>
      <style>{`
        .pf-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 960px) { .pf-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 599px) { .pf-grid { grid-template-columns: 1fr; } }

        .pf-card {
          background: ${PF.cardBg}; border: 1px solid ${PF.cardBorder}; border-radius: 12px;
          overflow: hidden; cursor: pointer;
          transition: box-shadow 150ms ease, transform 150ms ease;
        }
        .pf-card:hover, .pf-card:focus-visible {
          box-shadow: 0 4px 20px rgba(74,66,204,0.12);
          transform: translateY(-2px);
          outline: none;
        }
        .pf-card:focus-visible { border-color: ${PF.cardBorderHover}; }
      `}</style>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Header */}
        <header style={{ paddingTop: 64, paddingBottom: 40, textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: PF.textPrimary,
            letterSpacing: '-0.02em', marginBottom: 8,
          }}>
            Owen Kim
          </h1>
          <p style={{
            fontSize: 14, color: PF.textMuted, fontFamily: PF.fontMono,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            Portfolio
          </p>
          <Link href="/" style={{
            fontSize: 12, fontFamily: PF.fontMono, color: PF.accent,
            textDecoration: 'none', display: 'block', marginBottom: 48,
          }}>
            ← owenkim.ca
          </Link>
        </header>

        <div className="pf-grid">
          {ITEMS.map((it) => <Card key={it.href} item={it} />)}
        </div>
      </main>
    </div>
  );
}
