import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CachedRoute } from './CachedRoute';
import { useTabStore } from '../../store/tabStore';

export function MainLayout() {
  const { activeTab } = useTabStore();

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <aside className="hidden md:block">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-4">
          <CachedRoute routeKey={activeTab}>
            <Outlet />
          </CachedRoute>
        </main>
      </div>
    </div>
  );
}
