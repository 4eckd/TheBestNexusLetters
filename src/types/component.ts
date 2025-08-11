import React from 'react';

// Base component props with proper generics
export interface BaseComponentProps<T = HTMLElement> {
  /** Custom className to apply */
  className?: string;
  /** Child components */
  children?: React.ReactNode;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA labelled by for accessibility */
  'aria-labelledby'?: string;
  /** ARIA described by for accessibility */
  'aria-describedby'?: string;
  /** Data test identifier */
  'data-testid'?: string;
  /** Ref to the underlying element */
  ref?: React.Ref<T>;
}

// Component size variants
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

// Component color variants
export type ComponentColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Button specific types
export interface ButtonVariants {
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size: ComponentSize;
}

// Loading state interface
export interface LoadingState {
  isLoading?: boolean;
  loadingText?: string;
}

// Error state interface
export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

// Modal/Dialog types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

// Tooltip types
export interface TooltipProps {
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  trigger?: 'hover' | 'click' | 'focus';
}

// Theme aware component props
export interface ThemeAwareProps {
  /** Force light or dark theme */
  theme?: 'light' | 'dark';
}
