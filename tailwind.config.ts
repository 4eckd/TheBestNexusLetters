import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base colors for light/dark themes
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Military color palettes
        military: {
          // Olive/Green palette
          olive: {
            50: '#f7f8f3',
            100: '#e8ecd9',
            200: '#d1dab8',
            300: '#b3c48d',
            400: '#95ab69',
            500: '#7a924c',
            600: '#5f733a',
            700: '#4a5a2e',
            800: '#3e4a28',
            900: '#353f24',
            950: '#1b2012',
          },
          // Khaki/Tan palette
          khaki: {
            50: '#fafaf5',
            100: '#f0f0e5',
            200: '#e0dfca',
            300: '#cac7a5',
            400: '#b5b081',
            500: '#9e9865',
            600: '#8a8555',
            700: '#726b47',
            800: '#5f583d',
            900: '#524c36',
            950: '#2f2a1d',
          },
          // Forest/Dark Green palette
          forest: {
            50: '#f0f9f0',
            100: '#dbf0db',
            200: '#b9e0b9',
            300: '#8cc98c',
            400: '#5aac5a',
            500: '#3d8f3d',
            600: '#2f722f',
            700: '#285a28',
            800: '#234823',
            900: '#1e3c1e',
            950: '#0d200d',
          },
          // Navy/Dark Blue palette
          navy: {
            50: '#f0f4f8',
            100: '#d9e2ec',
            200: '#bcccdc',
            300: '#9bb0c4',
            400: '#8193a8',
            500: '#6b7d8f',
            600: '#5a6b7d',
            700: '#4a5968',
            800: '#3e4a56',
            900: '#353f49',
            950: '#252b33',
          },
          // Camo Gray palette
          camo: {
            50: '#f8f9fa',
            100: '#e9ecef',
            200: '#d1d7db',
            300: '#adb5bd',
            400: '#868e96',
            500: '#6c757d',
            600: '#5a6268',
            700: '#495057',
            800: '#3d4449',
            900: '#343a40',
            950: '#212529',
          },
        },

        // Card and border colors
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Primary and secondary colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // Accent colors
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // Semantic colors
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
