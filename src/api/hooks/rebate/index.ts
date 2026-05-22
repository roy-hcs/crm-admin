// Rebate module API hooks
import { apiFormPost, apiFormPostCustom, apiGet, apiGetCustom, apiPost } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AddRebateBasePointParams,
  AddRebateBaseTypeParams,
  AddRebateFeeSettingParams,
  AddTradingRebateRuleParams,
  EditRebateBaseAddOrUpdateParams,
  EditRebateBasePointParams,
  EditRebateBaseTypeParams,
  EditRebateDepositAddOrUpdateParams,
  EditRebateFeeAddOrUpdateParams,
  GetMtAndRebateTypeRes,
  MtRebateBaseTypeRes,
  RebateBaseAddOrUpdate,
  RebateBasePointParams,
  RebateBasePointRes,
  RebateBaseTypeParams,
  RebateBaseTypeRes,
  RebateBasicSettingRes,
  RebateDepositAddOrUpdate,
  RebateDepositSettingsListParams,
  RebateDepositSettingsListRes,
  RebateFeeSettingDetail,
  RebateFeeSettingsHistoryListParams,
  RebateFeeSettingsHistoryListRes,
  RebateFeeAddOrUpdate,
  RebateFeeSettingsListParams,
  RebateFeeSettingsListRes,
  RebateLevelParams,
  RebateLevelRes,
  RebateTraderDealDetail,
  RebateTraderDealListParams,
  RebateTraderDealListRes,
  SelectServerListParams,
  SelectServerListRes,
  AddRebateDepositSettingParams,
  RebateDepositSettingsHistoryListRes,
  RebateSettingsTemplateListRes,
  AddRebateSettingsTemplateParams,
  CustomerCommissionParams,
  CustomerCommissionRes,
  TwoCommissionGroupParams,
  TwoCommissionGroupRes,
  RebateTwoCommissionGroupAddParams,
  TwoCommissionGroupDetailRes,
  SetCommissionTypeParams,
  GetCommissionTypeRes,
  LevelListRes,
  CustomerCommissionDetailRes,
  TraderUserChildrenRes,
  EditCustomerCommissionDetailParams,
} from './types';
import { BasicParams } from '../review';
import { RebateLevelItem } from '../system';

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
export function useRebateFeeSettingsList(
  params: RebateFeeSettingsListParams,
  { enabled }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ['getRebateFeeSettingsList', params],
    queryFn: () =>
      apiFormPostCustom<RebateFeeSettingsListRes>(
        `/system/crmRebateTraderCommission/list?model=${params.model}`,
        params,
      ),
    enabled,
  });
}
/**
 * 获取手续费/交易历史订单返佣
 */
export function useRebateSettingsHistoryList(
  params: RebateFeeSettingsHistoryListParams,
  id: number, // 1交易返佣设置 2手续费返佣设置 3入金返佣设置
  { enabled }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ['getRebateFeeSettingsHistoryList', params, id],
    queryFn: () =>
      apiFormPostCustom<RebateFeeSettingsHistoryListRes>(
        `/system/crmRebateHistoryDeal/deal-list/${id}`,
        params,
      ),
    enabled,
  });
}

/**
 * 获取入金历史订单返佣
 */
export function useRebateDepositSettingsHistoryList(
  params: RebateFeeSettingsHistoryListParams,
  { enabled }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ['getRebateFeeSettingsHistoryList', params],
    queryFn: () =>
      // 入金历史订单返佣的类型与其他两种不一致，需要单独处理
      apiFormPostCustom<RebateDepositSettingsHistoryListRes>(
        '/system/crmRebateHistoryDeal/deal-list/3',
        params,
      ),
    enabled,
  });
}
/**
 * 计算返佣
 */
export function useCalculateRebateFee() {
  return useMutation({
    mutationFn: (params: { timestamp: number; matchRuleType?: string; id: number }) =>
      apiFormPost(`system/crmRebateHistoryDeal/send-deal/${params.id}`, params),
  });
}
/**
 * 获取手续费返佣规则详情
 */
