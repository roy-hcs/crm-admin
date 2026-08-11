import { useCrmFormContext } from '@/contexts/form';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseOption, RrhMultiSelect } from '../common/RrhMultiSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

type FetchParams = {
  pageNum: number;
  pageSize: number;
  keyword: string;
};

type FetchItem = {
  label: string | null;
  value: string | number | null;
};

type FetchResult = {
  list: FetchItem[];
  total?: number;
  hasMore?: boolean;
};

interface FormSearchSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  fetchOptions: (params: FetchParams) => Promise<FetchResult>;
  showRowValue?: boolean;
  initialOptions?: BaseOption[];
  disabled?: boolean;
}

export function FormSearchSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder = '',
  pageSize = 10,
  showRowValue = false,
  initialOptions = [],
  fetchOptions,
  disabled = false,
}: FormSearchSelectProps<T>) {
  const { form } = useCrmFormContext<T>();
  const [keyword, setKeyword] = useState('');
  const [options, setOptions] = useState<BaseOption[]>(initialOptions);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const normalizedKeyword = useMemo(() => keyword.trim(), [keyword]);

  const mergeUniqueOptions = useCallback((base: BaseOption[], incoming: BaseOption[]) => {
    const map = new Map<string, BaseOption>();
    base.forEach(item => map.set(item.value.toString(), item));
    incoming.forEach(item => map.set(item.value.toString(), item));
    return [...map.values()];
  }, []);

  useEffect(() => {
    setOptions(prev => mergeUniqueOptions(prev, initialOptions));
  }, [initialOptions, mergeUniqueOptions]);

  const loadOptions = useCallback(
    async (params: FetchParams, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const res = await fetchOptions(params);
        const list = (res.list || [])
          .filter(item => item.value !== null && item.label !== null)
          .map(item => ({
            value: item.value as string | number,
            label: item.label as string,
          }));

        setOptions(prev => (append ? mergeUniqueOptions(prev, list) : list));

        if (typeof res.hasMore === 'boolean') {
          setHasMore(res.hasMore);
        } else {
          setHasMore(list.length >= params.pageSize);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchOptions, mergeUniqueOptions],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageNum(1);
      loadOptions(
        {
          pageNum: 1,
          pageSize,
          keyword: normalizedKeyword,
        },
        false,
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [normalizedKeyword, pageSize, loadOptions]);

  const handleLoadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    const nextPage = pageNum + 1;
    setPageNum(nextPage);
    loadOptions(
      {
        pageNum: nextPage,
        pageSize,
        keyword: normalizedKeyword,
      },
      true,
    );
  };

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem
          className={cn(
            'text-foreground text-sm',
            verticalLabel ? '' : 'flex items-center',
            className,
          )}
        >
          {label && (
            <FormLabel className={cn(verticalLabel ? '' : 'basis-3/12')}>{label}</FormLabel>
          )}

          <FormControl className={cn('grow-0', verticalLabel ? 'w-full' : 'basis-9/12')}>
            <RrhMultiSelect<BaseOption>
              options={options}
              value={field.value ? [String(field.value)] : []}
              onValueChange={(value, option, operator) => {
                if (operator === 'add' && option) {
                  field.onChange(option);
                  return;
                }

                field.onChange(value.length ? value[value.length - 1] : '');
              }}
              className="w-full"
              placeholder={placeholder}
              showRowValue={showRowValue}
              searchSupport
              searchValue={keyword}
              searchPlaceholder={searchPlaceholder}
              onSearchChange={setKeyword}
              loadingMore={loadingMore || loading}
              hasMore={hasMore}
              onDropdownReachEnd={handleLoadMore}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
