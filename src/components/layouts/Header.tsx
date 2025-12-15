import { FolderGit, Menu, Search, Settings, Store } from 'lucide-react';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ProfileDropdown } from './components/ProfileDropdown';
import { TabNavigation } from './TabNavigation';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { RrhDrawer } from '../common/RrhDrawer';
import { Sidebar } from './Sidebar';
import { RrhButton } from '../common/RrhButton';
import { Input } from '../ui/input';
import { RrhDialog } from '../common/RrhDialog';
import { useGlobalSearch } from '@/api/hooks/common';
import { useState, useRef, useEffect } from 'react';
import { debounce } from 'es-toolkit';
import { RrhCircleLoading } from '../common/RrhCircleLoading';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { mutate: search, data: searchRes, isPending } = useGlobalSearch();
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    debouncedSearchRef.current = debounce((value: string) => {
      if (value.trim()) {
        search({ nameCn: value });
      }
    }, 500);

    return () => {
      debouncedSearchRef.current?.cancel?.();
    };
  }, [search]);

  const handleSearch = (value: string) => {
    setKeyword(value);
    debouncedSearchRef.current?.(value);
  };

  return (
    <header className="bg-primary-foreground text-card-foreground flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 md:px-6 md:py-0">
        <div className="flex items-center">
          <RrhDrawer
            asChild
            headerShow={false}
            footerShow={false}
            direction="left"
            Trigger={
              <button className="hover:bg-accent block cursor-pointer rounded-md pr-2 md:hidden">
                <Menu className="size-5" />
              </button>
            }
          >
            <Sidebar cls="w-full" />
          </RrhDrawer>
          {/* <h1 className="ml-4 block text-xl font-semibold md:hidden">CRM Admin</h1> */}
        </div>

        <div className="flex flex-1 items-center justify-between">
          <RrhDialog
            title={t('common.globalSearch')}
            footerShow={false}
            trigger={
              <div className="relative mr-2 flex md:mr-0">
                <RrhButton variant="ghost" className="absolute top-0 left-0 h-full !px-2">
                  <Search className="size-5" />
                </RrhButton>
                <Input className="bg-background pl-7" />
              </div>
            }
          >
            <div>
              <div className="relative flex">
                <RrhButton variant="ghost" className="absolute top-0 left-0 h-full !px-2">
                  <Search className="size-5" />
                </RrhButton>
                <Input
                  className="bg-background pl-7"
                  value={keyword}
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
              <div>
                <div className="my-2">{t('common.searchResult')}</div>
                {isPending ? (
                  <div className="min-h-25">
                    <RrhCircleLoading />
                  </div>
                ) : keyword.trim() ? (
                  <div className="max-h-[70vh] min-h-25 overflow-auto">
                    {searchRes?.data?.map(item => {
                      // TODO: there are nameCn and nameEn, need to confirm which field to show, and there is a field permission, it looks like it needs to be handled too
                      // there is a pagePath field, but it is old system, the path mismatch current system, need to change current project's path or need a mapping table
                      return (
                        <div key={item.id}>
                          {item.nameCn} {item.pagePath}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="min-h-25"></div>
                )}
              </div>
            </div>
          </RrhDialog>
          <div className="flex items-center gap-2">
            <RrhButton variant="ghost" className="!px-0 md:!px-2">
              <FolderGit className="size-5" />
              <span className="hidden md:block">{t('common.newVersion')}</span>
            </RrhButton>
            <RrhButton variant="ghost" className="!px-0 md:!px-2">
              <Store className="size-5" />
              <span className="hidden md:block">{t('common.marketplace')}</span>
            </RrhButton>

            <LanguageSwitcher showLabel={false} />

            <ThemeSwitcher />
            <RrhButton variant="ghost" className="!px-0 md:!px-2">
              <Settings className="size-5" />
            </RrhButton>

            <ProfileDropdown />
          </div>
        </div>
      </div>

      <TabNavigation />
    </header>
  );
}
