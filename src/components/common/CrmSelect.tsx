import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC, PropsWithChildren } from 'react';

export const CrmSelect: FC<
  PropsWithChildren<{
    options: { label: string; value: string | number }[];
    onValueChange?: (value: string) => void;
    value?: string;
    placeholder?: string;
    className?: string;
    showRowValue?: boolean;
  }>
> = ({ options, value, onValueChange, placeholder, showRowValue = true, className }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        {showRowValue ? (
          <div className="truncate text-sm">{value || placeholder}</div>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value.toString()}>
            <div>{option.label}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
