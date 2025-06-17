import React from 'react';
import { useStore } from '../../../store/useStore';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export const LanguageSwitcher: React.FC<{ showLabel?: boolean; className?: string }> = ({
  showLabel = true,
  className,
}) => {
  const { language, setLanguage } = useStore();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn('hover:bg-accent flex cursor-pointer items-center rounded-sm p-2', className)}
      >
        <Globe className="h-5 w-5" />
        {showLabel && <span className="ml-2 hidden sm:inline-block">{language.toUpperCase()}</span>}
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
