import { describe, it, expect } from 'vitest';
import { ComponentSize } from '@/types/component';

describe('ComponentSize Type', () => {
  it('should include all expected size values', () => {
    const validSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'icon'];
    
    // Type check - this will fail at compile time if any size is invalid
    validSizes.forEach(size => {
      expect(['xs', 'sm', 'md', 'lg', 'xl', 'icon']).toContain(size);
    });
  });

  it('should allow icon size for button components', () => {
    // This test verifies that the 'icon' size is properly typed
    const iconSize: ComponentSize = 'icon';
    expect(iconSize).toBe('icon');
  });

  it('should support all component sizes', () => {
    const allSizes: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'icon'];
    expect(allSizes).toHaveLength(6);
  });
});
