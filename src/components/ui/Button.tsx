import React, { forwardRef } from 'react';
import { cn } from '@/lib/component-utils';
import { BaseComponentProps, ComponentSize, LoadingState } from '@/types/component';
import { Loader2 } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

// Base button props
export interface ButtonProps 
  extends BaseComponentProps<HTMLButtonElement>,
    LoadingState,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /** Button visual variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Button size */
  size?: ComponentSize;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Icon to show before the text */
  startIcon?: React.ReactNode;
  /** Icon to show after the text */
  endIcon?: React.ReactNode;
  /** Whether to show only icon (no text) - requires size="icon" */
  iconOnly?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Render as a different element using Radix Slot */
  asChild?: boolean;
}

const buttonVariants = {
  variant: {
    default: 'bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90',
    destructive: 'bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
    outline: 'border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50',
    secondary: 'bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
    ghost: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50',
    link: 'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50',
  },
  size: {
    xs: 'h-7 rounded-md px-2 text-xs',
    sm: 'h-8 rounded-md px-3 text-sm',
    md: 'h-9 rounded-md px-4 text-sm',
    lg: 'h-10 rounded-md px-6 text-base',
    xl: 'h-11 rounded-md px-8 text-base',
    icon: 'h-9 w-9 rounded-md',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      loadingText,
      startIcon,
      endIcon,
      iconOnly = false,
      disabled,
      asChild = false,
      children,
      'aria-label': ariaLabel,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const Comp = asChild ? Slot : 'button';

    // Determine the actual size to use
    const actualSize = iconOnly && size !== 'icon' ? 'icon' : size;

    const buttonClasses = cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300',
      buttonVariants.variant[variant],
      buttonVariants.size[actualSize],
      fullWidth && 'w-full',
      iconOnly && 'px-0 aspect-square',
      className
    );

    const buttonProps = {
      className: buttonClasses,
      disabled: isDisabled,
      'aria-label': ariaLabel || (iconOnly && typeof children === 'string' ? children : undefined),
      'aria-disabled': isDisabled,
      'aria-busy': isLoading,
      'data-testid': testId || 'button',
      ref,
      ...props,
    };

    const content = (
      <>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" data-testid="loading-spinner" />
            {loadingText || (!iconOnly && 'Loading...')}
          </>
        ) : (
          <>
            {startIcon && (
              <span className="h-4 w-4 flex-shrink-0" aria-hidden="true">
                {startIcon}
              </span>
            )}
            {!iconOnly && children}
            {endIcon && (
              <span className="h-4 w-4 flex-shrink-0" aria-hidden="true">
                {endIcon}
              </span>
            )}
            {iconOnly && (
              <span className="h-4 w-4 flex-shrink-0" aria-hidden="true">
                {children}
              </span>
            )}
          </>
        )}
      </>
    );

    return (
      <Comp {...buttonProps}>
        {content}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
