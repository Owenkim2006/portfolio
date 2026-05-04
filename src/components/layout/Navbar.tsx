'use client';

import { useEffect, useState } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';

const NAV = [
  { href: '#projects',   id: 'projects',   label: 'Projects',   dot: '#BA7517' },
  { href: '#research',   id: 'research',   label: 'Research',   dot: '#1D9E75' },
  { href: '#experience', id: 'experience', label: 'Experience', dot: '#D85A30' },
  { href: '#contact',    id: 'contact',    label: 'Contact',    dot: '#7F77DD' },
];

const NAV_IDS = NAV.map((n) => n.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(NAV_IDS, { defaultId: '' });

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
        height: 68,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        transition: 'background 300ms ease, backdrop-filter 300ms ease, border-color 300ms ease',
        background: scrolled ? 'rgba(10,10,18,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(127,119,221,0.12)' : '1px solid transparent',
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
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: '#7F77DD',
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? '#f0f0f5' : '#9898b0',
                  textDecoration: 'none',
                  transition: 'color 200ms',
                }}
              >
                <span style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: n.dot,
                  flexShrink: 0,
                  opacity: isActive ? 1 : 0.35,
                  transition: 'opacity 200ms',
                }} />
                <span className="hidden sm:inline">{n.label}</span>
                <span className="sm:hidden">{n.label[0]}</span>
              </a>
            );
          })}

          <a
            href="https://github.com/Owenkim2006"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
              fontSize: 12,
              color: '#5a5a78',
              textDecoration: 'none',
              transition: 'color 200ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7F77DD')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5a5a78')}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
