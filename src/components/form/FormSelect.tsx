import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { BaseOption, RrhSelect } from '../common/RrhSelect';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
interface FormSelectProps<T extends FieldValues, O extends BaseOption = BaseOption> {
  name: FieldPath<T>;
  label?: string;
  options: O[];
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  renderItem?: (option: O) => ReactNode;
  showRowValue?: boolean;
  loading?: boolean;
}

export function FormSelect<T extends FieldValues, O extends BaseOption = BaseOption>({
  options,
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  renderItem,
  showRowValue = true,
  loading = false,
}: FormSelectProps<T, O>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <div
            className={cn(
              'text-foreground text-sm',
              verticalLabel ? '' : 'flex items-center',
              className,
            )}
          >
            {label && (
              <FormLabel className={cn(verticalLabel ? 'mb-2' : 'shrink-0 basis-3/12')}>
                {label}
              </FormLabel>
            )}
            <FormControl
              className={cn('grow-0', verticalLabel || !label ? 'basis-full' : 'basis-9/12')}
            >
              {loading ? (
                <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
              ) : (
                <RrhSelect<O>
                  options={options}
                  value={field.value?.toString()}
                  onValueChange={field.onChange}
                  className="w-full"
                  placeholder={placeholder}
                  renderItem={renderItem}
                  showRowValue={showRowValue}
                />
              )}
            </FormControl>
          </div>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
