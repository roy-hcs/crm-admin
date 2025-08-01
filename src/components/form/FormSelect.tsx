import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { CrmSelect } from '../common/CrmSelect';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
interface FormSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  options,
  name,
  label,
  placeholder,
  className,
}: FormSelectProps<T>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <div className={cn('flex items-center text-sm', className)}>
            <FormLabel className="shrink-0 basis-3/12">{label}</FormLabel>
            <FormControl className="grow-0 basis-9/12">
              <CrmSelect
                options={options}
                value={field.value}
                onValueChange={field.onChange}
                className="rounded-none"
                placeholder={placeholder}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
