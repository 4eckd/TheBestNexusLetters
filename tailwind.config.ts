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

        // Core TheBestNexusLetters brand colors
        navy: {
          DEFAULT: '#0A1F44', // Navy Blue
          dark: '#050F28',    // Midnight Navy
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9bb0c4',
          400: '#8193a8',
          500: '#6b7d8f',
          600: '#5a6b7d',
          700: '#4a5968',
          800: '#3e4a56',
          900: '#0A1F44',
          950: '#050F28',
        },
        red: {
          DEFAULT: '#DC2450', // American Red
          dark: '#B4143C',    // Deep Crimson
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#DC2450',
          700: '#b91c1c',
          800: '#B4143C',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        white: {
          DEFAULT: '#F0F0F0', // Freebase White
        },
        contrast: {
          DEFAULT: '#327DC8', // Contrast Blue
          light: '#4FA0FF',   // Brighter for dark mode text
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#327DC8',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // Extended brand colors
        slate: {
          DEFAULT: '#464E5A',     // Slate Gray
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#464E5A',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        sand: {
          DEFAULT: '#EBDCC8',     // Warm Sand
          50: '#fefcf0',
          100: '#fdf5e1',
          200: '#fbecc4',
          300: '#f7de9c',
          400: '#f2c86f',
          500: '#EBDCC8',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        mist: {
          DEFAULT: '#C8E6FF',     // Sky Mist
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#C8E6FF',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },

        // Military color palettes (maintained for existing components)
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
          navyMilitary: {
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
      // Brand-specific gradients
      backgroundImage: {
        'gradient-patriot': 'linear-gradient(135deg, #0A1F44 0%, #327DC8 100%)',
        'gradient-energy': 'linear-gradient(135deg, #DC2450 0%, #B4143C 100%)',
        'gradient-skyline': 'linear-gradient(135deg, #C8E6FF 0%, #327DC8 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0A1F44 0%, #DC2450 50%, #327DC8 100%)',
        'gradient-sunset': 'linear-gradient(45deg, #DC2450 0%, #EBDCC8 100%)',
        'gradient-ocean': 'linear-gradient(180deg, #327DC8 0%, #0A1F44 100%)',
      },
      // Brand shadows tuned for themes
      boxShadow: {
        brand: '0 4px 20px rgba(10, 31, 68, 0.1)', // Navy shadow for light theme
        'brand-dark': '0 4px 20px rgba(50, 125, 200, 0.3)', // Contrast blue shadow for dark theme
        'brand-red': '0 4px 20px rgba(220, 36, 80, 0.2)', // Red shadow for emphasis
        'brand-soft': '0 2px 12px rgba(10, 31, 68, 0.05)', // Subtle navy shadow
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
