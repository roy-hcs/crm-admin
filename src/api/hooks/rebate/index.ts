// Rebate module API hooks
import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  RebateBasePointParams,
  RebateBasePointRes,
  RebateBaseTypeParams,
  RebateBaseTypeRes,
  RebateLevelParams,
  RebateLevelRes,
  RebateTraderDealListParams,
  RebateTraderDealListRes,
  SelectServerListParams,
  SelectServerListRes,
} from './types';

export * from './types';

/**
 * 获取返佣基点列表（Pip Value）
 */
export function useGetRebateBasePoint(params: RebateBasePointParams) {
  return useQuery({
    queryKey: ['getRebateBasePoint', params],
    queryFn: () =>
      apiFormPostCustom<RebateBasePointRes>('/system/crmRebateBasePointValue/list', params),
  });
}

/**
 * 获取服务器列表（用于选择）
 */
export function useSelectServerList(
  params: SelectServerListParams,
  options: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['selectServerList', params],
    queryFn: () => apiFormPostCustom<SelectServerListRes>('/system/mtService/servers', params),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取品种组列表
 */
export function useRebateBaseTypeList(params: RebateBaseTypeParams) {
  return useQuery({
    queryKey: ['getRebateBaseTypeList', params],
    queryFn: () => apiFormPostCustom<RebateBaseTypeRes>('/system/crmRebateBaseType/list', params),
  });
}

/**
 * 获取返佣层级列表
 */
export function useRebateLevelList(params: RebateLevelParams) {
  return useQuery({
    queryKey: ['getRebateLevelList', params],
    queryFn: () => apiFormPostCustom<RebateLevelRes>('/system/crmRebateLevel/list', params),
  });
}

/**
 * 获取交易返佣设置
 */
export function useRebateTraderDealList(params: RebateTraderDealListParams) {
  return useQuery({
    queryKey: ['getRebateTraderDealList', params],
    queryFn: () =>
      apiFormPostCustom<RebateTraderDealListRes>('/system/crmRebateTraderDeal/list', params),
  });
}
