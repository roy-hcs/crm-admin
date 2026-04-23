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

interface FormSwitchProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  className?: string;
  verticalLabel?: boolean;
  labeTipsDom?: React.ReactNode;
  description?: string;
}

export function FormSwitch<T extends FieldValues>({
  name,
  label,
  verticalLabel = false,
  className,
  labeTipsDom,
  description,
}: FormSwitchProps<T> & React.ComponentPropsWithoutRef<typeof Switch>) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value = String(field.value);
        return (
          <FormItem
            className={cn(
              'text-foreground text-sm',
              verticalLabel ? '' : 'flex items-center',
              className,
            )}
          >
            <div className="flex items-center gap-2">
              {label && (
                <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12', 'leading-5')}>
                  {label}
                </FormLabel>
              )}
              {labeTipsDom && <div>{labeTipsDom}</div>}
            </div>
            <FormControl className="shrink-0 basis-9/12">
              <Switch
                className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
                checked={value === '1'}
                onClick={() => {
                  const newValue = value === '1' ? '0' : '1';
                  field.onChange(newValue);
                }}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className="text-end" />
          </FormItem>
        );
      }}
    />
  );
}
