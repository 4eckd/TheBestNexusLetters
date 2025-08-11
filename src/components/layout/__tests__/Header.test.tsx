import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Header from '../Header';

// Mock Next.js navigation hooks
let mockPathname = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

// Mock ThemeToggle component
vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render header with all navigation links', () => {
      render(<Header />, { wrapper });
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      
      // Check main navigation links
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /how it works/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /community/i })).toBeInTheDocument();
    });

    it('should render logo and brand name', () => {
      render(<Header />, { wrapper });
      
      const logoLink = screen.getByRole('link', { name: /the best nexus letters/i });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute('href', '/');
      
      // Use getAllByText to handle multiple instances
      const brandTexts = screen.getAllByText('The Best Nexus Letters');
      expect(brandTexts.length).toBeGreaterThan(0);
    });

    it('should render theme toggle in both desktop and mobile', () => {
      render(<Header />, { wrapper });
      
      const themeToggles = screen.getAllByTestId('theme-toggle');
      expect(themeToggles).toHaveLength(2); // One for mobile, one for desktop
    });

    it('should render user menu in desktop view', () => {
      render(<Header />, { wrapper });
      
      const userMenuButton = screen.getByRole('button', { name: /open user menu/i });
      expect(userMenuButton).toBeInTheDocument();
    });
  });

  describe('Community Demo Link', () => {
    it('should render Community link with correct href', () => {
      render(<Header />, { wrapper });
      
      const communityLinks = screen.getAllByRole('link', { name: /community/i });
      communityLinks.forEach(link => {
        expect(link).toHaveAttribute('href', '/community-demo');
      });
    });

    it('should have accessibility label for Community link', () => {
      render(<Header />, { wrapper });
      
      const communityLinks = screen.getAllByLabelText('Community Forum Demo');
      expect(communityLinks.length).toBeGreaterThan(0);
      
      communityLinks.forEach(link => {
        expect(link).toHaveTextContent('Community');
        expect(link).toHaveAttribute('href', '/community-demo');
      });
    });

    it('should render Community link in both desktop and mobile menus', () => {
      render(<Header />, { wrapper });
      
      // Desktop navigation
      const desktopNav = screen.getByRole('navigation', { name: /global/i });
      const desktopCommunityLink = screen.getAllByRole('link', { name: /community/i })[0];
      expect(desktopNav).toContainElement(desktopCommunityLink);
      
      // Mobile menu (hidden by default, but structure should be present)
      const allCommunityLinks = screen.getAllByRole('link', { name: /community/i });
      expect(allCommunityLinks).toHaveLength(2); // Desktop + Mobile
    });
  });

  describe('Active Path Logic', () => {
    it('should highlight home link when on home page', () => {
      mockPathname = '/';
      
      render(<Header />, { wrapper });
      
      const homeLinks = screen.getAllByRole('link', { name: /home/i });
      homeLinks.forEach(link => {
        expect(link).toHaveClass('text-primary');
      });
    });

    it('should highlight Community link when on community-demo page', () => {
      mockPathname = '/community-demo';
      
      render(<Header />, { wrapper });
      
      const communityLinks = screen.getAllByRole('link', { name: /community/i });
      communityLinks.forEach(link => {
        expect(link).toHaveClass('text-primary');
      });
    });

    it('should highlight Community link when on community-demo subpages', () => {
      mockPathname = '/community-demo/forum';
      
      render(<Header />, { wrapper });
      
      const communityLinks = screen.getAllByRole('link', { name: /community/i });
      communityLinks.forEach(link => {
        expect(link).toHaveClass('text-primary');
      });
    });

    it('should not highlight Community link when on other pages', () => {
      mockPathname = '/services';
      
      render(<Header />, { wrapper });
      
      const communityLinks = screen.getAllByRole('link', { name: /community/i });
      communityLinks.forEach(link => {
        expect(link).toHaveClass('text-muted-foreground');
        expect(link).not.toHaveClass('text-primary');
      });
    });

    it('should handle edge case where pathname is root and link is not root', () => {
      mockPathname = '/';
      
      render(<Header />, { wrapper });
      
      const servicesLinks = screen.getAllByRole('link', { name: /services/i });
      servicesLinks.forEach(link => {
        expect(link).not.toHaveClass('text-primary');
        expect(link).toHaveClass('text-muted-foreground');
      });
    });
  });

  describe('Mobile Menu Functionality', () => {
    it('should open mobile menu when hamburger button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />, { wrapper });
      
      const hamburgerButton = screen.getByRole('button', { name: /open main menu/i });
      expect(hamburgerButton).toBeInTheDocument();
      
      await user.click(hamburgerButton);
      
      // Mobile menu should be visible
      const closeButton = screen.getByRole('button', { name: /close menu/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should close mobile menu when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />, { wrapper });
      
      // Open menu first
      const hamburgerButton = screen.getByRole('button', { name: /open main menu/i });
      await user.click(hamburgerButton);
      
      // Close menu
      const closeButton = screen.getByRole('button', { name: /close menu/i });
      await user.click(closeButton);
      
      // Mobile menu should be closed (close button should not be visible)
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
      });
    });

    it('should close mobile menu when navigation link is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />, { wrapper });
      
      // Open menu first
      const hamburgerButton = screen.getByRole('button', { name: /open main menu/i });
      await user.click(hamburgerButton);
      
      // Click on community link in mobile menu
      const mobileCommunityLink = screen.getAllByRole('link', { name: /community/i })[1]; // Second one is mobile
      await user.click(mobileCommunityLink);
      
      // Mobile menu should close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
      });
    });

    it('should close mobile menu when logo is clicked in mobile menu', async () => {
      const user = userEvent.setup();
      render(<Header />, { wrapper });
      
      // Open menu first
      const hamburgerButton = screen.getByRole('button', { name: /open main menu/i });
      await user.click(hamburgerButton);
      
      // Click logo in mobile menu (there are multiple logo links)
      const logoLinks = screen.getAllByRole('link', { name: /the best nexus letters/i });
      const mobileLogoLink = logoLinks[1]; // Second one should be in mobile menu
      await user.click(mobileLogoLink);
      
      // Mobile menu should close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('User Menu Functionality', () => {
    it('should render user navigation items', async () => {
      const user = userEvent.setup();
      render(<Header />, { wrapper });
      
      const userMenuButton = screen.getByRole('button', { name: /open user menu/i });
      await user.click(userMenuButton);
      
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign out/i })).toBeInTheDocument();
    });

    it('should render user menu items in mobile menu', async () => {
      const user = userEvent.setup();
      render(<Header />, { wrapper });
      
      // Open mobile menu
      const hamburgerButton = screen.getByRole('button', { name: /open main menu/i });
      await user.click(hamburgerButton);
      
      // User navigation items should be visible in mobile menu
      const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i });
      const profileLinks = screen.getAllByRole('link', { name: /profile/i });
      const settingsLinks = screen.getAllByRole('link', { name: /settings/i });
      const signOutLinks = screen.getAllByRole('link', { name: /sign out/i });
      
      expect(dashboardLinks.length).toBeGreaterThan(0);
      expect(profileLinks.length).toBeGreaterThan(0);
      expect(settingsLinks.length).toBeGreaterThan(0);
      expect(signOutLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should show desktop navigation on large screens', () => {
      render(<Header />, { wrapper });
      
      const desktopNav = screen.getByRole('navigation', { name: /global/i });
      const desktopNavContainer = desktopNav.querySelector('.hidden.lg\\:flex.lg\\:gap-x-8');
      expect(desktopNavContainer).toBeInTheDocument();
    });

    it('should show mobile menu button on small screens', () => {
      render(<Header />, { wrapper });
      
      const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i });
      const mobileContainer = mobileMenuButton.closest('.flex.lg\\:hidden');
      expect(mobileContainer).toBeInTheDocument();
    });

    it('should show user menu only in desktop view by default', () => {
      render(<Header />, { wrapper });
      
      const desktopUserMenu = screen.getByRole('button', { name: /open user menu/i });
      const desktopUserMenuContainer = desktopUserMenu.closest('.hidden.lg\\:flex');
      expect(desktopUserMenuContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<Header />, { wrapper });
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      
      const nav = screen.getByRole('navigation', { name: /global/i });
      expect(nav).toBeInTheDocument();
    });

    it('should have accessible link labels', () => {
      render(<Header />, { wrapper });
      
      const communityLink = screen.getAllByLabelText('Community Forum Demo')[0];
      expect(communityLink).toBeInTheDocument();
      expect(communityLink).toHaveAttribute('href', '/community-demo');
    });

    it('should have screen reader text for logo', () => {
      render(<Header />, { wrapper });
      
      const screenReaderTexts = screen.getAllByText('The Best Nexus Letters', { selector: '.sr-only' });
      expect(screenReaderTexts.length).toBeGreaterThan(0);
    });

    it('should have proper button labels', () => {
      render(<Header />, { wrapper });
      
      const hamburgerButton = screen.getByRole('button', { name: /open main menu/i });
      expect(hamburgerButton).toBeInTheDocument();
      
      const userMenuButton = screen.getByRole('button', { name: /open user menu/i });
      expect(userMenuButton).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Header />, { wrapper });
      
      // Tab through focusable elements
      await user.tab();
      expect(screen.getAllByRole('link', { name: /the best nexus letters/i })[0]).toHaveFocus();
      
      await user.tab();
      expect(screen.getAllByRole('link', { name: /home/i })[0]).toHaveFocus();
      
      await user.tab();
      expect(screen.getAllByRole('link', { name: /services/i })[0]).toHaveFocus();
    });

    it('should handle keyboard events for mobile menu', async () => {
      const user = userEvent.setup();
      render(<Header />, { wrapper });
      
      const hamburgerButton = screen.getByRole('button', { name: /open main menu/i });
      
      // Focus and activate with Enter key
      hamburgerButton.focus();
      expect(hamburgerButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      
      const closeButton = screen.getByRole('button', { name: /close menu/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    const themes = ['light', 'dark', 'army', 'navy', 'marines'] as const;

    themes.forEach((theme) => {
      it(`should render correctly in ${theme} theme`, () => {
        render(
          <ThemeProvider defaultTheme={theme}>
            <Header />
          </ThemeProvider>
        );
        
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
        
        // Header should have proper theming classes
        expect(header).toHaveClass('bg-background', 'border-border');
        
        // Links should be visible in all themes
        const communityLink = screen.getAllByRole('link', { name: /community/i })[0];
        expect(communityLink).toBeVisible();
      });
    });

    it('should maintain proper contrast in all themes', () => {
      render(<Header />, { wrapper });
      
      const header = screen.getByRole('banner');
      expect(header).toBeVisible();
      
      // Navigation links should be properly styled for contrast
      const communityLink = screen.getAllByRole('link', { name: /community/i })[0];
      expect(communityLink).toHaveClass('text-muted-foreground');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing pathname gracefully', () => {
      mockPathname = '';
      
      expect(() => {
        render(<Header />, { wrapper });
      }).not.toThrow();
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should handle undefined pathname gracefully', () => {
      mockPathname = undefined as any;
      
      expect(() => {
        render(<Header />, { wrapper });
      }).not.toThrow();
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Navigation Structure', () => {
    it('should render all navigation items in correct order', () => {
      render(<Header />, { wrapper });
      
      const allNavLinks = screen.getAllByRole('link').filter(link => 
        link.textContent &&
        ['Home', 'Services', 'How It Works', 'Contact', 'Community'].includes(link.textContent)
      );
      
      const expectedOrder = ['Home', 'Services', 'How It Works', 'Contact', 'Community'];
      
      // Should have correct number of navigation sets (desktop + mobile)
      expect(allNavLinks.length).toBe(expectedOrder.length * 2);
      
      // Check first set (desktop) has correct order
      const desktopLinks = allNavLinks.slice(0, expectedOrder.length);
      desktopLinks.forEach((link, index) => {
        expect(link.textContent).toBe(expectedOrder[index]);
      });
    });

    it('should have correct href attributes for all navigation links', () => {
      render(<Header />, { wrapper });
      
      const expectedRoutes = {
        'Home': '/',
        'Services': '/services',
        'How It Works': '/how-it-works',
        'Contact': '/contact',
        'Community': '/community-demo'
      };
      
      Object.entries(expectedRoutes).forEach(([name, href]) => {
        const links = screen.getAllByRole('link', { name: new RegExp(name, 'i') });
        links.forEach(link => {
          expect(link).toHaveAttribute('href', href);
        });
      });
    });
  });
});
