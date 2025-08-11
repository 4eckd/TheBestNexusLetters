import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Button } from '../Button';
import { Plus, Download, ArrowRight } from 'lucide-react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Button Snapshots', () => {
  it('should match default button snapshot', () => {
    const { container } = render(<Button>Default Button</Button>, { wrapper });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match all variants snapshot', () => {
    const { container } = render(
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match all sizes snapshot', () => {
    const { container } = render(
      <div className="flex items-end gap-4">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match buttons with icons snapshot', () => {
    const { container } = render(
      <div className="flex flex-wrap gap-4">
        <Button startIcon={<Plus className="h-4 w-4" />}>Add Item</Button>
        <Button endIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
        <Button variant="outline" startIcon={<Download className="h-4 w-4" />}>
          Download
        </Button>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match icon only buttons snapshot', () => {
    const { container } = render(
      <div className="flex gap-4">
        <Button iconOnly size="icon" aria-label="Add item">
          <Plus className="h-4 w-4" />
        </Button>
        <Button iconOnly size="icon" variant="outline" aria-label="Download">
          <Download className="h-4 w-4" />
        </Button>
        <Button iconOnly size="icon" variant="ghost" aria-label="More options">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match loading states snapshot', () => {
    const { container } = render(
      <div className="flex gap-4">
        <Button isLoading>Loading</Button>
        <Button isLoading loadingText="Please wait...">
          Custom Loading Text
        </Button>
        <Button isLoading iconOnly size="icon" aria-label="Loading">
          <Plus className="h-4 w-4" />
        </Button>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match disabled and states snapshot', () => {
    const { container } = render(
      <div className="flex gap-4">
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
        <Button isLoading>Loading</Button>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match full width button snapshot', () => {
    const { container } = render(
      <div className="w-80">
        <Button fullWidth>Full Width Button</Button>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match asChild functionality snapshot', () => {
    const { container } = render(
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Button as Link (asChild)</h3>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <a href="#" target="_blank" rel="noopener noreferrer">
                External Link
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/docs">Go to Docs</a>
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Button as Custom Element</h3>
          <div className="flex gap-4">
            <Button asChild variant="default" startIcon={<Download className="h-4 w-4" />}>
              <span role="button" tabIndex={0}>Custom Span Button</span>
            </Button>
            <Button asChild iconOnly size="icon" aria-label="Custom div button">
              <div role="button" tabIndex={0}>
                <Plus className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Loading State with asChild</h3>
          <div className="flex gap-4">
            <Button asChild isLoading variant="outline">
              <a href="#">Loading Link</a>
            </Button>
          </div>
        </div>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
