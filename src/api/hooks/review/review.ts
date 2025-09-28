import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  BindVerifyListParams,
  BindVerifyListRes,
  CrmInfoVerifyListParams,
  CrmInfoVerifyListRes,
  CrmNewLoginVerifyListParams,
  CrmNewLoginVerifyListRes,
  CrmPreferenceListParams,
  CrmPreferenceListRes,
  LeverageVerifyListParams,
  LeverageVerifyListRes,
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

/**
 * 获取审核-开户审核
 */
export function useCrmNewLoginVerifyList(params: CrmNewLoginVerifyListParams) {
  return useQuery({
    queryKey: ['crmNewLoginVerifyList', params],
    queryFn: () =>
      apiFormPostCustom<CrmNewLoginVerifyListRes>('/system/crmNewLoginVerify/list', params),
  });
}

/**
 * 获取审核-绑定审核
 */
export function useBindVerifyList(params: BindVerifyListParams) {
  return useQuery({
    queryKey: ['crmUserBindVerifyList', params],
    queryFn: () => apiFormPostCustom<BindVerifyListRes>('/system/crmUserBindVerify/list', params),
  });
}

/**
 * 获取审核-杠杆审核
 */
export function useLeverageVerifyList(params: LeverageVerifyListParams) {
  return useQuery({
    queryKey: ['crmLeverageVerifyList', params],
    queryFn: () => apiFormPostCustom<LeverageVerifyListRes>('system/crmLeverVerify/list', params),
  });
}
