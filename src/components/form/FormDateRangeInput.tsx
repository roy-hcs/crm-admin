import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Control, FieldValues, Path } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalenderIcon } from 'lucide-react';

interface FormDateRangeInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormDateRangeInput<T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder = '',
  disabled = false,
  className,
}: FormDateRangeInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={name}
                  variant={'outline'}
                  className={cn(
                    'line-clamp-1 w-full justify-start rounded-none text-left font-normal text-ellipsis',
                  )}
                  disabled={disabled}
                >
                  {field.value?.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, 'yyyy-MM-dd')} -{' '}
                        {format(field.value.to, 'yyyy-MM-dd')}
                      </>
                    ) : (
                      format(field.value.from, 'yyyy-MM-dd')
                    )
                  ) : (
                    <div className="relative">
                      <span>{placeholder}</span>
                      <CalenderIcon className="absolute top-1/2 -right-2 -translate-1/2" />
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={field.value?.from}
                  selected={field.value as DateRange}
                  onSelect={field.onChange}
                  numberOfMonths={2}
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormDateRangeInput;
