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
      render={({ field }) => {
        const current = String(field.value ?? '').length;
        const max = props.maxLength;
        return (
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
              <div className="relative">
                <Input
                  type="text"
                  {...props}
                  {...field}
                  className={cn('h-9 w-full border px-2', max ? 'pr-12' : '')}
                  placeholder={placeholder}
                  onBlur={e => {
                    field.onBlur();
                    onBlur?.(e);
                  }}
                />
                {max && (
                  <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 transform">
                    <span className="text-input text-sm leading-5 font-medium whitespace-nowrap">
                      {current}/{max}
                    </span>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage className="text-end" />
          </FormItem>
        );
      }}
    />
  );
}
