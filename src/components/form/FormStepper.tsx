import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { RrhButton } from '@/components/common/RrhButton';
import { Input } from '@/components/ui/input';

interface FormStepperProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  min: number;
  max: number;
  step?: number;
  className?: string;
  labeTipsDom?: React.ReactNode;
  onValueChange?: (value: number) => void;
  inputClassName?: string;
  disabled?: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function FormStepper<T extends FieldValues>({
  name,
  label,
  min,
  max,
  step = 1,
  className,
  labeTipsDom,
  onValueChange,
  inputClassName,
  disabled = false,
}: FormStepperProps<T>) {
  const { form } = useCrmFormContext<T>();

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => {
        const currentValue = clamp(Number(field.value || min), min, max);

        const updateValue = (nextValue: number) => {
          const normalized = clamp(nextValue, min, max);
          if (onValueChange) {
            onValueChange(normalized);
            return;
          }
          field.onChange(String(normalized));
        };

        return (
          <FormItem className={cn('text-foreground text-sm', className)}>
            {label && (
              <div className="flex items-center gap-2">
                <FormLabel>{label}</FormLabel>
                {labeTipsDom && <div>{labeTipsDom}</div>}
              </div>
            )}

            <FormControl>
              <div className="flex w-fit items-center gap-2">
                <RrhButton
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateValue(currentValue - step)}
                  disabled={disabled || currentValue <= min}
                >
                  -
                </RrhButton>
                <Input
                  className={cn('w-20 text-center', inputClassName)}
                  inputMode="numeric"
                  value={String(currentValue)}
                  disabled={disabled}
                  onChange={e => {
                    const numeric = Number(e.target.value.replace(/\D/g, '') || min);
                    updateValue(numeric);
                  }}
                />
                <RrhButton
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateValue(currentValue + step)}
                  disabled={disabled || currentValue >= max}
                >
                  +
                </RrhButton>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
