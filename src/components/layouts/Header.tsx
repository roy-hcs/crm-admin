import { useState, useEffect } from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ProfileDropdown } from './components/ProfileDropdown';
import { TabNavigation } from './TabNavigation';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    // Check if dark mode is already enabled
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

          <button
            onClick={toggleDarkMode}
            className="hover:bg-accent cursor-pointer rounded-md p-2"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button className="hover:bg-accent relative cursor-pointer rounded-md p-2">
            <Bell className="h-5 w-5" />
            <span className="bg-destructive absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white">
              3
            </span>
          </button>

          <ProfileDropdown />
        </div>
      </div>

      <TabNavigation />
    </header>
  );
}
