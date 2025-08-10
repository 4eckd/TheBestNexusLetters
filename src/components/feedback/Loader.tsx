import React, { forwardRef } from 'react';
import { cn } from '@/lib/component-utils';
import { BaseComponentProps, ComponentSize } from '@/types/component';
import { Loader2, RotateCw } from 'lucide-react';

export interface LoaderProps extends BaseComponentProps<HTMLDivElement> {
  /** Loader variant */
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  /** Loader size */
  size?: ComponentSize;
  /** Loading text to display */
  text?: string;
  /** Whether to show the loader inline */
  inline?: boolean;
  /** Custom color */
  color?: string;
}

const loaderSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const SpinnerLoader: React.FC<{ size: ComponentSize; className?: string }> = ({
  size,
  className,
}) => (
  <Loader2
    className={cn('animate-spin', loaderSizes[size], className)}
    aria-hidden="true"
  />
);

const DotsLoader: React.FC<{ size: ComponentSize; className?: string }> = ({
  size,
  className,
}) => {
  const dotSize = {
    xs: 'h-1 w-1',
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  return (
    <div className={cn('flex space-x-1', className)} aria-hidden="true">
      <div
        className={cn('animate-pulse rounded-full bg-current', dotSize[size])}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={cn('animate-pulse rounded-full bg-current', dotSize[size])}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={cn('animate-pulse rounded-full bg-current', dotSize[size])}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};

const PulseLoader: React.FC<{ size: ComponentSize; className?: string }> = ({
  size,
  className,
}) => (
  <div
    className={cn(
      'animate-pulse rounded-full bg-current',
      loaderSizes[size],
      className
    )}
    aria-hidden="true"
  />
);

const BarsLoader: React.FC<{ size: ComponentSize; className?: string }> = ({
  size,
  className,
}) => {
  const barHeight = {
    xs: 'h-3',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12',
  };

  const barWidth = {
    xs: 'w-0.5',
    sm: 'w-0.5',
    md: 'w-1',
    lg: 'w-1',
    xl: 'w-1.5',
  };

  return (
    <div
      className={cn('flex items-end space-x-1', className)}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-current',
            barHeight[size],
            barWidth[size]
          )}
          style={{
            animationDelay: `${i * 100}ms`,
            animationDuration: '1.2s',
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );
};

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      className,
      variant = 'spinner',
      size = 'md',
      text,
      inline = false,
      color,
      'aria-label': ariaLabel,
      'data-testid': testId,
      children,
      ...props
    },
    ref
  ) => {
    const loaderComponent = () => {
      const commonProps = {
        size,
        ...(color ? {} : { className: 'text-slate-600 dark:text-slate-400' }),
      };

      switch (variant) {
        case 'dots':
          return <DotsLoader {...commonProps} />;
        case 'pulse':
          return <PulseLoader {...commonProps} />;
        case 'bars':
          return <BarsLoader {...commonProps} />;
        case 'spinner':
        default:
          return <SpinnerLoader {...commonProps} />;
      }
    };

    const content = (
      <>
        {loaderComponent()}
        {text && (
          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
            {text}
          </span>
        )}
        {children}
      </>
    );

    if (inline) {
      return (
        <span
          className={cn('inline-flex items-center', className)}
          style={color ? { color } : undefined}
          aria-label={ariaLabel || 'Loading'}
          data-testid={testId || 'loader'}
          ref={ref as React.Ref<HTMLSpanElement>}
          {...props}
        >
          {content}
        </span>
      );
    }

    return (
      <div
        className={cn(
          'flex items-center justify-center',
          text || children ? 'flex-col space-y-2' : '',
          className
        )}
        style={color ? { color } : undefined}
        role="status"
        aria-label={ariaLabel || 'Loading'}
        data-testid={testId || 'loader'}
        ref={ref}
        {...props}
      >
        {content}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Loader.displayName = 'Loader';
