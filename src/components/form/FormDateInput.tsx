import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RrhDateInput } from '../common/RrhDateInput';
import { useCrmFormContext } from '@/contexts/form';

interface FormDateInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
}

export function FormDateInput<T extends FieldValues>({
  name,
  label,
  placeholder = '',
  disabled = false,
  className,
  showTime,
}: FormDateInputProps<T>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RrhDateInput
              name={name}
              disabled={disabled}
              placeholder={placeholder}
              date={field.value}
              onChange={field.onChange}
              showTime={showTime}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormDateInput;
