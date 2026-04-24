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
import { Switch } from '@/components/ui/switch';
import { RrhCheckBoxGroup } from '../common/RrhCheckBoxGroup';

interface FormCheckBoxGroupProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  className?: string;
  labeTipsDom?: React.ReactNode;
  description?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export function FormCheckBoxGroup<T extends FieldValues>({
  name,
  label,
  className,
  labeTipsDom,
  description,
  options,
}: FormCheckBoxGroupProps<T> & React.ComponentPropsWithoutRef<typeof Switch>) {
  const { form } = useCrmFormContext<T>();
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
                  field.onChange(v);
                }}
                value={field.value}
                checkItems={options || []}
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
