import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn, generateId } from '@/lib/component-utils';
import {
  BaseComponentProps,
  TooltipProps as BaseTooltipProps,
} from '@/types/component';

export interface TooltipProps extends BaseTooltipProps {
  /** The element that triggers the tooltip */
  children: React.ReactElement;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
  /** Custom className for the tooltip content */
  contentClassName?: string;
  /** Custom arrow styling */
  showArrow?: boolean;
}

const placementClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
};

const arrowClasses = {
  top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-900 dark:border-t-slate-50',
  bottom:
    'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-900 dark:border-b-slate-50',
  left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-900 dark:border-l-slate-50',
  right:
    'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-900 dark:border-r-slate-50',
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      placement = 'top',
      delay = 500,
      trigger = 'hover',
      disabled = false,
      contentClassName,
      showArrow = true,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const tooltipId = useRef(generateId('tooltip'));

    const showTooltip = () => {
      if (disabled || !content) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        updatePosition();
      }, delay);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    const updatePosition = () => {
      if (!triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;

      let x = 0;
      let y = 0;

      switch (placement) {
        case 'top':
          x = triggerRect.left + scrollX + triggerRect.width / 2;
          y = triggerRect.top + scrollY;
          break;
        case 'bottom':
          x = triggerRect.left + scrollX + triggerRect.width / 2;
          y = triggerRect.bottom + scrollY;
          break;
        case 'left':
          x = triggerRect.left + scrollX;
          y = triggerRect.top + scrollY + triggerRect.height / 2;
          break;
        case 'right':
          x = triggerRect.right + scrollX;
          y = triggerRect.top + scrollY + triggerRect.height / 2;
          break;
      }

      setTooltipPosition({ x, y });
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    useEffect(() => {
      if (isVisible) {
        const handleScroll = () => {
          updatePosition();
        };

        const handleResize = () => {
          updatePosition();
        };

        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('scroll', handleScroll, true);
          window.removeEventListener('resize', handleResize);
        };
      }
      return undefined;
    }, [isVisible, placement, updatePosition]);

    // Clone the trigger element to add event handlers
    const triggerElement = React.cloneElement(
      children as React.ReactElement<any>,
      {
        'aria-describedby': isVisible ? tooltipId.current : undefined,
        ...(trigger === 'hover' && {
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip,
          onFocus: showTooltip,
          onBlur: hideTooltip,
        }),
        ...(trigger === 'click' && {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            if (isVisible) {
              hideTooltip();
            } else {
              showTooltip();
            }
            // Preserve existing onClick if any
            const childProps = children.props as any;
            if (childProps.onClick) {
              childProps.onClick(e);
            }
          },
        }),
        ...(trigger === 'focus' && {
          onFocus: showTooltip,
          onBlur: hideTooltip,
        }),
      }
    );

    const tooltipContent = isVisible && content && (
      <div
        className="pointer-events-none fixed z-50"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
        }}
      >
        <div className={cn('relative', placementClasses[placement])}>
          <div
            id={tooltipId.current}
            className={cn(
              'max-w-xs rounded-md bg-slate-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg dark:bg-slate-50 dark:text-slate-900',
              contentClassName
            )}
            role="tooltip"
            ref={tooltipRef}
          >
            {content}
            {showArrow && (
              <div
                className={cn(
                  'absolute h-0 w-0 border-4',
                  arrowClasses[placement]
                )}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    );

    return (
      <>
        {triggerElement}
        {typeof window !== 'undefined' &&
          tooltipContent &&
          createPortal(tooltipContent, document.body)}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';
