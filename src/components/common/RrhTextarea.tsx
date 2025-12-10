import { forwardRef, useState, useEffect } from 'react';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

export const RrhTextarea = forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, maxLength, value, onChange, ...props }, ref) => {
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length);
      } else if (value === undefined || value === null) {
        setCharCount(0);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      if (maxLength && newValue.length > maxLength) {
        e.target.value = newValue.substring(0, maxLength);
        setCharCount(maxLength);
      } else {
        setCharCount(newValue.length);
      }

      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <Textarea
          className={cn('w-full', className)}
          placeholder="请输入"
          rows={4}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {!!maxLength && (
          <div className="text-muted-foreground bg-background/80 absolute right-2 bottom-2 rounded px-1 text-xs">
            <span className={cn(charCount >= maxLength && 'text-destructive font-medium')}>
              {charCount}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  },
);

RrhTextarea.displayName = 'RrhTextarea';
