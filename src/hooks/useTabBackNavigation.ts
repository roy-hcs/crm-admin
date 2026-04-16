import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTabStore } from '@/store/tabStore';

export const useTabBackNavigation = (fallbackPath: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, activeTab, setActiveTab, removeTab } = useTabStore();

  return useCallback(() => {
    const currentKey = `${location.pathname}${location.search}`;
    const currentIndex = tabs.findIndex(tab => tab.key === currentKey || tab.key === activeTab);

    if (currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1];
      setActiveTab(prevTab.key);
      navigate(prevTab.path);
      removeTab(currentKey);
      return;
    }

    if (currentIndex === 0 && tabs[1]) {
      const nextTab = tabs[1];
      setActiveTab(nextTab.key);
      navigate(nextTab.path);
      removeTab(currentKey);
      return;
    }

    navigate(fallbackPath);
  }, [
    activeTab,
    fallbackPath,
    location.pathname,
    location.search,
    navigate,
    removeTab,
    setActiveTab,
    tabs,
  ]);
};
