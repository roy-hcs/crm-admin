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
              'flex text-sm text-[#757F8D]',
              verticalLabel ? 'flex-col items-start gap-2' : 'items-center',
              className,
            )}
          >
            <FormLabel className="basis-3/12">{label}</FormLabel>
            <FormControl className="shrink-0 basis-9/12">
              <Input
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
