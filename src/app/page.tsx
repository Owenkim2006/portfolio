'use client';

import Navbar          from '@/components/layout/Navbar';
import Footer          from '@/components/layout/Footer';
import SectionDotNav   from '@/components/layout/SectionDotNav';
import Hero            from '@/components/sections/Hero';
import Projects        from '@/components/sections/Projects';
import Research        from '@/components/sections/Research';
import Experience      from '@/components/sections/Experience';
import Contact         from '@/components/sections/Contact';

export default function Home() {
  return (
    <main className="relative pointer-events-none">
      <Navbar />
      <SectionDotNav />

      <section id="hero" style={{ pointerEvents: 'none' }}>
        <Hero />
      </section>

      <section id="projects" className="section-overlay" style={{ scrollMarginTop: 80 }}>
        <Projects />
      </section>

      <section id="experience" className="section-overlay" style={{ scrollMarginTop: 80 }}>
        <Experience />
      </section>

      <section id="research" className="section-overlay" style={{ scrollMarginTop: 80 }}>
        <Research />
      </section>

      <section id="contact" className="section-overlay" style={{ scrollMarginTop: 80 }}>
        <Contact />
      </section>

      <Footer />
    </main>
  );
}
