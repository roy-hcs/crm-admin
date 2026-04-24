import { apiFormPostCustom, apiGet, apiPost } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BaseSettingsParams,
  BaseSettingsRes,
  MamFollowListParams,
  MamFollowListRes,
  MamProtocolListParams,
  MamProtocolListRes,
  MamSignalSourceListParams,
  MamSignalSourceListRes,
  MamSignalSourceVerifyListParams,
  MamSignalSourceVerifyListRes,
  MamSymbolListParams,
  MamSymbolListRes,
  PerformanceFeeListParams,
  PerformanceFeeListRes,
  FeeConfigParams,
  SubscriptionSettingParams,
  PerformanceFeeParams,
  LoyaltyRewardParams,
} from './type';

export function useChangeMamSignalSource() {
  return useMutation({
    mutationFn: (params: { id: string; publicShow: number }) =>
      apiFormPostCustom<{
        code: number;
      }>('/system/mamSignalSource/edit', params),
  });
}
/**
 * 信号源列表
 */
export function useMamSignalSourceList(params: MamSignalSourceListParams) {
  return useQuery({
    queryKey: ['mamSignalSourceList', params],
    queryFn: () =>
      apiFormPostCustom<MamSignalSourceListRes>(`/system/mamSignalSource/list`, params),
  });
}

/**
 * 信号源审核列表
 */
export function useMamSignalSourceVerifyList(params: MamSignalSourceVerifyListParams) {
  return useQuery({
    queryKey: ['mamSignalSourceVerifyList', params],
    queryFn: () =>
      apiFormPostCustom<MamSignalSourceVerifyListRes>(
        `/system/mamSignalSourceVerify/verifyList`,
        params,
      ),
  });
}

/**
 * 品种管理
 */
export function useMamSymbolList(params: MamSymbolListParams) {
  return useQuery({
    queryKey: ['mamSymbolList', params],
    queryFn: () => apiFormPostCustom<MamSymbolListRes>(`/system/mamSymbol/list`, params),
  });
}

/**
 * 表现费记录
 */
export function usePerformanceFeeList(params: PerformanceFeeListParams) {
  return useQuery({
    queryKey: ['performanceFeeList', params],
    queryFn: () => apiFormPostCustom<PerformanceFeeListRes>(`/system/performanceFee/list`, params),
  });
}
/**
 * 协议设置
 */
export function useMamProtocolList(params: MamProtocolListParams) {
  return useQuery({
    queryKey: ['mamProtocolList', params],
    queryFn: () => apiFormPostCustom<MamProtocolListRes>('/system/mamProtocol/list', params),
  });
}

/**
 * 订单管理
 */
export function useMamFollowList(params: MamFollowListParams) {
  return useQuery({
    queryKey: ['mamFollowList', params],
    queryFn: () => apiFormPostCustom<MamFollowListRes>('/system/mamFollow/list', params),
  });
}

/**
 * 获取copytranding 所有配置信息
 */
export function useGetBaseSettings() {
  return useQuery({
    queryKey: ['BaseSettings'],
    queryFn: () => apiGet<BaseSettingsRes>(`/system/mamConfig/info?tab=1`),
  });
}

/**
 * 编辑copytranding 基础配置信息
 */
export function useEditBaseSettings() {
  return useMutation({
    mutationFn: (params: BaseSettingsParams) => apiPost('/system/mamConfig/edit', params),
  });
}

/**
 * 编辑copytranding 费用配置信息
 */
export function useEditFeeConfig() {
  return useMutation({
    mutationFn: (params: FeeConfigParams) => apiPost('/system/mamConfig/edit', params),
  });
}

/**
 * 编辑copytranding 订阅跟单设置
 */
export function useEditSubscriptionSetting() {
  return useMutation({
    mutationFn: (params: SubscriptionSettingParams) => apiPost('/system/mamConfig/edit', params),
  });
}

/**
 * 编辑copytranding 表现费返佣
 */
export function useEditPerformanceFeeRebate() {
  return useMutation({
    mutationFn: (params: PerformanceFeeParams) => apiPost('/system/mamConfig/edit', params),
  });
}

/**
 * 编辑copytranding 忠诚奖励
 */
export function useEditLoyaltyReward() {
  return useMutation({
    mutationFn: (params: LoyaltyRewardParams) => apiPost('/system/mamConfig/edit', params),
  });
}
