export const THEME = {
  colors: {
    accent: {
      base: '#6C63FF',
      light: '#9B94FF',
      dark: '#4A43CC',
    },
    teal: {
      base: '#1D9E75',
      light: '#5DCAA5',
    },
    bg: {
      primary: '#080b14',
      surface: '#0f1320',
      card: '#141928',
      cardHover: '#1a2035',
    },
    text: {
      primary: '#F0F2F8',
      secondary: '#8B93B0',
      muted: '#4A5270',
      accent: '#9B94FF',
    },
  },
} as const;

export type ThemeColor = typeof THEME.colors;
