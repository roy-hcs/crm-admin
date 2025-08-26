import { FC, PropsWithChildren } from 'react';
import { Button } from '../ui/button';
import { ButtonHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
export const RrhButton: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Button className={cn('cursor-pointer', className)} {...props}>
      {children}
    </Button>
  );
};
