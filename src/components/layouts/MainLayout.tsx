import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CachedRoute } from './CachedRoute';
import { useTabStore } from '../../store/tabStore';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { activeTab } = useTabStore();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-background flex h-screen">
      <Sidebar open={sidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-auto p-4">
          <CachedRoute routeKey={activeTab}>
            <Outlet />
          </CachedRoute>
        </main>
      </div>
    </div>
  );
}
