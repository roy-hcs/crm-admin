import { useEffect, useRef, memo } from 'react';
import { useTabStore } from '../../store/tabStore';

interface CachedRouteProps {
  routeKey: string;
  children: React.ReactNode;
}

export const CachedRoute = memo(function CachedRoute({ routeKey, children }: CachedRouteProps) {
  const { activeTab, isTabCached, markTabAsCached } = useTabStore();
  const isActive = activeTab === routeKey;
  const hasRunEffect = useRef(false);

  // Use useEffect instead of calling in render to avoid infinite updates
  useEffect(() => {
    if (isActive && !hasRunEffect.current) {
      markTabAsCached(routeKey);
      hasRunEffect.current = true;
    }
  }, [isActive, routeKey, markTabAsCached]);

  // Only render the content if we're either active or cached
  if (!isActive && !isTabCached(routeKey)) {
    return null;
  }

  return <div style={{ display: isActive ? 'block' : 'none' }}>{children}</div>;
});
