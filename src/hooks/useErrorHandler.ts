import { useCallback } from 'react';
import { useError } from '@/contexts/error';

export function useErrorHandler() {
  const { setError } = useError();

  const handleError = useCallback(
    (error: unknown, fallbackMessage = 'An unexpected error occurred') => {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError(fallbackMessage);
      }
    },
    [setError],
  );

  // Wrap an async function with error handling
  const withErrorHandling = useCallback(
    <T extends (...args: unknown[]) => Promise<U>, U = unknown>(
      fn: T,
      fallbackMessage?: string,
    ) => {
      return async (...args: Parameters<T>): Promise<U> => {
        try {
          return await fn(...args);
        } catch (error) {
          handleError(error, fallbackMessage);
          throw error;
        }
      };
    },
    [handleError],
  );

  return {
    handleError,
    withErrorHandling,
  };
}
