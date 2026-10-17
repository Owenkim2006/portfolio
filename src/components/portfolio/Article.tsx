import Link from 'next/link';
import { PF } from '@/lib/portfolioTheme';

// Report-style shell shared by /projects/[id], /experience/[id] and
// /research/[id]: title block with links up top, then headed sections of
// prose, lists and numbered figures.

export type ArticleLink = { label: string; href: string };

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 44 }}>
      <h2 className="article-h2">{title}</h2>
      {children}
    </section>
  );
}

export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\s*\n/).map((p, i) => <p key={i} className="article-p">{p}</p>)}
    </>
  );
}

export function List({ items }: { items: string[] }) {
  return (
    <ul className="article-list">
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  );
}

export function Figure({ src, n, caption, small }: { src: string; n: number; caption?: string; small?: boolean }) {
  const isVideo = src.toLowerCase().endsWith('.mp4');
  const maxHeight = small ? 280 : 480;
  return (
    <figure style={{ margin: small ? 0 : '32px 0' }}>
      <div style={{ background: PF.accentLight, border: `1px solid ${PF.rule}` }}>
        {isVideo ? (
          <video
            src={src}
            aria-label={caption ?? `Figure ${n}`}
            autoPlay loop muted playsInline
            style={{ display: 'block', width: '100%', maxHeight, objectFit: 'contain' }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={caption ?? `Figure ${n}`}
            loading={n > 1 ? 'lazy' : 'eager'}
            style={{ display: 'block', width: '100%', height: small ? maxHeight : undefined, maxHeight, objectFit: 'contain' }}
          />
        )}
      </div>
      <figcaption style={{ fontFamily: PF.fontSans, fontSize: 13, color: PF.textMuted, marginTop: 10, lineHeight: 1.5 }}>
        <span style={{ fontWeight: 600, color: PF.textSecondary }}>Figure {n}.</span>
        {caption ? ` ${caption}` : ''}
      </figcaption>
    </figure>
  );
}

/** Two-column grid of smaller figures, numbered from `start`. */
export function FigureGrid({ images, start }: { images: string[]; start: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20, marginTop: 8 }}>
      {images.map((src, i) => <Figure key={src} src={src} n={start + i} small />)}
    </div>
  );
}

type Props = {
  /** Small label above the title, e.g. "Project · Hardware" */
  kicker: string;
  title: string;
  /** Italic standfirst under the title */
  deck?: string;
  /** Byline / date line under the deck */
  meta?: React.ReactNode;
  links?: ArticleLink[];
  children: React.ReactNode;
};

export default function Article({ kicker, title, deck, meta, links = [], children }: Props) {
  return (
    <main style={{
      minHeight: '100vh', background: PF.pageBg, color: PF.textPrimary,
    }}>
      <style>{`
        .article-nav { font-family: ${PF.fontSans}; font-size: 13px; color: ${PF.textMuted}; text-decoration: none; }
        .article-nav:hover { color: ${PF.textPrimary}; }
        .article-h2 {
          font-family: ${PF.fontSerif}; font-size: 1.5rem; font-weight: 600;
          letter-spacing: -0.01em; line-height: 1.3; margin: 0 0 12px; color: ${PF.textPrimary};
        }
        .article-p, .article-list {
          font-family: ${PF.fontSerif}; font-size: 1.125rem; line-height: 1.7;
          color: ${PF.textSecondary}; margin: 0 0 18px;
        }
        .article-list { padding-left: 1.4em; list-style: disc; }
        .article-list li { margin-bottom: 8px; padding-left: 4px; }
        .article-list li::marker { color: ${PF.textMuted}; }
        .article-link {
          font-family: ${PF.fontSans}; font-size: 14px; font-weight: 500; color: ${PF.textPrimary};
          text-decoration: none; border: 1px solid ${PF.textPrimary}; border-radius: 4px;
          padding: 6px 14px; transition: background 150ms ease, color 150ms ease;
        }
        .article-link:hover { background: ${PF.textPrimary}; color: ${PF.pageBg}; }
      `}</style>

      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${PF.rule}` }}>
        <div className="px-5" style={{
          maxWidth: 720, margin: '0 auto', height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/portfolio" className="article-nav">← Portfolio</Link>
          <Link href="/" className="article-nav">Owen Kim</Link>
        </div>
      </div>

      <article className="px-5" style={{ maxWidth: 720, margin: '0 auto', paddingTop: 56, paddingBottom: 96 }}>

        {/* Title block */}
        <header style={{ paddingBottom: 28, borderBottom: `1px solid ${PF.rule}` }}>
          <p style={{
            fontFamily: PF.fontSans, fontSize: 12, fontWeight: 500, color: PF.textMuted,
            textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px',
          }}>
            {kicker}
          </p>
          <h1 style={{
            fontFamily: PF.fontSerif, fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 600,
            letterSpacing: '-0.02em', lineHeight: 1.15, margin: 0,
          }}>
            {title}
          </h1>
          {deck && (
            <p style={{
              fontFamily: PF.fontSerif, fontStyle: 'italic', fontSize: '1.25rem',
              color: PF.textSecondary, lineHeight: 1.5, margin: '12px 0 0',
            }}>
              {deck}
            </p>
          )}
          {meta && (
            <div style={{ fontFamily: PF.fontSans, fontSize: 14, color: PF.textMuted, lineHeight: 1.6, marginTop: 16 }}>
              {meta}
            </div>
          )}
          {links.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
              {links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="article-link">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </header>

        {children}

        <footer style={{
          marginTop: 72, paddingTop: 24, borderTop: `1px solid ${PF.rule}`,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <Link href="/portfolio" className="article-nav">← Back to portfolio</Link>
          <a href="mailto:o5kim@uwaterloo.ca" className="article-nav">o5kim@uwaterloo.ca</a>
        </footer>
      </article>
    </main>
  );
}
