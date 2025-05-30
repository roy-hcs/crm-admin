import { Menu } from 'lucide-react';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ProfileDropdown } from './components/ProfileDropdown';
import { TabNavigation } from './TabNavigation';
import { ThemeSwitcher } from './components/ThemeSwitcher';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-card text-card-foreground flex flex-col">
      <div className="border-border flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="hover:bg-accent cursor-pointer rounded-md p-2">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="ml-4 text-xl font-semibold">CRM Admin</h1>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />

          <ThemeSwitcher />

          <ProfileDropdown />
        </div>
      </div>

      <TabNavigation />
    </header>
  );
}
