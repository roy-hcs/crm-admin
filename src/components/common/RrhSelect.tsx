import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReactNode } from 'react';

export type BaseOption = { label: string; value: string | number };
export const RrhSelect = <T extends BaseOption>({
  options,
  value,
  onValueChange,
  placeholder,
  showRowValue = true,
  className,
  renderItem,
}: {
  options: T[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  showRowValue?: boolean;
  renderItem?: (option: T) => ReactNode;
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        {showRowValue ? (
          <div className="truncate text-sm">{value || placeholder}</div>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent className="bg-background">
        {options.map(option => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {renderItem ? renderItem(option) : <div>{option.label}</div>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
