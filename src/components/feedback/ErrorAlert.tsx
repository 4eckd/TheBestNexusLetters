/**
 * Standardized ErrorAlert component with multiple variants and comprehensive error handling
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/component-utils';
import { BaseComponentProps } from '@/types/component';
import { 
  AlertCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Bug,
  Wifi,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { DatabaseError } from '@/lib/database-helpers';

export interface ErrorAlertProps extends BaseComponentProps<HTMLDivElement> {
  /** Error object or message */
  error?: Error | DatabaseError | string | null;
  /** Error title */
  title?: string;
  /** Error variant */
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  /** Error size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Whether to show retry button */
  showRetry?: boolean;
  /** Custom retry button text */
  retryText?: string;
  /** Whether to show error details */
  showDetails?: boolean;
  /** Whether details are expanded by default */
  defaultExpanded?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Custom actions */
  actions?: React.ReactNode;
  /** Retry callback */
  onRetry?: () => void;
  /** Dismiss callback */
  onDismiss?: () => void;
  /** Whether to show timestamp */
  showTimestamp?: boolean;
  /** Custom timestamp */
  timestamp?: Date;
  /** Error category for styling */
  category?: 'network' | 'validation' | 'auth' | 'server' | 'client' | 'unknown';
}

const errorVariants = {
  default: {
    container: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
    icon: 'text-red-500 dark:text-red-400',
    title: 'text-red-900 dark:text-red-100',
    message: 'text-red-800 dark:text-red-200',
    details: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30',
  },
  destructive: {
    container: 'bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-700',
    icon: 'text-red-600 dark:text-red-300',
    title: 'text-red-900 dark:text-red-50',
    message: 'text-red-800 dark:text-red-100',
    details: 'text-red-700 dark:text-red-200 bg-red-200 dark:bg-red-900/50',
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-500 dark:text-yellow-400',
    title: 'text-yellow-900 dark:text-yellow-100',
    message: 'text-yellow-800 dark:text-yellow-200',
    details: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30',
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-500 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-100',
    message: 'text-blue-800 dark:text-blue-200',
    details: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30',
  },
};

const errorSizes = {
  sm: {
    container: 'p-3',
    icon: 'h-4 w-4',
    title: 'text-sm font-medium',
    message: 'text-sm',
    details: 'text-xs',
  },
  md: {
    container: 'p-4',
    icon: 'h-5 w-5',
    title: 'text-base font-medium',
    message: 'text-sm',
    details: 'text-xs',
  },
  lg: {
    container: 'p-6',
    icon: 'h-6 w-6',
    title: 'text-lg font-medium',
    message: 'text-base',
    details: 'text-sm',
  },
};

// Category-specific icons
const categoryIcons = {
  network: Wifi,
  validation: AlertTriangle,
  auth: Shield,
  server: Bug,
  client: AlertCircle,
  unknown: XCircle,
};

// Helper function to extract error information
const extractErrorInfo = (error: Error | DatabaseError | string | null) => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      code: null,
      details: null,
      stack: null,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: null,
      details: null,
      stack: null,
    };
  }

  if (error instanceof DatabaseError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack,
    };
  }

  return {
    message: error.message || 'An error occurred',
    code: null,
    details: null,
    stack: error.stack,
  };
};

// Helper function to determine error category
const determineErrorCategory = (error: Error | DatabaseError | string | null): ErrorAlertProps['category'] => {
  const errorInfo = extractErrorInfo(error);
  const message = errorInfo.message.toLowerCase();
  const code = errorInfo.code?.toLowerCase();

  if (message.includes('network') || message.includes('fetch') || code?.includes('network')) {
    return 'network';
  }
  if (message.includes('validation') || message.includes('invalid') || code?.includes('validation')) {
    return 'validation';
  }
  if (message.includes('auth') || message.includes('unauthorized') || code?.includes('auth')) {
    return 'auth';
  }
  if (code?.includes('pgrst') || message.includes('database') || message.includes('server')) {
    return 'server';
  }
  if (message.includes('client') || error instanceof TypeError) {
    return 'client';
  }
  return 'unknown';
};

