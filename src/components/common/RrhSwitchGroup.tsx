import { cn } from '@/lib/utils';
import { FC } from 'react';

export const RrhSwitchGroup: FC<{
  switchItems: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  switchItemClassName?: string;
  labelClassName?: string;
  className?: string;
  value?: string;
  values?: string[];
  multiple?: boolean;
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
}> = ({
  value,
  values,
  multiple = false,
  switchItems,
  switchItemClassName,
  labelClassName,
  onValueChange,
  onValuesChange,
  className,
}) => {
  const selectedValues = multiple ? (values ?? []) : [value ?? ''];

  const handleItemClick = (itemValue: string) => {
    if (multiple) {
      const currentValues = values ?? [];
      const isSelected = currentValues.includes(itemValue);
      const nextValues = isSelected
        ? currentValues.filter(v => v !== itemValue)
        : [...currentValues, itemValue];
      onValuesChange?.(nextValues);
      return;
    }
    onValueChange?.(itemValue);
  };

  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {switchItems.map(i => (
        <button
          type="button"
          className={cn(
            'rounded-full px-3 py-2 text-xs leading-4 font-medium',
            selectedValues.includes(i.value)
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground border',
            switchItemClassName,
          )}
          onClick={() => handleItemClick(i.value)}
          key={i.value}
          disabled={i.disabled}
        >
          <span className={labelClassName}>{i.label}</span>
        </button>
      ))}
    </div>
  );
};
