export const THEME = {
  colors: {
    neural: {
      purple: '#7F77DD',
      purpleLight: '#AFA9EC',
      purpleDark: '#3C3489',
    },
    synapse: {
      teal: '#1D9E75',
      tealLight: '#5DCAA5',
    },
    axon: {
      amber: '#BA7517',
      amberLight: '#EF9F27',
    },
    dendrite: {
      coral: '#D85A30',
      coralLight: '#F0997B',
    },
    bg: {
      base: '#0a0a12',
      surface: '#12121f',
      card: '#1a1a2e',
    },
    text: {
      primary: '#f0f0f5',
      secondary: '#9898b0',
      muted: '#5a5a78',
    },
  },
  sections: {
    hero: 'neural',
    research: 'synapse',
    projects: 'axon',
    experience: 'dendrite',
  },
} as const;

export type ThemeColor = typeof THEME.colors;
export type SectionName = keyof typeof THEME.sections;
