'use client';

import { useEffect, useState } from 'react';

const RESUME_HREF = '/documents/Owen Kim Resume - September 2026.pdf';

const LINKS = [
  { href: '/portfolio',                     label: 'Portfolio', external: false },
  { href: 'mailto:o5kim@uwaterloo.ca',      label: 'Email',     external: false },
  { href: 'https://github.com/Owenkim2006', label: 'GitHub',    external: true  },
  { href: RESUME_HREF,                      label: 'Resume',    external: true  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'auto',
        transition: 'background 250ms ease, border-color 250ms ease',
        background: scrolled ? 'rgba(8,11,20,0.92)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      }}
    >
      <style>{`
        .nav-link {
          font-size: 13px;
          color: var(--text-secondary);
          text-decoration: none;
          white-space: nowrap;
          transition: color 150ms ease;
        }
        .nav-link:hover { color: var(--text-primary); }
      `}</style>

      <div
        className="px-5 md:px-8"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a
          href="#hero"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          OK.
        </a>

        <div className="gap-4 md:gap-6" style={{ display: 'flex', alignItems: 'center' }}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link"
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
