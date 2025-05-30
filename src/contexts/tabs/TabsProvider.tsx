import { TabItem } from '@/store/tabStore';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabsContext } from './tabs-context';

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: 'dashboard', title: 'Dashboard', path: '/', closable: false },
  ]);
  const [activeTabKey, setActiveTabKey] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();

  const addTab = (tab: TabItem) => {
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(t => t.key === tab.key);
      if (existingTab) {
        return prevTabs;
      }
      return [...prevTabs, tab];
    });
    setActiveTabKey(tab.key);
  };

  const removeTab = (key: string) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.key !== key);

      // If the active tab is being closed, navigate to the last tab
      if (key === activeTabKey && newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1];
        navigate(lastTab.path);
        setActiveTabKey(lastTab.key);
      }

      return newTabs;
    });
  };

  const setActiveTab = (key: string) => {
    setActiveTabKey(key);
  };

  const closeAllTabs = () => {
    setTabs(prevTabs => {
      const permanentTabs = prevTabs.filter(tab => !tab.closable);
      if (permanentTabs.length > 0) {
        navigate(permanentTabs[0].path);
        setActiveTabKey(permanentTabs[0].key);
      }
      return permanentTabs;
    });
  };

  const closeOtherTabs = (key: string) => {
    setTabs(prevTabs => {
      const tabToKeep = prevTabs.find(tab => tab.key === key);
      const permanentTabs = prevTabs.filter(tab => !tab.closable);

      if (tabToKeep) {
        return [...permanentTabs.filter(tab => tab.key !== key), tabToKeep];
      }
      return permanentTabs;
    });
  };

  // Ensure the active tab is set correctly based on the current location
  useEffect(() => {
    const currentPathTab = tabs.find(tab => tab.path === location.pathname);
    if (currentPathTab) {
      setActiveTabKey(currentPathTab.key);
    }
  }, [location.pathname, tabs]);

  const contextValue = {
    tabs,
    activeTabKey,
    addTab,
    removeTab,
    setActiveTab,
    closeAllTabs,
    closeOtherTabs,
  };

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
}
