import { UserInfoRes } from '@/api/hooks/system/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserStore = {
  user: UserInfoRes['user'] | null;
  setUser: (user: UserInfoRes['user'] | null) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
    }),
    {
      name: 'user-store',
      partialize: state => ({ user: state.user }),
    },
  ),
);
