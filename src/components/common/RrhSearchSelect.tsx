import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
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
}

export function RrhSearchSelect<TParams, TItem>(props: RrhSearchSelectProps<TParams, TItem>) {
  const { fetchFunction, params, mapOption, getNextParams, buildSearchParams, onSelect } = props;
  const { t } = useTranslation();
  const [itemsData, setItemsData] = useState<TItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState(params);
  const [inputText, setInputText] = useState('');
  const [queryText, setQueryText] = useState('');
  const [debouncedQueryText, setDebouncedQueryText] = useState('');
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  const popupClassNameRef = useRef(
    `rrh-search-select-popup-${Math.random().toString(36).slice(2)}`,
  );
  const getNextParamsRef = useRef(getNextParams);
  const buildSearchParamsRef = useRef(buildSearchParams);

  useEffect(() => {
    getNextParamsRef.current = getNextParams;
  }, [getNextParams]);

  useEffect(() => {
    buildSearchParamsRef.current = buildSearchParams;
  }, [buildSearchParams]);

  const options = useMemo(() => {
    return itemsData.map(mapOption).filter(item => item.value !== '');
  }, [itemsData, mapOption]);

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
    // 用户一旦开始输入，立即把分页语义重置到第一页，并禁止自动加载下一页。
    setCurrentParams(patchSearchParams(params, queryText.trim()));
    setHasUserScrolled(false);
  }, [queryText, params, patchSearchParams]);

  useEffect(() => {
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
    setHasUserScrolled(false);
    setCurrentParams(patchSearchParams(params, debouncedQueryText.trim()));
    void initFirstPage();

    return () => {
      ignore = true;
    };
  }, [fetchFunction, params, patchSearchParams, debouncedQueryText]);

  const loadMore = useCallback(async () => {
    if (isSearchPending || !hasUserScrolled || loading || !hasMore || itemsData.length === 0)
      return;

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
    hasUserScrolled,
    loading,
    hasMore,
    itemsData,
    deriveNextParams,
    currentParams,
    fetchFunction,
  ]);

  useEffect(() => {
    if (isSearchPending || loading || !hasMore || options.length === 0) return;

    const popup = document.querySelector(`.${popupClassNameRef.current}`) as HTMLElement | null;
    if (!popup) return;

    const list = popup.querySelector('[data-slot="combobox-list"]') as HTMLElement | null;
    if (!list) return;

    const onListScroll = () => {
      if (list.scrollTop > 0) {
        setHasUserScrolled(true);
      }
    };
    list.addEventListener('scroll', onListScroll, { passive: true });

    const sentinel = document.createElement('div');
    sentinel.setAttribute('data-rrh-load-more-sentinel', 'true');
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    list.appendChild(sentinel);

    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      {
        root: list,
        rootMargin: '0px 0px 120px 0px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      list.removeEventListener('scroll', onListScroll);
      sentinel.remove();
    };
  }, [isSearchPending, options, hasMore, loading, loadMore]);

  return (
    <Combobox
      items={options.filter(item => item.value !== '')}
      itemToStringValue={(item: { value: string; label: string }) => item.label}
      filter={null}
      autoComplete="none"
    >
      <ComboboxInput
        placeholder={t('common.pleaseSelect')}
        value={inputText}
        onChange={event => {
          const nextValue = (event.target as HTMLInputElement).value;
          setInputText(nextValue);
          setQueryText(nextValue);
        }}
      />
      <ComboboxContent className={popupClassNameRef.current}>
        <ComboboxEmpty>{t('common.NoData')} </ComboboxEmpty>
        <ComboboxList>
          {item => (
            <ComboboxItem
              key={item.value}
              value={item}
              onClick={() => {
                setInputText(item.label);
                onSelect?.(item);
              }}
            >
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
