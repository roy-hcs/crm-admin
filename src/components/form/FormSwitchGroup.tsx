import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { RrhSwitchGroup } from '../common/RrhSwitchGroup';

interface FormSwitchGroupProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  className?: string;
  labeTipsDom?: React.ReactNode;
  description?: string;
  multiple?: boolean;
  switchItems: {
    value: string;
    label: string;
  }[];
  switchItemClassName?: string;
}

export function FormSwitchGroup<T extends FieldValues>({
  name,
  label,
  className,
  labeTipsDom,
  description,
  multiple = false,
  switchItems,
  switchItemClassName,
}: FormSwitchGroupProps<T>) {
  const { form } = useCrmFormContext<T>();

  const toArrayValue = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map(item => String(item));
    }
    if (typeof value === 'string') {
      return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          {label && (
            <div className="flex items-center gap-2">
              <FormLabel>{label}</FormLabel>
              {labeTipsDom && <div>{labeTipsDom}</div>}
            </div>
          )}
          <FormControl>
            <RrhSwitchGroup
              multiple={multiple}
              value={multiple ? undefined : String(field.value ?? '')}
              values={multiple ? toArrayValue(field.value) : undefined}
              onValueChange={value => {
                if (!multiple) {
                  field.onChange(value);
                }
              }}
              onValuesChange={values => {
                if (multiple) {
                  field.onChange(values);
                }
              }}
              switchItems={switchItems}
              switchItemClassName={switchItemClassName}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
