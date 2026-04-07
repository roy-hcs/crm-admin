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
import { toast } from 'sonner';

export type BaseOption = { label: string; value: string | number };
export type ValidationResult = { valid: boolean; message?: string };
export const RrhMultiSelect = <T extends BaseOption>({
  options,
  value = [],
  onValueChange,
  placeholder = 'Select items',
  className,
  renderItem,
  searchSupport = false,
  showRowValue = true,
  maxSelections,
  maxSelectionsMessage,
  onMaxSelectionsReached,
  onBeforeValueChange,
}: {
  options: T[];
  value?: string[];
  onValueChange?: (value: string[], option?: string, operator?: 'add' | 'remove') => void;
  placeholder?: string;
  className?: string;
  renderItem?: (option: T) => ReactNode;
  searchSupport?: boolean;
  showRowValue?: boolean;
  maxSelections?: number;
  maxSelectionsMessage?: string;
  onMaxSelectionsReached?: (max: number) => void;
  onBeforeValueChange?: (
    newValue: string[],
    option: string,
    operator: 'add' | 'remove',
    currentValue: string[],
  ) => ValidationResult;
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
    const operator = isSelected ? 'remove' : 'add';
    const newValue = isSelected ? value.filter(v => v !== optionValue) : [...value, optionValue];

    // 1. 先执行 onBeforeValueChange 钩子（业务验证）
    if (onBeforeValueChange) {
      const result = onBeforeValueChange(newValue, optionValue, operator, value);

      // 如果验证失败，显示错误消息并阻止操作
      if (!result.valid) {
        if (result.message) {
          toast.error(result.message);
        }
        return;
      }
    }

    // 2. 如果是添加操作，检查是否达到最大选择数量
    if (!isSelected && maxSelections && value.length >= maxSelections) {
      // 优先使用自定义回调
      if (onMaxSelectionsReached) {
        onMaxSelectionsReached(maxSelections);
      }
      // 否则使用提供的消息显示 toast
      else if (maxSelectionsMessage) {
        toast.error(maxSelectionsMessage);
      }
      // 提供默认提示
      else {
        toast.error(`Maximum ${maxSelections} selections allowed`);
      }
      return;
    }

    // 3. 所有验证通过，执行实际的值变更
    onValueChange(newValue, optionValue, operator);
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
          className={cn(
            '!h-auto min-h-9 w-full justify-between text-start font-normal',
            selectedOptions.length > 0 ? 'hover:bg-transparent' : '',
            className,
          )}
        >
          {showRowValue ? (
            <div className="flex flex-wrap gap-1 truncate">
              {selectedOptions.length > 0 ? (
                selectedOptions.map(option => (
                  <div
                    key={option.value}
                    className="bg-secondary text-secondary-foreground mr-1 inline-flex items-center rounded-md px-1 py-0 text-xs"
                  >
                    {renderItem ? renderItem(option) : option.label}
                    <div
                      className="text-muted-foreground hover:text-foreground ml-1 h-auto cursor-pointer border-none p-0 hover:bg-transparent"
                      onClick={e => handleRemove(e, option.value.toString())}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {option.label}</span>
                    </div>
                  </div>
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
