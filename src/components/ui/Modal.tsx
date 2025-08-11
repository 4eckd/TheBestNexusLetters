import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn, trapFocus, generateId } from '@/lib/component-utils';
import { BaseComponentProps, ModalProps as BaseModalProps } from '@/types/component';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps extends BaseComponentProps<HTMLDivElement>, BaseModalProps {
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Custom header content */
  header?: React.ReactNode;
  /** Custom footer content */
  footer?: React.ReactNode;
  /** Overlay z-index */
  zIndex?: number;
}

export interface ModalHeaderProps extends BaseComponentProps<HTMLDivElement> {
  /** Header title */
  title?: string;
  /** Whether to show the close button in header */
  showCloseButton?: boolean;
  /** Close handler */
  onClose?: () => void;
}

export interface ModalContentProps extends BaseComponentProps<HTMLDivElement> {}

export interface ModalFooterProps extends BaseComponentProps<HTMLDivElement> {}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg', 
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      isOpen,
      onClose,
      title,
      description,
      closeOnOverlayClick = true,
      closeOnEsc = true,
      size = 'md',
      showCloseButton = true,
      header,
      footer,
      children,
      zIndex = 50,
      'aria-label': ariaLabel,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = useRef(generateId('modal-title'));
    const descriptionId = useRef(generateId('modal-description'));

    useEffect(() => {
      if (!isOpen) return;

      // Focus first focusable element when modal opens
      const timer = setTimeout(() => {
        const modal = modalRef.current;
        if (modal) {
          const focusableElement = modal.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          focusableElement?.focus();
        }
      }, 100);

      // Handle escape key
      const handleEscape = (event: KeyboardEvent) => {
        if (closeOnEsc && event.key === 'Escape') {
          onClose();
        }
      };

      // Handle focus trap
      const handleKeyDown = (event: KeyboardEvent) => {
        const modal = modalRef.current;
        if (modal && event.key === 'Tab') {
          trapFocus(modal, event);
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleKeyDown);

      // Prevent background scroll
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [isOpen, closeOnEsc, onClose]);

    if (!isOpen) return null;

    const modalContent = (
      <div
        className={cn('fixed inset-0 flex items-center justify-center p-4', `z-${zIndex}`)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId.current : undefined}
        aria-describedby={description ? descriptionId.current : undefined}
        aria-label={ariaLabel || (title ? undefined : 'Modal')}
        data-testid={testId || 'modal'}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          className={cn(
            'relative w-full bg-white dark:bg-slate-950 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800',
            modalSizes[size],
            className
          )}
          ref={(node) => {
            modalRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          {...props}
        >
          {/* Header */}
          {(header || title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                {title && (
                  <h2 id={titleId.current} className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descriptionId.current} className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {description}
                  </p>
                )}
                {header}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  iconOnly
                  onClick={onClose}
                  aria-label="Close modal"
                  className="ml-4 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 pb-6 pt-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  (
    {
      className,
      title,
      showCloseButton = false,
      onClose,
      children,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn('flex items-center justify-between', className)}
        data-testid={testId || 'modal-header'}
        ref={ref}
        {...props}
      >
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </h2>
          )}
          {children}
        </div>
        {showCloseButton && onClose && (
          <Button
            variant="ghost"
            size="icon"
            iconOnly
            onClick={onClose}
            aria-label="Close modal"
            className="ml-4 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, 'data-testid': testId, ...props }, ref) => {
    return (
      <div
        className={cn('text-slate-700 dark:text-slate-300', className)}
        data-testid={testId || 'modal-content'}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalContent.displayName = 'ModalContent';

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, 'data-testid': testId, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center justify-end gap-2', className)}
        data-testid={testId || 'modal-footer'}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';
