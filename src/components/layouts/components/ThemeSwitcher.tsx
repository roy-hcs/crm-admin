import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
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
    <button onClick={toggleDarkMode} className="hover:bg-accent cursor-pointer rounded-md p-2">
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};
