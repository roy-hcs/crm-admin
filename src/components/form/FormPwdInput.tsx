import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface FormPwdInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  placeholder: string;
  className?: string;
  verticalLabel?: boolean;
  inputCls?: string;
  labeTipsDom?: React.ReactNode;
}

export function FormPwdInput<T extends FieldValues>({
  name,
  label,
  verticalLabel = true,
  placeholder,
  className,
  onBlur,
  inputCls,
  labeTipsDom,
  ...props
}: FormPwdInputProps<T> & React.ComponentPropsWithoutRef<'input'>) {
  const { form } = useCrmFormContext<T>();
  const [showPwd, setShowPwd] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
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
              <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12')}>{label}</FormLabel>
              {labeTipsDom && <div>{labeTipsDom}</div>}
            </div>
          )}
          <FormControl className="shrink-0 basis-9/12">
            <div className="relative">
              <Input
                type={showPwd ? 'text' : 'password'}
                {...props}
                {...field}
                className={cn('h-10 w-full border px-2 pr-10', inputCls)}
                placeholder={placeholder}
                onBlur={e => {
                  field.onBlur();
                  onBlur?.(e);
                }}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPwd(prev => !prev)}
              >
                {showPwd ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
              </button>
            </div>
          </FormControl>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
}
