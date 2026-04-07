import { ReactNode, useCallback, useMemo, useState } from 'react';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { LoadingContext } from './loading-context';

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = useCallback(() => {
    setLoadingCount(prev => prev + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount(prev => Math.max(0, prev - 1));
  }, []);

  const withLoading = useCallback(
    async <T,>(task: () => Promise<T> | T): Promise<T> => {
      showLoading();
      try {
        return await task();
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  const value = useMemo(
    () => ({
      isLoading: loadingCount > 0,
      showLoading,
      hideLoading,
      withLoading,
    }),
    [loadingCount, showLoading, hideLoading, withLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {loadingCount > 0 && (
        <div className="bg-accent-foreground/8 fixed inset-0 z-100 flex items-center justify-center">
          <RrhCircleLoading />
        </div>
      )}
    </LoadingContext.Provider>
  );
}
