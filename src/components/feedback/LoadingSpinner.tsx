/**
 * Standardized LoadingSpinner component with multiple variants and suspense support
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/component-utils';
import { BaseComponentProps, ComponentSize } from '@/types/component';
import { Loader2, RotateCw, Zap } from 'lucide-react';

export interface LoadingSpinnerProps extends BaseComponentProps<HTMLDivElement> {
  /** Spinner variant */
  variant?: 'spinner' | 'pulse' | 'dots' | 'bars' | 'ring' | 'wave';
  /** Spinner size */
  size?: ComponentSize | 'xs';
  /** Loading text to display */
  text?: string;
  /** Whether to show the spinner inline */
  inline?: boolean;
  /** Custom color override */
  color?: string;
  /** Whether to center the spinner */
  center?: boolean;
  /** Whether to overlay the entire parent */
  overlay?: boolean;
  /** Overlay background color */
  overlayColor?: string;
  /** Animation speed */
  speed?: 'slow' | 'normal' | 'fast';
}

const spinnerSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const speeds = {
  slow: 'duration-2000',
  normal: 'duration-1000',
  fast: 'duration-500',
};

// Spinner Variants
const SpinnerIcon: React.FC<{ size: ComponentSize | 'xs'; className?: string; speed?: string }> = ({ 
  size, 
  className, 
  speed = 'duration-1000' 
}) => (
  <Loader2 
    className={cn('animate-spin', spinnerSizes[size], speed, className)} 
    aria-hidden="true"
  />
);

const PulseSpinner: React.FC<{ size: ComponentSize | 'xs'; className?: string; speed?: string }> = ({ 
  size, 
  className, 
  speed = 'duration-1000' 
}) => (
  <div 
    className={cn('rounded-full bg-current animate-pulse', spinnerSizes[size], speed, className)} 
    aria-hidden="true"
  />
);

const DotsSpinner: React.FC<{ size: ComponentSize | 'xs'; className?: string; speed?: string }> = ({ 
  size, 
  className, 
  speed = 'duration-1000' 
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
      {[0, 150, 300].map((delay, index) => (
        <div 
          key={index}
          className={cn('rounded-full bg-current animate-pulse', dotSize[size], speed)} 
          style={{ animationDelay: `${delay}ms` }} 
        />
      ))}
    </div>
  );
};

