import { createContext } from 'react';

export interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  withLoading: <T>(task: () => Promise<T> | T) => Promise<T>;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
