import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import {} from '@base-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface RrhSearchSelectProps<TParams, TItem> {
  fetchFunction: (params: TParams) => Promise<{
    rows: TItem[];
    total: string | number;
  }>;
  params: TParams;
  mapOption: (item: TItem) => { value: string; label: string };
  getNextParams?: (prevParams: TParams, lastItem: TItem) => TParams | null;
  buildSearchParams?: (baseParams: TParams, keyword: string) => TParams;
  onSelect?: (option: { value: string; label: string }) => void;
  value?: string;
  displayLabel?: string;
  lazy?: boolean;
  disabled?: boolean;
}

export function RrhSearchSelect<TParams, TItem>(props: RrhSearchSelectProps<TParams, TItem>) {
  const {
    fetchFunction,
    params,
    mapOption,
    getNextParams,
    buildSearchParams,
    onSelect,
    value,
    displayLabel,
    lazy = false,
    disabled = false,
  } = props;
  const { t } = useTranslation();
  const [itemsData, setItemsData] = useState<TItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState(params);
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [queryText, setQueryText] = useState('');
  const [debouncedQueryText, setDebouncedQueryText] = useState('');

  useEffect(() => {
    if (value === '' || value === undefined) {
      setInputText('');
    }
  }, [value]);

  const getNextParamsRef = useRef(getNextParams);
  const buildSearchParamsRef = useRef(buildSearchParams);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<() => Promise<void>>(async () => {});
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getNextParamsRef.current = getNextParams;
  }, [getNextParams]);

  useEffect(() => {
    buildSearchParamsRef.current = buildSearchParams;
  }, [buildSearchParams]);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const options = useMemo(() => {
    return itemsData.map(mapOption).filter(item => item.value !== '');
  }, [itemsData, mapOption]);

  useEffect(() => {
    if (value === '' || value === undefined) {
      return;
    }

    if (displayLabel) {
      setInputText(displayLabel);
      return;
    }

    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      setInputText(selectedOption.label);
    }
  }, [value, displayLabel, options]);

  const isSearchPending = queryText.trim() !== debouncedQueryText.trim();

  const deriveNextParams = useCallback((prevParams: TParams, lastItem: TItem): TParams | null => {
    if (getNextParamsRef.current) {
      return getNextParamsRef.current(prevParams, lastItem);
    }

    if (prevParams && typeof prevParams === 'object') {
      const maybePaging = prevParams as Record<string, unknown>;
      const pageNum = maybePaging.pageNum;
      if (typeof pageNum === 'number') {
        return {
          ...(maybePaging as object),
          pageNum: pageNum + 1,
        } as TParams;
      }
    }

    return null;
  }, []);

  const parseTotal = (value: string | number) => {
    const total = Number(value);
    return Number.isFinite(total) ? total : null;
  };

  const patchSearchParams = useCallback((baseParams: TParams, keyword: string): TParams => {
    if (buildSearchParamsRef.current) {
      return buildSearchParamsRef.current(baseParams, keyword);
    }

    if (!baseParams || typeof baseParams !== 'object') {
      return baseParams;
    }

    const draft = { ...(baseParams as Record<string, unknown>) } as Record<string, unknown>;
    if (typeof draft.pageNum === 'number') {
      draft.pageNum = 1;
    }

    // 不在组件内部写死关键词字段，交由 buildSearchParams 定制。
    return draft as TParams;
  }, []);

  useEffect(() => {
    const debounceMs = 800;
    const timer = window.setTimeout(() => {
      setDebouncedQueryText(queryText);
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [queryText]);

  useEffect(() => {
    // 用户一旦开始输入，立即把分页语义重置到第一页。
    setCurrentParams(patchSearchParams(params, queryText.trim()));
  }, [queryText, params, patchSearchParams]);

  useEffect(() => {
    if (lazy && !open) {
      return;
    }

    let ignore = false;

    async function initFirstPage() {
      const firstParams = patchSearchParams(params, debouncedQueryText.trim());
      setLoading(true);
      const res = await fetchFunction(firstParams);
      if (ignore) return;

      const rows = res.rows ?? [];
      const total = parseTotal(res.total);

      setItemsData(rows);
      setCurrentParams(firstParams);

      if (total === null) {
        setHasMore(rows.length > 0);
      } else {
        setHasMore(rows.length < total);
      }

      setLoading(false);
    }

    setItemsData([]);
    setHasMore(true);
    setCurrentParams(patchSearchParams(params, debouncedQueryText.trim()));
    void initFirstPage();

    return () => {
      ignore = true;
    };
  }, [fetchFunction, params, patchSearchParams, debouncedQueryText, lazy, open]);

  const loadMore = useCallback(async () => {
    if (isSearchPending || loading || !hasMore || itemsData.length === 0) return;

    const lastItem = itemsData[itemsData.length - 1];
    const nextParams = deriveNextParams(currentParams, lastItem);
    if (!nextParams) {
      setHasMore(false);
      return;
    }

    setLoading(true);
    const res = await fetchFunction(nextParams);
    const rows = res.rows ?? [];
    const total = parseTotal(res.total);

    if (rows.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    setItemsData(prev => {
      const merged = [...prev, ...rows];
      if (total !== null) {
        setHasMore(merged.length < total);
      } else {
        setHasMore(rows.length > 0);
      }
      return merged;
    });

    setCurrentParams(nextParams);
    setLoading(false);
  }, [
    isSearchPending,
    loading,
    hasMore,
    itemsData,
    deriveNextParams,
    currentParams,
    fetchFunction,
  ]);

  // Keep the ref current so the stable sentinelRef callback always calls the latest version.
  loadMoreRef.current = loadMore;

  // useCallback ref pattern: fires when the sentinel mounts inside the Portal,
  // at which point we can safely create the IntersectionObserver.
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node) return;
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingRef.current && hasMoreRef.current) {
          void loadMoreRef.current();
        }
      },
      { threshold: 0 },
    );
    observerRef.current.observe(node);
  }, []);
  // shadCN的Popover组件默认把Content放在body下，这里需要把它放在组件内，才能让滚动行为正常，避免出现无法滚动的情况。
  const popoverOpenRef = useRef(null);

  return (
    <div ref={popoverOpenRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <input
            ref={inputRef}
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground/20 flex h-9 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-100"
            placeholder={t('common.pleaseSelect')}
            value={inputText}
            disabled={disabled}
            onFocus={() => setOpen(true)}
            onChange={e => {
              const nextValue = e.target.value;
              setInputText(nextValue);
              setQueryText(nextValue);
              if (!open) setOpen(true);
            }}
          />
        </PopoverAnchor>
        <PopoverContent
          className="p-0"
          align="start"
          onOpenAutoFocus={e => e.preventDefault()}
          onInteractOutside={e => {
            if (inputRef.current?.contains(e.target as Node)) {
              e.preventDefault();
            }
          }}
          container={popoverOpenRef.current}
        >
          <Command shouldFilter={false}>
            <CommandList>
              {!loading && options.length === 0 && (
                <CommandEmpty>{t('common.NoData')}</CommandEmpty>
              )}
              <CommandGroup>
                {options.map(item => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      setInputText(item.label);
                      onSelect?.(item);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
                {loading && (
                  <div className="text-muted-foreground px-2 py-1 text-xs">
                    {t('common.loading')}
                  </div>
                )}
                <div ref={sentinelRef} className="h-px" />
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
