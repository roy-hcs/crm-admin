import { PropsWithChildren, ReactElement, forwardRef } from 'react';
import { Button } from '../ui/button';
import { ButtonHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    Icon?: ReactElement;
  };
export const RrhButton = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  ({ children, className, loading, Icon, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn('cursor-pointer px-3 py-2', className)}
        {...props}
        disabled={loading || props.disabled}
      >
        {loading && <LoaderCircle className="animate-spin" />}
        {Icon && !loading && Icon}
        {children}
      </Button>
    );
  },
);
