import { createContext } from 'react';

interface TabItem {
  key: string;
  title: string;
  path: string;
  closable: boolean;
}

interface TabContextType {
  tabs: TabItem[];
  activeTabKey: string;
  addTab: (tab: TabItem) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (key: string) => void;
}

export const TabsContext = createContext<TabContextType | null>(null);
