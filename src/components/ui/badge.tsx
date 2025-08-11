import React, { forwardRef } from 'react';
import { cn } from '@/lib/component-utils';
import { BaseComponentProps, ComponentSize } from '@/types/component';

export interface BadgeProps
  extends BaseComponentProps<HTMLDivElement>,
    React.HTMLAttributes<HTMLDivElement> {
  /** Badge visual variant */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  /** Badge size */
  size?: Exclude<ComponentSize, 'xl'>;
  /** Icon to show before the text */
  startIcon?: React.ReactNode;
  /** Icon to show after the text */
  endIcon?: React.ReactNode;
}

const badgeVariants = {
  variant: {
    default: 'bg-brand-navy-600 text-slate-50 hover:bg-brand-navy-600/80',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
    destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/80',
    outline: 'border border-slate-200 text-slate-900 dark:border-slate-800 dark:text-slate-50',
    success: 'bg-green-500 text-slate-50 hover:bg-green-500/80',
    warning: 'bg-yellow-500 text-slate-900 hover:bg-yellow-500/80',
  },
  size: {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
    icon: 'px-2 py-0.5 text-xs',
  },
};

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'sm',
      startIcon,
      endIcon,
      children,
      'aria-label': ariaLabel,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300',
          badgeVariants.variant[variant],
          badgeVariants.size[size],
          className
        )}
        aria-label={ariaLabel}
        data-testid={testId || 'badge'}
        ref={ref}
        {...props}
      >
        {startIcon && (
          <span className="h-3 w-3 flex-shrink-0" aria-hidden="true">
            {startIcon}
          </span>
        )}
        {children}
        {endIcon && (
          <span className="h-3 w-3 flex-shrink-0" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
