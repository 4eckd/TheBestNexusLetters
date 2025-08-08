import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate unique IDs for components
 */
export function generateId(prefix = 'component'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper to generate ARIA attributes for form controls
 */
export function generateAriaAttributes(
  id: string,
  label?: string,
  description?: string,
  error?: string
) {
  const ariaAttributes: Record<string, string> = {};
  
  if (label) {
    ariaAttributes['aria-labelledby'] = `${id}-label`;
  }
  
  if (description) {
    ariaAttributes['aria-describedby'] = `${id}-description`;
  }
  
  if (error) {
    ariaAttributes['aria-describedby'] = error
      ? `${id}-error ${ariaAttributes['aria-describedby'] || ''}`.trim()
      : ariaAttributes['aria-describedby'];
    ariaAttributes['aria-invalid'] = 'true';
  }
  
  return ariaAttributes;
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableElements = [
    'button',
    'input',
    'select',
    'textarea',
    'a',
    'audio',
    'video',
    'object',
    'embed',
    'area',
    'iframe',
  ];
  
  const tagName = element.tagName.toLowerCase();
  
  if (focusableElements.includes(tagName)) {
    return !element.hasAttribute('disabled');
  }
  
  if (element.hasAttribute('tabindex')) {
    const tabIndex = parseInt(element.getAttribute('tabindex') || '0', 10);
    return tabIndex >= 0;
  }
  
  return false;
}

/**
 * Get next/previous focusable element
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    'audio[controls]',
    'video[controls]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');
  
  return Array.from(container.querySelectorAll(focusableSelectors));
}

/**
 * Trap focus within a container
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  if (event.key !== 'Tab') return;
  
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
}

/**
 * Check color contrast ratio for accessibility
 */
export function getContrastRatio(foreground: string, background: string): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };
  
  // Get luminance
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const sRGB = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  
  if (!fgRgb || !bgRgb) return 0;
  
  const fgLum = getLuminance(fgRgb);
  const bgLum = getLuminance(bgRgb);
  
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function meetsContrastStandard(
  foreground: string, 
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
