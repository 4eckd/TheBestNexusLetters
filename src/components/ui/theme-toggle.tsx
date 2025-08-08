'use client';

import React, { useState } from 'react';
import { ChevronDown, Palette } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Theme, themeConfigs } from '@/types/theme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'dropdown';
}

export function ThemeToggle({ className, variant = 'dropdown' }: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2',
          'bg-background hover:bg-accent hover:text-accent-foreground',
          'border border-input',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label={`Current theme: ${themeConfigs[theme].displayName}. Click to cycle themes.`}
      >
        <Palette className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2',
          'bg-background hover:bg-accent hover:text-accent-foreground',
          'border border-input',
          'text-sm font-medium',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
        aria-label={`Theme selector. Current theme: ${themeConfigs[theme].displayName}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-describedby="theme-selector-description"
      >
        <Palette className="h-4 w-4" />
        <span>{themeConfigs[theme].displayName}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div
            className={cn(
              'absolute right-0 top-full z-50 mt-1 min-w-[200px]',
              'rounded-md border bg-card shadow-lg',
              'p-1',
              'animate-in fade-in-0 zoom-in-95',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
            )}
            role="listbox"
          >
            {Object.values(themeConfigs).map((config) => (
              <button
                key={config.name}
                onClick={() => {
                  setTheme(config.name as Theme);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-sm px-3 py-2',
                  'text-left text-sm',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground',
                  'transition-colors duration-150',
                  theme === config.name && 'bg-accent text-accent-foreground font-medium'
                )}
                role="option"
                aria-selected={theme === config.name}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded border-2',
                    getThemePreviewColor(config.name as Theme)
                  )}
                />
                <div className="flex-1">
                  <div className="font-medium">{config.displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>
                {theme === config.name && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function getThemePreviewColor(theme: Theme): string {
  switch (theme) {
    case 'light':
      return 'bg-white border-gray-300';
    case 'dark':
      return 'bg-gray-900 border-gray-600';
    case 'army':
      return 'bg-green-600 border-green-700';
    case 'navy':
      return 'bg-blue-700 border-blue-800';
    case 'marines':
      return 'bg-red-600 border-red-700';
    default:
      return 'bg-white border-gray-300';
  }
}
