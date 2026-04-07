import { useContext } from 'react';
import { LoadingContext, type LoadingContextType } from './loading-context';

export const useGlobalLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  return context;
};
