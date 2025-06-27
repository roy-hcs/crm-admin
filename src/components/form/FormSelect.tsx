import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC, PropsWithChildren } from 'react';

export const FormSelect: FC<
  PropsWithChildren<{
    options: { label: string; value: string | number }[];
    onValueChange?: (value: string) => void;
    value?: string;
    placeholder?: string;
    className?: string;
  }>
> = ({ options, value, onValueChange, placeholder, className }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
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
