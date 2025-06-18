import { useMutation, useQuery } from '@tanstack/react-query';
import { apiFormPost, apiGet, FormValue } from '../../client';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  // Other user properties
}

export interface LoginParams extends Record<string, FormValue> {
  username: string;
  password: string;
  rememberMe: boolean;
  type: number;
}
export function useLogin() {
  return useMutation({
    mutationFn: (params: LoginParams) =>
      apiFormPost<{ userId: string; pubKey: string }>('/login', params),
    onSuccess: () => {},
  });
}

export function useLoginConfig() {
  return useQuery({
    queryKey: ['loginConfig'],
    queryFn: () => apiGet<string>('/loginConfig'),
  });
}

export function useLogout() {
  return useQuery({
    queryKey: ['logout'],
    queryFn: () => apiGet('/logout'),
  });
}
