import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  CrmInfoVerifyListParams,
  CrmInfoVerifyListRes,
  CrmPreferenceListParams,
  CrmPreferenceListRes,
} from './types';

/**
 * 获取审核设置列表
 */
export function useCrmPreferenceList(
  params: CrmPreferenceListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['crmPreferenceList', params],
    queryFn: () => apiFormPostCustom<CrmPreferenceListRes>('/system/crmPreference/list', params),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取审核-信息审核
 */
export function useCrmInfoVerifyList(params: CrmInfoVerifyListParams) {
  return useQuery({
    queryKey: ['crmInfoVerifyList', params],
    queryFn: () => apiFormPostCustom<CrmInfoVerifyListRes>('/system/crmInfoVerify/list', params),
  });
}