const BarsSpinner: React.FC<{ size: ComponentSize | 'xs'; className?: string; speed?: string }> = ({ 
  size, 
  className, 
  speed = 'duration-1000' 
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
    <div className={cn('flex items-end space-x-1', className)} aria-hidden="true">
      {[0, 100, 200, 300].map((delay, index) => (
        <div
          key={index}
          className={cn(
            'bg-current animate-pulse', 
            barHeight[size], 
            barWidth[size],
            speed
          )}
          style={{
            animationDelay: `${delay}ms`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );
};

const RingSpinner: React.FC<{ size: ComponentSize | 'xs'; className?: string; speed?: string }> = ({ 
  size, 
  className, 
  speed = 'duration-1000' 
}) => (
  <div 
    className={cn(
      'animate-spin rounded-full border-2 border-current border-t-transparent',
      spinnerSizes[size],
      speed,
      className
    )} 
    aria-hidden="true"
  />
);

const WaveSpinner: React.FC<{ size: ComponentSize | 'xs'; className?: string; speed?: string }> = ({ 
  size, 
  className, 
  speed = 'duration-1000' 
}) => {
  const waveSize = {
    xs: 'h-2 w-2',
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  };

  return (
    <div className={cn('flex space-x-1', className)} aria-hidden="true">
      {[0, 100, 200, 300, 400].map((delay, index) => (
        <div
          key={index}
          className={cn(
            'rounded-full bg-current animate-bounce',
            waveSize[size],
            speed
          )}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
};

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    {
      className,
      variant = 'spinner',
      size = 'md',
      text,
      inline = false,
      color,
      center = false,
      overlay = false,
      overlayColor = 'bg-white/80 dark:bg-slate-900/80',
      speed = 'normal',
      'aria-label': ariaLabel,
      'data-testid': testId,
      children,
      ...props
    },
    ref
  ) => {
    const renderSpinner = () => {
      const animationSpeed = speeds[speed];
      const spinnerColor = color ? 'text-current' : 'text-slate-600 dark:text-slate-400';
      
      const commonProps = { 
        size, 
        className: spinnerColor,
        speed: animationSpeed
      };
      
      switch (variant) {
        case 'pulse':
          return <PulseSpinner {...commonProps} />;
        case 'dots':
          return <DotsSpinner {...commonProps} />;
        case 'bars':
          return <BarsSpinner {...commonProps} />;
        case 'ring':
          return <RingSpinner {...commonProps} />;
        case 'wave':
          return <WaveSpinner {...commonProps} />;
        case 'spinner':
        default:
          return <SpinnerIcon {...commonProps} />;
      }
    };

    const content = (
      <>
        {renderSpinner()}
        {text && (
          <span className={cn('text-slate-600 dark:text-slate-400', textSizes[size])}>
            {text}
          </span>
        )}
        {children}
      </>
    );

    const baseClasses = cn(
      'flex items-center',
      center && 'justify-center',
      text || children ? (inline ? 'space-x-2' : 'flex-col space-y-2') : '',
      className
    );

    if (overlay) {
      return (
        <div
          className={cn(
            'absolute inset-0 z-50 flex items-center justify-center',
            overlayColor,
            className
          )}
          style={color ? { color } : undefined}
          role="status"
          aria-label={ariaLabel || 'Loading'}
          data-testid={testId || 'loading-spinner-overlay'}
          ref={ref}
          {...props}
        >
          <div className="flex flex-col items-center space-y-2">
            {content}
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    if (inline) {
      return (
        <span
          className={cn('inline-flex items-center space-x-2', className)}
          style={color ? { color } : undefined}
          aria-label={ariaLabel || 'Loading'}
          data-testid={testId || 'loading-spinner'}
          ref={ref as React.Ref<HTMLSpanElement>}
          {...props}
        >
          {content}
        </span>
      );
    }

    return (
      <div
        className={baseClasses}
        style={color ? { color } : undefined}
        role="status"
        aria-label={ariaLabel || 'Loading'}
        data-testid={testId || 'loading-spinner'}
        ref={ref}
        {...props}
      >
        {content}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

// =================================
// SUSPENSE FALLBACK COMPONENTS
// =================================

/**
 * Suspense fallback for page-level loading
 */
export const PageLoadingFallback: React.FC<{
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
}> = ({ text = 'Loading page...', variant = 'spinner' }) => (
  <div className="flex min-h-screen items-center justify-center">
    <LoadingSpinner
      variant={variant}
      size="lg"
      text={text}
      center
    />
  </div>
);

/**
 * Suspense fallback for component-level loading
 */
export const ComponentLoadingFallback: React.FC<{
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
  height?: string;
}> = ({ 
  text = 'Loading...', 
  variant = 'spinner',
  height = 'h-32'
}) => (
  <div className={cn('flex items-center justify-center', height)}>
    <LoadingSpinner
      variant={variant}
      size="md"
      text={text}
      center
    />
  </div>
);

/**
 * Suspense fallback for table/list loading
 */
export const TableLoadingFallback: React.FC<{
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse flex-1"
          />
        ))}
      </div>
    ))}
  </div>
);

/**
 * Suspense fallback for card loading
 */
export const CardLoadingFallback: React.FC<{
  lines?: number;
}> = ({ lines = 3 }) => (
  <div className="space-y-3">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
        style={{ width: `${Math.random() * 40 + 60}%` }}
      />
    ))}
  </div>
);

/**
 * Full-screen loading overlay
 */
export const FullScreenLoader: React.FC<{
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
}> = ({ text = 'Loading...', variant = 'spinner' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
    <div className="flex flex-col items-center space-y-4">
      <LoadingSpinner
        variant={variant}
        size="xl"
        center
      />
      {text && (
        <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
          {text}
        </p>
      )}
    </div>
  </div>
);
