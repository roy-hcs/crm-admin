import { useContext } from 'react';
import { TabsContext } from './tabs-context';

export const useTabNavigation = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabNavigation must be used within a TabsProvider');
  }
  return context;
};
