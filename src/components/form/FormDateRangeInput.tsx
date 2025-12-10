import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RrhRangeInput } from '../common/RrhRangeInput';

interface FormDateRangeInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormDateRangeInput<T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder = '',
  disabled = false,
  className,
}: FormDateRangeInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RrhRangeInput
              name={name}
              disabled={disabled}
              placeholder={placeholder}
              from={field.value?.from}
              to={field.value?.to}
              onChange={field.onChange}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormDateRangeInput;
