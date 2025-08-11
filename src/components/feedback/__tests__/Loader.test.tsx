import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loader } from '../Loader';
import { ThemeProvider } from '@/components/providers/theme-provider';
import type { Theme } from '@/types/theme';

// Mock Next.js useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
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

describe('Loader Component', () => {
  describe('Basic Rendering', () => {
    it('should render with minimal props', () => {
      render(
        <TestThemeWrapper>
          <Loader />
        </TestThemeWrapper>
      );
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      render(
        <TestThemeWrapper>
          <Loader text="Please wait..." />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('should render without text when text prop is empty', () => {
      render(
        <TestThemeWrapper>
          <Loader text="" />
        </TestThemeWrapper>
      );
      
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should hide text when showText is false', () => {
      render(
        <TestThemeWrapper>
          <Loader showText={false} />
        </TestThemeWrapper>
      );
      
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should render with extra small size', () => {
      render(
        <TestThemeWrapper>
          <Loader size="xs" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status').querySelector('div');
      expect(loader).toHaveClass('w-4', 'h-4');
    });

    it('should render with small size', () => {
      render(
        <TestThemeWrapper>
          <Loader size="sm" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status').querySelector('div');
      expect(loader).toHaveClass('w-6', 'h-6');
    });

    it('should render with medium size (default)', () => {
      render(
        <TestThemeWrapper>
          <Loader size="md" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status').querySelector('div');
      expect(loader).toHaveClass('w-8', 'h-8');
    });

    it('should render with large size', () => {
      render(
        <TestThemeWrapper>
          <Loader size="lg" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status').querySelector('div');
      expect(loader).toHaveClass('w-12', 'h-12');
    });

    it('should render with extra large size', () => {
      render(
        <TestThemeWrapper>
          <Loader size="xl" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status').querySelector('div');
      expect(loader).toHaveClass('w-16', 'h-16');
    });
  });

  describe('Variant Types', () => {
    it('should render spinner variant (default)', () => {
      render(
        <TestThemeWrapper>
          <Loader variant="spinner" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status');
      expect(loader.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should render dots variant', () => {
      render(
        <TestThemeWrapper>
          <Loader variant="dots" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status');
      const dots = loader.querySelectorAll('.animate-bounce');
      expect(dots).toHaveLength(3);
    });

    it('should render pulse variant', () => {
      render(
        <TestThemeWrapper>
          <Loader variant="pulse" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status');
      expect(loader.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should render bars variant', () => {
      render(
        <TestThemeWrapper>
          <Loader variant="bars" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status');
      const bars = loader.querySelectorAll('.animate-pulse');
      expect(bars.length).toBeGreaterThan(1);
    });
  });

  describe('Color Variants', () => {
    it('should render with primary color (default)', () => {
      render(
        <TestThemeWrapper>
          <Loader color="primary" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status').querySelector('div');
      expect(loader).toHaveClass('border-primary-600');
    });

    it('should render with secondary color', () => {
      render(
        <TestThemeWrapper>
          <Loader color="secondary" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status').querySelector('div');
      expect(loader).toHaveClass('border-secondary-600');
    });

    it('should render with white color', () => {
      render(
        <TestThemeWrapper>
          <Loader color="white" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status').querySelector('div');
      expect(loader).toHaveClass('border-white');
    });

    it('should render with gray color', () => {
      render(
        <TestThemeWrapper>
          <Loader color="gray" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status').querySelector('div');
      expect(loader).toHaveClass('border-gray-600');
    });
  });

  describe('Centering and Layout', () => {
    it('should render centered when center prop is true', () => {
      render(
        <TestThemeWrapper>
          <Loader center />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('status').parentElement;
      expect(container).toHaveClass('flex', 'justify-center', 'items-center');
    });

    it('should render with overlay when overlay prop is true', () => {
      render(
        <TestThemeWrapper>
          <Loader overlay />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('status').closest('.fixed');
      expect(container).toHaveClass('fixed', 'inset-0');
    });

    it('should render with fullscreen overlay', () => {
      render(
        <TestThemeWrapper>
          <Loader overlay center />
        </TestThemeWrapper>
      );
      
      const container = screen.getByRole('status').closest('.fixed');
      expect(container).toHaveClass('fixed', 'inset-0', 'flex', 'justify-center', 'items-center');
    });
  });

  describe('Theme Variants', () => {
    const themes: Theme[] = ['dark', 'violet', 'emerald', 'amber', 'aurora'];

    themes.forEach(theme => {
      it(`should render correctly in ${theme} theme`, () => {
        render(
          <TestThemeWrapper theme={theme}>
            <Loader text="Loading in theme..." />
          </TestThemeWrapper>
        );

        expect(screen.getByText('Loading in theme...')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <TestThemeWrapper>
          <Loader />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status');
      expect(loader).toHaveAttribute('aria-label', 'Loading');
    });

    it('should have custom aria-label', () => {
      render(
        <TestThemeWrapper>
          <Loader aria-label="Custom loading message" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status');
      expect(loader).toHaveAttribute('aria-label', 'Custom loading message');
    });

    it('should be screen reader accessible', () => {
      render(
        <TestThemeWrapper>
          <Loader text="Processing your request..." />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status');
      expect(loader).toBeInTheDocument();
      expect(screen.getByText('Processing your request...')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(
        <TestThemeWrapper>
          <Loader className="custom-loader-class" />
        </TestThemeWrapper>
      );
      
      const loader = screen.getByRole('status');
      expect(loader).toHaveClass('custom-loader-class');
    });

    it('should apply custom data-testid', () => {
      render(
        <TestThemeWrapper>
          <Loader data-testid="custom-loader" />
        </TestThemeWrapper>
      );
      
      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    });
  });

  describe('Animation States', () => {
    it('should have spinning animation for spinner variant', () => {
      render(
        <TestThemeWrapper>
          <Loader variant="spinner" />
        </TestThemeWrapper>
      );
      
      const spinner = screen.getByRole('status').querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should have bouncing animation for dots variant', () => {
      render(
        <TestThemeWrapper>
          <Loader variant="dots" />
        </TestThemeWrapper>
      );
      
      const dots = screen.getByRole('status').querySelectorAll('.animate-bounce');
      expect(dots.length).toBeGreaterThan(0);
    });

    it('should have pulsing animation for pulse variant', () => {
      render(
        <TestThemeWrapper>
          <Loader variant="pulse" />
        </TestThemeWrapper>
      );
      
      const pulse = screen.getByRole('status').querySelector('.animate-pulse');
      expect(pulse).toBeInTheDocument();
    });
  });

  describe('Composition and Complex Usage', () => {
    it('should render with all props combined', () => {
      render(
        <TestThemeWrapper>
          <Loader
            size="lg"
            variant="dots"
            color="secondary"
            text="Processing data..."
            center
            overlay
            className="custom-class"
          />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText('Processing data...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass('custom-class');
      
      const container = screen.getByRole('status').closest('.fixed');
      expect(container).toHaveClass('fixed', 'inset-0');
    });

    it('should handle responsive sizing', () => {
      render(
        <TestThemeWrapper>
          <Loader size="sm" />
        </TestThemeWrapper>
      );
      
      // Component should render without errors
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should render with null text', () => {
      render(
        <TestThemeWrapper>
          <Loader text={null as any} />
        </TestThemeWrapper>
      );
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render with undefined text', () => {
      render(
        <TestThemeWrapper>
          <Loader text={undefined} />
        </TestThemeWrapper>
      );
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should handle very long loading text', () => {
      const longText = 'A'.repeat(1000);
      
      render(
        <TestThemeWrapper>
          <Loader text={longText} />
        </TestThemeWrapper>
      );
      
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly with default props', () => {
      const startTime = performance.now();
      
      render(
        <TestThemeWrapper>
          <Loader />
        </TestThemeWrapper>
      );
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50); // Should render in less than 50ms
    });
  });
});
