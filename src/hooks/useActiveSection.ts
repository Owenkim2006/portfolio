'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Observes a list of section element IDs and returns the one currently
 * in view. Callers must pass a stable (module-level) array to avoid
 * re-creating observers on every render.
 */
export function useActiveSection(
  sectionIds: readonly string[],
  options?: { threshold?: number; defaultId?: string; rootMargin?: string },
): string {
  const { threshold = 0.5, defaultId, rootMargin } = options ?? {};
  const [active, setActive] = useState<string>(defaultId ?? sectionIds[0] ?? '');
  const idsRef = useRef(sectionIds);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    idsRef.current.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold, rootMargin },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
    // idsRef.current is stable; threshold/rootMargin changes recreate observers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin]);

  return active;
}
