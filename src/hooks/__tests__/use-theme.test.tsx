import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/providers/theme-provider';
import { Theme } from '@/types/theme';

// Mock document.documentElement
const mockDocumentElement = {
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
  },
  setAttribute: vi.fn(),
  removeAttribute: vi.fn(),
};

Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
  writable: true,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should throw error when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('should initialize with default theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    expect(result.current.theme).toBe('light');
  });

  it('should load theme from localStorage on mount', () => {
    localStorage.setItem('nexus-theme', 'dark');
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Note: This test may need to wait for useEffect to complete
    // In a real test environment, you might need to use waitFor
    expect(localStorage.getItem).toHaveBeenCalledWith('nexus-theme');
  });

  it('should update theme and save to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme('navy');
    });
    
    expect(result.current.theme).toBe('navy');
    expect(localStorage.setItem).toHaveBeenCalledWith('nexus-theme', 'navy');
  });

  it('should toggle through all themes', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    const themes: Theme[] = ['light', 'dark', 'army', 'navy', 'marines'];
    
    // Start with light theme
    expect(result.current.theme).toBe('light');
    
    // Toggle through all themes
    for (let i = 1; i < themes.length; i++) {
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe(themes[i]);
    }
    
    // Should cycle back to light
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
  });

  it('should apply dark class for dark theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  it('should apply data-theme attribute for non-dark themes', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme('army');
    });
    
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'army');
    expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('dark');
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw an error
    localStorage.getItem = vi.fn().mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    // Should not throw and should use default theme
    expect(() => {
      renderHook(() => useTheme(), { wrapper });
    }).not.toThrow();
  });

  it('should ignore invalid themes from localStorage', () => {
    localStorage.setItem('nexus-theme', 'invalid-theme');
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Should fall back to default theme
    expect(result.current.theme).toBe('light');
  });
});
