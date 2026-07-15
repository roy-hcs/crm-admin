import { apiFormPost, apiFormPostCustom } from '@/api/client';
import { useMutation } from '@tanstack/react-query';
import { GlobalSearchRes } from './types';

// Common/shared API hooks
export * from './types';
export function useGlobalSearch() {
  return useMutation({
    mutationFn: (params: { nameCn: string }) =>
      apiFormPost<GlobalSearchRes>('/grobal/search/list', params),
  });
}

export function useCheckEmailUnique() {
  return useMutation({
    mutationFn: (params: { email: string }) =>
      apiFormPostCustom<number>('/system/crmUser/checkEmailUnique', params),
  });
}

export function useCheckPhoneUnique() {
  return useMutation({
    mutationFn: (params: { phone: string; mobile: string }) =>
      apiFormPostCustom<number>('/system/crmUser/checkPhoneUnique', params),
  });
}

export function useCheckUserPhone() {
  return useMutation({
    mutationFn: (params: { phonenumber: string; mzone: string; userId?: string }) =>
      apiFormPostCustom<number>('/system/user/checkPhoneUnique', params),
  });
}
