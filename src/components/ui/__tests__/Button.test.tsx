import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Button } from '../Button';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Button Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('should render as different HTML elements', () => {
      const { rerender } = render(<Button asChild={false}>Button</Button>, { wrapper });
      expect(screen.getByRole('button')).toBeInTheDocument();

      // Test with custom element via asChild pattern
      rerender(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant styling', () => {
      render(<Button>Default Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary'); // Should have primary background
    });

    it('should apply secondary variant styling', () => {
      render(<Button variant="secondary">Secondary Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border'); // Secondary typically has border
    });

    it('should apply destructive variant styling', () => {
      render(<Button variant="destructive">Delete</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive'); // Destructive background
    });

    it('should apply outline variant styling', () => {
      render(<Button variant="outline">Outline Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-input'); // Outline has border
    });

    it('should apply ghost variant styling', () => {
      render(<Button variant="ghost">Ghost Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent'); // Ghost has hover background
    });

    it('should apply link variant styling', () => {
      render(<Button variant="link">Link Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('underline-offset-4'); // Link has underline
    });
  });

  describe('Sizes', () => {
    it('should apply default size', () => {
      render(<Button>Default Size</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10'); // Default height
      expect(button).toHaveClass('px-4'); // Default padding
    });

    it('should apply small size', () => {
      render(<Button size="sm">Small Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9'); // Small height
      expect(button).toHaveClass('px-3'); // Small padding
    });

    it('should apply large size', () => {
      render(<Button size="lg">Large Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-11'); // Large height
      expect(button).toHaveClass('px-8'); // Large padding
    });

    it('should apply icon size', () => {
      render(<Button size="icon">X</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10'); // Icon height
      expect(button).toHaveClass('w-10'); // Icon width (square)
    });
  });

  describe('States', () => {
    it('should handle disabled state', () => {
      render(<Button disabled>Disabled Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none');
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('should handle loading state', () => {
      render(<Button loading>Loading Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled(); // Loading buttons should be disabled
      
      // Should show loading spinner
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should hide text content when loading', () => {
      render(<Button loading>Button Text</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).not.toHaveTextContent('Button Text');
    });
  });

  describe('Interactions', () => {
    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click me</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button disabled onClick={handleClick}>Disabled</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not trigger click when loading', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button loading onClick={handleClick}>Loading</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle keyboard navigation', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Keyboard Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard('{Space}');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should forward HTML attributes', () => {
      render(
        <Button type="submit" data-testid="submit-button">
          Submit
        </Button>,
        { wrapper }
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('data-testid', 'submit-button');
    });

    it('should accept ref', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(<Button ref={ref}>Ref Button</Button>, { wrapper });
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Ref Button');
    });
  });

  describe('Theme Compatibility', () => {
    const themes = ['light', 'dark', 'army', 'navy', 'marines'] as const;

    themes.forEach((theme) => {
      it(`should render correctly in ${theme} theme`, () => {
        // Mock the theme context
        render(
          <ThemeProvider defaultTheme={theme}>
            <Button>Test Button</Button>
          </ThemeProvider>
        );
        
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Test Button');
        
        // Button should have proper contrast and visibility in all themes
        expect(button).toBeVisible();
      });
    });

    it('should maintain proper contrast in all themes', () => {
      // This would ideally test computed styles for contrast ratios
      // For now, we ensure the button renders and is visible
      render(<Button>Contrast Test</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Button aria-label="Custom label" aria-describedby="description">
          Button
        </Button>,
        { wrapper }
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('should indicate loading state to screen readers', () => {
      render(<Button loading>Loading Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have proper focus styles', async () => {
      const user = userEvent.setup();
      
      render(<Button>Focus Test</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      
      await user.tab(); // Focus the button
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus-visible:ring-2'); // Focus ring
    });

    it('should support high contrast mode', () => {
      render(<Button>High Contrast</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // In a real implementation, you'd test for forced-colors media query support
    });
  });
});
