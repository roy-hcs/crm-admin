import { TabItem, useTabStore } from '@/store/tabStore';
import { useNavigate } from 'react-router-dom';

export const useTabActions = () => {
  const navigate = useNavigate();
  const { addTab } = useTabStore();
  const openTab = (tab: Omit<TabItem, 'closable'> & { closable?: boolean }) => {
    addTab({
      closable: true,
      ...tab,
    });
    navigate(tab.path);
  };
  return { openTab };
};
