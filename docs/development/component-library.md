---
title: Component Library
description: Complete reference for The Best Nexus Letters UI components
---

# Component Library

This page provides comprehensive documentation for all components in The Best Nexus Letters design system. Components are organized by category and include usage examples, props documentation, and accessibility guidelines.

!!! tip "Storybook Integration"
    This documentation is automatically generated from Storybook stories and component TypeScript definitions. For interactive examples, visit our [Storybook](http://localhost:6006).

## Overview

Our component library includes:

- **20 Components** across 5 categories
- **TypeScript** definitions for all components  
- **Storybook** integration for interactive development
- **Accessibility** features built-in
- **Theme** support across all components

## Component Categories

### Examples Components

#### DataFetchingExample

Example component showcasing data fetching, validation, error & loading states

**Usage:**

```tsx
import { DataFetchingExample } from '@/components/examples/DataFetchingExample';

// Basic usage
<DataFetchingExample />
```

### Feedback Components

#### ErrorAlert

Standardized ErrorAlert component with multiple variants and comprehensive error handling

**Usage:**

```tsx
import { interface } from '@/components/feedback/ErrorAlert';

// Basic usage
<interface />
```

#### ErrorState

Error title

**Usage:**

```tsx
import { interface } from '@/components/feedback/ErrorState';

// Basic usage
<interface />
```

#### Loader

Loader variant

**Usage:**

```tsx
import { interface } from '@/components/feedback/Loader';

// Basic usage
<interface />
```

#### LoadingSpinner

Standardized LoadingSpinner component with multiple variants and suspense support

**Usage:**

```tsx
import { interface } from '@/components/feedback/LoadingSpinner';

// Basic usage
<interface />
```

### Layout Components

#### Footer

**Usage:**

```tsx
import { Footer } from '@/components/layout/Footer';

// Basic usage
<Footer />
```

#### Header

**Usage:**

```tsx
import { Header } from '@/components/layout/Header';

// Basic usage
<Header />
```

### Providers Components

#### ErrorBoundary

Global ErrorBoundary component to catch and handle unhandled React exceptions

**Usage:**

```tsx
import { withErrorBoundary } from '@/components/providers/ErrorBoundary';

// Basic usage
<withErrorBoundary />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | No description available |
| `fallback` | `React.ComponentType<{
    error?: Error` | No | No description available |
| `errorInfo` | `React.ErrorInfo` | No | No description available |
| `resetError` | `() => void` | No | No description available |

#### theme-provider

**Usage:**

```tsx
import { useTheme } from '@/components/providers/theme-provider';

// Basic usage
<useTheme />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | Yes | No description available |
| `defaultTheme` | `Theme` | No | No description available |
| `storageKey` | `string` | No | No description available |

### Ui Components

#### Button

Button visual variant

**Usage:**

```tsx
import { interface } from '@/components/ui/Button';

// Basic usage
<interface />
```

#### Card

Card visual variant

**Usage:**

```tsx
import { interface } from '@/components/ui/Card';

// Basic usage
<interface />
```

#### community-link

Category slug or ID to link to

**Usage:**

```tsx
import { CommunityLink } from '@/components/ui/community-link';

// Basic usage
<CommunityLink />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `category` | `string` | No | No description available |
| `categories` | `DiscourseCategory[]` | No | No description available |
| `mode` | `'single' | 'grid' | 'list'` | No | No description available |
| `className` | `string` | No | No description available |
| `linkText` | `string` | No | No description available |
| `showExternalIcon` | `boolean` | No | No description available |
| `openInNewTab` | `boolean` | No | No description available |
| `forumUrl` | `string` | No | No description available |

#### Features

**Usage:**

```tsx
import { Features } from '@/components/ui/Features';

// Basic usage
<Features />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | No | No description available |
| `subtitle` | `string` | No | No description available |
| `features` | `typeof defaultFeatures` | No | No description available |

#### Hero

**Usage:**

```tsx
import { Hero } from '@/components/ui/Hero';

// Basic usage
<Hero />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | No | No description available |
| `subtitle` | `string` | No | No description available |
| `description` | `string` | No | No description available |
| `primaryCTA` | `{
    text: string` | No | No description available |
| `href` | `string` | Yes | No description available |

#### icon

**Usage:**

```tsx
import { type } from '@/components/ui/icon';

// Basic usage
<type />
```

#### Modal

Modal size

**Usage:**

```tsx
import { interface } from '@/components/ui/Modal';

// Basic usage
<interface />
```

#### Testimonials

**Usage:**

```tsx
import { Testimonials } from '@/components/ui/Testimonials';

// Basic usage
<Testimonials />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `testimonials` | `Testimonial[]` | Yes | No description available |
| `featured` | `boolean` | No | No description available |
| `title` | `string` | No | No description available |
| `subtitle` | `string` | No | No description available |

#### theme-demo

**Usage:**

```tsx
import { ThemeDemo } from '@/components/ui/theme-demo';

// Basic usage
<ThemeDemo />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | No description available |

#### theme-toggle

**Usage:**

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Basic usage
<ThemeToggle />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | No description available |
| `variant` | `'button' | 'dropdown'` | No | No description available |

#### Tooltip

The element that triggers the tooltip

**Usage:**

```tsx
import { interface } from '@/components/ui/Tooltip';

// Basic usage
<interface />
```


## Additional Documentation

The following additional documentation is available from Storybook:

- **Configure**: Extracted from Storybook stories

---

## Development Guidelines

### Adding New Components

1. Create component file in appropriate category directory
2. Add TypeScript interface for props
3. Create Storybook story with examples
4. Add tests for component behavior
5. Update this documentation (automatically generated)

### Component Standards

- **TypeScript**: All components must have TypeScript definitions
- **Props Interface**: Clear interface with JSDoc comments
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: Unit tests and Storybook stories required
- **Theming**: Support for all 5 platform themes

### Resources

- **[Storybook](http://localhost:6006)** - Interactive component development
- **[Design System](../architecture/design-system.md)** - Design principles and guidelines
- **[Testing Guide](TESTING.md)** - Component testing strategies
- **[Accessibility Guide](../reference/accessibility.md)** - Accessibility requirements

---

*This documentation is automatically generated from component source code and Storybook stories.*  
*Last updated: 2025-08-08*
