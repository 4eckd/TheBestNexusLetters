import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Card, CardHeader, CardContent, CardFooter } from '../Card';
import { Button } from '../Button';
import { Settings, Star, User } from 'lucide-react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Card Snapshots', () => {
  it('should match default card snapshot', () => {
    const { container } = render(
      <Card>
        <CardHeader
          title="Card Title"
          subtitle="Card subtitle or description"
        />
        <CardContent>
          <p>
            This is the card content. You can put any content here including
            text, images, or other components.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
        </CardFooter>
      </Card>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match card variants snapshot', () => {
    const { container } = render(
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card variant="default">
          <CardHeader title="Default Card" />
          <CardContent>
            <p>This is a default card without border or shadow.</p>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader title="Outlined Card" />
          <CardContent>
            <p>This card has a border to define its boundaries.</p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader title="Elevated Card" />
          <CardContent>
            <p>This card uses shadow to appear elevated from the background.</p>
          </CardContent>
        </Card>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match card padding sizes snapshot', () => {
    const { container } = render(
      <div className="grid grid-cols-2 gap-6">
        <Card variant="outlined" padding="sm">
          <CardHeader title="Small Padding" />
          <CardContent>Less space around content.</CardContent>
        </Card>

        <Card variant="outlined" padding="lg">
          <CardHeader title="Large Padding" />
          <CardContent>More space around content.</CardContent>
        </Card>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match interactive cards snapshot', () => {
    const { container } = render(
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card variant="outlined" interactive onClick={() => {}}>
          <CardHeader title="Interactive Card" />
          <CardContent>
            <p>This card responds to hover and click events.</p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader title="Static Card" />
          <CardContent>
            <p>This card has no interactive behavior.</p>
          </CardContent>
        </Card>
      </div>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match card with actions snapshot', () => {
    const { container } = render(
      <Card variant="outlined">
        <CardHeader
          title="User Profile"
          subtitle="Manage your account settings"
          actions={
            <Button variant="ghost" iconOnly size="icon" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          }
        />
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">John Doe</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                john@example.com
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="sm">Edit Profile</Button>
          <Button variant="outline" size="sm">
            View Activity
          </Button>
        </CardFooter>
      </Card>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match product card snapshot', () => {
    const { container } = render(
      <Card variant="elevated">
        <div className="aspect-video rounded-t-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"></div>
        <CardHeader
          title="Premium Plan"
          subtitle="$29/month"
          actions={
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">4.9</span>
            </div>
          }
        />
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Unlimited projects</li>
            <li>• Advanced analytics</li>
            <li>• Priority support</li>
            <li>• Custom integrations</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button fullWidth>Get Started</Button>
        </CardFooter>
      </Card>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match card with no padding snapshot', () => {
    const { container } = render(
      <Card variant="outlined" padding="none">
        <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900"></div>
        <div className="p-6">
          <CardHeader title="Custom Layout" />
          <CardContent>
            <p>
              Using padding="none" allows for custom layouts with full control
              over spacing.
            </p>
          </CardContent>
        </div>
      </Card>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match accessible card snapshot', () => {
    const { container } = render(
      <Card
        variant="outlined"
        interactive
        onClick={() => {}}
        aria-label="Article: How to build accessible components"
        role="article"
      >
        <CardHeader
          title="Accessible Card"
          subtitle="With proper ARIA attributes"
        />
        <CardContent>
          <p>
            This card includes proper role and aria-label attributes for
            screen readers.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Read More</Button>
        </CardFooter>
      </Card>,
      { wrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
