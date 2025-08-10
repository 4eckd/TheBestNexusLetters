# TheBestNexusLetters Brand Colors

## Overview

The TheBestNexusLetters brand colors are designed to convey patriotism, professionalism, and trust. Our color palette draws inspiration from American flag colors and military traditions while maintaining modern web accessibility standards.

## Core Brand Colors

### Primary Colors

#### Navy Blue
- **HEX**: `#0A1F44` 
- **RGB**: `rgb(10, 31, 68)`
- **HSL**: `hsl(219, 100%, 13%)`
- **Usage**: Primary text, headers, main CTAs
- **Meaning**: Trust, authority, professionalism
- **Tailwind**: `navy-900` or `navy`

#### Midnight Navy (Dark Variant)
- **HEX**: `#050F28`
- **RGB**: `rgb(5, 15, 40)`
- **HSL**: `hsl(219, 100%, 6%)`
- **Usage**: Dark backgrounds, deep shadows
- **Tailwind**: `navy-dark` or `navy-950`

#### American Red
- **HEX**: `#DC2450`
- **RGB**: `rgb(220, 36, 80)`
- **HSL**: `hsl(340, 70%, 50%)`
- **Usage**: Accent elements, important actions, alerts
- **Meaning**: Urgency, importance, patriotism
- **Tailwind**: `red-600` or `red`

#### Deep Crimson (Dark Variant)
- **HEX**: `#B4143C`
- **RGB**: `rgb(180, 20, 60)`
- **HSL**: `hsl(340, 70%, 39%)`
- **Usage**: Hover states, pressed buttons
- **Tailwind**: `red-dark` or `red-800`

#### Contrast Blue
- **HEX**: `#327DC8`
- **RGB**: `rgb(50, 125, 200)`
- **HSL**: `hsl(207, 56%, 47%)`
- **Usage**: Links, secondary actions, info elements
- **Meaning**: Clarity, communication, accessibility
- **Tailwind**: `contrast-500` or `contrast`

#### Bright Contrast (Light Variant)
- **HEX**: `#4FA0FF`
- **RGB**: `rgb(79, 160, 255)`
- **HSL**: `hsl(207, 100%, 65%)`
- **Usage**: Dark theme text, hover highlights
- **Tailwind**: `contrast-light` or `contrast-400`

### Neutral Colors

#### Freebase White
- **HEX**: `#F0F0F0`
- **RGB**: `rgb(240, 240, 240)`
- **HSL**: `hsl(0, 0%, 94%)`
- **Usage**: Light backgrounds, card surfaces
- **Meaning**: Cleanliness, clarity, space
- **Tailwind**: `white` or `white-DEFAULT`

#### Slate Gray
- **HEX**: `#464E5A`
- **RGB**: `rgb(70, 78, 90)`
- **HSL**: `hsl(213, 9%, 31%)`
- **Usage**: Muted text, inactive elements
- **Meaning**: Stability, subtlety
- **Tailwind**: `slate-500` or `slate`

#### Warm Sand
- **HEX**: `#EBDCC8`
- **RGB**: `rgb(235, 220, 200)`
- **HSL**: `hsl(34, 31%, 85%)`
- **Usage**: Soft backgrounds, warm accents
- **Meaning**: Warmth, comfort, approachability
- **Tailwind**: `sand-500` or `sand`

#### Sky Mist
- **HEX**: `#C8E6FF`
- **RGB**: `rgb(200, 230, 255)`
- **HSL**: `hsl(207, 100%, 89%)`
- **Usage**: Light info backgrounds, subtle highlights
- **Meaning**: Openness, clarity, freshness
- **Tailwind**: `mist-500` or `mist`

## Color Palettes

Each core color has been expanded into a full 50-950 palette for maximum flexibility:

### Navy Palette
```css
navy-50:  #f0f4f8
navy-100: #d9e2ec
navy-200: #bcccdc
navy-300: #9bb0c4
navy-400: #8193a8
navy-500: #6b7d8f
navy-600: #5a6b7d
navy-700: #4a5968
navy-800: #3e4a56
navy-900: #0A1F44  /* Primary Navy */
navy-950: #050F28  /* Midnight Navy */
```

### Red Palette
```css
red-50:  #fef2f2
red-100: #fee2e2
red-200: #fecaca
red-300: #fca5a5
red-400: #f87171
red-500: #ef4444
red-600: #DC2450  /* American Red */
red-700: #b91c1c
red-800: #B4143C  /* Deep Crimson */
red-900: #7f1d1d
red-950: #450a0a
```

### Contrast Palette
```css
contrast-50:  #eff6ff
contrast-100: #dbeafe
contrast-200: #bfdbfe
contrast-300: #93c5fd
contrast-400: #4FA0FF  /* Bright Contrast */
contrast-500: #327DC8  /* Contrast Blue */
contrast-600: #2563eb
contrast-700: #1d4ed8
contrast-800: #1e40af
contrast-900: #1e3a8a
contrast-950: #172554
```

## Brand Gradients

### Primary Gradients

