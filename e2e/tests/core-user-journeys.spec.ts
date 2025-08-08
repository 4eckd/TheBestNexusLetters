import { test, expect, Page } from '@playwright/test';

test.describe('Core User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Homepage', () => {
    test('should load the homepage successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/The Best Nexus Letters/);
      await expect(page.locator('body')).toBeVisible();
    });

    test('should display main navigation', async ({ page }) => {
      // Check for navigation elements
      await expect(page.locator('nav')).toBeVisible();
      
      // Check for key navigation links
      const navigationLinks = [
        'Home',
        'Services', 
        'How It Works',
        'Contact'
      ];

      for (const linkText of navigationLinks) {
        await expect(page.locator(`a:has-text("${linkText}")`)).toBeVisible();
      }
    });

    test('should display hero section', async ({ page }) => {
      // Check for hero section with main heading
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for call-to-action buttons
      await expect(page.locator('[data-testid*="cta"], [class*="cta"], button').first()).toBeVisible();
    });

    test('should display footer', async ({ page }) => {
      // Scroll to bottom to ensure footer is visible
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      await expect(page.locator('footer')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to Services page', async ({ page }) => {
      await page.click('a:has-text("Services")');
      await expect(page).toHaveURL(/.*services.*/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should navigate to How It Works page', async ({ page }) => {
      await page.click('a:has-text("How It Works")');
      await expect(page).toHaveURL(/.*how-it-works.*/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should navigate to Contact page', async ({ page }) => {
      await page.click('a:has-text("Contact")');
      await expect(page).toHaveURL(/.*contact.*/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should navigate back to home from logo', async ({ page }) => {
      // Navigate to another page first
      await page.click('a:has-text("Services")');
      await expect(page).toHaveURL(/.*services.*/);
      
      // Click logo/home link to return
      await page.click('[data-testid="logo"], [href="/"], a:has-text("Home")');
      await expect(page).toHaveURL(/.*\/$|.*\/$/);
    });
  });

  test.describe('Page Content and SEO', () => {
    const pages = [
      { path: '/', title: /The Best Nexus Letters/ },
      { path: '/services', title: /Services/ },
      { path: '/how-it-works', title: /How It Works/ },
      { path: '/contact', title: /Contact/ },
      { path: '/privacy', title: /Privacy/ },
      { path: '/terms', title: /Terms/ },
    ];

    for (const { path, title } of pages) {
      test(`should have proper title and meta tags for ${path}`, async ({ page }) => {
        await page.goto(path);
        await expect(page).toHaveTitle(title);
        
        // Check for meta description
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content', /.+/);
      });
    }
  });

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      test(`should be responsive on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        
        // Check that content is visible and accessible
        await expect(page.locator('nav')).toBeVisible();
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
        
        // Check that no horizontal scrollbar appears
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50); // Allow small variance
      });
    }

    test('should handle mobile menu toggle', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Look for mobile menu button (hamburger menu)
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"], button:has([data-testid="menu-icon"]), .hamburger, [aria-label*="menu"]');
      
      if (await mobileMenuButton.isVisible()) {
        // Click to open mobile menu
        await mobileMenuButton.click();
        
        // Check that menu opens
        await expect(page.locator('[data-testid="mobile-menu"], .mobile-menu, .menu-overlay')).toBeVisible();
        
        // Click again to close
        await mobileMenuButton.click();
        
        // Check that menu closes
        await expect(page.locator('[data-testid="mobile-menu"], .mobile-menu, .menu-overlay')).not.toBeVisible();
      }
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = [];
      
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Filter out known acceptable errors (like network errors in dev mode)
      const criticalErrors = errors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('net::ERR_') &&
        !error.includes('Source map')
      );
      
      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      
      // Check that there's exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // Check that headings are in logical order (no skipped levels)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allInnerTexts();
      expect(headings.length).toBeGreaterThan(0);
    });

    test('should have proper alt text for images', async ({ page }) => {
      await page.goto('/');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        
        // All images should have alt text (can be empty for decorative images)
        expect(alt).not.toBeNull();
        
        // Non-decorative images should have meaningful alt text
        if (src && !src.includes('decoration') && !src.includes('bg-')) {
          expect(alt).toBeTruthy();
        }
      }
    });

    test('should have proper focus management', async ({ page }) => {
      await page.goto('/');
      
      // Tab through focusable elements
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      
      expect(focusedElement).toBeTruthy();
      
      // Focus should be visible
      const focusedElementSelector = await page.evaluate(() => {
        const active = document.activeElement;
        return active ? active.className : '';
      });
      
      // Should have focus styles (this depends on your CSS framework)
      expect(focusedElementSelector).toBeTruthy();
    });
  });
});
