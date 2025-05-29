import React from 'react';
import { useStore } from '../../../store/useStore';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useStore();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent flex cursor-pointer items-center rounded-sm p-2">
        <Globe className="h-5 w-5" />
        <span className="ml-2 hidden sm:inline-block">{language.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`hover:bg-accent ${language === lang.code ? 'bg-accent/50' : ''}`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
