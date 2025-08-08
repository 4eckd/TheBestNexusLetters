import { forwardRef } from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps extends LucideProps {
  icon: LucideIcon;
  className?: string;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, className, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        className={cn('h-4 w-4', className)}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };
export type { IconProps };
