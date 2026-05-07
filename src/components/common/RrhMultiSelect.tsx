import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RrhButton } from './RrhButton';
import { useTranslation } from 'react-i18next';
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
  searchValue,
  searchPlaceholder = '',
  onSearchChange,
  showRowValue = true,
  onDropdownReachEnd,
  loadingMore = false,
  hasMore = false,
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
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  showRowValue?: boolean;
  onDropdownReachEnd?: () => void;
  loadingMore?: boolean;
  hasMore?: boolean;
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
  const { t } = useTranslation();
  const selectedOptions = options.filter(option => value.includes(option.value.toString()));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingMoreRef = useRef(loadingMore);
  const hasMoreRef = useRef(hasMore);
  const onDropdownReachEndRef = useRef(onDropdownReachEnd);
  onDropdownReachEndRef.current = onDropdownReachEnd;
  const [triggerWidth, setTriggerWidth] = useState<number>();
  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
    hasMoreRef.current = hasMore;
  }, [loadingMore, hasMore]);

  // Command 用了radix的Portal（modal={true}），核心是radix-ui/react-presence，Portal内的元素会等到打开时才挂载，这时 useEffect 已经错过了时机，导致监听不到 sentinel 元素。这个问题不止出现在Command中，其他使用了Portal的组件也会有类似问题。
  // 使用useCallback能生效是因为portals的元素在打开时才挂载，useCallback的返回函数会在元素挂载时被调用，从而正确地设置IntersectionObserver。
  // useCallback也是合法的ref回调写法，React会在元素挂载时调用它，并传入元素节点；在元素卸载时调用它，并传入null。这种方式比useEffect更适合处理需要直接访问DOM节点的情况，尤其是在涉及到第三方库或复杂组件结构时。
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node || !onDropdownReachEndRef.current) return;
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMoreRef.current && hasMoreRef.current) {
          onDropdownReachEndRef.current?.();
        }
      },
      { threshold: 0 },
    );
    observerRef.current.observe(node);
  }, []);

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
            '!h-auto min-h-9 w-full justify-between text-start font-normal whitespace-normal',
            selectedOptions.length > 0 ? 'hover:bg-transparent' : '',
            className,
          )}
        >
          {showRowValue ? (
            <div className="flex min-w-0 flex-wrap gap-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map(option => (
                  <div
                    key={option.value}
                    className="bg-secondary text-secondary-foreground mr-1 inline-flex items-center rounded-md px-1 py-0 text-xs"
                  >
                    {renderItem ? renderItem(option) : option.label}
                    <div
                      className="text-muted-foreground hover:text-foreground ml-1 h-auto cursor-pointer border-none p-0.5 hover:bg-transparent"
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
            <span className="min-w-0 text-sm break-words whitespace-normal">
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
        <Command className="overflow-hidden" shouldFilter={onSearchChange ? false : undefined}>
          {searchSupport && (
            <CommandInput
              value={searchValue}
              onValueChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          )}
          <CommandEmpty>{t('common.NoData')}</CommandEmpty>
          <CommandList className="scrollbar-thin max-h-60 overflow-y-auto">
            <CommandGroup>
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
            {loadingMore && (
              <div className="text-muted-foreground px-2 py-1 text-xs">{t('common.loading')}</div>
            )}
            <div ref={sentinelRef} className="h-px" />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
