import { QueryClientProvider } from '@tanstack/react-query';
import { ApiContext } from './query-context';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { hooks as apiHooks } from '@/api';
import { queryClient } from '@/lib/tanstack-query';
import { ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Provide API hooks through context
  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={apiHooks}>{children}</ApiContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
