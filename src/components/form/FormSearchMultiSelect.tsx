import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseOption } from '@/components/common/RrhMultiSelect';
import { FormMultiSelect } from './FormMultiSelect';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

interface FormSearchMultiSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  verticalLabel?: boolean;
  className?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  fetchOptions: (params: FetchParams) => Promise<FetchResult>;
}

export function FormSearchMultiSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  verticalLabel = false,
  className,
  searchPlaceholder = '',
  pageSize = 10,
  fetchOptions,
}: FormSearchMultiSelectProps<T>) {
  const [keyword, setKeyword] = useState('');
  const [options, setOptions] = useState<BaseOption[]>([]);
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
          // Fallback: assume there is more when current page is full.
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
    <FormMultiSelect<T, BaseOption>
      name={name}
      label={label}
      options={options}
      placeholder={placeholder}
      verticalLabel={verticalLabel}
      className={className}
      showRowValue={false}
      searchSupport
      searchValue={keyword}
      searchPlaceholder={searchPlaceholder}
      onSearchChange={setKeyword}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onDropdownReachEnd={handleLoadMore}
    />
  );
}
