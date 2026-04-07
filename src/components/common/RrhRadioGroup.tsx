import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { FC, useId } from 'react';

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
  idPrefix?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}> = ({
  defaultValue,
  radioItems,
  radioItemClassName,
  labelClassName,
  value,
  idPrefix,
  onValueChange,
  orientation = 'vertical',
}) => {
  const autoIdPrefix = useId();
  const groupIdPrefix = idPrefix || autoIdPrefix;
  return (
    <RadioGroup
      className={cn(orientation === 'vertical' ? '' : 'flex')}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      {radioItems.map((item, index) => {
        const radioId = `${groupIdPrefix}-${item.value}-${index}`;
        return (
          <div className={cn('flex gap-3', radioItemClassName)} key={`${item.value}-${index}`}>
            <RadioGroupItem className="mt-0.5 size-4 [&_svg]:h-2" value={item.value} id={radioId} />
            <div>
              <Label className={cn('text-sm', labelClassName)} htmlFor={radioId}>
                {item.label}
              </Label>
              {item.desc && <p className="text-muted-foreground text-xs">{item.desc}</p>}
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
};
