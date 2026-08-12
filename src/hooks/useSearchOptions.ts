import { BaseOption } from '@/components/common/RrhMultiSelect';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type SearchFetchParams = {
  pageNum: number;
  pageSize: number;
  keyword: string;
};

export type SearchFetchItem = {
  label: string | null;
  value: string | number | null;
};

export type SearchFetchResult = {
  list: SearchFetchItem[];
  total?: number;
  hasMore?: boolean;
};

interface UseSearchOptionsParams {
  pageSize: number;
  initialOptions?: BaseOption[];
  fetchOptions: (params: SearchFetchParams) => Promise<SearchFetchResult>;
  debounceMs?: number;
}

export function useSearchOptions({
  pageSize,
  initialOptions = [],
  fetchOptions,
  debounceMs = 300,
}: UseSearchOptionsParams) {
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
    async (params: SearchFetchParams, append: boolean) => {
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
      } catch (error) {
        console.error('useSearchOptions loadOptions error:', error);
        if (!append) {
          setOptions([]);
        }
        setHasMore(false);
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
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [debounceMs, normalizedKeyword, pageSize, loadOptions]);

  const handleLoadMore = useCallback(() => {
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
  }, [hasMore, loadOptions, loading, loadingMore, normalizedKeyword, pageNum, pageSize]);

  return {
    keyword,
    setKeyword,
    options,
    hasMore,
    loading,
    loadingMore,
    handleLoadMore,
  };
}
