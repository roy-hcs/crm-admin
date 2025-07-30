import { useMutation, useQuery } from '@tanstack/react-query';
import { apiFormPost, apiGet } from '../../client';
import { LoginParams } from './types';

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
