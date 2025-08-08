# Component Library

A comprehensive, accessible, and type-safe component library built with React, TypeScript, and Tailwind CSS.

## Architecture

The component library is organized into the following categories:

### `/src/components/ui/`
Core UI primitives that form the foundation of the design system:
- **Button** - Versatile button component with variants, sizes, loading states
- **Card** - Flexible container with header, content, and footer sections
- **Modal** - Accessible dialog with focus trapping and keyboard navigation
- **Tooltip** - Positioned tooltip with hover/click/focus triggers

### `/src/components/layout/`
Layout and structural components:
- *Future: Header, Footer, Sidebar, Container, Grid components*

### `/src/components/elements/`
Smaller UI elements:
- *Future: Badge, Avatar, Divider, Skeleton components*

### `/src/components/forms/`
Form controls and validation:
- *Future: Input, Select, Checkbox, Radio, TextArea components*

### `/src/components/icons/`
Custom icon components using Lucide React

### `/src/components/feedback/`
User feedback components:
- **Loader** - Loading indicators with multiple variants
- **ErrorState** - Error handling with recovery actions

## Core Principles

### 1. Accessibility First
- All components include proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management and trapping
- Color contrast compliance (WCAG AA/AAA)

### 2. Type Safety
- Full TypeScript support with strict typing
- Generic component props for flexibility
- Comprehensive prop interfaces
- IntelliSense support

### 3. Design Consistency
- Consistent sizing scale (xs, sm, md, lg, xl)
- Unified color system with dark/light theme support
- Standard spacing and typography
- Professional design patterns

### 4. Performance
- Tree-shakable exports
- Minimal bundle impact
- Optimized re-renders
- Lazy loading support

## Usage

### Basic Import
```tsx
import { Button, Card, Loader } from '@/components';
```

### Component-specific Import
```tsx
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
```

## Component Features

### Button
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: xs, sm, md, lg, xl
- **States**: loading, disabled, focus, hover
- **Icons**: start/end icons, icon-only mode
- **Accessibility**: proper ARIA labels, keyboard navigation

```tsx
<Button 
  variant="default" 
  size="md" 
  startIcon={<Plus />}
  isLoading={false}
  onClick={handleClick}
>
  Add Item
</Button>
```

### Card
- **Variants**: default, outlined, elevated
- **Padding**: none, sm, md, lg
- **Interactive**: hover states, click handlers
- **Composition**: header, content, footer sections

```tsx
<Card variant="outlined" interactive>
  <CardHeader title="Title" subtitle="Subtitle" />
  <CardContent>Card content here</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Modal
- **Sizes**: sm, md, lg, xl, full
- **Features**: focus trapping, escape key, overlay click
- **Accessibility**: proper ARIA attributes, keyboard navigation
- **Portal**: renders outside component tree

```tsx
<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  Modal content here
</Modal>
```

### Tooltip
- **Placement**: top, bottom, left, right
- **Triggers**: hover, click, focus
- **Features**: auto-positioning, delay configuration
- **Accessibility**: ARIA describedby, keyboard support

```tsx
<Tooltip content="Helpful information" placement="top">
  <Button>Hover me</Button>
</Tooltip>
```

### Loader
- **Variants**: spinner, dots, pulse, bars
- **Sizes**: xs, sm, md, lg, xl
- **Usage**: inline, block, with text
- **Accessibility**: screen reader announcements

```tsx
<Loader 
  variant="spinner" 
  size="md" 
  text="Loading..." 
  inline={false}
/>
```

### ErrorState
- **Variants**: default, minimal, detailed
- **Features**: retry actions, navigation buttons
- **Accessibility**: alert role, proper messaging
- **Customization**: icons, actions, styling

```tsx
<ErrorState
  hasError={true}
  errorMessage="Failed to load data"
  onRetry={handleRetry}
  showRetry={true}
/>
```

## Storybook Integration

All components include comprehensive Storybook stories:

```bash
npm run storybook
```

Stories cover:
- All component variants and states
- Interactive examples
- Accessibility demonstrations
- Dark/light theme testing
- Real-world usage scenarios

## Testing

### Accessibility Testing
- Automated contrast ratio checking
- ARIA attribute validation
- Keyboard navigation testing
- Screen reader compatibility

### Visual Regression
- Storybook visual testing
- Theme compatibility testing
- Responsive design validation

### Unit Testing
```bash
npm run test
npm run test:coverage
```

## Styling

### Theme Support
- Full dark/light mode compatibility
- CSS custom properties for theming
- Consistent color tokens
- Responsive design patterns

### Customization
```tsx
// Custom styling with className
<Button className="my-custom-styles">
  Custom Button
</Button>

// Theme-aware styling
<div className="bg-white dark:bg-slate-950">
  Content
</div>
```

## Development Workflow

### Adding New Components
1. Create component in appropriate category folder
2. Add TypeScript interfaces
3. Implement with accessibility features
4. Create Storybook stories
5. Add tests
6. Update exports in index files

### Best Practices
- Use `forwardRef` for ref forwarding
- Include proper ARIA attributes
- Support both controlled and uncontrolled modes
- Follow the established naming conventions
- Document all props with JSDoc

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Screen readers
- Keyboard-only navigation

## Contributing

1. Follow the existing patterns and conventions
2. Include comprehensive TypeScript types
3. Add Storybook stories for all variants
4. Test accessibility with screen readers
5. Validate color contrast ratios
6. Update documentation

## Future Roadmap

- [ ] Complete form components suite
- [ ] Advanced data table component  
- [ ] Navigation components (Breadcrumb, Pagination)
- [ ] Layout components (Sidebar, Header)
- [ ] Chart and visualization components
- [ ] Animation and transition utilities
- [ ] Advanced accessibility features
- [ ] Figma design tokens integration
