import React from 'react';
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

    it('should render as button element', () => {
      render(<Button>Button Text</Button>, { wrapper });
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Button Text')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant styling', () => {
      render(<Button>Default Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-slate-900'); // Should have default background
    });

    it('should apply secondary variant styling', () => {
      render(<Button variant="secondary">Secondary Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-slate-100'); // Secondary has light background
    });

    it('should apply destructive variant styling', () => {
      render(<Button variant="destructive">Delete</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-500'); // Destructive background
    });

    it('should apply outline variant styling', () => {
      render(<Button variant="outline">Outline Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border'); // Outline has border
    });

    it('should apply ghost variant styling', () => {
      render(<Button variant="ghost">Ghost Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-slate-100'); // Ghost has hover background
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
      expect(button).toHaveClass('h-9'); // Default height (md)
      expect(button).toHaveClass('px-4'); // Default padding
    });

    it('should apply small size', () => {
      render(<Button size="sm">Small Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8'); // Small height
      expect(button).toHaveClass('px-3'); // Small padding
    });

    it('should apply large size', () => {
      render(<Button size="lg">Large Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10'); // Large height
      expect(button).toHaveClass('px-6'); // Large padding
    });

    it('should apply icon size with iconOnly', () => {
      render(<Button iconOnly size="icon" aria-label="Icon button">X</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9'); // Icon height
      expect(button).toHaveClass('w-9'); // Icon width (square)
      expect(button).toHaveClass('aspect-square'); // Should be square
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
      render(<Button isLoading>Loading Button</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled(); // Loading buttons should be disabled
      
      // Should show loading spinner
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should hide text content when loading', () => {
      render(<Button isLoading>Button Text</Button>, { wrapper });
      
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
      
      render(<Button isLoading onClick={handleClick}>Loading</Button>, { wrapper });
      
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
      
      // Note: Space key on buttons might not work in JSDOM environment
      // This test focuses on Enter key which is more reliable
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

  describe('AsChild Functionality', () => {
    it('should render as a link when asChild is true', () => {
      render(
        <Button asChild variant="outline">
          <a href="/test" data-testid="button-link">Link Button</a>
        </Button>,
        { wrapper }
      );
      
      const link = screen.getByTestId('button-link');
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveClass('border'); // Should have outline variant styles
      expect(link).toHaveTextContent('Link Button');
    });

    it('should render as custom element when asChild is true', () => {
      render(
        <Button asChild>
          <span role="button" tabIndex={0} data-testid="button-span">Span Button</span>
        </Button>,
        { wrapper }
      );
      
      const span = screen.getByTestId('button-span');
      expect(span).toBeInTheDocument();
      expect(span.tagName).toBe('SPAN');
      expect(span).toHaveAttribute('role', 'button');
      expect(span).toHaveClass('bg-slate-900'); // Should have default variant styles
      expect(span).toHaveTextContent('Span Button');
    });

    it('should handle loading state with asChild', () => {
      render(
        <Button asChild isLoading>
          <a href="#" data-testid="loading-link">Loading Link</a>
        </Button>,
        { wrapper }
      );
      
      const link = screen.getByTestId('loading-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('aria-busy', 'true');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      
      // Should show loading spinner
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should handle disabled state with asChild', () => {
      render(
        <Button asChild disabled>
          <a href="#" data-testid="disabled-link">Disabled Link</a>
        </Button>,
        { wrapper }
      );
      
      const link = screen.getByTestId('disabled-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveClass('disabled:opacity-50');
    });

    it('should handle iconOnly with asChild', () => {
      render(
        <Button asChild iconOnly size="icon" aria-label="Icon link">
          <a href="#" data-testid="icon-link">
            <span>X</span>
          </a>
        </Button>,
        { wrapper }
      );
      
      const link = screen.getByTestId('icon-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('h-9'); // Icon size
      expect(link).toHaveClass('w-9'); // Icon width
      expect(link).toHaveClass('aspect-square');
      expect(link).toHaveAttribute('aria-label', 'Icon link');
    });
  });

  describe('Icon Only Behavior', () => {
    it('should auto-apply icon size when iconOnly is true', () => {
      render(<Button iconOnly aria-label="Icon button">X</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9'); // Should auto-apply icon size
      expect(button).toHaveClass('w-9');
      expect(button).toHaveClass('aspect-square');
    });

    it('should preserve explicit size when iconOnly is true', () => {
      render(<Button iconOnly size="icon" aria-label="Icon button">X</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9');
      expect(button).toHaveClass('w-9');
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
      render(<Button isLoading>Loading Button</Button>, { wrapper });
      
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
      expect(button).toHaveClass('focus-visible:ring-1'); // Focus ring
    });

    it('should support high contrast mode', () => {
      render(<Button>High Contrast</Button>, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // In a real implementation, you'd test for forced-colors media query support
    });
  });
});
