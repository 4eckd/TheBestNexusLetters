import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues on home page', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility issues on contact page', async ({ page }) => {
    await page.goto('/contact');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility issues on services page', async ({ page }) => {
    await page.goto('/services');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Test color contrast specifically
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    
    // Test ARIA attributes specifically
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules([
        'aria-allowed-attr',
        'aria-required-attr',
        'aria-valid-attr',
        'aria-valid-attr-value'
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('theme toggle should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme/i });
    await expect(themeToggle).toBeVisible();
    
    // Check if it has proper ARIA attributes
    await expect(themeToggle).toHaveAttribute('aria-label');
    
    // Test keyboard navigation
    await themeToggle.focus();
    await expect(themeToggle).toBeFocused();
    
    // Test activation via keyboard
    await themeToggle.press('Enter');
    // Should still be focusable after activation
    await expect(themeToggle).toBeFocused();
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation through main navigation
    await page.keyboard.press('Tab');
    let focusedElement = await page.locator(':focus');
    
    // Should be able to navigate through all interactive elements
    const maxTabs = 10;
    let tabCount = 0;
    
    while (tabCount < maxTabs) {
      const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
      const role = await focusedElement.getAttribute('role');
      
      // Check if focused element is interactive
      if (['a', 'button', 'input', 'select', 'textarea'].includes(tagName) || 
          ['button', 'link', 'menuitem'].includes(role || '')) {
        // Element should be visible and have proper focus styling
        await expect(focusedElement).toBeVisible();
      }
      
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus');
      tabCount++;
    }
  });
});
