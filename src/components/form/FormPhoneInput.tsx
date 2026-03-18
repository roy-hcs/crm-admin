import { RrhSelect } from '../common/RrhSelect';
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import mobileZone from '@/data/mzone.json';
import { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useCrmFormContext } from '@/contexts/form';
import { ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';

interface FormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  mzoneFieldName: FieldPath<T>;
  label: string;
  placeholder: string;
  className?: string;
  verticalLabel?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}
export function FormPhoneInput<T extends FieldValues>({
  name,
  mzoneFieldName,
  label,
  placeholder,
  verticalLabel = false,
  className,
  onBlur,
}: FormInputProps<T>) {
  const { form } = useCrmFormContext<T>();
  const mzone = form.watch(mzoneFieldName) as string;
  const mobileZoneOptions = mobileZone.mzone.map((item, index) => {
    return {
      label: `${item.area} ${item.code}`,
      // shadcn use value as key internally, to ensure unique values, append the index,
      // eg, american, canada share the same value "+1", if don't append index, will cause react key warning
      value: `+${item.code}-${index}`,
    };
  });
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12', 'leading-5')}>
            {label}
          </FormLabel>
          <div
            className={cn('flex items-center', verticalLabel ? 'w-full basis-full' : 'basis-9/12')}
          >
            <div className="relative basis-3/12">
              <div className="flex h-9 flex-nowrap items-center justify-center gap-1 rounded-l-lg border-y border-r-0 border-l px-1">
                <span>{mzone?.replace(/-.*/, '')}</span>
                <ChevronDown className="size-3.5" />
              </div>
              <RrhSelect
                options={mobileZoneOptions}
                value={mzone}
                showRowValue={true}
                onValueChange={value =>
                  form.setValue(mzoneFieldName, value as PathValue<T, typeof mzoneFieldName>)
                }
                className="absolute inset-0 basis-3/12 cursor-pointer opacity-0"
              />
            </div>
            <Input
              type="text"
              {...field}
              placeholder={placeholder}
              className="h-9 w-full basis-9/12 rounded-l-none border-y border-r border-l-0 px-2 text-sm"
              onBlur={e => {
                field.onBlur();
                onBlur?.(e);
              }}
            />
          </div>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
