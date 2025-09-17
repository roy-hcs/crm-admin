import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CascaderOption {
  value: string;
  label: string;
  isLeaf?: boolean;
  children?: CascaderOption[];
  loading?: boolean;
}

interface CascaderProps {
  options: CascaderOption[];
  loadData?: (selectedOptions: CascaderOption[]) => Promise<void>;
  onChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
  placeholder?: string;
  notFoundContent?: React.ReactNode;
  displayRender?: (labels: string[]) => React.ReactNode;
  changeOnSelect?: boolean;
  className?: string;
}

export const RrhCascader: React.FC<CascaderProps> = ({
  options,
  loadData,
  onChange,
  notFoundContent,
  changeOnSelect = false,
  className,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<CascaderOption[]>([]);
  const [menus, setMenus] = useState<CascaderOption[][]>([options]);

  // 根据当前选择的值更新菜单
  useEffect(() => {
    const newMenus: CascaderOption[][] = [options];
    let currentOptions = options;

    for (let i = 0; i < selectedValues.length; i++) {
      const value = selectedValues[i];
      const option = currentOptions.find(opt => opt.value === value);

      if (option && option.children) {
        newMenus.push(option.children);
        currentOptions = option.children;
      } else {
        break;
      }
    }

    setMenus(newMenus);
  }, [options, selectedValues]);

  // 处理选择选项
  const handleSelect = useCallback(
    (option: CascaderOption, menuIndex: number) => {
      const newSelectedValues = selectedValues.slice(0, menuIndex);
      const newSelectedOptions = selectedOptions.slice(0, menuIndex);

      newSelectedValues[menuIndex] = option.value;
      newSelectedOptions[menuIndex] = option;

      setSelectedValues(newSelectedValues);
      setSelectedOptions(newSelectedOptions);

      if (option.children && option.children.length > 0) {
        setSelectedValues(newSelectedValues);
        setSelectedOptions(newSelectedOptions);

        if (changeOnSelect) {
          onChange?.(newSelectedValues, newSelectedOptions);
        }

        const newMenus = menus.slice(0, menuIndex + 1);
        newMenus[menuIndex + 1] = option.children;
        setMenus(newMenus);
      } else if (option.isLeaf !== false) {
        setSelectedValues(newSelectedValues);
        setSelectedOptions(newSelectedOptions);
        onChange?.(newSelectedValues, newSelectedOptions);
      } else if (loadData && !option.loading) {
        option.loading = true;
        const newMenus = menus.slice(0, menuIndex + 1);
        newMenus[menuIndex + 1] = [{ value: 'loading', label: 'Loading...', isLeaf: true }];
        setMenus(newMenus);

        loadData([...newSelectedOptions, option]).then(() => {
          if (option.children && option.children.length > 0) {
            const updatedMenus = menus.slice(0, menuIndex + 1);
            updatedMenus[menuIndex + 1] = option.children;
            setMenus(updatedMenus);
          }
        });
      } else {
        onChange?.(newSelectedValues, newSelectedOptions);
      }
    },
    [selectedValues, selectedOptions, menus, changeOnSelect, loadData, onChange],
  );

  return (
    <div className={cn('relative', className)}>
      <div className="bg-popover text-popover-foreground absolute z-50 mt-1 min-w-50 rounded-md border shadow-md">
        <div className="scrollbar-thin flex max-h-64 max-w-[calc(50vw-48px)] overflow-x-auto overflow-y-hidden">
          {menus.map((menu, index) => (
            <MenuPanel
              key={index}
              options={menu}
              selectedValue={selectedValues[index]}
              onSelect={option => handleSelect(option, index)}
              notFoundContent={notFoundContent}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface MenuPanelProps {
  options: CascaderOption[];
  selectedValue?: string;
  onSelect: (option: CascaderOption) => void;
  notFoundContent: React.ReactNode;
}

const MenuPanel: React.FC<MenuPanelProps> = ({
  options,
  selectedValue,
  onSelect,
  notFoundContent,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOptions = options.filter(
    option =>
      option.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  return (
    <div className="border-r last:border-r-0">
      <div className="p-2">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border-input focus:ring-ring w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus:ring-1 focus:outline-none"
        />
      </div>
      <Command className="bg-background min-w-50">
        <CommandList ref={parentRef} className="scrollbar-thin max-h-64 overflow-auto">
          {filteredOptions.length === 0 ? (
            <CommandEmpty>{notFoundContent}</CommandEmpty>
          ) : (
            <CommandGroup>
              <div
                className="relative w-full"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                }}
              >
                {rowVirtualizer.getVirtualItems().map(virtualItem => {
                  const option = filteredOptions[virtualItem.index];

                  return (
                    <div
                      key={option.value}
                      className="absolute top-0 left-0 w-full"
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <CommandItem
                        value={option.value}
                        onSelect={() => onSelect(option)}
                        className={cn(
                          'flex cursor-pointer justify-between',
                          selectedValue === option.value ? 'bg-slate-100' : '',
                        )}
                      >
                        <span>{option.label}</span>
                        <div className="flex items-center">
                          {option.loading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>{option.isLeaf === false && <ChevronRight className="h-3 w-3" />}</>
                          )}
                        </div>
                      </CommandItem>
                    </div>
                  );
                })}
              </div>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};
