import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { FC } from 'react';

export const RrhRadioGroup: FC<{
  defaultValue?: string;
  radioItems: {
    value: string;
    label: string;
  }[];
  radioItemClassName?: string;
  labelClassName?: string;
  value: string;
  onValueChange?: (value: string) => void;
}> = ({ defaultValue, radioItems, radioItemClassName, labelClassName, value, onValueChange }) => {
  return (
    <RadioGroup defaultValue={defaultValue} value={value} onValueChange={onValueChange}>
      {radioItems.map(item => (
        <div className={cn('flex items-center gap-3', radioItemClassName)} key={item.value}>
          <RadioGroupItem className="size-4 [&_svg]:h-2" value={item.value} id={item.value} />
          <Label className={cn('text-sm', labelClassName)} htmlFor={item.value}>
            {item.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
