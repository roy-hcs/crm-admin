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
  labeTipsDom?: React.ReactNode;
  displayValue?: string;
}

// 提取 Select 组件额外支持的属性
type SelectRootProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;
type SelectExtraProps = Omit<SelectRootProps, 'value' | 'onValueChange' | 'disabled'>;

export function FormSelect<T extends FieldValues, O extends BaseOption = BaseOption>({
  options,
  name,
  label,
  placeholder,
  verticalLabel = true,
  className,
  renderItem,
  showRowValue = true,
  loading = false,
  disabled = false,
  selectCls,
  labeTipsDom,
  ...props
}: FormSelectProps<T, O> & SelectExtraProps) {
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => {
        const fieldValue = field.value == null ? '' : String(field.value);
        const normalizedValue = fieldValue === '' ? undefined : fieldValue;

        const handleValueChange = (nextValue: string) => {
          // 防止底层 Select 在重渲染时把已有值回写为空字符串。
          if (!nextValue && fieldValue) return;
          field.onChange(nextValue);
        };

        return (
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
              {loading ? (
                <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
              ) : (
                <RrhSelect<O>
                  options={options}
                  value={normalizedValue}
                  onValueChange={handleValueChange}
                  className={cn(
                    'w-full',
                    disabled &&
                      'data-[disabled]:bg-muted data-[disabled]:text-muted-foreground data-[disabled]:border-muted-foreground/20 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-100',
                    selectCls,
                  )}
                  placeholder={placeholder}
                  displayValue={props.displayValue}
                  renderItem={renderItem}
                  showRowValue={showRowValue}
                  disabled={disabled}
                  {...props}
                />
              )}
            </FormControl>
            <FormMessage className="text-end" />
          </FormItem>
        );
      }}
    />
  );
}
