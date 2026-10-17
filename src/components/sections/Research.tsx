'use client';

import { research } from '@/data/research';
import type { ResearchItem, ResearchStatus } from '@/types';

// Under-review work first, then completed.
const STATUS_ORDER: ResearchStatus[] = ['review', 'published'];

// ─── Author list, bolds "Owen Kim" wherever it appears ───────────────────────

function AuthorList({ authors }: { authors: string[] }) {
  return (
    <>
      {authors.map((author, i) => (
        <span key={i}>
          {author === 'Owen Kim' ? (
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Owen Kim</strong>
          ) : (
            author
          )}
          {i < authors.length - 1 ? ', ' : ''}
        </span>
      ))}
    </>
  );
}

// ─── Publication entry (Google Scholar style: title, authors, venue) ─────────

function ResearchEntry({ item }: { item: ResearchItem }) {
  const href = item.links.find((l) => l.href)?.href;
  // "Under review" doubles as the venue line until there is a real venue.
  const venue = item.venue ?? (item.status === 'review' ? 'Under review' : undefined);

  return (
    <li style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="research-title">
          {item.title}
        </a>
      ) : (
        <span className="research-title">{item.title}</span>
      )}
      <div style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 6 }}>
        <AuthorList authors={item.authors} />
      </div>
      {venue && (
        <div style={{ fontSize: 15, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5, marginTop: 2 }}>
          {venue}
        </div>
      )}
    </li>
  );
}

// ─── Research section ─────────────────────────────────────────────────────────

export default function Research() {
  const items = STATUS_ORDER.flatMap((s) => research.filter((r) => r.status === s));

  return (
    <section className="home-section">
      <style>{`
        .research-title {
          display: block;
          font-size: 17px; font-weight: 500; line-height: 1.4;
          color: var(--text-primary); text-decoration: none;
        }
        a.research-title:hover { text-decoration: underline; text-underline-offset: 3px; }
      `}</style>

      <div className="home-container" style={{ maxWidth: 964 }}>
        <h2 className="home-h2" style={{ marginBottom: 8 }}>Research</h2>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((item) => <ResearchEntry key={item.id} item={item} />)}
        </ul>
      </div>
    </section>
  );
}
