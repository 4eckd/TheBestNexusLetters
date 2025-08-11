import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '../ErrorState';
import { ThemeProvider } from '@/components/providers/theme-provider';
import type { Theme } from '@/types/theme';

// Mock Next.js useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Theme wrapper for testing theme variants
const TestThemeWrapper: React.FC<{
  theme?: Theme;
  children: React.ReactNode;
}> = ({ theme = 'dark', children }) => (
  <ThemeProvider defaultTheme={theme}>
    {children}
  </ThemeProvider>
);

describe('ErrorState Component', () => {
  describe('Basic Rendering', () => {
    it('should render with minimal props', () => {
      render(
        <TestThemeWrapper>
          <ErrorState />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should render with custom title and message', () => {
      render(
        <TestThemeWrapper>
          <ErrorState 
            title="Custom Error Title"
            errorMessage="Custom error message"
          />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should render with custom icon', () => {
      const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;
      
      render(
        <TestThemeWrapper>
          <ErrorState icon={<CustomIcon />} />
        </TestThemeWrapper>
      );
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render retry button when onRetry is provided', () => {
      const handleRetry = vi.fn();
      
      render(
        <TestThemeWrapper>
          <ErrorState onRetry={handleRetry} />
        </TestThemeWrapper>
      );
      
      const retryButton = screen.getByLabelText('Retry the failed action');
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveTextContent('Try again');
    });

    it('should call onRetry when retry button is clicked', async () => {
      const handleRetry = vi.fn();
      const user = userEvent.setup();
      
      render(
        <TestThemeWrapper>
          <ErrorState onRetry={handleRetry} />
        </TestThemeWrapper>
      );
      
      const retryButton = screen.getByLabelText('Retry the failed action');
      await user.click(retryButton);
      
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('should render custom retry button text', () => {
      const handleRetry = vi.fn();
      
      render(
        <TestThemeWrapper>
          <ErrorState onRetry={handleRetry} retryText="Retry Now" />
        </TestThemeWrapper>
      );
      
      const retryButton = screen.getByLabelText('Retry the failed action');
      expect(retryButton).toHaveTextContent('Retry Now');
    });

    it('should render home button when showNavigation is true with onNavigateHome', () => {
      const handleHome = vi.fn();
      
      render(
        <TestThemeWrapper>
          <ErrorState showNavigation onNavigateHome={handleHome} />
        </TestThemeWrapper>
      );
      
      const homeButton = screen.getByLabelText('Go to home page');
      expect(homeButton).toBeInTheDocument();
      expect(homeButton).toHaveTextContent('Home');
    });

    it('should render both retry and home buttons', () => {
      const handleRetry = vi.fn();
      const handleHome = vi.fn();
      
      render(
        <TestThemeWrapper>
          <ErrorState 
            onRetry={handleRetry} 
            showNavigation 
            onNavigateHome={handleHome} 
          />
        </TestThemeWrapper>
      );
      
      expect(screen.getByLabelText('Retry the failed action')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to home page')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should render with small size and have correct styling', () => {
      render(
        <TestThemeWrapper>
          <ErrorState size="sm" />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('alert');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('p-4');
    });

    it('should render with medium size (default) and have correct styling', () => {
      render(
        <TestThemeWrapper>
          <ErrorState size="md" />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('alert');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('p-6');
    });

    it('should render with large size and have correct styling', () => {
      render(
        <TestThemeWrapper>
          <ErrorState size="lg" />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('alert');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('p-8');
    });
  });

  describe('Size Variants', () => {
    it('should render with small size', () => {
      render(
        <TestThemeWrapper>
          <ErrorState size="sm" />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('alert').parentElement;
      expect(container).toHaveClass('space-y-3');
    });

    it('should render with medium size (default)', () => {
      render(
        <TestThemeWrapper>
          <ErrorState size="md" />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('alert').parentElement;
      expect(container).toHaveClass('space-y-4');
    });

    it('should render with large size', () => {
      render(
        <TestThemeWrapper>
          <ErrorState size="lg" />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('alert').parentElement;
      expect(container).toHaveClass('space-y-6');
    });
  });

  describe('Theme Variants', () => {
    const themes: Theme[] = ['dark', 'violet', 'emerald', 'amber', 'aurora'];

    themes.forEach(theme => {
      it(`should render correctly in ${theme} theme`, () => {
        render(
          <TestThemeWrapper theme={theme}>
            <ErrorState onRetry={() => {}} showHomeButton />
          </TestThemeWrapper>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go home' })).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <TestThemeWrapper>
          <ErrorState />
        </TestThemeWrapper>
      );
      
      const errorContainer = screen.getByRole('alert');
      expect(errorContainer).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      const handleRetry = vi.fn();
      
      render(
        <TestThemeWrapper>
          <ErrorState onRetry={handleRetry} showHomeButton />
        </TestThemeWrapper>
      );
      
      const retryButton = screen.getByRole('button', { name: 'Try again' });
      const homeButton = screen.getByRole('button', { name: 'Go home' });
      
      expect(retryButton).toBeInTheDocument();
      expect(homeButton).toBeInTheDocument();
    });

    it('should handle keyboard navigation', async () => {
      const handleRetry = vi.fn();
      const user = userEvent.setup();
      
      render(
        <TestThemeWrapper>
          <ErrorState onRetry={handleRetry} showHomeButton />
        </TestThemeWrapper>
      );
      
      // Test keyboard navigation between buttons
      await user.tab();
      expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: 'Go home' })).toHaveFocus();
      
      // Test Enter key activation
      await user.keyboard('{Enter}');
      // Home button should trigger navigation (mocked)
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(
        <TestThemeWrapper>
          <ErrorState className="custom-error-class" />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('alert').closest('.custom-error-class');
      expect(container).toBeInTheDocument();
    });

    it('should apply custom data-testid', () => {
      render(
        <TestThemeWrapper>
          <ErrorState data-testid="custom-error-state" />
        </TestThemeWrapper>
      );
      
      expect(screen.getByTestId('custom-error-state')).toBeInTheDocument();
    });
  });

  describe('Error Object Handling', () => {
    it('should handle Error objects', () => {
      const error = new Error('Network error occurred');
      
      render(
        <TestThemeWrapper>
          <ErrorState error={error} showDetails />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });

    it('should handle string errors', () => {
      const error = 'Simple error message';
      
      render(
        <TestThemeWrapper>
          <ErrorState error={error} showDetails />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText('Simple error message')).toBeInTheDocument();
    });

    it('should handle null/undefined errors', () => {
      render(
        <TestThemeWrapper>
          <ErrorState error={null} showDetails />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });
  });

  describe('Action Handlers', () => {
    it('should handle missing onRetry gracefully', () => {
      render(
        <TestThemeWrapper>
          <ErrorState />
        </TestThemeWrapper>
      );
      
      expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
    });

    it('should disable retry button during retry', async () => {
      const slowRetry = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      const user = userEvent.setup();
      
      render(
        <TestThemeWrapper>
          <ErrorState onRetry={slowRetry} />
        </TestThemeWrapper>
      );
      
      const retryButton = screen.getByRole('button', { name: 'Try again' });
      await user.click(retryButton);
      
      expect(retryButton).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should render without any optional props', () => {
      render(
        <TestThemeWrapper>
          <ErrorState />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle very long error messages', () => {
      const longError = 'A'.repeat(1000);
      
      render(
        <TestThemeWrapper>
          <ErrorState error={longError} showDetails />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('should handle empty string props', () => {
      render(
        <TestThemeWrapper>
          <ErrorState title="" message="" />
        </TestThemeWrapper>
      );
      
      // Should fall back to defaults or handle empty strings gracefully
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });
});
