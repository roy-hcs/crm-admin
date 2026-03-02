import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { Calendar as CalenderIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';

export const RrhDateInput = ({
  name,
  disabled,
  placeholder = '',
  date,
  onChange,
  className,
  showTime,
}: {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  date?: Date;
  onChange?: (value: Date) => void;
  className?: string;
  /** 是否展示时分秒选择 */
  showTime?: boolean;
}) => {
  const displayFormat = showTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';

  const timeString = date ? format(date, 'HH:mm:ss') : '';

  const handleDateSelect = (selectedDate?: Date) => {
    if (!onChange) return;

    // 取消选择
    if (!selectedDate) {
      onChange(selectedDate as unknown as Date);
      return;
    }

    // 只选日期，或者还没有已有时间，直接返回选中的日期
    if (!showTime || !date) {
      onChange(selectedDate);
      return;
    }

    // 保留原来的时分秒，只更新年月日
    const next = new Date(selectedDate);
    next.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), 0);
    onChange(next);
  };

  const handleTimeChange = (value: string) => {
    if (!onChange) return;

    if (!value) {
      if (!date) return;
      const next = new Date(date);
      next.setHours(0, 0, 0, 0);
      onChange(next);
      return;
    }

    const [hoursStr, minutesStr, secondsStr] = value.split(':');
    const hours = Number(hoursStr) || 0;
    const minutes = Number(minutesStr) || 0;
    const seconds = Number(secondsStr) || 0;

    const base = date ? new Date(date) : new Date();
    base.setHours(hours, minutes, seconds, 0);
    onChange(base);
  };
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
          {date ? (
            format(date, displayFormat)
          ) : (
            <div className="relative">
              <span>{placeholder}</span>
              <CalenderIcon className="absolute top-1/2 -right-2 -translate-1/2" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-background w-auto p-0" align="start">
        <div className="flex flex-col gap-2 p-2">
          <Calendar
            required={true}
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabled}
          />
          {showTime && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-muted-foreground text-sm whitespace-nowrap">时间</span>
              <Input
                type="time"
                step={1}
                value={timeString}
                onChange={e => handleTimeChange(e.target.value)}
                disabled={disabled}
                className="h-8 w-[140px]"
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
