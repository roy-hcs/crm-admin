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
    <div className={cn('relative w-full', wrapperClassName)}>
      <Input
        disabled={disabled}
        className="disabled:text-muted-foreground bg-background h-10 pr-15 text-sm"
        {...props}
      />
      <span
        className={cn(
          'text-sidebar-ring absolute right-3 bottom-1/2 translate-y-1/2 text-sm',
          disabled ? 'opacity-50' : '',
          unitClassName,
        )}
      >
        {unit}
      </span>
    </div>
  );
};
