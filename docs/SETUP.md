# Core Tooling and Styling Configuration

This document outlines the core tooling and styling setup completed for The Best Nexus Letters project.

## ✅ Completed Tasks

### 1. TailwindCSS, PostCSS, and Autoprefixer Setup

- **TailwindCSS v4** installed and configured
- **PostCSS** configured with `@tailwindcss/postcss` and `autoprefixer`
- **tailwind.config.ts** created with comprehensive configuration

### 2. Theme Configuration

- **Dark/Light theme support** with CSS variables
- **Military color palettes** defined:
  - Olive (green military tones)
  - Khaki (tan/beige military tones)
  - Forest (dark green military tones)
  - Navy (blue military tones)
  - Camo (gray military tones)
- **Semantic color variables** for consistent theming
- **Enhanced globals.css** with comprehensive theme variables

### 3. Lucide Icons Integration

- **lucide-react** package installed
- **Global Icon component** created (`src/components/ui/icon.tsx`)
- **Standardized icon usage** with consistent sizing and styling
- **Type-safe icon props** with TypeScript

### 4. Typography Setup

- **@tailwindcss/typography** plugin added
- **Typography utilities** available for rich content formatting

### 5. Absolute Imports Configuration

- **Comprehensive tsconfig paths** configured:
  - `@/*` → `./src/*`
  - `@/components/*` → `./src/components/*`
  - `@/lib/*` → `./src/lib/*`
  - `@/app/*` → `./src/app/*`
  - `@/styles/*` → `./src/styles/*`
  - `@/types/*` → `./src/types/*`
  - `@/hooks/*` → `./src/hooks/*`
  - `@/utils/*` → `./src/utils/*`

### 6. Utility Functions

- **cn() function** for className merging (clsx + tailwind-merge)
- **Consistent component styling** patterns established

### 7. Component Structure

- **Organized component directory** structure
- **UI components** with proper exports
- **Theme demonstration** component showing all features

## 📁 File Structure Created

```
src/
├── components/
│   ├── ui/
│   │   ├── icon.tsx          # Global Icon component
│   │   ├── theme-demo.tsx    # Theme demonstration
│   │   └── index.ts          # UI components export
│   └── index.ts              # Main components export
├── lib/
│   └── utils.ts              # Utility functions (cn)
└── app/
    ├── globals.css           # Enhanced with theme variables
    └── page.tsx              # Updated to showcase setup

tailwind.config.ts            # Comprehensive Tailwind configuration
postcss.config.mjs           # PostCSS with Autoprefixer
tsconfig.json                # Updated with absolute imports
```

## 🎨 Theme Features

### CSS Variables Structure

- Light and dark mode support via `.dark` class
- Military-specific theme variables
- Semantic color naming for consistency

### Military Color Palettes

Each military palette includes 11 shades (50-950) for comprehensive design flexibility:

- **Olive**: Natural green military tones
- **Khaki**: Classic tan/beige military colors
- **Forest**: Dark green camouflage tones
- **Navy**: Military blue variants
- **Camo**: Neutral gray military colors

### Icon System

- Consistent 16px (h-4 w-4) default sizing
- Easy customization with className override
- Type-safe with LucideIcon interface
- Centralized component for standardization

## 🔧 Usage Examples

### Using Military Colors

```tsx
<div className="bg-military-olive-600 text-white">Olive Background</div>
<div className="bg-military-khaki-100 dark:bg-military-khaki-800">Adaptive Khaki</div>
```

### Using Icons

```tsx
import { Home } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

<Icon icon={Home} className="text-primary h-6 w-6" />;
```

### Using Absolute Imports

```tsx
import { Icon } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SomeType } from '@/types/example';
```

## 🚀 Next Steps

The core tooling foundation is now complete and ready for:

- Component development with consistent theming
- Military-themed UI elements
- Typography-rich content with @tailwindcss/typography
- Scalable icon usage with Lucide React
- Clean absolute imports throughout the codebase

All configurations are production-ready and follow best practices for Next.js 15, React 19, and TailwindCSS v4.
