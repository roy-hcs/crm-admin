import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type CountryCodeProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

const countries = [
  { code: 'US', dial_code: '+1' },
  { code: 'GB', dial_code: '+44' },
  { code: 'IN', dial_code: '+91' },
  { code: 'DE', dial_code: '+49' },
  { code: 'FR', dial_code: '+33' },
  { code: 'ES', dial_code: '+34' },
  { code: 'IT', dial_code: '+39' },
  { code: 'JP', dial_code: '+81' },
  { code: 'CN', dial_code: '+86' },
  { code: 'AU', dial_code: '+61' },
  { code: 'BR', dial_code: '+55' },
  { code: 'RU', dial_code: '+7' },
];

export const CountryCode: React.FC<CountryCodeProps> = ({
  value,
  onValueChange,
  disabled = false,
  className,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn('w-[85px]', className)}>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {countries.map(country => (
          <SelectItem key={country.code} value={country.dial_code}>
            <div className="flex items-center gap-2">
              <span>{country.dial_code}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
