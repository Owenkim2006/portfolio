'use client'

import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

export default function About() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 120, position: 'relative' }}>
      <div
        className="grid grid-cols-2 gap-[80px] max-md:grid-cols-1 max-md:gap-[40px]"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          alignItems: 'center',
        }}
      >

        {/* Left — photo */}
        <AnimateOnScroll>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
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
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: 40,
            }}>
              About
            </h2>

            {/* Bio — placeholder, Owen will fill this in */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              <p style={{
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                margin: 0,
              }}>
                I'm a Biomedical Engineering student at the University of Waterloo who is eager to join the wearable device and neurotech fields. Right now I'm doing an R&D co-op at SickKids working on pediatric neuromodulation tech, and I'm generally chasing the intersection of hardware, sensors, and AI, aiming to eventually build real, shipped products. Off the clock, you'll usually find me playing volleyball, basketball, or ultimate frisbee!
              </p>
            </div>

            {/* Quick facts */}
            <div style={{
              marginTop: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              {[
                { label: 'Location', value: 'Waterloo, ON' },
                { label: 'Education', value: 'BASc Biomedical Engineering, UWaterloo' },
                { label: 'GPA', value: '3.91 / 4.0' },
                { label: 'Available', value: 'Summer 2027' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  gap: 16,
                  fontSize: 13,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    minWidth: 90,
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
