import { cn } from '@/lib/utils';
import { FC } from 'react';
import { Checkbox } from '../ui/checkbox';

export const RrhCheckBoxGroup: FC<{
  checkItems: {
    value: string;
    label: string;
  }[];
  checkItemClassName?: string;
  labelClassName?: string;
  value: string;
  onValueChange?: (value: string) => void;
}> = ({ checkItems, checkItemClassName, onValueChange, value }) => {
  const current = (value ?? '')
    .toString()
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
      {checkItems.map(i => {
        const isChecked = current.length ? current.includes(i.value) : false;
        return (
          <div className="flex items-center gap-1.5" key={i.value}>
            <Checkbox
              className={cn('data-[state=checked]:border-slate-700', checkItemClassName)}
              checked={isChecked}
              onCheckedChange={checked => {
                const next = [...current];
                const idx = next.indexOf(i.value);
                if (checked) {
                  if (idx === -1) next.push(i.value);
                } else {
                  if (idx > -1) next.splice(idx, 1);
                }
                onValueChange?.(next.join(','));
              }}
              aria-label="Select row"
            />
            <div>{i.label}</div>
          </div>
        );
      })}
    </div>
  );
};
