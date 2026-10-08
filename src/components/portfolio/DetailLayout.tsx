import Link from 'next/link';
import { PF } from '@/lib/portfolioTheme';
import LightSlideshow from '@/components/portfolio/LightSlideshow';

// Light-theme detail page shell shared by /experience/[id] and /research/[id].
// Mirrors the structure of /projects/[id]: top bar, header, slideshow,
// main column + sidebar, bottom nav.

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: PF.fontMono, fontSize: 11, color: PF.textMuted,
      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
    }}>
      {children}
    </p>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ color: PF.accent, flexShrink: 0, lineHeight: 1.65 }}>›</span>
          <span style={{ fontSize: 15, color: PF.textSecondary, lineHeight: 1.65 }}>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {tags.map((tag) => (
        <span key={tag} style={{
          fontSize: 11, fontFamily: PF.fontMono, padding: '3px 10px', borderRadius: 4,
          background: PF.tagBg, color: PF.tagText,
        }}>
          {tag}
        </span>
      ))}
    </div>
  );
}

export function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="pf-link">
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}

type Props = {
  badge: string;
  title: string;
  subtitle?: string;
  images?: string[];
  /** Main column (description, highlights, …) */
  children: React.ReactNode;
  /** Right column (stack, links, …) */
  sidebar?: React.ReactNode;
};

export default function DetailLayout({ badge, title, subtitle, images, children, sidebar }: Props) {
  const backLink: React.CSSProperties = {
    fontFamily: PF.fontMono, fontSize: 13, color: PF.accent, textDecoration: 'none',
  };

  return (
    <main style={{
      position: 'relative', zIndex: 1, // above the global NeuronCanvas
      minHeight: '100vh', background: PF.pageBg,
      fontFamily: PF.fontSans, color: PF.textPrimary,
    }}>
      <style>{`
        .pf-link {
          display: inline-block; border: 1px solid ${PF.cardBorder}; border-radius: 8px;
          padding: 8px 16px; font-size: 13px; color: ${PF.accent}; text-decoration: none;
          background: ${PF.cardBg}; transition: background 150ms ease;
        }
        .pf-link:hover { background: ${PF.accentLight}; }
      `}</style>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(245,244,255,0.95)', borderBottom: `1px solid ${PF.cardBorder}`,
      }}>
        <div className="px-5 md:px-8" style={{ maxWidth: 1100, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center' }}>
          <Link href="/portfolio" style={backLink}>← Portfolio</Link>
        </div>
      </div>

      <div className="px-5 md:px-8" style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 64, paddingBottom: 120 }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontFamily: PF.fontMono,
            color: PF.accent, background: PF.accentLight, borderRadius: 999,
            padding: '3px 10px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            {badge}
          </span>
          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 500, letterSpacing: '-0.03em',
            color: PF.textPrimary, margin: '0 0 12px', lineHeight: 1.1,
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 18, color: PF.accent, margin: 0, fontWeight: 500 }}>{subtitle}</p>
          )}
        </div>

        {images && images.length > 0 && <LightSlideshow images={images} name={title} />}

        <div
          className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-x-0 md:gap-x-20 gap-y-10 md:gap-y-0"
          style={{ alignItems: 'start' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>{children}</div>
          {sidebar && <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>{sidebar}</div>}
        </div>

        {/* Bottom nav */}
        <div style={{
          marginTop: 96, paddingTop: 32, borderTop: `1px solid ${PF.cardBorder}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Link href="/portfolio" style={backLink}>← Portfolio</Link>
          <Link href="/#contact" style={backLink}>Get in touch →</Link>
        </div>
      </div>
    </main>
  );
}
