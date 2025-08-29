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
  placeholder,
  notFoundContent,
  displayRender,
  changeOnSelect = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
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
        setOpen(false);
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
        setOpen(false);
      }
    },
    [selectedValues, selectedOptions, menus, changeOnSelect, loadData, onChange],
  );

  const renderDisplayText = useCallback(() => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    const labels = selectedOptions.map(opt => opt.label);

    if (displayRender) {
      return displayRender(labels);
    }

    return labels.join(' / ');
  }, [selectedOptions, displayRender, placeholder]);

  return (
    <div className={`relative ${className}`}>
      <div
        className="border-input focus-visible:ring-ring flex h-9 w-full cursor-pointer items-center rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {renderDisplayText()}
        </span>
      </div>

      {open && (
        <div className="bg-popover text-popover-foreground absolute z-50 mt-1 min-w-[200px] rounded-md border shadow-md">
          <div className="flex max-h-64 overflow-hidden">
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
      )}
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

  const rowVirtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  return (
    <div className="border-r last:border-r-0">
      <Command className="w-[200px]">
        <CommandList ref={parentRef} className="max-h-64 overflow-auto">
          {options.length === 0 ? (
            <CommandEmpty>{notFoundContent}</CommandEmpty>
          ) : (
            <CommandGroup>
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map(virtualItem => {
                  const option = options[virtualItem.index];

                  return (
                    <div
                      key={option.value}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <CommandItem
                        value={option.value}
                        onSelect={() => onSelect(option)}
                        className={`flex justify-between ${selectedValue === option.value ? 'bg-accent' : ''}`}
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
