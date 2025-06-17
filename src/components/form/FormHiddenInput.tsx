import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';

interface FormHiddenInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  value: string | number;
  control: Control<T>;
}

export const FormHiddenInput = <T extends FieldValues>({
  name,
  value,
  control,
}: FormHiddenInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="sr-only">
          <FormControl>
            <Input {...field} value={value} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
