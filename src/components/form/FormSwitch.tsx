import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface FormSwitchProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  className?: string;
  verticalLabel?: boolean;
}

export function FormSwitch<T extends FieldValues>({
  name,
  label,
  verticalLabel = false,
  className,
}: FormSwitchProps<T> & React.ComponentPropsWithoutRef<typeof Switch>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            className={cn(
              'text-foreground text-sm',
              verticalLabel ? '' : 'flex items-center',
              className,
            )}
          >
            <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12', 'leading-5')}>
              {label}
            </FormLabel>
            <FormControl className="shrink-0 basis-9/12">
              <Switch
                className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
                checked={field.value === '1'}
                onClick={() => {
                  const newValue = field.value === '1' ? '0' : '1';
                  field.onChange(newValue);
                }}
              />
            </FormControl>
            <FormMessage className="text-end" />
          </FormItem>
        );
      }}
    />
  );
}
