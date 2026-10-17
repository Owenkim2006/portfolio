// Neutral, paper-like theme used by /portfolio and the article-style detail
// pages it links to. Separate from the dark site palette in globals.css / theme.ts.
export const PF = {
  pageBg: '#FBFAF7',
  cardBg: '#FFFFFF',
  cardBorder: '#E4E1DA',
  cardBorderHover: '#1C1C1C',
  rule: '#E4E1DA',
  textPrimary: '#1C1C1C',
  textSecondary: '#45433F',
  textMuted: '#7A776F',
  accent: '#1C1C1C',
  accentLight: '#F1EFEA',
  // next/font registers fonts under generated family names, so the CSS
  // variables come first and the plain names are fallbacks.
  fontSerif: 'var(--font-serif), Newsreader, Georgia, serif',
  fontSans: 'var(--font-inter), Inter, system-ui, sans-serif',
  fontMono: 'var(--font-jetbrains-mono), JetBrains Mono, monospace',
} as const;
