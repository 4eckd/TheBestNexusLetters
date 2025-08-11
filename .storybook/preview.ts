import type { Preview } from '@storybook/nextjs';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
      ],
    },
    a11y: {
      // Configure accessibility testing
      config: {
        rules: [
          {
            // Ensure color contrast meets WCAG standards
            id: 'color-contrast',
            enabled: true,
          },
          {
            // Check for proper ARIA labels
            id: 'aria-valid-attr',
            enabled: true,
          },
          {
            // Ensure keyboard navigation
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
      // Show violations in the UI for development
      // Can be set to true in development to see accessibility violations
      test: process.env.NODE_ENV === 'development',
    },
    docs: {
      // Enable automatic documentation
      autodocs: 'tag',
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
