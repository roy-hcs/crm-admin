import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { RrhInputWithUnit } from '../common/RrhInputWithUnit';
import { ComponentPropsWithoutRef } from 'react';

type InputElementProps = ComponentPropsWithoutRef<'input'>;

type FormInputWithUnitProps<T extends FieldValues> = {
  name: FieldPath<T>;
  unit: string;
  label?: string;
  verticalLabel?: boolean;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  labeTipsDom?: React.ReactNode;
};

export function FormInputWithUnit<T extends FieldValues>({
  name,
  unit,
  label,
  verticalLabel = true,
  className,
  inputClassName,
  disabled = false,
  labeTipsDom,
  ...props
}: FormInputWithUnitProps<T> &
  Omit<InputElementProps, 'name' | 'value' | 'onChange' | 'disabled'>) {
  const { form } = useCrmFormContext<T>();

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem
          className={cn(
            'text-foreground text-sm',
            verticalLabel ? '' : 'flex items-center',
            className,
          )}
        >
          {label && (
            <div className="flex items-center gap-2">
              <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12', 'leading-5')}>
                {label}
              </FormLabel>
              {labeTipsDom && <div>{labeTipsDom}</div>}
            </div>
          )}

          <FormControl
            className={cn('grow-0', verticalLabel || !label ? 'basis-full' : 'basis-9/12')}
          >
            <RrhInputWithUnit
              unit={unit}
              value={field.value ?? ''}
              disabled={disabled}
              className={cn('h-10', inputClassName)}
              onChange={e => field.onChange(e.target.value)}
              {...props}
            />
          </FormControl>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
