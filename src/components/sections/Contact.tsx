'use client';

import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const links = [
  {
    href: 'mailto:owen18kim@gmail.com',
    label: 'owen18kim@gmail.com',
    className: 'px-8 py-4 rounded-xl text-sm font-medium transition-colors bg-neural-purple text-white hover:bg-neural-purple-light',
  },
  {
    href: 'https://github.com/Owenkim2006',
    label: 'GitHub ↗',
    external: true,
    className: 'px-8 py-4 rounded-xl font-mono text-sm border border-white/10 text-text-secondary hover:border-neural-purple/40 hover:text-neural-purple transition-colors',
  },
  {
    href: 'https://linkedin.com/in/owenkimm',
    label: 'LinkedIn ↗',
    external: true,
    className: 'px-8 py-4 rounded-xl font-mono text-sm border border-white/10 text-text-secondary hover:border-neural-purple/40 hover:text-neural-purple transition-colors',
  },
];

export default function Contact() {
  return (
    <div className="py-36 px-8 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <AnimateOnScroll>
          <p className="font-mono text-xs tracking-widest uppercase mb-6 text-neural-purple">
            Contact
          </p>
          <h2 className="text-4xl md:text-6xl font-medium leading-tight mb-6 text-text-primary">
            Let&apos;s build something
            <br />
            <span className="text-neural-purple">worth remembering.</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-4 leading-relaxed text-text-secondary">
            Actively seeking R&amp;D, product, and engineering roles in neurotech, medical AI,
            and health tech — available Fall 2026.
          </p>
          <p className="font-mono text-xs text-text-muted mb-12 tracking-wide">
            Based in Waterloo, ON · Open to remote and hybrid roles
          </p>
        </AnimateOnScroll>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {links.map((link, index) => (
            <AnimateOnScroll key={link.href} delay={index * 0.07}>
              <a
                href={link.href}
                className={link.className}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
              </a>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
}
