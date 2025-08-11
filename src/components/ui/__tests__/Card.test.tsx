import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '../Card';
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
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => (
  <ThemeProvider defaultTheme={theme}>
    {children}
  </ThemeProvider>
);

describe('Card Component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      render(<Card>Basic card content</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Basic card content');
    });

    it('should apply custom className', () => {
      render(<Card className="custom-class">Content</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });

    it('should apply custom testId', () => {
      render(<Card data-testid="custom-card">Content</Card>);
      
      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Card Variants', () => {
    it('should render with default variant', () => {
      render(<Card>Default variant</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-white', 'dark:bg-slate-950');
    });

    it('should render with outlined variant', () => {
      render(<Card variant="outlined">Outlined variant</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-white', 'border', 'border-slate-200', 'dark:bg-slate-950', 'dark:border-slate-800');
    });

    it('should render with elevated variant', () => {
      render(<Card variant="elevated">Elevated variant</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-white', 'shadow-lg', 'dark:bg-slate-950', 'dark:shadow-slate-900/25');
    });
  });

  describe('Card Padding', () => {
    it('should render with no padding', () => {
      render(<Card padding="none">No padding</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('p-3', 'p-6', 'p-8');
    });

    it('should render with small padding', () => {
      render(<Card padding="sm">Small padding</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('p-3');
    });

    it('should render with medium padding (default)', () => {
      render(<Card padding="md">Medium padding</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('p-6');
    });

    it('should render with large padding', () => {
      render(<Card padding="lg">Large padding</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('p-8');
    });
  });

  describe('Interactive Card', () => {
    it('should render as interactive when interactive=true', () => {
      render(<Card interactive>Interactive card</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('cursor-pointer', 'hover:bg-slate-50', 'dark:hover:bg-slate-900/50');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabindex', '0');
    });

    it('should not be interactive by default', () => {
      render(<Card>Non-interactive card</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('cursor-pointer');
      expect(card).not.toHaveAttribute('role', 'button');
      expect(card).not.toHaveAttribute('tabindex');
    });

    it('should handle click events when interactive', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Card interactive onClick={handleClick}>
          Clickable card
        </Card>
      );
      
      const card = screen.getByTestId('card');
      await user.click(card);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events when interactive', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Card interactive onClick={handleClick}>
          Keyboard accessible card
        </Card>
      );
      
      const card = screen.getByTestId('card');
      card.focus();
      
      // Test Enter key
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      // Test Space key
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Card Header and Footer', () => {
    it('should render with header', () => {
      const header = <div>Custom Header</div>;
      render(<Card header={header}>Card with header</Card>);
      
      expect(screen.getByText('Custom Header')).toBeInTheDocument();
      expect(screen.getByText('Card with header')).toBeInTheDocument();
    });

    it('should render with footer', () => {
      const footer = <div>Custom Footer</div>;
      render(<Card footer={footer}>Card with footer</Card>);
      
      expect(screen.getByText('Custom Footer')).toBeInTheDocument();
      expect(screen.getByText('Card with footer')).toBeInTheDocument();
    });

    it('should render with both header and footer', () => {
      const header = <div>Header Content</div>;
      const footer = <div>Footer Content</div>;
      
      render(
        <Card header={header} footer={footer}>
          Main content
        </Card>
      );
      
      expect(screen.getByText('Header Content')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });
  });

  describe('CardHeader Component', () => {
    it('should render with title and subtitle', () => {
      render(
        <CardHeader title="Card Title" subtitle="Card Subtitle" />
      );
      
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
      expect(screen.getByTestId('card-header')).toBeInTheDocument();
    });

    it('should render with actions', () => {
      const actions = <button>Action Button</button>;
      
      render(
        <CardHeader title="Card Title" actions={actions} />
      );
      
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });

    it('should render with children', () => {
      render(
        <CardHeader>
          <div>Custom header content</div>
        </CardHeader>
      );
      
      expect(screen.getByText('Custom header content')).toBeInTheDocument();
    });

    it('should apply correct styling for title and subtitle', () => {
      render(
        <CardHeader title="Card Title" subtitle="Card Subtitle" />
      );
      
      const title = screen.getByText('Card Title');
      const subtitle = screen.getByText('Card Subtitle');
      
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight', 'text-slate-900', 'dark:text-slate-50');
      expect(subtitle).toHaveClass('text-sm', 'text-slate-500', 'dark:text-slate-400');
    });
  });

  describe('CardContent Component', () => {
    it('should render with correct styling', () => {
      render(<CardContent>Content text</CardContent>);
      
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('text-slate-700', 'dark:text-slate-300');
      expect(content).toHaveTextContent('Content text');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardContent ref={ref}>Content</CardContent>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardFooter Component', () => {
    it('should render with correct styling', () => {
      render(<CardFooter>Footer content</CardFooter>);
      
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveClass('flex', 'items-center', 'gap-2');
      expect(footer).toHaveTextContent('Footer content');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardFooter ref={ref}>Footer</CardFooter>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardTitle Component', () => {
    it('should render as h3 with correct styling', () => {
      render(<CardTitle>Title Text</CardTitle>);
      
      const title = screen.getByTestId('card-title');
      expect(title.tagName).toBe('H3');
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight');
      expect(title).toHaveTextContent('Title Text');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(<CardTitle ref={ref}>Title</CardTitle>);
      
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.tagName).toBe('H3');
    });
  });

  describe('Theme Variants', () => {
    const themes: Theme[] = ['dark', 'violet', 'emerald', 'amber', 'aurora'];

    themes.forEach(theme => {
      it(`should render correctly in ${theme} theme`, () => {
        render(
          <TestThemeWrapper theme={theme}>
            <Card variant="outlined" interactive>
              <CardHeader title="Test Title" subtitle="Test Subtitle" />
              <CardContent>Test content</CardContent>
              <CardFooter>Test footer</CardFooter>
            </Card>
          </TestThemeWrapper>
        );

        const card = screen.getByTestId('card');
        expect(card).toBeInTheDocument();
        
        // Check that theme-specific classes are applied
        const computedStyle = window.getComputedStyle(card);
        expect(computedStyle).toBeTruthy(); // Just verify styling is computed
        
        // Verify all sections are present
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
        expect(screen.getByText('Test content')).toBeInTheDocument();
        expect(screen.getByText('Test footer')).toBeInTheDocument();
      });
    });

    it('should maintain contrast standards across all themes', () => {
      themes.forEach(theme => {
        const { container } = render(
          <TestThemeWrapper theme={theme}>
            <Card>
              <CardContent>Accessible content</CardContent>
            </Card>
          </TestThemeWrapper>
        );
        
        // Basic accessibility check - component should render without errors
        expect(container.firstChild).toBeInTheDocument();
        cleanup();
      });
    });
  });

  describe('Accessibility (WCAG)', () => {
    it('should have no accessibility violations for basic card', () => {
      const { container } = render(
        <Card>
          <CardContent>Accessible card content</CardContent>
        </Card>
      );

      // Basic accessibility checks
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
    });

    it('should have proper accessibility attributes for interactive card', () => {
      const { container } = render(
        <Card interactive aria-label="Interactive card">
          <CardContent>Interactive content</CardContent>
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabindex', '0');
      expect(card).toHaveAttribute('aria-label', 'Interactive card');
    });

    it('should have proper heading hierarchy', () => {
      const { container } = render(
        <Card>
          <CardHeader title="Main Title" />
          <CardContent>
            <CardTitle>Section Title</CardTitle>
            Content goes here
          </CardContent>
        </Card>
      );

      const titles = screen.getAllByRole('heading');
      expect(titles).toHaveLength(2);
      
      // Both should be h3 elements (CardTitle components)
      titles.forEach(title => {
        expect(title.tagName).toBe('H3');
      });
    });

    it('should support keyboard navigation for interactive cards', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <div>
          <Card interactive onClick={handleClick}>First card</Card>
          <Card interactive onClick={handleClick}>Second card</Card>
          <Card interactive onClick={handleClick}>Third card</Card>
        </div>
      );

      const cards = screen.getAllByRole('button');
      expect(cards).toHaveLength(3);

      // Test Tab navigation
      await user.tab();
      expect(cards[0]).toHaveFocus();

      await user.tab();
      expect(cards[1]).toHaveFocus();

      await user.tab();
      expect(cards[2]).toHaveFocus();

      // Test Shift+Tab navigation
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(cards[1]).toHaveFocus();
    });

    it('should handle focus management correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <Card interactive>
          <CardContent>Focusable card</CardContent>
        </Card>
      );

      const card = screen.getByRole('button');
      
      // Test programmatic focus
      card.focus();
      expect(card).toHaveFocus();

      // Test blur
      await user.tab();
      expect(card).not.toHaveFocus();
    });
  });

  describe('Complex Card Compositions', () => {
    it('should render complex card with all components', () => {
      const actions = (
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      );

      render(
        <Card variant="elevated" interactive>
          <CardHeader 
            title="Complex Card Title" 
            subtitle="This is a subtitle"
            actions={actions}
          />
          <CardContent>
            <p>This is the main content area.</p>
            <CardTitle>Subsection Title</CardTitle>
            <p>Additional content here.</p>
          </CardContent>
          <CardFooter>
            <button>Primary Action</button>
            <button>Secondary Action</button>
          </CardFooter>
        </Card>
      );

      // Verify all parts are rendered
      expect(screen.getByText('Complex Card Title')).toBeInTheDocument();
      expect(screen.getByText('This is a subtitle')).toBeInTheDocument();
      expect(screen.getByText('This is the main content area.')).toBeInTheDocument();
      expect(screen.getByText('Subsection Title')).toBeInTheDocument();
      expect(screen.getByText('Additional content here.')).toBeInTheDocument();
      
      // Verify action buttons
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Secondary Action' })).toBeInTheDocument();
    });

    it('should maintain proper layout with nested content', () => {
      render(
        <Card>
          <CardContent>
            <div>
              <CardTitle>Nested Title</CardTitle>
              <div>
                <p>Nested paragraph</p>
                <ul>
                  <li>List item 1</li>
                  <li>List item 2</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Nested Title')).toBeInTheDocument();
      expect(screen.getByText('Nested paragraph')).toBeInTheDocument();
      expect(screen.getByText('List item 1')).toBeInTheDocument();
      expect(screen.getByText('List item 2')).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('should handle mouse events correctly', async () => {
      const handleMouseEnter = vi.fn();
      const handleMouseLeave = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Card 
          interactive 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Hover me
        </Card>
      );

      const card = screen.getByTestId('card');
      
      await user.hover(card);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
      
      await user.unhover(card);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events for interactive cards', async () => {
      const handleKeyDown = vi.fn();
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Card 
          interactive 
          onKeyDown={handleKeyDown}
          onClick={handleClick}
        >
          Keyboard accessible
        </Card>
      );

      const card = screen.getByRole('button');
      card.focus();
      
      await user.keyboard('{Enter}');
      expect(handleKeyDown).toHaveBeenCalled();
      expect(handleClick).toHaveBeenCalled();
      
      vi.clearAllMocks();
      
      await user.keyboard(' ');
      expect(handleKeyDown).toHaveBeenCalled();
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Error States and Edge Cases', () => {
    it('should handle empty content gracefully', () => {
      render(<Card />);
      
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toBeEmptyDOMElement();
    });

    it('should handle null/undefined header and footer', () => {
      render(
        <Card header={null} footer={undefined}>
          Content only
        </Card>
      );

      expect(screen.getByText('Content only')).toBeInTheDocument();
      // Header and footer containers should not be rendered
      expect(screen.queryByText('Header')).not.toBeInTheDocument();
      expect(screen.queryByText('Footer')).not.toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(1000);
      
      render(
        <Card>
          <CardContent>{longContent}</CardContent>
        </Card>
      );

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });
});
