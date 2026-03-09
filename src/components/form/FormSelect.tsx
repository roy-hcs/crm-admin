import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { BaseOption, RrhSelect } from '../common/RrhSelect';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

interface FormSelectProps<T extends FieldValues, O extends BaseOption = BaseOption> {
  name: FieldPath<T>;
  label?: string;
  options: O[];
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  renderItem?: (option: O) => ReactNode;
  showRowValue?: boolean;
  loading?: boolean;
  disabled?: boolean;
  selectCls?: string;
}

// 提取 Select 组件额外支持的属性
type SelectRootProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;
type SelectExtraProps = Omit<SelectRootProps, 'value' | 'onValueChange' | 'disabled'>;

export function FormSelect<T extends FieldValues, O extends BaseOption = BaseOption>({
  options,
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  renderItem,
  showRowValue = true,
  loading = false,
  disabled = false,
  selectCls,
  ...props
}: FormSelectProps<T, O> & SelectExtraProps) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <div
            className={cn(
              'text-foreground text-sm',
              verticalLabel ? '' : 'flex items-center',
              className,
            )}
          >
            {label && (
              <FormLabel className={cn(verticalLabel ? 'mb-2' : 'shrink-0 basis-3/12')}>
                {label}
              </FormLabel>
            )}
            <FormControl
              className={cn('grow-0', verticalLabel || !label ? 'basis-full' : 'basis-9/12')}
            >
              {loading ? (
                <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
              ) : (
                <RrhSelect<O>
                  options={options}
                  value={field.value?.toString()}
                  onValueChange={field.onChange}
                  className={cn('w-full', selectCls)}
                  placeholder={placeholder}
                  renderItem={renderItem}
                  showRowValue={showRowValue}
                  disabled={disabled}
                  {...props}
                />
              )}
            </FormControl>
          </div>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
