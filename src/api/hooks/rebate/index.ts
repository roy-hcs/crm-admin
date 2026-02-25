// Rebate module API hooks
import { apiFormPost, apiFormPostCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AddRebateBasePointParams,
  AddRebateBaseTypeParams,
  EditRebateBasePointParams,
  EditRebateBaseTypeParams,
  MtRebateBaseTypeRes,
  RebateBasePointParams,
  RebateBasePointRes,
  RebateBaseTypeParams,
  RebateBaseTypeRes,
  RebateDepositSettingsListParams,
  RebateDepositSettingsListRes,
  RebateFeeSettingsListParams,
  RebateFeeSettingsListRes,
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
 * 新增点值
 */
export function useAddRebateBasePoint() {
  return useMutation({
    mutationFn: (params: AddRebateBasePointParams) =>
      apiFormPost('/system/crmRebateBasePointValue/add', params),
  });
}
/**
 * 编辑点值
 */
export function useEditRebateBasePoint() {
  return useMutation({
    mutationFn: (params: EditRebateBasePointParams) =>
      apiFormPost('/system/crmRebateBasePointValue/edit', params),
  });
}
/**
 * 删除点值
 */
export function useDeleteRebateBasePoint() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/crmRebateBasePointValue/remove', params),
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
 * 获取mt品种组列表
 */
export function useMtRebateBaseTypeList(serverId: string, { enabled }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['getRebateBaseTypeList', serverId],
    queryFn: () =>
      apiFormPostCustom<MtRebateBaseTypeRes>(
        `/system/crmRebateBaseType/mt/getAllSymbol?serverId=${serverId}`,
        {},
      ),
    enabled,
  });
}
/**
 * 新增品种组
 */
export function useAddRebateBaseType() {
  return useMutation({
    mutationFn: (params: AddRebateBaseTypeParams) =>
      apiFormPost('/system/crmRebateBaseType/add', params),
  });
}
/**
 * 编辑品种组
 */
export function useEditRebateBaseType() {
  return useMutation({
    mutationFn: (params: EditRebateBaseTypeParams) =>
      apiFormPost('/system/crmRebateBaseType/edit', params),
  });
}

/**
 * 删除品种组
 */
export function useDeleteRebateBaseType() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/crmRebateBaseType/remove', params),
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
/**
 * 获取手续费返佣设置
 */
export function useRebateFeeSettingsList(params: RebateFeeSettingsListParams) {
  return useQuery({
    queryKey: ['getRebateFeeSettingsList', params],
    queryFn: () =>
      apiFormPostCustom<RebateFeeSettingsListRes>('/system/crmRebateTraderCommission/list', params),
  });
}
/**
 * 获取入金返佣设置
 */
export function useRebateDepositSettingsList(params: RebateDepositSettingsListParams) {
  return useQuery({
    queryKey: ['getRebateDepositSettingsList', params],
    queryFn: () =>
      apiFormPostCustom<RebateDepositSettingsListRes>(
        '/system/crmRebateTraderInMoney/list',
        params,
      ),
  });
}
