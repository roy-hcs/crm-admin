import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { Calendar as CalenderIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';

export const RrhRangeInput = ({
  name,
  disabled,
  placeholder = '',
  from,
  to,
  onChange,
  className,
}: {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  from?: Date;
  to?: Date;
  onChange?: (value: DateRange) => void;
  className?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={name}
          variant={'outline'}
          className={cn(
            'line-clamp-1 w-full justify-start text-left font-normal text-ellipsis',
            className,
          )}
          disabled={disabled}
          type="button"
        >
          {from ? (
            to ? (
              <>
                {format(from, 'yyyy-MM-dd')} - {format(to, 'yyyy-MM-dd')}
              </>
            ) : (
              format(from, 'yyyy-MM-dd')
            )
          ) : (
            <div className="relative">
              <span>{placeholder}</span>
              <CalenderIcon className="absolute top-1/2 -right-2 -translate-1/2" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-background w-auto p-0" align="start">
        <Calendar
          required={true}
          mode="range"
          defaultMonth={from}
          selected={{ from, to } as DateRange}
          onSelect={onChange}
          numberOfMonths={2}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};
