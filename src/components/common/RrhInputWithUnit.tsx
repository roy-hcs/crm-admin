import { ComponentProps, FC } from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

export const RrhInputWithUnit: FC<
  {
    unit: string;
    wrapperClassName?: string;
    unitClassName?: string;
  } & ComponentProps<'input'>
> = ({ unit, wrapperClassName, unitClassName, ...props }) => {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <Input className="h-10 pr-15" {...props} />
      <span
        className={cn(
          'text-sidebar-ring absolute right-3 bottom-1/2 translate-y-1/2',
          unitClassName,
        )}
      >
        {unit}
      </span>
    </div>
  );
};
