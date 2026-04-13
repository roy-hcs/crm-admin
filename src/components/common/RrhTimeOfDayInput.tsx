import { Input } from '@/components/ui/input';
import { cn, normalizeTimeByPrecision, TimePrecision } from '@/lib/utils';
import { Clock3 } from 'lucide-react';
import { useRef } from 'react';

export const RrhTimeOfDayInput = ({
  name,
  value,
  onChange,
  disabled,
  className,
  precision = 'second',
}: {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  precision?: TimePrecision;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (disabled) return;
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
  };

  return (
    <div className="relative w-full" onClick={openPicker}>
      <Input
        ref={inputRef}
        id={name}
        type="time"
        step={precision === 'second' ? 1 : 60}
        value={normalizeTimeByPrecision(value || '', precision)}
        onChange={e => onChange?.(normalizeTimeByPrecision(e.target.value, precision))}
        disabled={disabled}
        className={cn('h-10 w-full cursor-pointer pr-10', className)}
      />
      <button
        type="button"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          openPicker();
        }}
        disabled={disabled}
        className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex w-10 items-center justify-center"
        aria-label="Open time picker"
      >
        <Clock3 className="size-4" />
      </button>
    </div>
  );
};
