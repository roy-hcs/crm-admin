import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';

interface FormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  className?: string;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  className,
  ...props
}: FormInputProps<T> & React.ComponentPropsWithoutRef<'input'>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className={cn('flex items-center text-sm', className)}>
            <FormLabel className="basis-3/12">{label}</FormLabel>
            <FormControl className="basis-9/12">
              <input
                type="text"
                {...props}
                {...field}
                className="h-9 w-full border px-2"
                placeholder={placeholder}
              />
            </FormControl>
          </div>
          <div className="flex justify-end">
            <FormMessage className="basis-9/12" />
          </div>
        </FormItem>
      )}
    />
  );
}
