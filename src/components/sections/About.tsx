'use client'

import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

export default function About() {
  return (
    <section className="home-section" style={{ position: 'relative' }}>
      <div
        className="home-container grid grid-cols-[240px_1fr] gap-[44px] max-md:grid-cols-1 max-md:gap-[24px]"
        style={{ alignItems: 'center' }}
      >

        {/* Left — photo */}
        <AnimateOnScroll>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 240,
            margin: '0 auto',
          }}>
            {/* Photo placeholder — replace src with real photo */}
            <div style={{
              width: '100%',
              aspectRatio: '3/4',
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/owen.jpg"
                alt="Owen Kim"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                }}
                onError={(e) => {
                  // Fallback if photo not found
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              {/* Accent border glow */}
              <div style={{
                position: 'absolute',
                inset: -1,
                borderRadius: 16,
                border: '1px solid var(--accent-border)',
                pointerEvents: 'none',
              }}/>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Right — bio text */}
        <AnimateOnScroll delay={0.1}>
          <div>
            <h2 className="home-h2" style={{ marginBottom: 14 }}>About</h2>

            {/* Bio — placeholder, Owen will fill this in */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              <p style={{
                fontSize: '1.0625rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                margin: 0,
              }}>
                I'm a Biomedical Engineering student at the University of Waterloo, interested in neurotech, wearables, and the intersection of hardware and ML. I'm looking for Summer 2027 hardware and ML roles where I can help ship real products. Off the clock, you'll usually find me running, or playing volleyball, basketball, or ultimate frisbee.
              </p>
            </div>

            {/* Quick facts */}
            <div style={{
              marginTop: 20,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '8px 24px',
            }}>
              {[
                { label: 'Location', value: 'Waterloo, ON' },
                { label: 'Education', value: 'BASc Biomedical Engineering, UWaterloo' },
                { label: 'GPA', value: '3.91 / 4.0' },
                { label: 'Available', value: 'Summer 2027' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  gap: 14,
                  fontSize: 15,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    minWidth: 86,
                    flexShrink: 0,
                  }}>
                    {item.label}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </AnimateOnScroll>

      </div>
    </section>
  )
}
