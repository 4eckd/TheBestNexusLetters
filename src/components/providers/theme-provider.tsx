'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, defaultTheme } from '@/types/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const STORAGE_KEY = 'nexus-theme';

export function ThemeProvider({
  children,
  defaultTheme: defaultThemeProp = defaultTheme,
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultThemeProp);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      if (savedTheme && ['light', 'dark', 'army', 'navy', 'marines'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    setIsHydrated(true);
  }, [storageKey]);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (!isHydrated) return;

    const root = document.documentElement;
    
    // Remove all theme classes and data attributes
    root.classList.remove('dark');
    root.removeAttribute('data-theme');
    
    // Apply the selected theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', theme);
    }

    // Save to localStorage
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme, isHydrated, storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'army', 'navy', 'marines'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    if (nextTheme) {
      setTheme(nextTheme);
    }
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until client-side is ready
  if (!isHydrated) {
    // Return a simplified context that won't cause hydration mismatches
    return (
      <ThemeContext.Provider value={{
        theme: defaultThemeProp,
        setTheme: () => {},
        toggleTheme: () => {},
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
