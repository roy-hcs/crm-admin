// Marketing module API hooks
import { apiFormPost, apiFormPostCustom, apiGet, apiGetCustom, apiPost } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BonusSettingListParams,
  BonusSettingListRes,
  AdsListParams,
  AdsListRes,
  RewardRecordsListParams,
  RewardRecordsListRes,
  AddAdsParams,
  AdsDetail,
} from './types';

export * from './types';

/**
 * 获取奖励配置列表（Bonus Setting）
 */
export function useBonusSettingList(params: BonusSettingListParams) {
  return useQuery({
    queryKey: ['bonusSettingList', params],
    queryFn: () =>
      apiFormPostCustom<BonusSettingListRes>(`/system/marketing/bonusSetting/list`, params),
  });
}

/**
 * 奖励配置 是否允许命中多条奖励状态
 */
export function useManyBonusStatus() {
  return useMutation({
    mutationFn: () =>
      apiGetCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/marketing/bonusSetting/manyBonusStatus', {}),
  });
}

/**
 * 奖励配置 是否允许命中多条奖励
 */
export function useBonusSettingManyBonus() {
  return useMutation({
    mutationFn: (params: { bonusSetting: boolean }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/marketing/bonusSetting/manyBonus', params),
  });
}

/**
 * 奖励配置 启用/禁用
 */
export function useBonusSettingSwitch() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiPost('/system/marketing/bonusSetting/switch', params),
  });
}

/**
 * 删除奖励配置
 */
export function useBonusSettingRemove() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/marketing/bonusSetting/remove', params),
  });
}

/**
 * 获取广告管理列表
 */
export function useAdsList(params: AdsListParams) {
  return useQuery({
    queryKey: ['adsList', params],
    queryFn: () => apiFormPostCustom<AdsListRes>(`/system/marketing/advertise/list`, params),
  });
}

/**
 * 修改广告状态
 */
export function useChangeAdsStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiPost('/system/marketing/advertise/switch', params),
  });
}

/**
 * 删除广告
 */
export function useRemoveAds() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/marketing/advertise/remove', params),
  });
}

/**
 * 获取广告详情
 */
export function useAdsDetail() {
  return useMutation({
    mutationFn: (id: string) => apiGet<AdsDetail>(`/system/marketing/advertise/detail/${id}`),
  });
}

/**
 * 添加广告
 */
export function useAddAds() {
  return useMutation({
    mutationFn: (params: AddAdsParams) => apiPost('/system/marketing/advertise/add', params),
  });
}

/**
 * 编辑广告
 */
export function useEditAds() {
  return useMutation({
    mutationFn: (params: AddAdsParams & { id: string }) =>
      apiPost('/system/marketing/advertise/edit', params),
  });
}

/**
 * 获取奖励记录列表
 */
export function useRewardRecordsList(params: RewardRecordsListParams) {
  return useQuery({
    queryKey: ['rewardRecordsList', params],
    queryFn: () =>
      apiFormPostCustom<RewardRecordsListRes>(`/system/marketing/rewardRecord/list`, params),
  });
}

/**
 * 设置奖励自动审核配置
 */
export function useRewardRecordSetVerifyConfig() {
  return useMutation({
    mutationFn: (params: {
      depositRewardChecked: string;
      closePositionRewardChecked: string;
      openAccountRewardChecked: string;
    }) =>
      apiPost(
        `/system/marketing/rewardRecord/setVerifyConfig?depositRewardChecked=${params.depositRewardChecked}&closePositionRewardChecked=${params.closePositionRewardChecked}&openAccountRewardChecked=${params.openAccountRewardChecked}`,
        {},
      ),
  });
}

/**
 * 获取奖励自动审核配置
 */
export function useGetRewardRecordSetVerifyConfig() {
  return useMutation({
    mutationFn: () =>
      apiGetCustom<{
        code: number;
        msg: string;
        data: {
          depositRewardChecked: string;
          closePositionRewardChecked: string;
          openAccountRewardChecked: string;
        };
      }>(`/system/marketing/rewardRecord/rewardVerifyConfigs`),
  });
}