export function useGetRebateFeeSettingDetail(id: string, { enabled }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['getRebateFeeSettingDetail', id],
    queryFn: () => apiGet<RebateFeeSettingDetail>(`/system/crmRebateTraderCommission/detail/${id}`),
    enabled,
    staleTime: 0,
  });
}
/**
 * 新增手续费返佣设置
 */
export function useAddRebateFeeSetting() {
  return useMutation({
    mutationFn: (params: AddRebateFeeSettingParams) =>
      apiFormPost('/system/crmRebateTraderCommission/add', params),
  });
}
/**
 * 编辑手续费返佣设置
 */
export function useEditRebateFeeSetting() {
  return useMutation({
    mutationFn: (params: AddRebateFeeSettingParams & { id?: string }) =>
      apiFormPost('/system/crmRebateTraderCommission/edit', params),
  });
}
/**
 * 改变手续费返佣设置的状态
 */
export function useChangeRebateFeeSettingStatus() {
  return useMutation({
    mutationFn: (params: { id: string; hasUsed: string }) =>
      apiFormPost('/system/crmRebateTraderCommission/changeStatus', params),
  });
}
/**
 * 删除手续费返佣设置
 */
export function useDeleteRebateFeeSetting() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/crmRebateTraderCommission/remove', params),
  });
}
/**
 * 获取入金返佣设置
 */
export function useRebateDepositSettingsList(
  params: RebateDepositSettingsListParams,
  { enabled }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ['getRebateDepositSettingsList', params],
    queryFn: () =>
      apiFormPostCustom<RebateDepositSettingsListRes>(
        '/system/crmRebateTraderInMoney/list',
        params,
      ),
    enabled,
  });
}

/**
 * 新增入金返佣设置
 */
export function useAddRebateDepositSetting() {
  return useMutation({
    mutationFn: (params: AddRebateDepositSettingParams) =>
      apiFormPost('/system/crmRebateTraderInMoney/add', params),
  });
}
/**
 * 编辑入金返佣设置
 */
export function useEditRebateDepositSetting() {
  return useMutation({
    mutationFn: (params: AddRebateDepositSettingParams & { id?: string }) =>
      apiFormPost('/system/crmRebateTraderInMoney/edit', params),
  });
}
/**
 * 改变入金返佣设置的状态
 */
export function useChangeRebateDepositSettingStatus() {
  return useMutation({
    mutationFn: (params: { id: string; hasUsed: string }) =>
      apiFormPost('/system/crmRebateTraderInMoney/changeStatus', params),
  });
}

/**
 * 删除入金返佣设置
 */
export function useDeleteRebateDepositSetting() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/crmRebateTraderInMoney/remove', params),
  });
}

/**
 * 获取入金返佣设置详情
 */
export function useGetRebateDepositSettingDetail(
  id: string,
  { enabled }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ['getRebateDepositSettingDetail', id],
    queryFn: () => apiGet<RebateFeeSettingDetail>(`/system/crmRebateTraderInMoney/detail/${id}`),
    enabled,
    staleTime: 0,
  });
}
/**
 * 获取返佣基础设置
 */
export function useRebateBase(tab: '0' | '1' | '2' | '3') {
  return useQuery({
    queryKey: ['getRebateBase', tab],
    queryFn: () => apiGetCustom<RebateBasicSettingRes>(`/system/crmRebateBase/setInfo/${tab}`),
  });
}
/**
 * 修改返佣基础设置
 */
export function useEditRebateBase() {
  return useMutation({
    mutationFn: (params: { setting: string; manyRebate: string; num: string }) =>
      apiFormPost('/system/crmRebateBase/setBaseSetting', params),
  });
}

/**
 * 获取交易返佣设置
 */
export function useGetRebateBaseAddOrUpdate(tab: '0' | '1' | '2' | '3') {
  return useQuery({
    queryKey: ['getRebateBaseAddOrUpdate', tab],
    queryFn: () => apiGetCustom<RebateBaseAddOrUpdate>(`/system/crmRebateBase/setInfo/${tab}`),
  });
}

