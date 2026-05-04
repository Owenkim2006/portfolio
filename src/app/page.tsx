'use client';

import NeuronCanvas    from '@/components/layout/NeuronCanvas';
import Navbar          from '@/components/layout/Navbar';
import Footer          from '@/components/layout/Footer';
import SectionDotNav   from '@/components/layout/SectionDotNav';
import BrainWidget     from '@/components/layout/BrainWidget';
import Hero            from '@/components/sections/Hero';
import Projects        from '@/components/sections/Projects';
import Research        from '@/components/sections/Research';
import Experience      from '@/components/sections/Experience';
import Contact         from '@/components/sections/Contact';

export default function Home() {
  return (
    <main className="relative">
      <NeuronCanvas />

      <Navbar />
      <SectionDotNav />

      <section id="hero">
        <Hero />
      </section>

      <section id="projects" style={{ scrollMarginTop: 80 }}>
        <Projects />
      </section>

      <section id="research" style={{ scrollMarginTop: 80 }}>
        <Research />
      </section>

      <section id="experience" style={{ scrollMarginTop: 80 }}>
        <Experience />
      </section>

      <section id="contact" style={{ scrollMarginTop: 80 }}>
        <Contact />
      </section>

      <Footer />
      <BrainWidget />
    </main>
  );
}
