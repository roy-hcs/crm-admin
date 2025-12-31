import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { useTabStore } from '@/store/tabStore';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from 'react-i18next';

export const ProfileDropdown: React.FC = () => {
  const { t } = useTranslation();
  const menus = [t('common.profile'), t('common.settings'), t('common.logout')];
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { addTab } = useTabStore();
  const { user } = useUserStore();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const callToAction = (menu: string) => {
    switch (menu) {
      case t('common.profile'):
        addTab({ key: 'profile', title: 'Profile', path: '/profile', closable: true });
        navigate('/account/profile');
        break;
      case t('common.settings'):
        addTab({ key: 'settings', title: 'Settings', path: '/settings', closable: true });
        navigate('/settings');
        break;
      case t('common.logout'):
        handleLogout();
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent flex w-6 cursor-pointer items-center rounded-sm md:w-auto md:p-2">
        <img
          src={user?.avatar || ''}
          alt={user?.userLastName || 'avatar'}
          className="size-6 rounded-full md:size-10"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {menus.map(menu => (
          <DropdownMenuItem
            key={menu}
            onClick={() => callToAction(menu)}
            className="hover:bg-accent cursor-pointer"
          >
            {menu}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
