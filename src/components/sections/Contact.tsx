'use client';

import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const links = [
  {
    href: 'mailto:o5kim@uwaterloo.ca',
    label: 'o5kim@uwaterloo.ca',
    className: 'px-8 py-4 rounded-xl text-sm font-medium transition-colors bg-accent text-white hover:bg-accent-light',
  },
  {
    href: 'https://github.com/Owenkim2006',
    label: 'GitHub ↗',
    external: true,
    className: 'px-8 py-4 rounded-xl font-mono text-sm border border-white/10 text-text-secondary hover:border-accent/40 hover:text-accent-light transition-colors',
  },
  {
    href: 'https://linkedin.com/in/owenkimm',
    label: 'LinkedIn ↗',
    external: true,
    className: 'px-8 py-4 rounded-xl font-mono text-sm border border-white/10 text-text-secondary hover:border-accent/40 hover:text-accent-light transition-colors',
  },
];

export default function Contact() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 120 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <AnimateOnScroll>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-light)',
              marginBottom: 12,
              display: 'inline-block',
            }}>
              Contact
            </span>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: 0,
              marginTop: 8,
            }}>
              Contact
            </h2>
          </AnimateOnScroll>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {links.map((link, index) => (
            <AnimateOnScroll key={link.href} delay={index * 0.07}>
              <a
                href={link.href}
                className={link.className}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
              </a>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
