import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type BaseOption = { label: string; value: string | number };
export const RrhSelect = <T extends BaseOption>({
  options,
  value,
  onValueChange,
  placeholder,
  showRowValue = true,
  showI18nLabel = false,
  className,
  renderItem,
}: {
  options: T[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  showRowValue?: boolean;
  showI18nLabel?: boolean;
  renderItem?: (option: T) => ReactNode;
}) => {
  const { t } = useTranslation();
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn('bg-background', className)}>
        {showRowValue ? (
          <div className="truncate text-sm">{value || placeholder}</div>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent className="bg-background">
        {options.map(option => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {renderItem ? (
              renderItem(option)
            ) : (
              <div>{showI18nLabel ? t(option.label) : option.label}</div>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
