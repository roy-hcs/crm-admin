import { cn } from '@/lib/utils';
import { ReactElement } from 'react';

export const LabelItem = ({
  label,
  ContentDom,
  className,
}: {
  label: ReactElement | string;
  ContentDom: ReactElement;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col gap-2 py-3', className)}>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">{ContentDom}</div>
    </div>
  );
};
