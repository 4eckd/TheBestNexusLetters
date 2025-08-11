import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeToggle } from '../theme-toggle';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Button variant', () => {
    it('should render theme toggle button', () => {
      render(<ThemeToggle variant="button" />, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Current theme: Light. Click to cycle themes.');
    });

    it('should cycle through themes when clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle variant="button" />, { wrapper });
      
      const button = screen.getByRole('button');
      
      // Initially light theme
      expect(button).toHaveAttribute('aria-label', 'Current theme: Light. Click to cycle themes.');
      
      // Click to go to dark
      await user.click(button);
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Current theme: Dark. Click to cycle themes.');
      });
      
      // Click to go to army
      await user.click(button);
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Current theme: Army. Click to cycle themes.');
      });
    });
  });

  describe('Dropdown variant', () => {
    it('should render theme selector dropdown', () => {
      render(<ThemeToggle variant="dropdown" />, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Light');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should open dropdown when clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle variant="dropdown" />, { wrapper });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should display all theme options in dropdown', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle variant="dropdown" />, { wrapper });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(5);
      
      expect(screen.getAllByText('Light')).toHaveLength(2); // Button text and option text
      expect(screen.getAllByText('Dark')).toHaveLength(1); // Only in option
      expect(screen.getByText('Army')).toBeInTheDocument();
      expect(screen.getByText('Navy')).toBeInTheDocument();
      expect(screen.getByText('Marines')).toBeInTheDocument();
    });

    it('should select theme from dropdown', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle variant="dropdown" />, { wrapper });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const navyOption = screen.getByRole('option', { name: /Navy/ });
      await user.click(navyOption);
      
      await waitFor(() => {
        expect(button).toHaveTextContent('Navy');
      });
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should close dropdown when clicking backdrop', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle variant="dropdown" />, { wrapper });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      // Click the backdrop
      const backdrop = document.querySelector('.fixed.inset-0');
      if (backdrop) {
        await user.click(backdrop);
      }
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should show current theme as selected', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle variant="dropdown" />, { wrapper });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const lightOption = screen.getByRole('option', { name: /Light/ });
      expect(lightOption).toHaveAttribute('aria-selected', 'true');
      expect(lightOption).toHaveClass('bg-accent');
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle variant="dropdown" />, { wrapper });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const firstOption = screen.getByRole('option', { name: /Light/ });
      
      // Test keyboard navigation (Enter key)
      await user.type(firstOption, '{enter}');
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for button variant', () => {
      render(<ThemeToggle variant="button" />, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('should have proper ARIA attributes for dropdown variant', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle variant="dropdown" />, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Theme selector. Current theme: Light');
      expect(button).toHaveAttribute('aria-expanded');
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
      
      await user.click(button);
      
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
      
      const options = screen.getAllByRole('option');
      options.forEach(option => {
        expect(option).toHaveAttribute('aria-selected');
      });
    });
  });

  describe('Custom styling', () => {
    it('should apply custom className', () => {
      render(<ThemeToggle className="custom-class" />, { wrapper });
      
      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });
});
