'use client';

import { useEffect, useState } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';

const NAV = [
  { href: '#projects',   id: 'projects',   label: 'Projects'   },
  { href: '#experience', id: 'experience', label: 'Experience' },
  { href: '#research',   id: 'research',   label: 'Research'   },
  { href: '#contact',    id: 'contact',    label: 'Contact'    },
];

const NAV_IDS = NAV.map((n) => n.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(NAV_IDS, {
    defaultId: '',
    threshold: 0.3,
    rootMargin: '-20% 0px -20% 0px',
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
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
        width: '100%',
        height: 64,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'auto',
        transition: 'all 350ms ease',
        background: scrolled ? 'rgba(8,11,20,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 32px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a
          href="#hero"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          OK.
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {NAV.map((n) => {
            const isActive = activeSection === n.id;
            return (
              <a
                key={n.href}
                href={n.href}
                style={{
                  fontSize: '0.875rem',
                  color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
              >
                <span className="hidden sm:inline">{n.label}</span>
                <span className="sm:hidden">{n.label[0]}</span>
              </a>
            );
          })}

          <a
            href="https://www.linkedin.com/in/owenkimm/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
