export default function Footer() {
  return (
    <footer
      className="py-8 px-8"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
          © 2025 Owen Kim
        </span>
        <span className="font-mono text-xs" style={{ color: 'rgba(127,119,221,0.4)' }}>
          Next.js · Framer Motion · Tailwind CSS v4
        </span>
      </div>
    </footer>
  );
}
