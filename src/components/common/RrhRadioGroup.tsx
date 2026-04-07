import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { FC } from 'react';

export const RrhRadioGroup: FC<{
  defaultValue?: string;
  radioItems: {
    value: string;
    label: string;
    desc?: string;
  }[];
  radioItemClassName?: string;
  labelClassName?: string;
  value: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}> = ({
  defaultValue,
  radioItems,
  radioItemClassName,
  labelClassName,
  value,
  onValueChange,
  orientation = 'vertical',
}) => {
  return (
    <RadioGroup
      className={cn(orientation === 'vertical' ? '' : 'flex')}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      {radioItems.map(item => (
        <div className={cn('flex gap-3', radioItemClassName)} key={item.value}>
          <RadioGroupItem
            className="mt-0.5 size-4 [&_svg]:h-2"
            value={item.value}
            id={item.value}
          />
          <div>
            <Label className={cn('text-sm', labelClassName)} htmlFor={item.value}>
              {item.label}
            </Label>
            {item.desc && <p className="text-muted-foreground text-xs">{item.desc}</p>}
          </div>
        </div>
      ))}
    </RadioGroup>
  );
};
