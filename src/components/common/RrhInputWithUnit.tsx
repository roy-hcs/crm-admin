import { ComponentProps, FC } from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

export const RrhInputWithUnit: FC<
  {
    unit: string;
    wrapperClassName?: string;
    unitClassName?: string;
  } & ComponentProps<'input'>
> = ({ unit, wrapperClassName, unitClassName, disabled, ...props }) => {
  return (
    <div className={cn('relative w-full', wrapperClassName, disabled && 'bg-muted')}>
      <Input
        disabled={disabled}
        className="bg-background disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground/20 h-10 pr-15 text-sm disabled:cursor-not-allowed disabled:opacity-100"
        {...props}
      />
      <span
        className={cn(
          'text-sidebar-ring absolute right-3 bottom-1/2 translate-y-1/2 text-sm',
          disabled ? 'text-muted-foreground opacity-100' : '',
          unitClassName,
        )}
      >
        {unit}
      </span>
    </div>
  );
};
