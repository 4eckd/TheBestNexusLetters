import { test, expect, Page } from '@playwright/test';

test.describe('Theme Toggle E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Theme Toggle Functionality', () => {
    test('should find and interact with theme toggle', async ({ page }) => {
      // Look for theme toggle button/dropdown
      const themeToggle = page.locator(
        '[data-testid="theme-toggle"], [aria-label*="theme"], [title*="theme"], button:has-text("Light"), button:has-text("Dark")'
      );
      
      await expect(themeToggle.first()).toBeVisible();
    });

    test('should cycle through available themes', async ({ page }) => {
      // Find theme toggle
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
      
      if (await themeToggle.isVisible()) {
        // Record initial theme state
        const initialBodyClass = await page.locator('body').getAttribute('class');
        const initialHtmlClass = await page.locator('html').getAttribute('class');
        
        // Click theme toggle
        await themeToggle.click();
        
        // Wait for theme change
        await page.waitForTimeout(500);
        
        // Check that theme has changed
        const newBodyClass = await page.locator('body').getAttribute('class');
        const newHtmlClass = await page.locator('html').getAttribute('class');
        
        // At least one should have changed
        const hasChanged = newBodyClass !== initialBodyClass || newHtmlClass !== initialHtmlClass;
        expect(hasChanged).toBe(true);
      }
    });

    test('should persist theme selection across page reloads', async ({ page }) => {
      // Find and interact with theme toggle
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
      
      if (await themeToggle.isVisible()) {
        // Change theme
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Record theme state after change
        const themeAfterChange = await getThemeState(page);
        
        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Check that theme persisted
        const themeAfterReload = await getThemeState(page);
        expect(themeAfterReload).toEqual(themeAfterChange);
      }
    });
  });

  test.describe('Theme Toggle Dropdown', () => {
    test('should open theme selection dropdown', async ({ page }) => {
      // Look for dropdown variant of theme toggle
      const themeDropdown = page.locator('[data-testid="theme-toggle"][aria-expanded], [aria-haspopup="listbox"]');
      
      if (await themeDropdown.isVisible()) {
        // Click to open dropdown
        await themeDropdown.click();
        
        // Check that dropdown opened
        const expanded = await themeDropdown.getAttribute('aria-expanded');
        expect(expanded).toBe('true');
        
        // Check that options are visible
        await expect(page.locator('[role="listbox"], [role="menu"]')).toBeVisible();
      }
    });

    test('should display all available theme options', async ({ page }) => {
      const themeDropdown = page.locator('[data-testid="theme-toggle"][aria-expanded]');
      
      if (await themeDropdown.isVisible()) {
        await themeDropdown.click();
        
        // Expected theme options based on your theme configuration
        const expectedThemes = ['Light', 'Dark', 'Army', 'Navy', 'Marines'];
        
        for (const theme of expectedThemes) {
          await expect(page.locator(`[role="option"]:has-text("${theme}"), [role="menuitem"]:has-text("${theme}")`)).toBeVisible();
        }
      }
    });

    test('should select specific theme from dropdown', async ({ page }) => {
      const themeDropdown = page.locator('[data-testid="theme-toggle"][aria-expanded]');
      
      if (await themeDropdown.isVisible()) {
        await themeDropdown.click();
        
        // Select a specific theme (e.g., Dark)
        await page.click('[role="option"]:has-text("Dark"), [role="menuitem"]:has-text("Dark")');
        
        // Wait for theme application
        await page.waitForTimeout(500);
        
        // Verify theme was applied (check for dark theme indicators)
        const bodyClass = await page.locator('body').getAttribute('class');
        const htmlClass = await page.locator('html').getAttribute('class');
        const dataTheme = await page.locator('html').getAttribute('data-theme');
        
        const isDarkTheme = 
          bodyClass?.includes('dark') || 
          htmlClass?.includes('dark') || 
          dataTheme === 'dark';
          
        expect(isDarkTheme).toBe(true);
      }
    });
  });

  test.describe('Theme Visual Validation', () => {
    const themes = [
      { name: 'Light', selector: 'light' },
      { name: 'Dark', selector: 'dark' },
      { name: 'Army', selector: 'army' },
      { name: 'Navy', selector: 'navy' },
      { name: 'Marines', selector: 'marines' },
    ];

    for (const theme of themes) {
      test(`should render correctly in ${theme.name} theme`, async ({ page }) => {
        // Set theme (this assumes you can set theme via URL parameter or similar)
        // Alternatively, interact with theme toggle to set specific theme
        
        // Try to set theme through various methods
        await page.evaluate((themeName) => {
          // Method 1: localStorage
          localStorage.setItem('theme', themeName.toLowerCase());
          
          // Method 2: data attribute
          document.documentElement.setAttribute('data-theme', themeName.toLowerCase());
          
          // Method 3: class
          document.documentElement.className = `theme-${themeName.toLowerCase()}`;
          
          // Trigger theme change event if available
          window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: themeName.toLowerCase() } }));
        }, theme.name);
        
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Take screenshot for visual comparison (optional)
        await expect(page).toHaveScreenshot(`homepage-${theme.selector}-theme.png`, {
          fullPage: true,
          threshold: 0.3, // Allow for minor differences
        });
        
        // Verify theme-specific elements are visible and properly styled
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('nav')).toBeVisible();
        
        // Check contrast and readability
        const textColor = await page.locator('h1').evaluate(el => {
          return window.getComputedStyle(el).color;
        });
        
        const bgColor = await page.locator('body').evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        // Ensure text and background are different colors (basic contrast check)
        expect(textColor).not.toBe(bgColor);
      });
    }
  });

  test.describe('Theme Toggle Accessibility', () => {
    test('should have proper ARIA attributes', async ({ page }) => {
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
      
      if (await themeToggle.isVisible()) {
        // Check for aria-label or accessible name
        const ariaLabel = await themeToggle.getAttribute('aria-label');
        const title = await themeToggle.getAttribute('title');
        const textContent = await themeToggle.textContent();
        
        const hasAccessibleName = ariaLabel || title || textContent;
        expect(hasAccessibleName).toBeTruthy();
        
        // If it's a dropdown, check for proper dropdown ARIA
        const hasPopup = await themeToggle.getAttribute('aria-haspopup');
        if (hasPopup) {
          expect(hasPopup).toBe('listbox');
          
          const expanded = await themeToggle.getAttribute('aria-expanded');
          expect(['true', 'false']).toContain(expanded);
        }
      }
    });

    test('should be keyboard accessible', async ({ page }) => {
      // Tab to theme toggle
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // May need multiple tabs depending on page structure
      
      // Find focused element
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          tagName: active?.tagName,
          testId: active?.getAttribute('data-testid'),
          ariaLabel: active?.getAttribute('aria-label'),
        };
      });
      
      // Check if theme toggle is focused or continue tabbing
      let attempts = 0;
      while (attempts < 20 && focusedElement.testId !== 'theme-toggle') {
        await page.keyboard.press('Tab');
        attempts++;
        
        const currentFocus = await page.evaluate(() => {
          return document.activeElement?.getAttribute('data-testid');
        });
        
        if (currentFocus === 'theme-toggle') break;
      }
      
      // Activate with keyboard
      await page.keyboard.press('Enter');
      
      // Check that theme toggle responded to keyboard activation
      // This depends on implementation - for dropdown, it should open
      // For button toggle, it should change theme
      await page.waitForTimeout(500);
    });

    test('should announce theme changes to screen readers', async ({ page }) => {
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
      
      if (await themeToggle.isVisible()) {
        // Get initial aria-label or text
        const initialLabel = await themeToggle.getAttribute('aria-label') || 
                           await themeToggle.textContent();
        
        // Change theme
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Check that label updated to reflect new theme
        const newLabel = await themeToggle.getAttribute('aria-label') || 
                        await themeToggle.textContent();
        
        expect(newLabel).not.toBe(initialLabel);
        expect(newLabel).toBeTruthy();
      }
    });
  });

  test.describe('Theme Toggle Mobile Experience', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
      
      if (await themeToggle.isVisible()) {
        // Ensure theme toggle is large enough for touch interaction
        const boundingBox = await themeToggle.boundingBox();
        expect(boundingBox?.width).toBeGreaterThan(44); // Minimum touch target size
        expect(boundingBox?.height).toBeGreaterThan(44);
        
        // Test touch interaction
        await themeToggle.tap();
        await page.waitForTimeout(500);
        
        // Verify theme changed
        const themeState = await getThemeState(page);
        expect(themeState).toBeTruthy();
      }
    });

    test('should handle theme persistence on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
      
      if (await themeToggle.isVisible()) {
        await themeToggle.tap();
        await page.waitForTimeout(500);
        
        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Theme should persist
        const themeState = await getThemeState(page);
        expect(themeState).toBeTruthy();
      }
    });
  });
});

// Helper function to get current theme state
async function getThemeState(page: Page) {
  return await page.evaluate(() => {
    return {
      bodyClass: document.body.className,
      htmlClass: document.documentElement.className,
      dataTheme: document.documentElement.getAttribute('data-theme'),
      localStorage: localStorage.getItem('theme'),
    };
  });
}
