import { cn } from '@/lib/utils';
import { FC } from 'react';

export const RrhSwitchGroup: FC<{
  switchItems: {
    value: string;
    label: string;
  }[];
  switchItemClassName?: string;
  labelClassName?: string;
  value: string;
  onValueChange?: (value: string) => void;
}> = ({ value, switchItems, switchItemClassName, onValueChange }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {switchItems.map(i => (
        <button
          className={cn(
            'rounded-full px-3 py-2 text-xs leading-4 font-medium',
            value == i.value ? 'bg-primary text-primary-foreground' : 'text-foreground border',
            switchItemClassName,
          )}
          onClick={() => onValueChange?.(i.value)}
          key={i.value}
        >
          {i.label}
        </button>
      ))}
    </div>
  );
};
