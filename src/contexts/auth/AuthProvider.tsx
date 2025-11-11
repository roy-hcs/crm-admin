import { useMemo, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { useTabStore } from '@/store/tabStore';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { useLogout } from '@/api/hooks/users/users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { closeAllTabs } = useTabStore();
  const queryClient = useQueryClient();
  const { clearUser, user } = useUserStore();
  const logoutSuccess = () => {
    localStorage.removeItem('publicKey');
    closeAllTabs();
    clearUser();
    queryClient.clear();
  };
  const logoutMutation = useLogout(logoutSuccess);
  const logout = () => {
    logoutMutation.mutate();
  };

  const isAuthenticated = useMemo(() => !!user, [user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
