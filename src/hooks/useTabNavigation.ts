import { useEffect, useRef } from 'react';
import { useTabStore } from '../store/tabStore';

interface UseTabNavigationProps {
  title: string;
  path: string;
  key?: string;
  closable?: boolean;
}

export function useTabNavigation({ title, path, key, closable = true }: UseTabNavigationProps) {
  const { addTab } = useTabStore();
  const tabKey = key || path;
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only run once when the component mounts
    if (isInitialMount.current) {
      isInitialMount.current = false;
      addTab({
        key: tabKey,
        title,
        path,
        closable,
      });
    }
    // Empty dependency array to ensure this only runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
