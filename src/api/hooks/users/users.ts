import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../lib/tanstack-query';
import { fetchWithAuth } from '../../client';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  // Other user properties
}

export interface UpdateUserParams {
  id: string;
  username?: string;
  email?: string;
  // Other updatable fields
}

export interface LoginParams {
  username: string;
  password: string;
  rememberMe: boolean;
  type: number;
}

export interface RegisterParams {
  username: string;
  password: string;
  email: string;
  // other fields as needed
}

// Login
export function useLogin() {
  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const formData = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      const data = await fetchWithAuth<{
        code: number;
        msg: string;
        data: { userId: string; pubKey: string } | null;
      }>('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      return data;
    },
    onSuccess: () => {
      // Invalidate queries that should refresh after login
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useLoginConfig() {
  return useQuery({
    queryKey: ['loginConfig'],
    queryFn: async () => {
      const data = await fetchWithAuth<{
        code: number;
        msg: string;
        data: string | null;
      }>('/loginConfig');
      return data;
    },
  });
}

export function useLogout() {
  return useQuery({
    queryKey: ['logout'],
    queryFn: async () => {
      const data = await fetchWithAuth<{ code: number; msg: string }>('/logout');
      return data;
    },
  });
}
