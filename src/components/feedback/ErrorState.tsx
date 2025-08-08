import React, { forwardRef } from 'react';
import { cn } from '@/lib/component-utils';
import { BaseComponentProps, ErrorState as BaseErrorState } from '@/types/component';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorStateProps extends BaseComponentProps<HTMLDivElement>, BaseErrorState {
  /** Error title */
  title?: string;
  /** Error variant */
  variant?: 'default' | 'minimal' | 'detailed';
  /** Error size */
  size?: 'sm' | 'md' | 'lg';
  /** Error icon */
  icon?: React.ReactNode;
  /** Custom retry button text */
  retryText?: string;
  /** Custom action buttons */
  actions?: React.ReactNode;
  /** Whether to show the default retry button */
  showRetry?: boolean;
  /** Whether to show a back/home button */
  showNavigation?: boolean;
  /** Navigation callback */
  onNavigateBack?: () => void;
  /** Home navigation callback */
  onNavigateHome?: () => void;
}

const errorSizes = {
  sm: {
    container: 'p-4',
    icon: 'h-8 w-8',
    title: 'text-lg',
    message: 'text-sm',
  },
  md: {
    container: 'p-6',
    icon: 'h-12 w-12',
    title: 'text-xl',
    message: 'text-base',
  },
  lg: {
    container: 'p-8',
    icon: 'h-16 w-16',
    title: 'text-2xl',
    message: 'text-lg',
  },
};

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      hasError = true,
      errorMessage = 'Something went wrong',
      title = 'Oops! Something went wrong',
      variant = 'default',
      size = 'md',
      icon,
      retryText = 'Try again',
      actions,
      showRetry = true,
      showNavigation = false,
      onRetry,
      onNavigateBack,
      onNavigateHome,
      'aria-label': ariaLabel,
      'data-testid': testId,
      children,
      ...props
    },
    ref
  ) => {
    if (!hasError) {
      return <>{children}</>;
    }

    const defaultIcon = <AlertCircle className={cn(errorSizes[size].icon, 'text-red-500')} aria-hidden="true" />;
    const errorIcon = icon || defaultIcon;

    if (variant === 'minimal') {
      return (
        <div
          className={cn('flex items-center justify-center text-red-600 dark:text-red-400', className)}
          role="alert"
          aria-label={ariaLabel || 'Error'}
          data-testid={testId || 'error-state'}
          ref={ref}
          {...props}
        >
          <AlertCircle className="h-4 w-4 mr-2" aria-hidden="true" />
          <span className="text-sm">{errorMessage}</span>
          {onRetry && (
            <Button
              variant="link"
              size="sm"
              onClick={onRetry}
              className="ml-2 p-0 h-auto"
              aria-label="Retry action"
            >
              {retryText}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center text-center',
          errorSizes[size].container,
          variant === 'detailed' && 'border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20',
          className
        )}
        role="alert"
        aria-label={ariaLabel || 'Error state'}
        data-testid={testId || 'error-state'}
        ref={ref}
        {...props}
      >
        {/* Error Icon */}
        <div className="mb-4">
          {errorIcon}
        </div>

        {/* Error Title */}
        {title && (
          <h2 className={cn('font-semibold text-slate-900 dark:text-slate-50 mb-2', errorSizes[size].title)}>
            {title}
          </h2>
        )}

        {/* Error Message */}
        <p className={cn('text-slate-600 dark:text-slate-400 mb-6 max-w-md', errorSizes[size].message)}>
          {errorMessage}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Retry Button */}
          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              variant="default"
              size={size === 'sm' ? 'sm' : 'md'}
              startIcon={<RefreshCw className="h-4 w-4" />}
              aria-label="Retry the failed action"
            >
              {retryText}
            </Button>
          )}

          {/* Navigation Buttons */}
          {showNavigation && (
            <>
              {onNavigateBack && (
                <Button
                  onClick={onNavigateBack}
                  variant="outline"
                  size={size === 'sm' ? 'sm' : 'md'}
                  startIcon={<ArrowLeft className="h-4 w-4" />}
                  aria-label="Go back to previous page"
                >
                  Go Back
                </Button>
              )}
              {onNavigateHome && (
                <Button
                  onClick={onNavigateHome}
                  variant="ghost"
                  size={size === 'sm' ? 'sm' : 'md'}
                  startIcon={<Home className="h-4 w-4" />}
                  aria-label="Go to home page"
                >
                  Home
                </Button>
              )}
            </>
          )}

          {/* Custom Actions */}
          {actions}
        </div>

        {/* Additional Content */}
        {children && (
          <div className="mt-6 w-full">
            {children}
          </div>
        )}
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';
