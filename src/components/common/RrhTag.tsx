import { cn } from '@/lib/utils';
import { FC, PropsWithChildren } from 'react';

export type RrhTagProps = {
  type: 'success' | 'error' | 'warning' | 'info' | 'default';
  className?: string;
};

export const RrhTag: FC<PropsWithChildren<RrhTagProps>> = ({ children, type, className }) => {
  return (
    <div
      className={cn(
        'inline-flex flex-nowrap items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 text-xs leading-4',
        className,
      )}
    >
      <div
        className={cn('size-2 rounded-full', {
          'bg-emerald-600': type === 'success',
          'bg-red-600': type === 'error',
          'bg-amber-600': type === 'warning',
          'bg-blue-600': type === 'info',
          'bg-slate-400': type === 'default',
        })}
      ></div>
      <div>{children}</div>
    </div>
  );
};
