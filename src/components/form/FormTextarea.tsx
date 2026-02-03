import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

interface FormTextareaProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  className?: string;
  verticalLabel?: boolean;
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  verticalLabel = false,
  placeholder,
  className,
  onBlur,
  ...props
}: FormTextareaProps<T> & React.ComponentPropsWithoutRef<'textarea'>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const current = String(field.value).length;
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
                <Textarea
                  {...props}
                  {...field}
                  placeholder={placeholder}
                  onBlur={e => {
                    field.onBlur();
                    onBlur?.(e);
                  }}
                />
                {max && (
                  <div className="absolute right-3 bottom-3">
                    <span className="text-input text-sm leading-5 font-medium">
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
