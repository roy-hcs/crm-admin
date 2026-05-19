import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { RrhCheckBoxGroup } from '../common/RrhCheckBoxGroup';

interface FormCheckBoxGroupProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  className?: string;
  labeTipsDom?: React.ReactNode;
  description?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  valueType?: 'string' | 'array';
  checkGroupClassName?: string;
  checkItemClassName?: string;
}

export function FormCheckBoxGroup<T extends FieldValues>({
  name,
  label,
  className,
  labeTipsDom,
  description,
  options,
  valueType = 'string',
  checkGroupClassName,
  checkItemClassName,
}: FormCheckBoxGroupProps<T>) {
  const { form } = useCrmFormContext<T>();

  const toCommaString = (value: unknown) => {
    if (Array.isArray(value)) {
      return value
        .map(item => String(item).trim())
        .filter(Boolean)
        .join(',');
    }
    if (typeof value === 'string') {
      return value;
    }
    return '';
  };

  const toArrayValue = (value: string) =>
    value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn(className)}>
            {label && (
              <div className="flex gap-2">
                {label && <FormLabel>{label}</FormLabel>}
                {labeTipsDom && <div>{labeTipsDom}</div>}
              </div>
            )}
            <FormControl>
              <RrhCheckBoxGroup
                onValueChange={v => {
                  if (valueType === 'array') {
                    field.onChange(toArrayValue(v));
                    return;
                  }
                  field.onChange(v);
                }}
                value={toCommaString(field.value)}
                checkItems={options || []}
                className={checkGroupClassName}
                checkItemClassName={checkItemClassName}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
