'use client';

import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

export default function Contact() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 120 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <AnimateOnScroll>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
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
                padding: '12px 24px',
                background: 'var(--accent)',
                color: 'white',
                borderRadius: 10,
                fontSize: 14,
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
                 padding: '12px 24px',
                 background: 'transparent',
                 color: 'var(--text-primary)',
                 border: '1px solid var(--border)',
                 borderRadius: 10,
                 fontSize: 14,
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
                 padding: '12px 24px',
                 background: 'transparent',
                 color: 'var(--text-primary)',
                 border: '1px solid var(--border)',
                 borderRadius: 10,
                 fontSize: 14,
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
