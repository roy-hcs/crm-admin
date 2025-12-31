import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface FormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  verticalLabel?: boolean;
  className?: string;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
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
          <div
            className={cn(
              'text-foreground text-sm',
              verticalLabel ? '' : 'flex items-center',
              className,
            )}
          >
            <FormLabel className={cn(verticalLabel ? 'mb-2' : 'basis-3/12')}>{label}</FormLabel>
            <FormControl className="shrink-0 basis-9/12">
              <Input
                type="text"
                {...props}
                {...field}
                className={cn('h-9 w-full border px-2')}
                placeholder={placeholder}
              />
            </FormControl>
          </div>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
