import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RrhSelect } from '../common/RrhSelect';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
interface FormSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  options,
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
}: FormSelectProps<T>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <div
            className={cn(
              'flex items-center text-sm text-[#757F8D]',
              verticalLabel ? 'flex-col items-start gap-2' : '',
              className,
            )}
          >
            <FormLabel className="shrink-0 basis-3/12">{label}</FormLabel>
            <FormControl className={cn('grow-0', verticalLabel ? 'basis-full' : 'basis-9/12')}>
              <RrhSelect
                options={options}
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
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
