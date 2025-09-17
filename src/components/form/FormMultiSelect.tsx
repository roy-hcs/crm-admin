import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { BaseOption, RrhMultiSelect } from '../common/RrhMultiSelect';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface FormMultiSelectProps<T extends FieldValues, O extends BaseOption = BaseOption> {
  name: FieldPath<T>;
  label: string;
  options: O[];
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  renderItem?: (option: O) => ReactNode;
  showRowValue?: boolean;
}

export function FormMultiSelect<T extends FieldValues, O extends BaseOption = BaseOption>({
  options,
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  renderItem,
  showRowValue = true,
}: FormMultiSelectProps<T, O>) {
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
            <FormControl className={cn('grow-0', verticalLabel ? 'w-full' : 'basis-9/12')}>
              <RrhMultiSelect<O>
                options={options}
                value={field.value || []}
                onValueChange={field.onChange}
                className="w-full"
                placeholder={placeholder}
                renderItem={renderItem}
                showRowValue={showRowValue}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