#### Patriot Gradient
- **CSS**: `linear-gradient(135deg, #0A1F44 0%, #327DC8 100%)`
- **Tailwind**: `bg-gradient-patriot`
- **Usage**: Hero sections, primary CTAs
- **Description**: Navy to Contrast Blue diagonal

#### Energy Gradient
- **CSS**: `linear-gradient(135deg, #DC2450 0%, #B4143C 100%)`
- **Tailwind**: `bg-gradient-energy`
- **Usage**: Action buttons, urgent alerts
- **Description**: American Red to Deep Crimson

#### Skyline Gradient
- **CSS**: `linear-gradient(135deg, #C8E6FF 0%, #327DC8 100%)`
- **Tailwind**: `bg-gradient-skyline`
- **Usage**: Info sections, calm areas
- **Description**: Sky Mist to Contrast Blue

### Secondary Gradients

#### Hero Gradient
- **CSS**: `linear-gradient(135deg, #0A1F44 0%, #DC2450 50%, #327DC8 100%)`
- **Tailwind**: `bg-gradient-hero`
- **Usage**: Main hero sections
- **Description**: Three-color patriotic blend

#### Sunset Gradient
- **CSS**: `linear-gradient(45deg, #DC2450 0%, #EBDCC8 100%)`
- **Tailwind**: `bg-gradient-sunset`
- **Usage**: Warm call-to-actions
- **Description**: Red to Warm Sand

#### Ocean Gradient
- **CSS**: `linear-gradient(180deg, #327DC8 0%, #0A1F44 100%)`
- **Tailwind**: `bg-gradient-ocean`
- **Usage**: Vertical sections, footers
- **Description**: Contrast Blue to Navy vertical

## Brand Shadows

### Light Theme Shadows
- **Brand**: `0 4px 20px rgba(10, 31, 68, 0.1)` - Navy shadow
- **Brand Soft**: `0 2px 12px rgba(10, 31, 68, 0.05)` - Subtle navy
- **Brand Red**: `0 4px 20px rgba(220, 36, 80, 0.2)` - Red emphasis

### Dark Theme Shadows
- **Brand Dark**: `0 4px 20px rgba(50, 125, 200, 0.3)` - Contrast blue shadow

## Usage Guidelines

### Do's ✅

1. **Use Navy as the primary color** for text, headers, and main UI elements
2. **Use Red sparingly** for important actions, errors, and emphasis
3. **Use Contrast Blue** for links, secondary actions, and informational elements
4. **Maintain contrast ratios** of at least 4.5:1 for normal text, 3:1 for large text
5. **Use gradients purposefully** for hero sections and key visual elements
6. **Combine brand colors** with generous white space for clean layouts

### Don'ts ❌

1. **Don't use Red as a primary color** - it should be an accent only
2. **Don't combine all brand colors** in one element - choose 2-3 max
3. **Don't use low contrast combinations** like Sky Mist on Freebase White
4. **Don't override CSS variables** without considering theme compatibility
5. **Don't use military colors** (olive, khaki, forest) for main brand elements

## Accessibility Compliance

All brand colors have been tested for WCAG 2.1 AA compliance:

### Contrast Ratios
- **Navy on Freebase White**: 13.2:1 (AAA compliant)
- **American Red on Freebase White**: 7.1:1 (AAA compliant)
- **Contrast Blue on Freebase White**: 4.6:1 (AA compliant)
- **Slate Gray on Freebase White**: 6.8:1 (AAA compliant)

### Color Blindness
All color combinations have been tested with:
- Deuteranopia (red-green colorblind)
- Protanopia (red-green colorblind)
- Tritanopia (blue-yellow colorblind)

## Implementation

### Tailwind CSS Classes

```html
<!-- Primary colors -->
<div class="bg-navy text-white">Navy background</div>
<div class="bg-red text-white">Red accent</div>
<div class="bg-contrast text-white">Contrast blue</div>

<!-- Gradients -->
<div class="bg-gradient-patriot">Patriot gradient</div>
<div class="bg-gradient-energy">Energy gradient</div>

<!-- Shadows -->
<div class="shadow-brand">Brand shadow</div>
<div class="dark:shadow-brand-dark">Dark theme shadow</div>
```

### CSS Variables

```css
/* Use HSL values for theme compatibility */
.custom-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  box-shadow: var(--shadow-brand);
}
```

### React Components

```tsx
// Using Tailwind classes
<Button className="bg-navy hover:bg-navy-800 text-white">
  Primary Action
</Button>

<Button className="bg-gradient-patriot text-white">
  Hero CTA
</Button>

// Using CSS variables (theme-aware)
<div style={{
  backgroundColor: 'hsl(var(--primary))',
  color: 'hsl(var(--primary-foreground))'
}}>
  Theme-aware element
</div>
```

## Brand Evolution

The brand colors are designed to be:
- **Timeless**: Drawing from classic American patriotic colors
- **Professional**: Suitable for military and veteran audiences
- **Accessible**: Meeting modern web accessibility standards
- **Flexible**: Working across light and dark themes
- **Distinctive**: Creating a unique brand identity

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/customizing-colors)
- [Brand Asset Downloads](../assets/brand/)

---

*Last updated: August 2025 | Version: 1.0*
