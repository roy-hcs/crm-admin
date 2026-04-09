import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { RrhTimeOfDayInput } from '@/components/common/RrhTimeOfDayInput';

interface FormTimeOfDayInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  disabled?: boolean;
  className?: string;
  labeTipsDom?: React.ReactNode;
  precision?: 'minute' | 'second';
}

export function FormTimeOfDayInput<T extends FieldValues>({
  name,
  label,
  disabled = false,
  className,
  labeTipsDom,
  precision,
}: FormTimeOfDayInputProps<T>) {
  const { form } = useCrmFormContext<T>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex gap-2">
            {label && <FormLabel>{label}</FormLabel>}
            {labeTipsDom && <div>{labeTipsDom}</div>}
          </div>
          <FormControl>
            <RrhTimeOfDayInput
              name={name}
              value={field.value?.toString() || ''}
              onChange={field.onChange}
              disabled={disabled}
              precision={precision}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
