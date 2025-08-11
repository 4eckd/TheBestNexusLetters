# Military Theme Verification Testing Guide

This document outlines the comprehensive testing strategy for verifying the visual and functional aspects of military themes (Army, Navy, Marines) in The Best Nexus Letters application.

## Overview

The military theme verification testing includes:

1. **Jest + RTL Tests** - Unit testing for CSS variable validation
2. **Playwright E2E Tests** - Visual regression and browser testing
3. **Storybook Stories** - Interactive theme showcase
4. **Manual QA Checklist** - Human verification guidelines

## Test Files Structure

```
src/components/ui/__tests__/
├── military-theme-verification.test.tsx    # Jest + RTL tests

e2e/tests/
├── military-themes-visual.spec.ts          # Playwright E2E tests

src/components/ui/
├── MilitaryThemeShowcase.stories.tsx       # Storybook stories

scripts/
├── run-theme-tests.sh                      # Test runner script

docs/testing/
├── MILITARY_THEME_VERIFICATION.md          # This file
```

## Running Tests

### Quick Start

```bash
# Run all theme verification tests
./scripts/run-theme-tests.sh

# Make script executable if needed
chmod +x scripts/run-theme-tests.sh
```

### Individual Test Commands

#### Jest + RTL Tests (CSS Variables)

```bash
# Run CSS variable verification tests
pnpm test src/components/ui/__tests__/military-theme-verification.test.tsx

# Run with coverage
pnpm test:coverage src/components/ui/__tests__/military-theme-verification.test.tsx
```

#### Playwright E2E Tests (Visual)

```bash
# Run visual verification tests
pnpm exec playwright test e2e/tests/military-themes-visual.spec.ts

# Run in headed mode (see browser)
pnpm exec playwright test e2e/tests/military-themes-visual.spec.ts --headed

# Generate test report
pnpm exec playwright show-report
```

#### Storybook Stories

```bash
# Start Storybook for manual testing
pnpm storybook

# Build Storybook for deployment
pnpm exec storybook build
```

## Test Coverage

### Jest + RTL Tests

**File**: `src/components/ui/__tests__/military-theme-verification.test.tsx`

#### CSS Variables Verification

- ✅ Army theme CSS variables match expected HSL values
- ✅ Navy theme CSS variables match expected HSL values
- ✅ Marines theme CSS variables match expected HSL values
- ✅ Semantic color elements render correctly
- ✅ Theme persistence in localStorage

#### Expected CSS Values

##### Army Theme

```css
--background: 45 15% 95% --foreground: 45 25% 10% --primary: 84 31% 31%
  /* olive-600 */ --secondary: 45 25% 31% /* khaki-600 */ --accent: 120 30% 25%
  /* forest-700 */;
```

##### Navy Theme

```css
--background: 210 25% 95% --foreground: 210 35% 10% --primary: 210 35% 25%
  /* navy-700 */ --secondary: 200 30% 30% /* steel-600 */ --accent: 220 40% 35%
  /* admiral-600 */;
```

##### Marines Theme

```css
--background: 0 15% 95% --foreground: 0 25% 10% --primary: 0 70% 40%
  /* marine-red-600 */ --secondary: 45 25% 25% /* desert-700 */ --accent: 25 40%
  30% /* bronze-700 */;
```

### Playwright E2E Tests

**File**: `e2e/tests/military-themes-visual.spec.ts`

#### Visual Rendering

- ✅ Screenshot comparison for each theme
- ✅ Cross-browser compatibility testing
- ✅ Mobile responsiveness verification
- ✅ Theme switching functionality

#### Accessibility Testing

- ✅ Color contrast verification
- ✅ Focus visibility testing
- ✅ Touch target sizing (44px minimum)
- ✅ Keyboard navigation support

#### Performance Testing

- ✅ Theme switching performance (< 1 second)
- ✅ Memory usage validation
- ✅ CSS transition smoothness

### Storybook Stories

**File**: `src/components/ui/MilitaryThemeShowcase.stories.tsx`

#### Interactive Showcase

