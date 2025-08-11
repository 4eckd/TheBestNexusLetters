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
        <ThemeProvider>{children}</ThemeProvider>
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
      <button onClick={() => setTheme('navy')}>Switch to Navy</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Theme Toggle Component

The `ThemeToggle` component provides three variants:

#### Button Variant (Cycles through themes)

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle variant="button" />;
```

#### Switch Variant (Light/Dark toggle)

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle variant="switch" />;
```

#### Dropdown Variant (Choose specific theme)

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle variant="dropdown" />;
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
[data-theme='light'] {
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
  defaultTheme="dark" // Set default theme
  storageKey="my-theme-key" // Custom localStorage key
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
  return <div style={{ visibility: 'hidden' }}>{children}</div>;
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

## Hero Image Guidelines

### Overview

Hero images are a critical component of The Best Nexus Letters visual design. These guidelines ensure consistent, professional, and accessible hero image implementation across all themes.

### Image Specifications

#### Required Dimensions

```typescript
// Hero image dimensions
const HERO_IMAGE_SPECS = {
  desktop: {
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
  },
  tablet: {
    width: 1024,
    height: 768,
    aspectRatio: '4:3',
  },
  mobile: {
    width: 768,
    height: 1024,
    aspectRatio: '3:4',
  },
};
```

#### File Formats & Optimization

- **Primary Format**: WebP for modern browsers
- **Fallback Format**: JPEG (quality: 85)
- **File Size Limit**: 500KB maximum
- **Progressive Loading**: Enabled for all hero images
- **Lazy Loading**: Only for below-the-fold hero images

### Theme-Aware Hero Images

#### Color Compatibility

```css
/* Hero image overlay for theme compatibility */
.hero-image {
  position: relative;
  overflow: hidden;
}

.hero-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--hero-overlay);
  z-index: 1;
}

/* Theme-specific overlays */
[data-theme='light'] .hero-image::before {
  --hero-overlay: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .hero-image::before {
  --hero-overlay: rgba(0, 0, 0, 0.3);
}

[data-theme='army'] .hero-image::before {
  --hero-overlay: rgba(75, 85, 58, 0.2);
}

[data-theme='navy'] .hero-image::before {
  --hero-overlay: rgba(30, 58, 85, 0.2);
}

[data-theme='marines'] .hero-image::before {
  --hero-overlay: rgba(153, 27, 27, 0.2);
}
```

### Implementation Examples

#### Basic Hero Component

```tsx
// components/ui/Hero.tsx
import { useTheme } from '@/hooks/use-theme';
import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  className = '',
}) => {
  const { theme } = useTheme();

  return (
    <section className={`hero-section ${className}`}>
      <div className="hero-image">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
      </div>
    </section>
  );
};
```

#### Responsive Hero Images

```tsx
// Advanced hero with responsive images
export const ResponsiveHero: React.FC<HeroProps> = ({
  imageSrc,
  imageAlt,
  ...props
}) => {
  return (
    <picture>
      <source
        media="(max-width: 768px)"
        srcSet={`${imageSrc}-mobile.webp 768w`}
        type="image/webp"
      />
      <source
        media="(max-width: 1024px)"
        srcSet={`${imageSrc}-tablet.webp 1024w`}
        type="image/webp"
      />
      <source srcSet={`${imageSrc}-desktop.webp 1920w`} type="image/webp" />
      <Image
        src={`${imageSrc}-desktop.jpg`}
        alt={imageAlt}
        width={1920}
        height={1080}
        priority
        className="hero-image"
      />
    </picture>
  );
};
```

### Accessibility Guidelines

#### Alt Text Requirements

- **Descriptive**: Describe the image content, not just "hero image"
- **Context-Aware**: Include relevant context for the page/section
- **Concise**: Keep under 125 characters
- **Action-Oriented**: Include any relevant calls-to-action

**Examples:**

```typescript
// Good alt text examples
const altTextExamples = {
  homepage:
    'Veterans receiving professional medical consultation for nexus letter services',
  about:
    'Team of medical professionals reviewing veteran disability documentation',
  services:
    "Medical expert writing comprehensive nexus letter for veteran's claim",
  contact:
    'Professional consultation meeting between veteran and medical specialist',
};
```

#### Color Contrast Requirements

- **Text Overlay**: Minimum 4.5:1 contrast ratio with background
- **Focus Indicators**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Clear visual distinction from background

### Performance Optimization

#### Image Loading Strategy

```typescript
// Hero image loading configuration
const heroImageConfig = {
  priority: true, // Above-the-fold hero images
  quality: 85, // Balance quality vs file size
  placeholder: 'blur', // Smooth loading experience
  sizes: {
    mobile: '100vw',
    tablet: '100vw',
    desktop: '100vw',
  },
};
```

#### Critical Resource Hints

```html
<!-- Preload critical hero images -->
<link rel="preload" as="image" href="/images/hero-desktop.webp" />
<link
  rel="preload"
  as="image"
  href="/images/hero-mobile.webp"
  media="(max-width: 768px)"
/>
```

### Content Guidelines

#### Image Selection Criteria

1. **Professional Quality**: High-resolution, professionally shot or designed
2. **Brand Alignment**: Consistent with military/veteran themes
3. **Emotional Connection**: Evokes trust, professionalism, and support
4. **Diversity**: Represents diverse veteran community
5. **Action-Oriented**: Shows services in use or positive outcomes

#### Prohibited Content

- Generic stock photos without veteran context
- Images with poor quality or resolution
- Content that could be triggering to veterans
- Images with embedded text (use overlay text instead)
- Copyrighted material without proper licensing

### Testing Checklist

- [ ] **Load Time**: Hero images load within 2 seconds
- [ ] **Theme Compatibility**: Images work across all 5 themes
- [ ] **Responsive Design**: Proper display on all device sizes
- [ ] **Accessibility**: Alt text and contrast requirements met
- [ ] **SEO Optimization**: Proper file names and metadata
- [ ] **Browser Support**: WebP with JPEG fallback working
- [ ] **Performance**: Core Web Vitals not negatively impacted

---

## Performance

- CSS variables enable near-instant theme switching
- localStorage persistence prevents theme flashing
- Minimal JavaScript footprint (~2KB gzipped)
- No runtime CSS generation
- Hero images optimized for performance and accessibility
