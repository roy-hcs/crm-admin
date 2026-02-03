import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface FormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  className?: string;
  verticalLabel?: boolean;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  verticalLabel = false,
  placeholder,
  className,
  onBlur,
  ...props
}: FormInputProps<T> & React.ComponentPropsWithoutRef<'input'>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'text-foreground text-sm',
            verticalLabel ? '' : 'flex items-center',
            className,
          )}
        >
          <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12', 'leading-5')}>
            {label}
          </FormLabel>
          <FormControl className="shrink-0 basis-9/12">
            <Input
              type="text"
              {...props}
              {...field}
              className={cn('h-9 w-full border px-2')}
              placeholder={placeholder}
              onBlur={e => {
                field.onBlur();
                onBlur?.(e);
              }}
            />
          </FormControl>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
