'use client';

import Navbar          from '@/components/layout/Navbar';
import Footer          from '@/components/layout/Footer';
import SectionDotNav   from '@/components/layout/SectionDotNav';
import Hero            from '@/components/sections/Hero';
import Research        from '@/components/sections/Research';
import Experience      from '@/components/sections/Experience';

export default function Home() {
  return (
    <main className="relative pointer-events-none">
      <Navbar />
      <SectionDotNav />

      <section id="hero" style={{ pointerEvents: 'none' }}>
        <Hero />
      </section>

      <section id="experience" className="section-overlay" style={{ scrollMarginTop: 56 }}>
        <Experience />
      </section>

      <section id="research" className="section-overlay" style={{ scrollMarginTop: 56 }}>
        <Research />
      </section>

      <Footer />
    </main>
  );
}
