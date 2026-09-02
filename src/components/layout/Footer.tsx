'use client';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-primary)',
      padding: '40px 0',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>

        {/* Left — name + copyright */}
        <div>
          <div style={{
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}>
            Owen Kim
          </div>
          <div style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>
            © {year} · All rights reserved
          </div>
        </div>

        {/* Center — links */}
        <div style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
        }}>
          {[
            { label: 'Projects', href: '/#projects' },
            { label: 'Experience', href: '/#experience' },
            { label: 'Research', href: '/#research' },
            { label: 'Contact', href: '/#contact' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.color = 'var(--text-muted)';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right — socials */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a
            href="mailto:o5kim@uwaterloo.ca"
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = 'var(--accent-light)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = 'var(--text-muted)';
            }}
          >
            o5kim@uwaterloo.ca
          </a>
          <a
            href="https://www.linkedin.com/in/owenkimm/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = 'var(--accent-light)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = 'var(--text-muted)';
            }}
          >
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/Owenkim2006"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = 'var(--accent-light)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = 'var(--text-muted)';
            }}
          >
            GitHub ↗
          </a>
        </div>

      </div>
    </footer>
  );
}