- ✅ Army theme demonstration
- ✅ Navy theme demonstration
- ✅ Marines theme demonstration
- ✅ Side-by-side theme comparison

#### Component Coverage

- Color system swatches
- Button variations
- Typography samples
- Form elements
- Interactive components

## Manual QA Checklist

### Visual Verification

#### Branding Alignment

- [ ] Army theme uses appropriate olive/khaki colors
- [ ] Navy theme uses appropriate blue/steel colors
- [ ] Marines theme uses appropriate red/bronze colors
- [ ] All themes maintain professional appearance
- [ ] Brand consistency across components

#### Contrast Compliance

- [ ] All text meets WCAG AA contrast ratio (4.5:1 minimum)
- [ ] Interactive elements are clearly distinguishable
- [ ] Focus indicators are visible in all themes
- [ ] State changes are clearly communicated

### Functional Verification

#### Theme Switching

- [ ] Theme toggle works correctly
- [ ] Theme selection persists across page reloads
- [ ] Smooth transitions between themes
- [ ] No visual artifacts during switching

#### Cross-Browser Testing

- [ ] Chrome/Chromium compatibility
- [ ] Firefox compatibility
- [ ] Safari compatibility (if applicable)
- [ ] Edge compatibility

#### Device Testing

- [ ] Desktop responsiveness (1920x1080+)
- [ ] Tablet responsiveness (768px - 1024px)
- [ ] Mobile responsiveness (375px - 767px)
- [ ] Touch interaction support

## Test Data and Expectations

### Color Validation

The tests validate that CSS variables resolve to exact HSL values as defined in `src/app/globals.css`. Any deviation indicates a theme implementation issue.

### Performance Benchmarks

- Theme switching: < 1 second
- Page load with theme: < 2 seconds
- CSS transition duration: 300ms (as defined in globals.css)

### Accessibility Standards

- WCAG 2.1 AA compliance
- Minimum contrast ratio: 4.5:1
- Touch targets: minimum 44x44px
- Keyboard navigation support

## Troubleshooting

### Common Issues

#### CSS Variables Not Applied

```javascript
// Check if theme is properly set
console.log(document.documentElement.getAttribute('data-theme'));

// Verify CSS variables
const styles = getComputedStyle(document.documentElement);
console.log(styles.getPropertyValue('--primary'));
```

#### Theme Provider Issues

- Ensure ThemeProvider wraps the component
- Check for hydration mismatches
- Verify localStorage access

#### Playwright Test Failures

- Install browsers: `pnpm exec playwright install`
- Update snapshots: `pnpm exec playwright test --update-snapshots`
- Check viewport settings for mobile tests

### Debug Commands

```bash
# Run specific test with debug output
pnpm test military-theme-verification --verbose

# Run Playwright in debug mode
pnpm exec playwright test military-themes-visual --debug

# Check Storybook build
pnpm exec storybook build --debug
```

## Continuous Integration

### GitHub Actions Integration

The theme verification tests should be included in CI/CD pipeline:

```yaml
- name: Run Military Theme Tests
  run: |
    pnpm test src/components/ui/__tests__/military-theme-verification.test.tsx
    pnpm exec playwright test e2e/tests/military-themes-visual.spec.ts
    pnpm exec storybook build
```

### Test Reports

- Jest generates coverage reports in `coverage/`
- Playwright generates HTML reports in `playwright-report/`
- Storybook builds static files in `storybook-static/`

## Contributing

When adding new military themes or modifying existing ones:

1. Update CSS variables in `src/app/globals.css`
2. Add expected values to test files
3. Update Storybook stories
4. Run full test suite
5. Update this documentation

### Adding New Themes

1. Define theme in `src/types/theme.ts`
2. Add CSS variables to `globals.css`
3. Update test expectations
4. Add Storybook story
5. Update theme toggle component

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Playwright Documentation](https://playwright.dev/)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Testing Library Documentation](https://testing-library.com/)

---

**Last Updated**: January 2025  
**Maintainer**: The Best Nexus Letters Development Team
