import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { RrhButton } from './RrhButton';

export type BaseOption = { label: string; value: string | number };
export const RrhMultiSelect = <T extends BaseOption>({
  options,
  value = [],
  onValueChange,
  placeholder = 'Select items',
  className,
  renderItem,
  searchSupport = false,
  showRowValue = true,
}: {
  options: T[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  renderItem?: (option: T) => ReactNode;
  searchSupport?: boolean;
  showRowValue?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const selectedOptions = options.filter(option => value.includes(option.value.toString()));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>();
  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  const handleSelect = (optionValue: string) => {
    if (!onValueChange) return;

    const isSelected = value.includes(optionValue);
    if (isSelected) {
      onValueChange(value.filter(v => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  };

  const handleRemove = (event: React.MouseEvent<HTMLDivElement>, optionValue: string) => {
    event.stopPropagation();
    if (!onValueChange) return;
    onValueChange(value.filter(v => v !== optionValue));
  };

  return (
    // set modal to true to make the scroll work on Drawer
    <Popover open={open} modal={true} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <RrhButton
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('!h-auto min-h-9 w-full justify-between text-start font-normal', className)}
        >
          {showRowValue ? (
            <div className="flex flex-wrap gap-1 truncate">
              {selectedOptions.length > 0 ? (
                selectedOptions.map(option => (
                  <span
                    key={option.value}
                    className="bg-secondary text-secondary-foreground mr-1 inline-flex items-center rounded-md px-1 py-0 text-xs"
                  >
                    {option.label}
                    <div
                      className="text-muted-foreground hover:text-foreground ml-1 h-auto cursor-pointer border-none p-0 hover:bg-transparent"
                      onClick={e => handleRemove(e, option.value.toString())}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {option.label}</span>
                    </div>
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
          ) : (
            <span className="truncate text-sm">
              {selectedOptions.length > 0
                ? selectedOptions.map(o => o.label).join(', ')
                : placeholder}
            </span>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </RrhButton>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={triggerWidth ? { width: triggerWidth } : undefined}
        align="start"
        sideOffset={4}
      >
        <Command className="overflow-hidden">
          {searchSupport && <CommandInput placeholder={placeholder} />}
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup className="scrollbar-thin max-h-60 overflow-y-auto">
            {options.map(option => (
              <CommandItem
                key={option.value}
                value={option.value.toString()}
                onSelect={handleSelect}
                className={cn('cursor-pointer hover:bg-slate-100', {
                  'bg-slate-100': value.includes(option.value.toString()),
                })}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value.includes(option.value.toString()) ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {renderItem ? renderItem(option) : option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
