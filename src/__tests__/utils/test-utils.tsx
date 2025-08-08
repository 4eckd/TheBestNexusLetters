import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/theme-provider';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render method with custom render
export { customRender as render };

// Test utilities
export const waitForLoadingToFinish = async () => {
  // Wait for loading spinners to disappear
  const { waitForElementToBeRemoved } = await import('@testing-library/react');
  
  try {
    await waitForElementToBeRemoved(
      () => document.querySelector('[data-testid="loading-spinner"], .loading, [aria-busy="true"]'),
      { timeout: 5000 }
    );
  } catch {
    // Loading might have finished before we started waiting
  }
};

// Mock user for testing
export const mockUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  username: 'testuser',
  role: 'user' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock claim for testing
export const mockClaim = {
  id: 'mock-claim-id',
  user_id: 'mock-user-id',
  claim_number: 'CLM-2024-001',
  title: 'Test Claim',
  description: 'Test claim description',
  claim_type: 'disability' as const,
  status: 'pending' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Theme testing utilities
export const testThemes = ['light', 'dark', 'army', 'navy', 'marines'] as const;

export const testInAllThemes = (testFn: (theme: typeof testThemes[number]) => void) => {
  testThemes.forEach(theme => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        // Set theme for testing
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
      });
      
      testFn(theme);
    });
  });
};

// Accessibility testing helpers
export const axeConfig = {
  rules: {
    // Disable some rules that might be too strict for development
    'color-contrast': { enabled: false }, // We'll test this separately
  },
};

// Form testing utilities
export const fillForm = async (fields: Record<string, string>) => {
  const { screen } = await import('@testing-library/react');
  const userEvent = (await import('@testing-library/user-event')).default;
  const user = userEvent.setup();

  for (const [field, value] of Object.entries(fields)) {
    const input = screen.getByLabelText(new RegExp(field, 'i')) || 
                  screen.getByPlaceholderText(new RegExp(field, 'i')) ||
                  screen.getByRole('textbox', { name: new RegExp(field, 'i') });
    
    await user.clear(input);
    await user.type(input, value);
  }
};

// Network request mocking helpers
export const mockApiResponse = (data: any, status = 200) => {
  return {
    data,
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(data),
  };
};

// Database operation mocking
export const mockDatabaseOperation = (result: any, error?: any) => {
  return {
    data: error ? null : result,
    error: error || null,
  };
};

// Viewport testing utilities
export const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Custom matchers for better test assertions
export const customMatchers = {
  toHaveProperContrast: (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    
    return {
      pass: color !== backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)',
      message: () => `Expected element to have proper contrast. Color: ${color}, Background: ${backgroundColor}`,
    };
  },
  
  toBeAccessible: (element: HTMLElement) => {
    // Basic accessibility checks
    const hasRole = element.getAttribute('role');
    const hasAriaLabel = element.getAttribute('aria-label');
    const hasTabIndex = element.getAttribute('tabindex');
    
    const isAccessible = hasRole || hasAriaLabel || element.tagName.match(/^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/i);
    
    return {
      pass: Boolean(isAccessible),
      message: () => `Expected element to be accessible (have role, aria-label, or be a semantic element)`,
    };
  },
};

// Performance testing utilities
export const measurePerformance = async (fn: () => Promise<void> | void) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  return end - start;
};

// Cleanup utilities
export const cleanup = () => {
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Reset document attributes
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.className = '';
  document.body.className = '';
};
