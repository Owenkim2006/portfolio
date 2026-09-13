'use client'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '32px 24px',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>

        <div>
          <div style={{
            fontSize: 14,
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

        <a
          href="mailto:o5kim@uwaterloo.ca"
          style={{
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.color = 'var(--accent-light)'
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.color = 'var(--text-muted)'
          }}
        >
          o5kim@uwaterloo.ca
        </a>

      </div>
    </footer>
  )
}
