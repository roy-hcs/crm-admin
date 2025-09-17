import { PropsWithChildren, forwardRef } from 'react';
import { Button } from '../ui/button';
import { ButtonHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
export const RrhButton = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button ref={ref} className={cn('cursor-pointer px-4 py-2', className)} {...props}>
        {children}
      </Button>
    );
  },
);
