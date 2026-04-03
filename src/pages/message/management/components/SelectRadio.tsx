import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';

export const SelectRadio = ({
  title,
  field,
  verticalLabel = false,
  radioItems,
  orientation = 'vertical',
}: {
  title: string;
  field: ControllerRenderProps<FieldValues>;
  verticalLabel?: boolean;
  radioItems: {
    value: string;
    label: string;
  }[];
  orientation?: 'horizontal' | 'vertical';
}) => {
  return (
    <FormItem>
      <div className={cn('text-foreground text-sm', verticalLabel ? '' : 'flex items-center')}>
        <FormLabel className={cn(verticalLabel ? 'mb-2' : 'basis-3/12')}>{title}</FormLabel>
        <FormControl>
          <RrhRadioGroup
            idPrefix={field.name}
            value={field.value ?? '1'}
            orientation={orientation}
            onValueChange={value => {
              field.onChange(value);
            }}
            labelClassName="font-medium"
            radioItems={radioItems}
          />
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
};
