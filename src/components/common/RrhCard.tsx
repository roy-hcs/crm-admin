import { cn } from '@/lib/utils';
import { FC, PropsWithChildren, ReactElement } from 'react';

export const RrhCard: FC<
  PropsWithChildren<{
    title?: string;
    titleCls?: string;
    TitleDom?: ReactElement;
    className?: string;
  }>
> = ({ title, titleCls, TitleDom, className, children }) => {
  return (
    <div className={cn('bg-card rounded-lg p-3 md:rounded-2xl md:p-6', className)}>
      {title && (
        <h2 className={cn('text-normal py-1.5 text-base font-bold md:py-3 md:text-lg', titleCls)}>
          {title}
        </h2>
      )}
      {TitleDom}
      {children}
    </div>
  );
};
