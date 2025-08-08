'use client';

import React from 'react';
import { Home, User, Settings, Menu, X } from 'lucide-react';
import { Icon } from './icon';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from '@/hooks/use-theme';
import { themeConfigs } from '@/types/theme';
import { cn } from '@/lib/utils';

interface ThemeDemoProps {
  className?: string;
}

export function ThemeDemo({ className }: ThemeDemoProps) {
  const { theme } = useTheme();
  const currentTheme = themeConfigs[theme];

  return (
    <div className={cn('space-y-6 p-6', className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Theme & Icon Demo</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Current: <span className="font-medium">{currentTheme.displayName}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Theme Info */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-semibold mb-2">Active Theme: {currentTheme.displayName}</h3>
          <p className="text-sm text-muted-foreground">{currentTheme.description}</p>
        </div>

        {/* Basic Theme Colors */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-4">
            <p className="font-medium">Primary</p>
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-lg p-4">
            <p className="font-medium">Secondary</p>
          </div>
          <div className="bg-accent text-accent-foreground rounded-lg p-4">
            <p className="font-medium">Accent</p>
          </div>
          <div className="bg-muted text-muted-foreground rounded-lg p-4">
            <p className="font-medium">Muted</p>
          </div>
        </div>

        {/* Military Color Palette */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Military Palettes</h3>
          <div className="grid grid-cols-5 gap-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Olive</p>
              <div className="bg-military-olive-600 h-8 rounded"></div>
              <div className="bg-military-olive-700 h-8 rounded"></div>
              <div className="bg-military-olive-800 h-8 rounded"></div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Khaki</p>
              <div className="bg-military-khaki-600 h-8 rounded"></div>
              <div className="bg-military-khaki-700 h-8 rounded"></div>
              <div className="bg-military-khaki-800 h-8 rounded"></div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Forest</p>
              <div className="bg-military-forest-600 h-8 rounded"></div>
              <div className="bg-military-forest-700 h-8 rounded"></div>
              <div className="bg-military-forest-800 h-8 rounded"></div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Navy</p>
              <div className="bg-military-navy-600 h-8 rounded"></div>
              <div className="bg-military-navy-700 h-8 rounded"></div>
              <div className="bg-military-navy-800 h-8 rounded"></div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Camo</p>
              <div className="bg-military-camo-600 h-8 rounded"></div>
              <div className="bg-military-camo-700 h-8 rounded"></div>
              <div className="bg-military-camo-800 h-8 rounded"></div>
            </div>
          </div>
        </div>

        {/* Icon Examples */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Icon Usage</h3>
          <div className="flex items-center gap-4">
            <Icon icon={Home} className="text-primary h-6 w-6" />
            <Icon icon={User} className="text-secondary h-6 w-6" />
            <Icon icon={Settings} className="text-accent h-6 w-6" />
            <Icon icon={Menu} className="text-muted-foreground h-6 w-6" />
            <Icon icon={X} className="text-destructive h-6 w-6" />
          </div>
        </div>

        {/* Card Examples */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Card Styles</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-card text-card-foreground rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Default Card</h4>
              <p className="text-muted-foreground text-sm">
                This is a standard card component.
              </p>
            </div>
            <div className="bg-military-olive-100 dark:bg-military-olive-800 rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Military Olive</h4>
              <p className="text-sm opacity-75">Military-themed card style.</p>
            </div>
            <div className="bg-military-navy-100 dark:bg-military-navy-800 rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Military Navy</h4>
              <p className="text-sm opacity-75">Naval-themed card style.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
