import { FC, PropsWithChildren, ReactElement } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';

export const RrhPopup: FC<
  PropsWithChildren<{ Trigger: ReactElement; align?: 'center' | 'start' | 'end' }>
> = ({ Trigger, align, children }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{Trigger}</PopoverTrigger>
      <PopoverContent
        className={cn('w-container', {
          'w-container-md': true,
        })}
        align={align}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};
