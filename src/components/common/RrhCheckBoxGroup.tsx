import { cn } from '@/lib/utils';
import { FC } from 'react';
import { Checkbox } from '../ui/checkbox';

export const RrhCheckBoxGroup: FC<{
  checkItems: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  checkItemClassName?: string;
  value: string;
  onValueChange?: (value: string) => void;
}> = ({ checkItems, checkItemClassName, onValueChange, value }) => {
  const currentSelected = value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return (
    <div className="flex flex-wrap gap-6">
      {checkItems.map(i => {
        const isChecked = currentSelected.includes(i.value);
        return (
          <div className="flex items-center gap-1.5" key={i.value}>
            <Checkbox
              className={cn('data-[state=checked]:border-slate-700', checkItemClassName)}
              checked={isChecked}
              onCheckedChange={() => {
                const next = [...currentSelected];
                const idx = next.indexOf(i.value);
                if (idx === -1) {
                  next.push(i.value);
                } else {
                  next.splice(idx, 1);
                }
                onValueChange?.(next.join(','));
              }}
              disabled={i.disabled}
              aria-label="Select row"
            />
            <div>{i.label}</div>
          </div>
        );
      })}
    </div>
  );
};
