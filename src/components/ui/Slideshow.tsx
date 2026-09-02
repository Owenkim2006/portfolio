'use client';

import { useEffect, useState } from 'react';

export default function Slideshow({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = images.length;

  // Auto-advance every 3.5 seconds
  useEffect(() => {
    if (isPaused || count <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, count]);

  if (count === 0) {
    return (
      <div style={{
        height: 320,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        marginBottom: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
      }}>
        Images coming soon
      </div>
    );
  }

  return (
    <div
      style={{ position: 'relative', marginBottom: 40, borderRadius: 12,
               overflow: 'hidden', border: '1px solid var(--border)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image container, fixed height, image covers it */}
      <div style={{ position: 'relative', height: 360, background: 'var(--bg-card)' }}>
        <img
          key={current}
          src={images[current]}
          alt={`${name} screenshot ${current + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
          }}
        />

        {/* Prev button */}
        {count > 1 && (
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + count) % count)}
            style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(8,11,20,0.7)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-primary)',
              fontSize: 16,
            }}
          >
            ‹
          </button>
        )}

        {/* Next button */}
        {count > 1 && (
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % count)}
            style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(8,11,20,0.7)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-primary)',
              fontSize: 16,
            }}
          >
            ›
          </button>
        )}

        {/* Slide counter */}
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--text-muted)',
          background: 'rgba(8,11,20,0.6)',
          padding: '2px 8px', borderRadius: 4,
        }}>
          {current + 1} / {count}
        </div>
      </div>

      {/* Dot indicators */}
      {count > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 6, padding: '10px 0',
          background: 'var(--bg-card)',
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                border: 'none',
                cursor: 'pointer',
                background: i === current
                  ? 'var(--accent)'
                  : 'rgba(255,255,255,0.15)',
                transition: 'all 250ms ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