/**
 * 修改交易返佣设置
 */
export function useEditRebateBaseAddOrUpdate() {
  return useMutation({
    mutationFn: (params: EditRebateBaseAddOrUpdateParams) =>
      apiFormPost('/system/crmRebateBase/addOrUpdate', params),
  });
}

/**
 * 获取手续费返佣设置
 */
export function useGetRebateFeeAddOrUpdate(tab: '0' | '1' | '2' | '3') {
  return useQuery({
    queryKey: ['getRebateFeeAddOrUpdate', tab],
    queryFn: () => apiGetCustom<RebateFeeAddOrUpdate>(`/system/crmRebateBase/setInfo/${tab}`),
  });
}

/**
 * 修改手续费返佣设置
 */
export function useEditRebateFeeAddOrUpdate() {
  return useMutation({
    mutationFn: (params: EditRebateFeeAddOrUpdateParams) =>
      apiFormPost('/system/crmRebateBase/addOrUpdate', params),
  });
}

/**
 * 获取入金返佣设置
 */
export function useGetRebateDepositAddOrUpdate(tab: '0' | '1' | '2' | '3') {
  return useQuery({
    queryKey: ['getRebateDepositAddOrUpdate', tab],
    queryFn: () => apiGetCustom<RebateDepositAddOrUpdate>(`/system/crmRebateBase/setInfo/${tab}`),
  });
}

/**
 * 修改入金返佣设置
 */
export function useEditRebateDepositAddOrUpdate() {
  return useMutation({
    mutationFn: (params: EditRebateDepositAddOrUpdateParams) =>
      apiFormPost('/system/crmRebateBase/addOrUpdate', params),
  });
}

export function useGetRebateSettingsTemplate(type: number, params: BasicParams) {
  return useQuery({
    queryKey: ['getRebateSettingsTemplate', type, params],
    queryFn: () =>
      apiFormPostCustom<RebateSettingsTemplateListRes>(
        `/system/crmRebateTemplate/list/type/${type}`,
        params,
      ),
  });
}

export function useGetRebateLevelList(model: number) {
  return useQuery({
    queryKey: ['getRebateLevelList', model],
    queryFn: () =>
      apiFormPostCustom<RebateLevelItem[]>('/system/crmRebateLevel/getLevelList', { model }),
  });
}
export function useGetUniqueTemplateName() {
  return useMutation({
    mutationFn: (params: { name: string; rebateType: number; id?: string }) =>
      apiFormPostCustom<number>('/system/crmRebateTemplate/getUniqueName', params),
  });
}
export function useAddRebateSettingsTemplate(type: number) {
  return useMutation({
    mutationFn: (params: AddRebateSettingsTemplateParams) =>
      apiFormPost(`/system/crmRebateTemplate/add/${type}`, params),
  });
}
export function useEditRebateSettingsTemplate(type: number) {
  return useMutation({
    mutationFn: (params: AddRebateSettingsTemplateParams & { id?: string }) =>
      apiFormPost(`/system/crmRebateTemplate/edit/${type}`, params),
  });
}

export function useDeleteRebateSettingsTemplate(type: number) {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost(`/system/crmRebateTemplate/remove/${type}`, params),
  });
}

/**
 * 获取自定义佣金参数列表
 */
export function useCustomerCommissionList(
  params: CustomerCommissionParams,
  { enabled }: { enabled?: boolean } = { enabled: true },
) {
  return useQuery({
    queryKey: ['getCustomerCommissionList', params],
    queryFn: () =>
      apiFormPostCustom<CustomerCommissionRes>('/system/crmRebateCustomerCommission/list', params),
    enabled,
  });
}

/**
 * 获取自定义佣金参数详情
 */
