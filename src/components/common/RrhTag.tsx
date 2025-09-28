import React from 'react';
import { cn } from '@/lib/utils';
import { OrderStatusOptions } from '@/lib/const';
import { useTranslation } from 'react-i18next';
type Option = {
  label: string;
  value: string;
};
type RrhTagProps = {
  status: string;
  options?: Option[];
};

const statusColorMap: Record<string, string> = {
  '0': 'bg-amber-600',
  '1': 'bg-emerald-600',
  '2': 'bg-slate-400',
  '3': 'bg-red-600',
};

export const RrhTag: React.FC<RrhTagProps> = ({ status, options = OrderStatusOptions }) => {
  const { t } = useTranslation();
  const statusOption = options.find(option => option.value === status);
  const dotColor = statusColorMap[status] ?? 'bg-slate-400';
  return (
    <div className="inline-block">
      <div
        className={cn(
          'border-r-md flex items-center gap-1 rounded-md border border-l-slate-200 px-2 py-0.5',
        )}
      >
        <div className={cn('h-2 w-2 rounded-full', dotColor)}></div>
        <div className={cn('text-xs leading-4 font-normal text-slate-700')}>
          {t(statusOption?.label || '')}
        </div>
      </div>
    </div>
  );
};