export const ErrorAlert = forwardRef<HTMLDivElement, ErrorAlertProps>(
  (
    {
      className,
      error,
      title,
      variant = 'default',
      size = 'md',
      dismissible = false,
      showRetry = false,
      retryText = 'Try again',
      showDetails = false,
      defaultExpanded = false,
      icon,
      actions,
      onRetry,
      onDismiss,
      showTimestamp = false,
      timestamp,
      category,
      'aria-label': ariaLabel,
      'data-testid': testId,
      children,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
    
    const errorInfo = extractErrorInfo(error);
    const errorCategory = category || determineErrorCategory(error);
    const styles = errorVariants[variant];
    const sizing = errorSizes[size];

    // Don't render if no error
    if (!error) {
      return null;
    }

    const getIcon = () => {
      if (icon) return icon;
      
      // Category-specific icons
      if (categoryIcons[errorCategory]) {
        const IconComponent = categoryIcons[errorCategory];
        return <IconComponent className={cn(sizing.icon, styles.icon)} />;
      }

      // Default variant icons
      switch (variant) {
        case 'warning':
          return <AlertTriangle className={cn(sizing.icon, styles.icon)} />;
        case 'info':
          return <Info className={cn(sizing.icon, styles.icon)} />;
        default:
          return <AlertCircle className={cn(sizing.icon, styles.icon)} />;
      }
    };

    const getDefaultTitle = () => {
      switch (errorCategory) {
        case 'network':
          return 'Connection Error';
        case 'validation':
          return 'Validation Error';
        case 'auth':
          return 'Authentication Error';
        case 'server':
          return 'Server Error';
        case 'client':
          return 'Application Error';
        default:
          return 'Error';
      }
    };

    const formatTimestamp = (date: Date) => {
      return date.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    };

    return (
      <div
        className={cn(
          'border rounded-lg',
          styles.container,
          sizing.container,
          className
        )}
        role="alert"
        aria-label={ariaLabel || 'Error alert'}
        data-testid={testId || 'error-alert'}
        ref={ref}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Title and timestamp */}
            <div className="flex items-center justify-between">
              <h3 className={cn(sizing.title, styles.title)}>
                {title || getDefaultTitle()}
              </h3>
              
              <div className="flex items-center space-x-2">
                {showTimestamp && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs opacity-70">
                      {formatTimestamp(timestamp || new Date())}
                    </span>
                  </div>
                )}
                
                {dismissible && onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    aria-label="Dismiss error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Message */}
            <div className={cn('mt-1', sizing.message, styles.message)}>
              {errorInfo.message}
            </div>
            
            {/* Actions */}
            {(showRetry || actions || showDetails) && (
              <div className="flex items-center space-x-3 mt-3">
                {showRetry && onRetry && (
                  <Button
                    variant="outline"
                    size={size === 'lg' ? 'sm' : 'xs'}
                    onClick={onRetry}
                    startIcon={<RefreshCw className="h-3 w-3" />}
                  >
                    {retryText}
                  </Button>
                )}
                
                {actions}
                
                {showDetails && (errorInfo.details || errorInfo.code || errorInfo.stack) && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center space-x-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                    aria-label={isExpanded ? 'Hide details' : 'Show details'}
                  >
                    <span>Details</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Details */}
        {showDetails && isExpanded && (errorInfo.details || errorInfo.code || errorInfo.stack) && (
          <div className={cn('mt-3 p-3 rounded border', styles.details, sizing.details)}>
            {errorInfo.code && (
              <div className="mb-2">
                <span className="font-medium">Error Code:</span> {errorInfo.code}
              </div>
            )}
            
            {errorInfo.details && (
              <div className="mb-2">
                <span className="font-medium">Details:</span>
                <pre className="mt-1 whitespace-pre-wrap text-xs">
                  {typeof errorInfo.details === 'object' 
                    ? JSON.stringify(errorInfo.details, null, 2)
                    : errorInfo.details
                  }
                </pre>
              </div>
            )}
            
            {errorInfo.stack && (
              <div>
                <span className="font-medium">Stack Trace:</span>
                <pre className="mt-1 whitespace-pre-wrap text-xs overflow-x-auto">
                  {errorInfo.stack}
                </pre>
              </div>
            )}
          </div>
        )}
        
        {/* Additional content */}
        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>
    );
  }
);

ErrorAlert.displayName = 'ErrorAlert';

// =================================
// SPECIALIZED ERROR COMPONENTS
// =================================

/**
 * Network error component
 */
export const NetworkErrorAlert: React.FC<{
  error?: Error | string;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <ErrorAlert
    error={error || 'Network connection failed'}
    variant="warning"
    category="network"
    icon={<Wifi className="h-5 w-5" />}
    showRetry
    onRetry={onRetry}
    retryText="Reconnect"
  />
);

/**
 * Validation error component
 */
export const ValidationErrorAlert: React.FC<{
  errors: Record<string, string[]> | string[];
  title?: string;
}> = ({ errors, title = 'Please fix the following errors:' }) => {
  const errorList = Array.isArray(errors) 
    ? errors 
    : Object.entries(errors).flatMap(([field, messages]) => 
        messages.map(message => `${field}: ${message}`)
      );

  return (
    <ErrorAlert
      error={errorList.join(', ')}
      title={title}
      variant="warning"
      category="validation"
    >
      <ul className="list-disc list-inside space-y-1 text-sm mt-2">
        {errorList.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </ErrorAlert>
  );
};

/**
 * Authentication error component
 */
export const AuthErrorAlert: React.FC<{
  error?: Error | string;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <ErrorAlert
    error={error || 'Authentication failed'}
    variant="destructive"
    category="auth"
    icon={<Shield className="h-5 w-5" />}
    showRetry
    onRetry={onRetry}
    retryText="Sign in again"
  />
);

/**
 * Generic error boundary fallback
 */
export const ErrorBoundaryFallback: React.FC<{
  error?: Error;
  resetError?: () => void;
}> = ({ error, resetError }) => (
  <div className="min-h-[400px] flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <ErrorAlert
        error={error || 'Something went wrong'}
        title="Application Error"
        variant="destructive"
        size="lg"
        showDetails
        showRetry
        onRetry={resetError}
        retryText="Reload application"
        showTimestamp
      />
    </div>
  </div>
);
