import { Blocks, FileQuestion, Menu, Search, Settings } from 'lucide-react';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ProfileDropdown } from './components/ProfileDropdown';
import { TabNavigation } from './TabNavigation';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { RrhDrawer } from '../common/RrhDrawer';
import { Sidebar } from './Sidebar';
import { RrhButton } from '../common/RrhButton';

export function Header() {
  return (
    <header className="bg-card text-card-foreground flex flex-col">
      <div className="border-border flex h-12 items-center justify-between border-b px-4">
        <div className="flex items-center">
          <RrhDrawer
            asChild
            headerShow={false}
            footerShow={false}
            direction="left"
            Trigger={
              <button className="hover:bg-accent block cursor-pointer rounded-md p-2 md:hidden">
                <Menu className="!h-5 !w-5" />
              </button>
            }
          >
            <Sidebar cls="w-full" />
          </RrhDrawer>
          {/* <h1 className="ml-4 block text-xl font-semibold md:hidden">CRM Admin</h1> */}
        </div>

        <div className="flex items-center">
          <RrhButton variant="ghost" className="!px-2">
            <Search className="!h-5 !w-5" />
          </RrhButton>
          <RrhButton variant="ghost" className="!px-2">
            <Blocks className="!h-5 !w-5" />
          </RrhButton>
          <RrhButton variant="ghost" className="!px-2">
            <FileQuestion className="!h-5 !w-5" />
          </RrhButton>

          <LanguageSwitcher showLabel={false} />

          <ThemeSwitcher />
          <RrhButton variant="ghost">
            <Settings className="!h-5 !w-5" />
          </RrhButton>

          <ProfileDropdown />
        </div>
      </div>

      <TabNavigation />
    </header>
  );
}
