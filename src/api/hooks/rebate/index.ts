// Rebate module API hooks
import { apiFormPost, apiFormPostCustom, apiGet } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AddRebateBasePointParams,
  AddRebateBaseTypeParams,
  AddTradingRebateRuleParams,
  EditRebateBasePointParams,
  EditRebateBaseTypeParams,
  GetMtAndRebateTypeRes,
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
  RebateTraderDealDetail,
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
export function useRebateLevelList(
  params: RebateLevelParams,
  { enabled }: { enabled?: boolean } = { enabled: true },
) {
  return useQuery({
    queryKey: ['getRebateLevelList', params],
    queryFn: () => apiFormPostCustom<RebateLevelRes>('/system/crmRebateLevel/list', params),
    enabled,
  });
}
/**
 * 返佣层级名称唯一性检查
 */
export function useGetUniqueName() {
  return useMutation({
    mutationFn: (params: { name: string }) =>
      apiFormPostCustom<number>('/system/crmRebateLevel/getUniqueName', params),
  });
}

/**
 * 新增返佣层级
 */
export function useAddRebateLevel() {
  return useMutation({
    mutationFn: (params: { level: string; levelName: string }) =>
      apiFormPost('/system/crmRebateLevel/add', params),
  });
}
/**
 * 编辑返佣层级
 */
export function useEditRebateLevel() {
  return useMutation({
    mutationFn: (params: { id: string; level: string; levelName: string }) =>
      apiFormPost('/system/crmRebateLevel/edit', params),
  });
}
/**
 * 删除返佣层级
 */
export function useDeleteRebateLevel() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/crmRebateLevel/remove', params),
  });
}

/**
 * 修改平越级设置
 */
export function useEditLevelSkippingSetting() {
  return useMutation({
    mutationFn: (params: { setting: string }) =>
      apiFormPost('/system/crmRebateLevel/setRebatePlatSetting', params),
  });
}

/**
 * 获取交易返佣设置
 */
export function useRebateTraderDealList(
  params: RebateTraderDealListParams,
  { enabled }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ['getRebateTraderDealList', params],
    queryFn: () =>
      apiFormPostCustom<RebateTraderDealListRes>('/system/crmRebateTraderDeal/list', params),
    enabled,
  });
}

/**
 * 修改交易返佣状态
 */
export function useEditRebateTraderDealStatus() {
  return useMutation({
    mutationFn: (params: { id: string; hasUsed: string }) =>
      apiFormPost('/system/crmRebateTraderDeal/changeStatus', params),
  });
}
/**
 * 交易返佣规则名称唯一性检查
 */
export function useCheckRebateTraderDealUnique() {
  return useMutation({
    mutationFn: (params: {
      name: string;
      id?: string;
      num: number;
      rebateType: string;
      model: string;
      language: string;
    }) => apiFormPostCustom<number>('/system/crmRebateTraderDeal/getUniqueName', params),
  });
}
/**
 * 新增交易返佣规则
 */
export function useAddRebateTraderDeal() {
  return useMutation({
    mutationFn: (params: AddTradingRebateRuleParams) =>
      apiFormPost('/system/crmRebateTraderDeal/add', params),
  });
}
/**
 * 编辑交易返佣规则
 */
export function useEditRebateTraderDeal() {
  return useMutation({
    mutationFn: (params: AddTradingRebateRuleParams & { id?: string }) =>
      apiFormPost('/system/crmRebateTraderDeal/edit', params),
  });
}
/**
 * 获取交易返佣规则详情
 */
export function useGetRebateTraderDealDetail(id: string, { enabled }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['getRebateTraderDealDetail', id],
    queryFn: () => apiGet<RebateTraderDealDetail>(`/system/crmRebateTraderDeal/detail/${id}`),
    enabled,
    staleTime: 0,
  });
}
/**
 * 删除交易返佣规则
 */
export function useDeleteRebateTraderDeal() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/crmRebateTraderDeal/remove', params),
  });
}
/**
 * 获取服务器对应的组别和品种组信息
 */
export function useGetMtAndRebateType() {
  return useMutation({
    mutationFn: (params: { serverId: string }) =>
      apiFormPostCustom<GetMtAndRebateTypeRes>(
        '/system/crmRebateTraderDeal/getMtAndRebateType',
        params,
      ),
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
