// Light theme used by /portfolio and the detail pages it links to.
// Separate from the dark site palette in globals.css / theme.ts.
export const PF = {
  pageBg: '#F5F4FF',
  cardBg: '#FFFFFF',
  cardBorder: '#D8D6EE',
  cardBorderHover: '#4A42CC',
  textPrimary: '#0A0A1A',
  textSecondary: '#3D3D5C',
  textMuted: '#7070A0',
  accent: '#4A42CC',
  accentLight: '#E8E6FF',
  tagBg: '#E8E6FF',
  tagText: '#4A42CC',
  // next/font registers Inter / JetBrains Mono under generated family names,
  // so the CSS variables come first and the plain names are fallbacks.
  fontSans: 'var(--font-inter), Inter, system-ui, sans-serif',
  fontMono: 'var(--font-jetbrains-mono), JetBrains Mono, monospace',
} as const;
