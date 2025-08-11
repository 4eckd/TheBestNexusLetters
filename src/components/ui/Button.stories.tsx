import type { Meta, StoryObj } from '@storybook/nextjs';
// Mock action for Storybook
const fn = () => () => {};
import { Plus, Download, ArrowRight } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, sizes, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The size of the button',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button takes full width',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Whether to show only icon (no text)',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button startIcon={<Plus className="h-4 w-4" />}>Add Item</Button>
      <Button endIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
      <Button variant="outline" startIcon={<Download className="h-4 w-4" />}>
        Download
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
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
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button isLoading>Loading</Button>
      <Button isLoading loadingText="Please wait...">
        Custom Loading Text
      </Button>
      <Button isLoading iconOnly size="icon" aria-label="Loading">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button isLoading>Loading</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-80">
      <Button fullWidth>Full Width Button</Button>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
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
    </div>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        All buttons include proper ARIA attributes and keyboard navigation
        support:
      </p>
      <div className="flex gap-4">
        <Button
          aria-label="Save document"
          startIcon={<Download className="h-4 w-4" />}
        >
          Save
        </Button>
        <Button iconOnly size="icon" aria-label="Add new item">
          <Plus className="h-4 w-4" />
        </Button>
        <Button disabled aria-label="Action not available">
          Disabled
        </Button>
      </div>
    </div>
  ),
};
