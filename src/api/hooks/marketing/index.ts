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
  NetBonusRewardReportsListParams,
  NetBonusRewardReportsRes,
  NetBonusRewardReportsTotal,
  NetBonusRewardStatisticsListParams,
  NetBonusRewardStatisticsRes,
  RewardRecordReviewDetailRes,
  RewardRecordVerifyParams,
  NetBonusRewardRecordsListParams,
  NetBonusRewardRecordsRes,
  NetBonusRewardRecordsTotalRes,
  NetBonusRewardRecordReviewDetailRes,
  NetBonusRewardRecordVerifyParams,
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
 * 获取奖励记录审核详情
 */
export function useRewardRecordReviewDetail(recordId: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['rewardRecordReviewDetail', recordId],
    queryFn: () =>
      apiGetCustom<RewardRecordReviewDetailRes>(
        `/system/crmRewardVerify/viewDetailInfo/${recordId}`,
      ),
    enabled: options.enabled,
  });
}

/**
 * 奖励记录审核提交
 */
export function useRewardRecordVerify() {
  return useMutation({
    mutationFn: (params: RewardRecordVerifyParams) =>
      apiFormPost(`/system/crmRewardVerify/verify`, params),
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
/**
 * 获取净入金奖励报表
 */
export function useGetNetBonusRewardReports(params: NetBonusRewardReportsListParams) {
  return useQuery({
    queryKey: ['netBonusRewardReports', params],
    queryFn: () =>
      apiFormPostCustom<NetBonusRewardReportsRes>('/system/statistics/netStatisticList', params),
  });
}
/**
 * 导出净入金奖励报表
 */
export function useExportNetBonusRewardReports() {
  return useMutation({
    mutationFn: (params: NetBonusRewardReportsListParams) =>
      apiFormPost('/system/statistics/netStatisticExport', params),
  });
}

/**
 * 获取净入金奖励总计数据
 */
export function useGetNetBonusRewardReportsTotal() {
  return useMutation({
    mutationFn: (params: NetBonusRewardReportsListParams) =>
      apiFormPost<NetBonusRewardReportsTotal>(
        '/system/marketing/netDepositBonus/recordListSum',
        params,
      ),
  });
}

/**
 * 获取净入金统计报表
 */
export function useGetNetBonusRewardStatistics(params: NetBonusRewardStatisticsListParams) {
  return useQuery({
    queryKey: ['netBonusRewardStatistics', params],
    queryFn: () =>
      apiFormPostCustom<NetBonusRewardStatisticsRes>(
        '/system/statistics/netDataStatisticList',
        params,
      ),
  });
}

/**
 * 导出净入金统计报表
 */
export function useExportNetBonusRewardStatistics() {
  return useMutation({
    mutationFn: (params: NetBonusRewardStatisticsListParams) =>
      apiFormPost('/system/statistics/netDataStatisticExport', params),
  });
}

/**
 * 获取净入金奖励记录
 */
export function useGetNetBonusRewardRecords(params: NetBonusRewardRecordsListParams) {
  return useQuery({
    queryKey: ['netBonusRewardRecords', params],
    queryFn: () =>
      apiFormPostCustom<NetBonusRewardRecordsRes>(
        '/system/marketing/netDepositBonus/recordList',
        params,
      ),
  });
}

/**
 * 导出净入金奖励记录
 */
export function useExportNetBonusRewardRecords() {
  return useMutation({
    mutationFn: (params: NetBonusRewardRecordsListParams) =>
      apiFormPost('/system/statistics/netStatisticExport', params),
  });
}

/**
 * 获取净入金奖励记录总计数据
 */
export function useGetNetBonusRewardRecordsTotal() {
  return useMutation({
    mutationFn: (params: NetBonusRewardRecordsListParams) =>
      apiFormPost<NetBonusRewardRecordsTotalRes>(
        '/system/marketing/netDepositBonus/recordListSum',
        params,
      ),
  });
}
/**
 * 净入金奖励记录批量审核
 */
export function useBatchVerifyNetBonusRewardRecords() {
  return useMutation({
    mutationFn: (params: { id: string; status: string; remark?: string }) =>
      apiFormPost<NetBonusRewardRecordsTotalRes>(
        '/system/marketing/netDepositBonus/verify',
        params,
      ),
  });
}

/**
 * 删除净入金奖励记录
 */
export function useRemoveRecord() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/marketing/netDepositBonus/recordRemove', params),
  });
}

/**
 * 获取净入金奖励记录审核详情
 */
export function useNetBonusRewardRecordReviewDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['netBonusRewardRecordReviewDetail', id],
    queryFn: () =>
      apiGetCustom<NetBonusRewardRecordReviewDetailRes>(
        `/system/marketing/netDepositBonus/viewDetailInfo/${id}`,
      ),
    enabled: options.enabled,
  });
}

/**
 * 净入金奖励记录审核详情审核提交
 */
export function useNetBonusRewardRecordVerify() {
  return useMutation({
    mutationFn: (params: NetBonusRewardRecordVerifyParams) =>
      apiFormPost(`/system/marketing/netDepositBonus/verify`, params),
  });
}
