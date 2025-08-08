# Theming System Documentation

## Overview

This application implements a comprehensive theming system with 5 distinct themes:
- **Light**: Clean and bright theme for better readability
- **Dark**: Easy on the eyes with dark backgrounds
- **Army**: Military-inspired olive and khaki tones
- **Navy**: Naval-inspired blue and steel tones
- **Marines**: Marine-inspired red and bronze tones

## Features

- 🎨 **CSS Variables**: All themes use CSS custom properties for smooth transitions
- 💾 **localStorage Persistence**: Theme preferences are automatically saved
- ⚡ **Smooth Transitions**: CSS transitions provide seamless theme switching
- 🔧 **TypeScript**: Fully typed with excellent developer experience
- ♿ **Accessible**: ARIA-compliant theme toggle components
- 🧪 **Well Tested**: Comprehensive unit and integration tests

## Usage

### Basic Setup

The theming system is automatically configured in the root layout. No additional setup is required.

```tsx
// src/app/layout.tsx
import { ThemeProvider } from '@/components/providers/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Using the useTheme Hook

```tsx
'use client';

import { useTheme } from '@/hooks/use-theme';

export function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('navy')}>
        Switch to Navy
      </button>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### Theme Toggle Component

The `ThemeToggle` component provides two variants:

#### Button Variant (Cycles through themes)
```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle variant="button" />
```

#### Dropdown Variant (Choose specific theme)
```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle variant="dropdown" />
```

## CSS Variables

Each theme defines the following CSS custom properties:

### Base Variables
```css
:root {
  --radius: 0.5rem;
  --theme-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Theme-Specific Variables
```css
/* Example: Light Theme */
[data-theme="light"] {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  /* ... more variables */
}
```

## Theme Configuration

Themes are configured in `src/types/theme.ts`:

```typescript
export type Theme = 'light' | 'dark' | 'army' | 'navy' | 'marines';

export const themeConfigs: Record<Theme, ThemeConfig> = {
  light: {
    name: 'light',
    displayName: 'Light',
    description: 'Clean and bright theme for better readability',
  },
  // ... other themes
};
```

## Advanced Usage

### Custom Theme Provider Props

```tsx
<ThemeProvider
  defaultTheme="dark"        // Set default theme
  storageKey="my-theme-key"  // Custom localStorage key
>
  {children}
</ThemeProvider>
```

### Accessing Theme Context Directly

```tsx
import { ThemeProvider, useTheme } from '@/components/providers/theme-provider';

// useTheme must be used within ThemeProvider
const { theme, setTheme, toggleTheme } = useTheme();
```

## CSS Transitions

All elements automatically receive smooth transitions when themes change:

```css
* {
  transition: var(--theme-transition);
}

body {
  transition: var(--theme-transition);
}
```

## Testing

The theming system includes comprehensive tests:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Test Files
- `src/hooks/__tests__/use-theme.test.tsx` - useTheme hook tests
- `src/components/ui/__tests__/theme-toggle.test.tsx` - ThemeToggle component tests
- `src/components/providers/__tests__/theme-provider.test.tsx` - ThemeProvider tests

## Tailwind CSS Integration

The theming system integrates seamlessly with Tailwind CSS:

```tsx
// Use semantic color classes
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 89+
- ✅ Safari 14+
- ✅ All browsers supporting CSS custom properties and localStorage

## Troubleshooting

### Hydration Issues
The ThemeProvider includes built-in hydration mismatch prevention:

```tsx
// Children are hidden until client-side hydration completes
if (!isHydrated) {
  return (
    <div style={{ visibility: 'hidden' }}>
      {children}
    </div>
  );
}
```

### localStorage Errors
The system gracefully handles localStorage errors:

```typescript
try {
  localStorage.setItem(storageKey, theme);
} catch (error) {
  console.warn('Failed to save theme to localStorage:', error);
}
```

### Theme Persistence
Themes are automatically saved to localStorage and restored on page load. Invalid themes are ignored and fall back to the default theme.

## Contributing

When adding new themes:

1. Add the theme to the `Theme` type in `src/types/theme.ts`
2. Add theme configuration to `themeConfigs`
3. Define CSS variables in `src/app/globals.css`
4. Update tests to include the new theme
5. Update documentation

## Performance

- CSS variables enable near-instant theme switching
- localStorage persistence prevents theme flashing
- Minimal JavaScript footprint (~2KB gzipped)
- No runtime CSS generation
