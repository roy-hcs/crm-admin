// Rebate module API hooks
import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  RebateBasePointParams,
  RebateBasePointRes,
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
