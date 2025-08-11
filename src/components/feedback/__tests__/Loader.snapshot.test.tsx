import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Loader } from '../Loader';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Loader Snapshots', () => {
  it('should match default loader snapshot', () => {
    const { container } = render(<Loader />, { wrapper });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match loader variants snapshot', () => {
    const { container } = render(
      <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4">
        <div className="text-center">
          <Loader variant="spinner" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Spinner
          </p>
        </div>
        <div className="text-center">
          <Loader variant="dots" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Dots</p>
        </div>
        <div className="text-center">
          <Loader variant="pulse" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Pulse</p>
        </div>
        <div className="text-center">
          <Loader variant="bars" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Bars</p>
        </div>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match loader sizes snapshot', () => {
    const { container } = render(
      <div className="flex items-center gap-8">
        <div className="text-center">
          <Loader size="xs" />
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">XS</p>
        </div>
        <div className="text-center">
          <Loader size="sm" />
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">SM</p>
        </div>
        <div className="text-center">
          <Loader size="md" />
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">MD</p>
        </div>
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">LG</p>
        </div>
        <div className="text-center">
          <Loader size="xl" />
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">XL</p>
        </div>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match loader with text snapshot', () => {
    const { container } = render(
      <div className="space-y-6">
        <Loader text="Loading..." />
        <Loader text="Processing your request..." />
        <Loader variant="dots" text="Please wait" />
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match inline loader snapshot', () => {
    const { container } = render(
      <div className="space-y-4">
        <p className="text-slate-700 dark:text-slate-300">
          Saving your changes <Loader inline size="sm" />
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          <Loader inline variant="dots" size="sm" /> Processing data
        </p>
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <Loader inline text="Loading" size="xs" />
        </div>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match custom color loader snapshot', () => {
    const { container } = render(
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="text-center">
          <Loader color="#3b82f6" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Blue</p>
        </div>
        <div className="text-center">
          <Loader color="#10b981" variant="dots" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Green</p>
        </div>
        <div className="text-center">
          <Loader color="#f59e0b" variant="pulse" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Amber</p>
        </div>
        <div className="text-center">
          <Loader color="#ef4444" variant="bars" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Red</p>
        </div>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match loader in context snapshot', () => {
    const { container } = render(
      <div className="space-y-6">
        {/* Button loading state */}
        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="mb-3 text-sm font-medium">Button Loading State</h3>
          <button
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            disabled
          >
            <Loader inline size="sm" color="white" />
            Processing...
          </button>
        </div>

        {/* Card loading state */}
        <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
          <h3 className="mb-4 text-sm font-medium">Card Loading State</h3>
          <div className="flex min-h-32 items-center justify-center">
            <Loader text="Loading content..." />
          </div>
        </div>

        {/* Page loading state */}
        <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
          <h3 className="mb-4 text-sm font-medium">Page Loading State</h3>
          <div className="flex min-h-40 items-center justify-center">
            <Loader size="lg" text="Loading page..." />
          </div>
        </div>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match accessible loader snapshot', () => {
    const { container } = render(
      <div className="space-y-4">
        <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
          All loaders include proper ARIA attributes and screen reader support:
        </p>
        <div className="space-y-6">
          <Loader aria-label="Loading user profile" text="Loading profile..." />
          <Loader inline aria-label="Saving document" text="Saving" size="sm" />
          <div>
            <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
              Screen readers will announce "Loading..." for all loader variants
            </p>
            <Loader variant="pulse" />
          </div>
        </div>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
