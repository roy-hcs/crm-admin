import { useState } from 'react';
import { X, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTabStore, type TabItem } from '../../store/tabStore';
import { cn } from '@/lib/utils';

export function TabNavigation() {
  const navigate = useNavigate();
  const { tabs, activeTab, removeTab, setActiveTab, closeAllTabs, closeOtherTabs } = useTabStore();
  const [showDropdown, setShowDropdown] = useState(false);
  console.log(tabs, 'tabs info--');
  const handleTabClick = (tab: TabItem) => {
    setActiveTab(tab.key);
    navigate(tab.path);
  };

  const handleCloseTab = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (activeTab === key) {
      const currentIndex = tabs.findIndex(tab => tab.key === activeTab);
      if (tabs[currentIndex + 1]) {
        setActiveTab(tabs[currentIndex + 1].key);
        navigate(tabs[currentIndex + 1].path);
      } else if (tabs[currentIndex - 1]) {
        // in current design, there always should be a previous tab (dashboard) if the current one is closed
        setActiveTab(tabs[currentIndex - 1].key);
        navigate(tabs[currentIndex - 1].path);
      }
    }
    removeTab(key);
  };

  const handleTabActions = (action: 'closeAll' | 'closeOthers') => {
    if (action === 'closeAll') {
      closeAllTabs();
      navigate('/');
    } else if (action === 'closeOthers') {
      closeOtherTabs(activeTab);
    }
    setShowDropdown(false);
  };

  return (
    <div className="bg-background relative flex w-full items-center border-b py-0.5">
      <div className="flex flex-1 items-center gap-0.5 overflow-x-auto px-0.5">
        {tabs.map(tab => (
          <div
            key={tab.key}
            className={cn(
              'flex cursor-pointer items-center border px-2 py-1 text-xs select-none',
              activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
            )}
            onClick={() => handleTabClick(tab)}
          >
            <span>{tab.title}</span>
            {tab.closable && (
              <button
                onClick={e => handleCloseTab(e, tab.key)}
                className="hover:bg-primary-foreground hover:text-primary ml-2 cursor-pointer rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
      {/* TODO: not sure whether keep it or not */}
      <div className="relative px-2">
        <button onClick={() => setShowDropdown(!showDropdown)} className="hover:bg-muted px-2 py-1">
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {showDropdown && (
          <div className="bg-popover absolute right-0 z-10 mt-2 w-48 rounded-md border shadow-lg">
            <div className="py-1">
              <button
                onClick={() => handleTabActions('closeOthers')}
                className="hover:bg-accent w-full px-4 py-2 text-left text-sm"
              >
                Close Other Tabs
              </button>
              <button
                onClick={() => handleTabActions('closeAll')}
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
