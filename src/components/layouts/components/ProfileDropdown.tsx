import React from 'react';
import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown: React.FC = () => {
  const menus = ['profile', 'settings', 'logout'];
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const callToAction = (menu: string) => {
    switch (menu) {
      case 'profile':
        console.log('jump to profile');
        break;
      case 'settings':
        console.log('jump to settings');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent flex cursor-pointer items-center rounded-sm p-2">
        <User className="h-5 w-5" />
        <span className="ml-2 hidden sm:inline-block">Admin</span>
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
