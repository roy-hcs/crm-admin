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
    <div className="flex gap-4">
      {switchItems.map(i => (
        <div
          className={cn(
            'cursor-pointer rounded-full px-3 py-2',
            value == i.value ? 'bg-primary text-primary-foreground' : 'text-foreground border',
            switchItemClassName,
          )}
          onClick={() => onValueChange?.(i.value)}
          key={i.value}
        >
          <div className="text-xs leading-4 font-medium">{i.label}</div>
        </div>
      ))}
    </div>
  );
};
