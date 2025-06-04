import { useMutation } from '@tanstack/react-query';
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
  type: string;
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
      const data = await fetchWithAuth<{
        code: number;
        msg: string;
        data: { userId: string; pubKey: string } | null;
      }>('/login', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      // Store auth token if returned
      // if (data.token) {
      //   localStorage.setItem('authToken', data.token);
      // }

      return data;
    },
    onSuccess: () => {
      // Invalidate queries that should refresh after login
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