export function useCustomerCommissionDetail(
  params: {
    traderId: string;
    userId: string;
  },
  { enabled }: { enabled?: boolean } = { enabled: true },
) {
  return useQuery({
    queryKey: ['getCustomerCommissionDetail', params],
    queryFn: () =>
      apiGetCustom<CustomerCommissionDetailRes>(
        `/system/crmRebateCustomerCommission/paramDetail?traderId=${params.traderId}&userId=${params.userId}`,
      ),
    enabled,
  });
}
/**
 * 获取交易员的下级用户列表（用于设置自定义佣金参数）
 */
export function useTraderUserChildren() {
  return useMutation({
    mutationFn: (params: { userId: string; traderId: string }) =>
      apiFormPostCustom<TraderUserChildrenRes>(
        `/system/crmRebateCustomerCommission/traderUserChildren`,
        params,
      ),
  });
}

/**
 * 编辑自定义佣金参数详情
 */
export function useEditCustomerCommissionDetail() {
  return useMutation({
    mutationFn: (params: EditCustomerCommissionDetailParams) =>
      apiPost(`/system/crmRebateCustomerCommission/save?userId=${params.userId}`, params.arr),
  });
}

/**
 * 获取佣金组设置列表
 */
export function useTwoCommissionGroupList(
  params: TwoCommissionGroupParams,
  { enabled }: { enabled?: boolean } = { enabled: true },
) {
  return useQuery({
    queryKey: ['getTwoCommissionGroupList', params],
    queryFn: () =>
      apiFormPostCustom<TwoCommissionGroupRes>(
        `/system/crmRebateTwoCommissionGroup/list/1/${params.rebateTraderId}`,
        params,
      ),
    enabled,
  });
}

/**
 * 获取 system/crmRebateTwoCommissionGroup/getLevelList
 */
export function useLevelList(
  params: {
    rebateTraderId: string;
    type: string;
  },
  { enabled }: { enabled?: boolean } = { enabled: true },
) {
  return useQuery({
    queryKey: ['getLevelList', params],
    queryFn: () =>
      apiFormPostCustom<LevelListRes>(`/system/crmRebateTwoCommissionGroup/getLevelList`, params),
    enabled,
  });
}

/**
 * 佣金组设置-删除佣金组
 */
export function useRemoveRebateGroup() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/crmRebateTwoCommissionGroup/remove', params),
  });
}

/**
 * 获取佣金组详情
 */
export function useTwoCommissionGroupDetail(
  params: {
    id: string;
  },
  { enabled }: { enabled?: boolean } = { enabled: true },
) {
  return useQuery({
    queryKey: ['getTwoCommissionGroupDetail', params],
    queryFn: () =>
      apiFormPostCustom<TwoCommissionGroupDetailRes>(
        `/system/crmRebateTwoCommissionGroup/getOneGroupData`,
        params,
      ),
    enabled,
  });
}

/**
 * 佣金组设置新增
 */
export function useRebateTwoCommissionGroupAdd() {
  return useMutation({
    mutationFn: (params: RebateTwoCommissionGroupAddParams) =>
      apiPost(`/system/crmRebateTwoCommissionGroup/addJson`, params),
  });
}

/**
 * 佣金组设置编辑
 */
export function useRebateTwoCommissionGroupEdit() {
  return useMutation({
    mutationFn: (params: RebateTwoCommissionGroupAddParams & { id: string }) =>
      apiPost(`/system/crmRebateTwoCommissionGroup/editJson`, params),
  });
}

/**
 * 获取佣金方案偏好设置
 */
export function useGetCommissionSetting({ enabled }: { enabled?: boolean } = { enabled: true }) {
  return useQuery({
    queryKey: ['getCommissionSetting'],
    queryFn: () =>
      apiGetCustom<GetCommissionTypeRes>(
        `/system/crmRebateCustomerCommission/getCommissionSetting`,
      ),
    enabled,
  });
}

/**
 * 编辑佣金方案偏好设置
 */
export function useSetCommissionType() {
  return useMutation({
    mutationFn: (params: SetCommissionTypeParams) =>
      apiPost(`/system/crmRebateCustomerCommission/setCommissionType`, params),
  });
}
