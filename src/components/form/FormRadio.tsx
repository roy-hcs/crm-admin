import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { BaseOption } from '../common/RrhSelect';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { RrhRadioGroup } from '../common/RrhRadioGroup';

interface FormRadioProps<T extends FieldValues, O extends BaseOption = BaseOption> {
  name: FieldPath<T>;
  label?: string;
  options: O[];
  verticalLabel?: boolean;
  className?: string;
  loading?: boolean;
  orientation?: 'horizontal' | 'vertical';
  labeTipsDom?: React.ReactNode;
}

export function FormRadio<T extends FieldValues, O extends BaseOption = BaseOption>({
  options,
  name,
  label,
  verticalLabel = false,
  className,
  loading = false,
  orientation,
  labeTipsDom,
}: FormRadioProps<T, O>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <div className="flex gap-2">
            {label && <FormLabel>{label}</FormLabel>}
            {labeTipsDom && <div>{labeTipsDom}</div>}
          </div>
          <FormControl
            className={cn('grow-0', verticalLabel || !label ? 'basis-full' : 'basis-9/12')}
          >
            {loading ? (
              <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
            ) : (
              <RrhRadioGroup
                value={field.value ?? '1'}
                orientation={orientation}
                onValueChange={value => {
                  field.onChange(value);
                }}
                labelClassName="font-medium"
                radioItems={options.map(i => ({
                  value: String(i.value),
                  label: i.label,
                }))}
              />
            )}
          </FormControl>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
