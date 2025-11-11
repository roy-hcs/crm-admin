import { UserInfoRes } from '@/api/hooks/system';
import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  user: UserInfoRes['user'] | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
