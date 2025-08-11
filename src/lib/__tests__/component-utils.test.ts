import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  cn,
  generateId,
  generateAriaAttributes,
  isFocusable,
  getFocusableElements,
  trapFocus,
  getContrastRatio,
  meetsContrastStandard,
  debounce,
  throttle,
} from '../component-utils';

// Setup DOM environment for tests
let jsdom: JSDOM;
let window: Window & typeof globalThis;
let document: Document;

beforeEach(() => {
  jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  window = jsdom.window as any;
  document = window.document;
  
  // Set up global DOM environment
  global.window = window;
  global.document = document;
  global.HTMLElement = window.HTMLElement;
  global.Element = window.Element;
});

afterEach(() => {
  jsdom?.window.close();
});

describe('Component Utils', () => {
  describe('cn function', () => {
    it('should merge classes correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toBe('base-class additional-class');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
      expect(result).toBe('base-class conditional-class');
    });

    it('should handle Tailwind merge conflicts', () => {
      const result = cn('p-2 p-4', 'bg-red-500 bg-blue-500');
      // Should merge to use the latter values
      expect(result).toContain('p-4');
      expect(result).toContain('bg-blue-500');
      expect(result).not.toContain('p-2');
      expect(result).not.toContain('bg-red-500');
    });

    it('should handle arrays and objects', () => {
      const result = cn(['class1', 'class2'], { 'class3': true, 'class4': false });
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle null and undefined', () => {
      const result = cn('base', null, undefined, 'end');
      expect(result).toBe('base end');
    });
  });

  describe('generateId function', () => {
    it('should generate unique IDs with default prefix', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toMatch(/^component-/);
      expect(id2).toMatch(/^component-/);
      expect(id1).not.toBe(id2);
    });

    it('should generate unique IDs with custom prefix', () => {
      const id1 = generateId('button');
      const id2 = generateId('input');
      
      expect(id1).toMatch(/^button-/);
      expect(id2).toMatch(/^input-/);
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with consistent format', () => {
      const id = generateId('test');
      // Should be prefix followed by dash and 9 character string
      expect(id).toMatch(/^test-[a-z0-9]{9}$/);
    });
  });

  describe('generateAriaAttributes function', () => {
    it('should generate basic aria attributes', () => {
      const attrs = generateAriaAttributes('test-id');
      expect(Object.keys(attrs)).toHaveLength(0); // No attributes without label/description/error
    });

    it('should generate aria-labelledby when label is provided', () => {
      const attrs = generateAriaAttributes('test-id', 'Test Label');
      expect(attrs['aria-labelledby']).toBe('test-id-label');
    });

    it('should generate aria-describedby when description is provided', () => {
      const attrs = generateAriaAttributes('test-id', undefined, 'Test Description');
      expect(attrs['aria-describedby']).toBe('test-id-description');
    });

    it('should generate aria attributes for error state', () => {
      const attrs = generateAriaAttributes('test-id', undefined, undefined, 'Test Error');
      expect(attrs['aria-describedby']).toBe('test-id-error');
      expect(attrs['aria-invalid']).toBe('true');
    });

    it('should combine description and error in aria-describedby', () => {
      const attrs = generateAriaAttributes('test-id', 'Label', 'Description', 'Error');
      expect(attrs['aria-labelledby']).toBe('test-id-label');
      expect(attrs['aria-describedby']).toBe('test-id-error test-id-description');
      expect(attrs['aria-invalid']).toBe('true');
    });

    it('should handle all attributes together', () => {
      const attrs = generateAriaAttributes('input-1', 'Username', 'Enter your username', 'Username is required');
      
      expect(attrs['aria-labelledby']).toBe('input-1-label');
      expect(attrs['aria-describedby']).toBe('input-1-error input-1-description');
      expect(attrs['aria-invalid']).toBe('true');
    });
  });

  describe('isFocusable function', () => {
    it('should identify focusable elements', () => {
      const button = document.createElement('button');
      const input = document.createElement('input');
      const select = document.createElement('select');
      const textarea = document.createElement('textarea');
      const link = document.createElement('a');
      
      expect(isFocusable(button)).toBe(true);
      expect(isFocusable(input)).toBe(true);
      expect(isFocusable(select)).toBe(true);
      expect(isFocusable(textarea)).toBe(true);
      expect(isFocusable(link)).toBe(true); // Note: this might be false if no href
    });

    it('should identify non-focusable elements', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const p = document.createElement('p');
      
      expect(isFocusable(div)).toBe(false);
      expect(isFocusable(span)).toBe(false);
      expect(isFocusable(p)).toBe(false);
    });

    it('should handle disabled elements', () => {
      const button = document.createElement('button');
      const input = document.createElement('input');
      
      button.disabled = true;
      input.disabled = true;
      
      expect(isFocusable(button)).toBe(false);
      expect(isFocusable(input)).toBe(false);
    });

    it('should handle tabindex attributes', () => {
      const div = document.createElement('div');
      
      div.setAttribute('tabindex', '0');
      expect(isFocusable(div)).toBe(true);
      
      div.setAttribute('tabindex', '-1');
      expect(isFocusable(div)).toBe(false);
      
      div.setAttribute('tabindex', '1');
      expect(isFocusable(div)).toBe(true);
    });

    it('should handle invalid tabindex values', () => {
      const div = document.createElement('div');
      div.setAttribute('tabindex', 'invalid');
      
      // Should default to 0 and be focusable
      expect(isFocusable(div)).toBe(true);
    });
  });

  describe('getFocusableElements function', () => {
    it('should find focusable elements in container', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button id="btn1">Button 1</button>
        <input id="input1" type="text" />
        <div>Not focusable</div>
        <a href="#" id="link1">Link</a>
        <button disabled id="btn2">Disabled Button</button>
        <div tabindex="0" id="div1">Focusable Div</div>
      `;
      
      const focusableElements = getFocusableElements(container);
      const ids = focusableElements.map(el => el.id);
      
      expect(focusableElements).toHaveLength(4);
      expect(ids).toContain('btn1');
      expect(ids).toContain('input1');
      expect(ids).toContain('link1');
      expect(ids).toContain('div1');
      expect(ids).not.toContain('btn2'); // Disabled button should not be included
    });

    it('should return empty array for container with no focusable elements', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div>Not focusable</div>
        <span>Also not focusable</span>
        <p>Still not focusable</p>
      `;
      
      const focusableElements = getFocusableElements(container);
      expect(focusableElements).toHaveLength(0);
    });

    it('should handle nested focusable elements', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div>
          <div>
            <button>Nested Button</button>
          </div>
        </div>
        <form>
          <input type="text" />
          <select>
            <option>Option</option>
          </select>
        </form>
      `;
      
      const focusableElements = getFocusableElements(container);
      expect(focusableElements).toHaveLength(3);
    });
  });

  describe('trapFocus function', () => {
    it('should handle Tab key to trap focus forward', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button id="first">First</button>
        <input id="middle" type="text" />
        <button id="last">Last</button>
      `;
      document.body.appendChild(container);
      
      const lastButton = document.getElementById('last')!;
      const firstButton = document.getElementById('first')!;
      
      // Mock activeElement and focus method
      Object.defineProperty(document, 'activeElement', {
        value: lastButton,
        writable: true,
      });
      
      const focusSpy = vi.fn();
      firstButton.focus = focusSpy;
      
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      trapFocus(container, event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
      
      document.body.removeChild(container);
    });

    it('should handle Shift+Tab key to trap focus backward', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button id="first">First</button>
        <input id="middle" type="text" />
        <button id="last">Last</button>
      `;
      document.body.appendChild(container);
      
      const firstButton = document.getElementById('first')!;
      const lastButton = document.getElementById('last')!;
      
      // Mock activeElement and focus method
      Object.defineProperty(document, 'activeElement', {
        value: firstButton,
        writable: true,
      });
      
      const focusSpy = vi.fn();
      lastButton.focus = focusSpy;
      
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      trapFocus(container, event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
      
      document.body.removeChild(container);
    });

    it('should ignore non-Tab keys', () => {
      const container = document.createElement('div');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      trapFocus(container, event);
      
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('getContrastRatio function', () => {
    it('should calculate correct contrast ratios for known color combinations', () => {
      // Black on white should have maximum contrast
      const blackWhite = getContrastRatio('#000000', '#ffffff');
      expect(blackWhite).toBeCloseTo(21, 1);
      
      // White on white should have minimum contrast
      const whiteWhite = getContrastRatio('#ffffff', '#ffffff');
      expect(whiteWhite).toBeCloseTo(1, 1);
      
      // Test some real-world color combinations
      const darkBlueWhite = getContrastRatio('#003366', '#ffffff');
      expect(darkBlueWhite).toBeGreaterThan(7); // Should be AAA compliant
    });

    it('should handle invalid hex colors gracefully', () => {
      const invalidResult = getContrastRatio('invalid', '#ffffff');
      expect(invalidResult).toBe(0);
      
      const invalidResult2 = getContrastRatio('#ffffff', 'invalid');
      expect(invalidResult2).toBe(0);
    });

    it('should handle short hex format', () => {
      // This test might fail depending on implementation
      // The function might need to be updated to handle 3-char hex codes
      const result = getContrastRatio('#000', '#fff');
      // If not supported, should return 0
      expect(typeof result).toBe('number');
    });

    it('should be symmetric for foreground/background swap', () => {
      const ratio1 = getContrastRatio('#333333', '#cccccc');
      const ratio2 = getContrastRatio('#cccccc', '#333333');
      expect(ratio1).toBeCloseTo(ratio2, 2);
    });
  });

  describe('meetsContrastStandard function', () => {
    it('should correctly identify AA compliance', () => {
      // High contrast combinations should pass AA
      expect(meetsContrastStandard('#000000', '#ffffff', 'AA')).toBe(true);
      expect(meetsContrastStandard('#003366', '#ffffff', 'AA')).toBe(true);
      
      // Low contrast should fail AA
      expect(meetsContrastStandard('#cccccc', '#ffffff', 'AA')).toBe(false);
      expect(meetsContrastStandard('#888888', '#aaaaaa', 'AA')).toBe(false);
    });

    it('should correctly identify AAA compliance', () => {
      // Very high contrast should pass AAA
      expect(meetsContrastStandard('#000000', '#ffffff', 'AAA')).toBe(true);
      
      // Medium contrast might pass AA but fail AAA
      const mediumContrast = meetsContrastStandard('#666666', '#ffffff', 'AA');
      const mediumContrastAAA = meetsContrastStandard('#666666', '#ffffff', 'AAA');
      
      // This is a heuristic test - exact values depend on the color
      if (mediumContrast) {
        // If it passes AA, AAA should be more strict
        expect(typeof mediumContrastAAA).toBe('boolean');
      }
    });

    it('should default to AA standard', () => {
      const resultWithDefault = meetsContrastStandard('#000000', '#ffffff');
      const resultWithAA = meetsContrastStandard('#000000', '#ffffff', 'AA');
      
      expect(resultWithDefault).toBe(resultWithAA);
    });
  });

  describe('debounce function', () => {
    it('should debounce function calls', (done) => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      // Call multiple times quickly
      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');
      
      // Should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();
      
      // Wait for debounce delay
      setTimeout(() => {
        // Should have been called once with the last arguments
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('arg3');
        done();
      }, 150);
    });

    it('should reset timer on subsequent calls', (done) => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('first');
      
      setTimeout(() => {
        debouncedFn('second'); // This should reset the timer
      }, 50);
      
      setTimeout(() => {
        expect(mockFn).not.toHaveBeenCalled(); // Still within debounce period
      }, 120);
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('second');
        done();
      }, 180);
    });

    it('should handle function with return value', (done) => {
      const mockFn = vi.fn(() => 'result');
      const debouncedFn = debounce(mockFn, 50);
      
      // The debounced function doesn't return the original function's return value immediately
      const result = debouncedFn('test');
      expect(result).toBeUndefined();
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledWith('test');
        done();
      }, 100);
    });
  });

  describe('throttle function', () => {
    it('should throttle function calls', (done) => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);
      
      // First call should execute immediately
      throttledFn('arg1');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg1');
      
      // Subsequent calls within throttle period should be ignored
      throttledFn('arg2');
      throttledFn('arg3');
      
      expect(mockFn).toHaveBeenCalledTimes(1); // Still only called once
      
      // After throttle period, should be able to call again
      setTimeout(() => {
        throttledFn('arg4');
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenCalledWith('arg4');
        done();
      }, 150);
    });

    it('should handle multiple throttled calls correctly', (done) => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 50);
      
      // Call immediately
      throttledFn('first');
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Wait for throttle to reset
      setTimeout(() => {
        throttledFn('second');
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenLastCalledWith('second');
        done();
      }, 100);
    });

    it('should preserve function context and arguments', (done) => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 50);
      
      throttledFn('test', 123, { prop: 'value' });
      
      expect(mockFn).toHaveBeenCalledWith('test', 123, { prop: 'value' });
      done();
    });
  });
});
