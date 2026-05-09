import { cn } from '@/lib/utils';
import { FC, ReactElement } from 'react';

export const PageInfo: FC<{
  title: string;
  desc?: string | ReactElement;
  titleCls?: string;
  descCls?: string;
  wrapperCls?: string;
}> = ({ title, desc, titleCls, descCls, wrapperCls }) => {
  return (
    <div className={wrapperCls}>
      <h1 className={cn('text-foreground text-xl font-semibold', titleCls)}>{title}</h1>
      {desc && (
        <div className={cn('text-muted-foreground mt-1 whitespace-pre-line', descCls)}>{desc}</div>
      )}
    </div>
  );
};
