/**
 * Global ErrorBoundary component to catch and handle unhandled React exceptions
 */

import React, { Component, ReactNode } from 'react';
import { ErrorBoundaryFallback } from '../feedback/ErrorAlert';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  /** Children to render */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: React.ComponentType<{
    error?: Error;
    errorInfo?: React.ErrorInfo;
    resetError?: () => void;
  }>;
  /** Called when an error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Whether to log errors to console */
  logErrors?: boolean;
  /** Whether to report errors to external service */
  reportErrors?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, logErrors = true, reportErrors = false } = this.props;

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (logErrors && process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error info:', errorInfo);
    }

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Report to external error service
    if (reportErrors) {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Example: Report to Sentry, LogRocket, or other error tracking service
    try {
      // In a real application, you would integrate with your error tracking service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Example integration (uncomment and configure as needed):
      // Sentry.captureException(error, { contexts: { react: errorInfo } });
      
      console.warn('Error reported:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback: CustomFallback } = this.props;

    if (hasError) {
      // Render custom fallback or default error UI
      if (CustomFallback) {
        return (
          <CustomFallback
            error={error || undefined}
            errorInfo={errorInfo || undefined}
            resetError={this.resetError}
          />
        );
      }

      // Default error fallback
      return (
        <ErrorBoundaryFallback
          error={error || undefined}
          resetError={this.resetError}
        />
      );
    }

    return children;
  }
}

// =================================
// HOC FOR WRAPPING COMPONENTS
// =================================

/**
 * Higher-order component to wrap any component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return ComponentWithErrorBoundary;
}

// =================================
// HOOK FOR ERROR REPORTING
// =================================

/**
 * Hook to manually report errors
 */
export function useErrorHandler() {
  const reportError = React.useCallback((error: Error, context?: Record<string, any>) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Manual error report:', error);
      if (context) console.error('Error context:', context);
    }

    // Report to external service
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Example integration (configure as needed):
      // Sentry.captureException(error, { extra: context });
      
      console.warn('Error reported:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }, []);

  return { reportError };
}

// =================================
// SPECIALIZED ERROR BOUNDARIES
// =================================

/**
 * Error boundary for async operations
 */
export const AsyncErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}> = ({ children, fallback }) => {
  const [asyncError, setAsyncError] = React.useState<Error | null>(null);

  // Handle async errors
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      if (event.reason instanceof Error) {
        setAsyncError(event.reason);
      } else {
        setAsyncError(new Error(String(event.reason)));
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const resetAsyncError = () => setAsyncError(null);

  if (asyncError) {
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent error={asyncError} resetError={resetAsyncError} />;
    }
    return <ErrorBoundaryFallback error={asyncError} resetError={resetAsyncError} />;
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('ErrorBoundary - Async operation error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Error boundary for route components
 */
export const RouteErrorBoundary: React.FC<{
  children: ReactNode;
}> = ({ children }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      console.error('RouteErrorBoundary - Route error:', error, errorInfo);
    }}
    fallback={({ error, resetError }) => (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Page Error</h1>
          <p className="text-gray-600 mb-6">
            Sorry, there was an error loading this page.
          </p>
          <ErrorBoundaryFallback error={error} resetError={resetError} />
        </div>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

/**
 * Error boundary for data components
 */
export const DataErrorBoundary: React.FC<{
  children: ReactNode;
}> = ({ children }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      console.error('DataErrorBoundary - Data operation error:', error, errorInfo);
    }}
    fallback={({ error, resetError }) => (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Data Error</h3>
        <p className="text-red-700 mb-4">
          There was an error loading the data. Please try again.
        </p>
        <button
          onClick={resetError}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
