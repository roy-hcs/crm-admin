import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTabStore, type TabItem } from '../../store/tabStore';
import { cn } from '@/lib/utils';
import { RrhButton } from '../common/RrhButton';

export function TabNavigation() {
  const navigate = useNavigate();
  const { tabs, activeTab, removeTab, setActiveTab } = useTabStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  // const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const activeTabElement = tabRefs.current.get(activeTab);
    if (activeTabElement && scrollContainerRef.current) {
      // Scroll the active tab into view
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust scroll distance as needed
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
    <div className="bg-sidebar border-border relative flex w-full items-center border-b px-1.5">
      <RrhButton variant="outline" className="size-8 !px-2" onClick={() => handleScroll('left')}>
        <ChevronLeft className="size-4" />
      </RrhButton>
      <div
        ref={scrollContainerRef}
        className="scrollbar-none mx-1.5 flex flex-1 items-center gap-0.5 overflow-x-auto px-1.5 py-1"
      >
        {tabs.map(tab => (
          <div
            key={tab.key}
            ref={el => {
              if (el) {
                tabRefs.current.set(tab.key, el);
              } else {
                tabRefs.current.delete(tab.key);
              }
            }}
            className={cn(
              'text-muted-foreground hover:bg-background hover:text-foreground relative flex cursor-pointer items-center rounded-lg px-2.5 py-2 text-sm text-nowrap select-none',
              activeTab === tab.key ? 'bg-background' : '',
            )}
            onClick={() => handleTabClick(tab)}
          >
            <span className={cn(activeTab === tab.key ? 'text-primary' : '')}>{tab.title}</span>
            {tab.closable && (
              <RrhButton
                variant="ghost"
                onClick={e => handleCloseTab(e, tab.key)}
                className="ml-2 h-3 rounded-full !p-0 opacity-70"
              >
                <X className="h-3 w-3" />
              </RrhButton>
            )}
          </div>
        ))}
      </div>
      <RrhButton variant="outline" className="size-8 !px-2" onClick={() => handleScroll('right')}>
        <ChevronRight className="size-4" />
      </RrhButton>
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
