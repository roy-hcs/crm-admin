import { useState } from 'react';
import { RrhSelect } from '../common/RrhSelect';
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import mobileZone from '@/data/mzone.json';
import { FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useCrmFormContext } from '@/contexts/form';
import { ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';

interface FormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  className?: string;
}
export function FormPhoneInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  className,
}: FormInputProps<T>) {
  const [mzone, setMzone] = useState('+86-0');
  const mobileZoneOptions = mobileZone.mzone.map((item, index) => {
    return {
      label: `${item.area} ${item.code}`,
      // shadcn use value as key internally, to ensure unique values, append the index
      value: `+${item.code}-${index}`,
    };
  });
  const { form } = useCrmFormContext<T>();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className={cn('flex items-center text-sm', className)}>
            <FormLabel className="basis-3/12 text-[#757F8D]">{label}</FormLabel>
            <div className="flex basis-9/12 items-center">
              <div className="relative basis-3/12">
                <div className="flex h-9 flex-nowrap items-center gap-1 rounded-l-lg border px-1">
                  <span>{mzone.replace(/-.*/, '')}</span>
                  <ChevronDown className="size-3.5" />
                </div>
                <RrhSelect
                  options={mobileZoneOptions}
                  value={mzone}
                  showRowValue={true}
                  onValueChange={setMzone}
                  className="absolute inset-0 basis-3/12 cursor-pointer opacity-0"
                />
              </div>
              <Input
                type="text"
                {...field}
                placeholder={placeholder}
                className="h-9 w-full basis-9/12 rounded-l-none border-y border-r border-l-0 px-2 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <FormMessage className="basis-9/12" />
          </div>
        </FormItem>
      )}
    />
  );
}
