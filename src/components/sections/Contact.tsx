'use client';

import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

export default function Contact() {
  return (
    <section style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <AnimateOnScroll>
            <h2 style={{
              fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: 0,
            }}>
              Contact
            </h2>
          </AnimateOnScroll>
        </div>

        <div
          className="flex flex-col items-stretch sm:flex-row sm:items-center"
          style={{ gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <AnimateOnScroll>
            <a
              href="mailto:o5kim@uwaterloo.ca"
              className="block w-full text-center sm:inline-block sm:w-auto"
              style={{
                padding: '9px 18px',
                background: 'var(--accent)',
                color: 'white',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              o5kim@uwaterloo.ca
            </a>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.07}>
            <a href="https://www.linkedin.com/in/owenkimm/"
               target="_blank" rel="noopener noreferrer"
               className="block w-full text-center sm:inline-block sm:w-auto"
               style={{
                 padding: '9px 18px',
                 background: 'transparent',
                 color: 'var(--text-primary)',
                 border: '1px solid var(--border)',
                 borderRadius: 8,
                 fontSize: 13,
                 textDecoration: 'none',
                 whiteSpace: 'nowrap',
               }}>
              LinkedIn ↗
            </a>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.14}>
            <a href="https://github.com/Owenkim2006"
               target="_blank" rel="noopener noreferrer"
               className="block w-full text-center sm:inline-block sm:w-auto"
               style={{
                 padding: '9px 18px',
                 background: 'transparent',
                 color: 'var(--text-primary)',
                 border: '1px solid var(--border)',
                 borderRadius: 8,
                 fontSize: 13,
                 textDecoration: 'none',
                 whiteSpace: 'nowrap',
               }}>
              GitHub ↗
            </a>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
