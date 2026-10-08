'use client';

import { useEffect, useState } from 'react';
import { PF } from '@/lib/portfolioTheme';

export default function LightSlideshow({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    if (isPaused || count <= 1) return;
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % count), 3500);
    return () => clearInterval(timer);
  }, [isPaused, count]);

  if (count === 0) return null;

  const navBtn: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(255,255,255,0.92)', border: `1px solid ${PF.cardBorder}`,
    color: PF.textPrimary, fontSize: 16, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div
      style={{ marginBottom: 48, borderRadius: 12, overflow: 'hidden', border: `1px solid ${PF.cardBorder}`, background: PF.cardBg }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={{ position: 'relative', height: 'clamp(240px, 50vw, 420px)', background: PF.cardBg }}>
        <img
          key={current}
          src={images[current]}
          alt={`${name} image ${current + 1}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
        />
        {count > 1 && (
          <>
            <button type="button" aria-label="Previous image" style={{ ...navBtn, left: 12 }}
              onClick={() => setCurrent((prev) => (prev - 1 + count) % count)}>‹</button>
            <button type="button" aria-label="Next image" style={{ ...navBtn, right: 12 }}
              onClick={() => setCurrent((prev) => (prev + 1) % count)}>›</button>
            <div style={{
              position: 'absolute', bottom: 10, right: 14,
              fontFamily: PF.fontMono, fontSize: 11, color: PF.textSecondary,
              background: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: 4,
            }}>
              {current + 1} / {count}
            </div>
          </>
        )}
      </div>
      {count > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 6, padding: '10px 0',
          borderTop: `1px solid ${PF.accentLight}`,
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 20 : 6, height: 6, borderRadius: 3,
                border: 'none', padding: 0, cursor: 'pointer',
                background: i === current ? PF.accent : PF.cardBorder,
                transition: 'all 250ms ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
