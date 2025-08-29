import * as React from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Calendar as CalenderIcon, ChevronDown } from 'lucide-react';

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
import { cn } from '@/lib/utils';

interface FormMonthPickerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromYear?: number;
  toYear?: number;
}

// 仅选择“年月”的表单组件：值类型为 'YYYY-MM'
export function FormMonthPicker<T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder = '请选择月份',
  disabled = false,
  className,
  fromYear = 2000,
  toYear = 2100,
}: FormMonthPickerProps<T>) {
  const [open, setOpen] = React.useState(false);

  const parseMonth = (val?: string): Date | undefined => {
    if (!val) return undefined;
    const [y, m] = val.split('-').map(Number);
    if (!y || !m) return undefined;
    return new Date(y, m - 1, 1);
  };

  const formatMonth = (d?: Date): string => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const monthDate = parseMonth(field.value);
        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id={name}
                    variant="outline"
                    className={cn('w-full justify-between font-normal')}
                    disabled={disabled}
                  >
                    {field.value ? (
                      <span>{field.value}</span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-2">
                        <CalenderIcon className="size-4" />
                        {placeholder}
                      </span>
                    )}
                    <ChevronDown className="size-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    // 只用顶部年/月下拉；隐藏日期网格
                    mode="single"
                    selected={monthDate}
                    defaultMonth={monthDate}
                    captionLayout="dropdown"
                    fromYear={fromYear}
                    toYear={toYear}
                    classNames={{
                      table: 'hidden',
                      weekdays: 'hidden',
                      week: 'hidden',
                      day: 'hidden',
                    }}
                    // 切换月份即选中
                    onMonthChange={month => {
                      const val = formatMonth(month);
                      field.onChange(val);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormMonthPicker;
