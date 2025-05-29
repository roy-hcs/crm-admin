import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

// Tab item interface
interface TabItem {
  key: string;
  title: string;
  path: string;
  closable: boolean;
}

// Context for tab management
interface TabContextType {
  tabs: TabItem[];
  activeTabKey: string;
  addTab: (tab: TabItem) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (key: string) => void;
}

const TabsContext = createContext<TabContextType | null>(null);

// Hook to use tab navigation
export const useTabNavigation = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabNavigation must be used within a TabsProvider');
  }
  return context;
};

// Component to add the current route as a tab
export function TabRoute({
  title,
  tabKey,
  closable = true,
  children,
}: {
  title: string;
  tabKey?: string;
  closable?: boolean;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { addTab } = useTabNavigation();

  useEffect(() => {
    const key = tabKey || location.pathname;
    addTab({
      key,
      title,
      path: location.pathname,
      closable,
    });
  }, [title, tabKey, closable, location.pathname, addTab]);

  return <>{children}</>;
}

// Tab navigation component
export function TabsNavigation() {
  const { tabs, activeTabKey, removeTab, setActiveTab, closeAllTabs, closeOtherTabs } =
    useTabNavigation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleTabClick = (tab: TabItem) => {
    setActiveTab(tab.key);
    navigate(tab.path);
  };

  const handleCloseTab = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    removeTab(key);
  };

  return (
    <div className="bg-background relative flex w-full items-center border-b">
      <div className="flex flex-1 items-center overflow-x-auto p-1">
        {tabs.map(tab => (
          <div
            key={tab.key}
            className={`mx-1 flex cursor-pointer items-center rounded-md px-4 py-2 select-none ${activeTabKey === tab.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'} `}
            onClick={() => handleTabClick(tab)}
          >
            <span>{tab.title}</span>
            {tab.closable && (
              <button
                onClick={e => handleCloseTab(e, tab.key)}
                className="hover:bg-primary-foreground hover:text-primary ml-2 rounded-full p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="relative px-2">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="hover:bg-muted rounded-md p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>

        {showDropdown && (
          <div className="bg-popover absolute right-0 z-10 mt-2 w-48 rounded-md border shadow-lg">
            <div className="py-1">
              <button
                onClick={() => {
                  closeOtherTabs(activeTabKey);
                  setShowDropdown(false);
                }}
                className="hover:bg-accent w-full px-4 py-2 text-left text-sm"
              >
                Close Other Tabs
              </button>
              <button
                onClick={() => {
                  closeAllTabs();
                  setShowDropdown(false);
                }}
                className="hover:bg-accent w-full px-4 py-2 text-left text-sm"
              >
                Close All Tabs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main TabsProvider component
export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: 'dashboard', title: 'Dashboard', path: '/dashboard', closable: false },
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

// Cache components with this wrapper
export function CachedOutlet() {
  const location = useLocation();
  const { tabs, activeTabKey } = useTabNavigation();

  return (
    <div className="cached-routes-container">
      {tabs.map(tab => (
        <div key={tab.key} style={{ display: activeTabKey === tab.key ? 'block' : 'none' }}>
          {tab.path === location.pathname && activeTabKey === tab.key && <Outlet />}
        </div>
      ))}
    </div>
  );
}
