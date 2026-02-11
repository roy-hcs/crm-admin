import { RrhSelect } from '../common/RrhSelect';
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useCrmFormContext } from '@/contexts/form';
import { ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';

interface FormLeftSelectInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  typeValue: FieldPath<T>;
  options: { label: string; value: string | number }[];
  label: string;
  placeholder: string;
  className?: string;
  verticalLabel?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}
/**
 * 如果需要在输入框左侧展示一个选择框，可以使用这个组件。选择框的值由typeValue控制，输入框的值由name控制。
 * 选择框的选项通过options传入，label是输入框的标签，placeholder是输入框的占位文本。
 * 当选择框的值发生变化时，会调用form.setValue更新typeValue对应的值。当输入框失去焦点时，会调用onBlur回调。
 * 这个组件适用于需要在输入框左侧展示一个选择框，并且选择框的值会影响输入框的行为或内容的场景。
 */
export function FormLeftSelectInput<T extends FieldValues>({
  name,
  typeValue,
  options,
  label,
  placeholder,
  verticalLabel = false,
  className,
  onBlur,
}: FormLeftSelectInputProps<T>) {
  const { form } = useCrmFormContext<T>();
  const val = form.watch(typeValue) as string;
  const valText = options.find(i => String(i.value) === val)?.label || val;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div
            className={cn(
              'text-foreground text-sm',
              verticalLabel ? '' : 'flex items-center',
              className,
            )}
          >
            <FormLabel className={cn(verticalLabel ? 'mb-2' : 'basis-3/12')}>{label}</FormLabel>
            <div
              className={cn(
                'flex items-center',
                verticalLabel ? 'w-full basis-full' : 'basis-9/12',
              )}
            >
              <div className="relative basis-3/12">
                <div className="flex h-9 flex-nowrap items-center justify-center gap-1 rounded-l-lg border-y border-r-0 border-l px-1">
                  <span>{valText}</span>
                  <ChevronDown className="size-3.5" />
                </div>
                <RrhSelect
                  options={options}
                  value={val}
                  showRowValue={true}
                  onValueChange={value =>
                    form.setValue(typeValue, value as PathValue<T, typeof typeValue>)
                  }
                  className="absolute inset-0 basis-3/12 cursor-pointer opacity-0"
                />
              </div>
              <Input
                type="text"
                {...field}
                placeholder={placeholder}
                className="h-9 w-full basis-9/12 rounded-l-none border-y border-r border-l-0 px-2 text-sm"
                onBlur={e => {
                  field.onBlur();
                  onBlur?.(e);
                }}
              />
            </div>
          </div>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
