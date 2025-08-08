export type Theme = 'light' | 'dark' | 'army' | 'navy' | 'marines';

export interface ThemeConfig {
  name: Theme;
  displayName: string;
  description: string;
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
  light: {
    name: 'light',
    displayName: 'Light',
    description: 'Clean and bright theme for better readability',
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    description: 'Easy on the eyes with dark backgrounds',
  },
  army: {
    name: 'army',
    displayName: 'Army',
    description: 'Military-inspired olive and khaki tones',
  },
  navy: {
    name: 'navy',
    displayName: 'Navy',
    description: 'Naval-inspired blue and steel tones',
  },
  marines: {
    name: 'marines',
    displayName: 'Marines',
    description: 'Marine-inspired red and bronze tones',
  },
};

export const defaultTheme: Theme = 'light';
