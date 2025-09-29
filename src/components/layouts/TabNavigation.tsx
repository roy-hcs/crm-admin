import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTabStore, type TabItem } from '../../store/tabStore';
import { cn } from '@/lib/utils';
import { RrhButton } from '../common/RrhButton';

export function TabNavigation() {
  const navigate = useNavigate();
  const { tabs, activeTab, removeTab, setActiveTab } = useTabStore();
  // const [showDropdown, setShowDropdown] = useState(false);
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

  // const handleTabActions = (action: 'closeAll' | 'closeOthers') => {
  //   if (action === 'closeAll') {
  //     closeAllTabs();
  //     navigate('/');
  //   } else if (action === 'closeOthers') {
  //     closeOtherTabs(activeTab);
  //   }
  //   setShowDropdown(false);
  // };

  return (
    <div className="bg-background relative flex w-full items-center">
      <div className="flex flex-1 items-center gap-0.5 overflow-x-auto px-0.5 py-1">
        {tabs.map(tab => (
          <div
            key={tab.key}
            className={cn(
              'flex cursor-pointer items-center rounded border px-3 py-1.5 text-xs font-semibold text-nowrap select-none',
              activeTab === tab.key
                ? 'bg-background text-third shadow'
                : 'bg-accent text-muted dark:text-third/50',
            )}
            onClick={() => handleTabClick(tab)}
          >
            <span>{tab.title}</span>
            {tab.closable && activeTab === tab.key && (
              <RrhButton
                variant="ghost"
                onClick={e => handleCloseTab(e, tab.key)}
                className="ml-5 h-3 rounded-full !p-0"
              >
                <X className="h-3 w-3" />
              </RrhButton>
            )}
          </div>
        ))}
      </div>
      {/* TODO: not sure whether keep it or not */}
      {/* <div className="relative px-2">
        <RrhButton
          variant="ghost"
          onClick={() => setShowDropdown(!showDropdown)}
          className="!px-2 !py-1"
        >
          <MoreHorizontal className="h-4 w-4" />
        </RrhButton>

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
      </div> */}
    </div>
  );
}
