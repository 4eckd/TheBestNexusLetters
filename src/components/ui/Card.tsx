import React, { forwardRef } from 'react';
import { cn } from '@/lib/component-utils';
import { BaseComponentProps } from '@/types/component';

export interface CardProps extends BaseComponentProps<HTMLDivElement>, React.HTMLAttributes<HTMLDivElement> {
  /** Card visual variant */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Whether the card should be interactive (hover effects) */
  interactive?: boolean;
  /** Whether the card should have padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Custom header content */
  header?: React.ReactNode;
  /** Custom footer content */
  footer?: React.ReactNode;
}

export interface CardHeaderProps extends BaseComponentProps<HTMLDivElement> {
  /** Header title */
  title?: string;
  /** Header subtitle */
  subtitle?: string;
  /** Additional actions for the header */
  actions?: React.ReactNode;
}

export interface CardContentProps extends BaseComponentProps<HTMLDivElement> {}

export interface CardFooterProps extends BaseComponentProps<HTMLDivElement> {}

export interface CardTitleProps extends BaseComponentProps<HTMLHeadingElement> {}

const cardVariants = {
  variant: {
    default: 'bg-white dark:bg-slate-950',
    outlined: 'bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800',
    elevated: 'bg-white shadow-lg dark:bg-slate-950 dark:shadow-slate-900/25',
  },
  padding: {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  },
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      interactive = false,
      padding = 'md',
      header,
      footer,
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
          'rounded-xl transition-colors',
          cardVariants.variant[variant],
          cardVariants.padding[padding],
          interactive && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors',
          className
        )}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={ariaLabel}
        data-testid={testId || 'card'}
        ref={ref}
        {...props}
      >
        {header && (
          <div className="mb-4 last:mb-0">
            {header}
          </div>
        )}
        {children}
        {footer && (
          <div className="mt-4 first:mt-0">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      className,
      title,
      subtitle,
      actions,
      children,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn('flex items-start justify-between', className)}
        data-testid={testId || 'card-header'}
        ref={ref}
        {...props}
      >
        <div className="space-y-1.5">
          {title && (
            <h3 className="font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {actions && (
          <div className="flex items-center gap-2 ml-4">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, 'data-testid': testId, ...props }, ref) => {
    return (
      <div
        className={cn('text-slate-700 dark:text-slate-300', className)}
        data-testid={testId || 'card-content'}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, 'data-testid': testId, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center gap-2', className)}
        data-testid={testId || 'card-footer'}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, 'data-testid': testId, ...props }, ref) => {
    return (
      <h3
        className={cn('font-semibold leading-none tracking-tight', className)}
        data-testid={testId || 'card-title'}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';
