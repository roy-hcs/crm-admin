import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TabItem {
  key: string;
  title: string;
  path: string;
  closable: boolean;
}

interface TabStore {
  tabs: TabItem[];
  activeTab: string;
  cachedTabKeys: string[];
  maxCachedTabs: number;
  addTab: (tab: TabItem) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (key: string) => void;
  markTabAsCached: (key: string) => void;
  isTabCached: (key: string) => boolean;
}

// Create a more stable store with persist middleware
export const useTabStore = create<TabStore>()(
  persist(
    (set, get) => ({
      tabs: [{ key: 'dashboard', title: 'Dashboard', path: '/', closable: false }],
      activeTab: 'dashboard',
      cachedTabKeys: ['dashboard'],
      maxCachedTabs: 10,

      addTab: tab => {
        const { tabs, activeTab } = get();
        // If tab already exists, just set it as active
        if (tabs.some(t => t.key === tab.key)) {
          if (activeTab !== tab.key) {
            set({ activeTab: tab.key });
          }
          return;
        }

        // Otherwise add the new tab
        set(state => ({
          tabs: [...state.tabs, tab],
          activeTab: tab.key,
          cachedTabKeys: [...state.cachedTabKeys, tab.key].slice(-state.maxCachedTabs),
        }));
      },

      removeTab: key => {
        const { tabs, activeTab, cachedTabKeys } = get();
        const newTabs = tabs.filter(tab => tab.key !== key);
        const newCachedTabKeys = cachedTabKeys.filter(k => k !== key);

        let newActiveTab = activeTab;
        if (key === activeTab && newTabs.length > 0) {
          newActiveTab = newTabs[newTabs.length - 1].key;
        }

        set({ tabs: newTabs, activeTab: newActiveTab, cachedTabKeys: newCachedTabKeys });
      },

      setActiveTab: key => {
        set({ activeTab: key });
      },

      closeAllTabs: () => {
        const permanentTabs = get().tabs.filter(tab => !tab.closable);
        const newActiveTab = permanentTabs.length > 0 ? permanentTabs[0].key : '';
        const newCachedTabKeys = permanentTabs.map(tab => tab.key);

        set({ tabs: permanentTabs, activeTab: newActiveTab, cachedTabKeys: newCachedTabKeys });
      },

      closeOtherTabs: key => {
        const { tabs } = get();
        const keepTab = tabs.find(tab => tab.key === key);
        const permanentTabs = tabs.filter(tab => !tab.closable);

        const newTabs = keepTab
          ? [...permanentTabs.filter(tab => tab.key !== key), keepTab]
          : permanentTabs;

        const newCachedTabKeys = newTabs.map(tab => tab.key);

        set({
          tabs: newTabs,
          activeTab: keepTab ? key : newTabs.length > 0 ? newTabs[0].key : '',
          cachedTabKeys: newCachedTabKeys,
        });
      },

      markTabAsCached: key => {
        const { cachedTabKeys, maxCachedTabs } = get();
        if (!cachedTabKeys.includes(key)) {
          set({
            cachedTabKeys: [...cachedTabKeys, key].slice(-maxCachedTabs),
          });
        }
      },

      isTabCached: key => {
        return get().cachedTabKeys.includes(key);
      },
    }),
    {
      name: 'tab-storage',
      partialize: state => ({
        tabs: state.tabs,
        activeTab: state.activeTab,
      }),
    },
  ),
);
