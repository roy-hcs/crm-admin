import {
  apiDelete,
  apiFormPost,
  apiFormPostCustom,
  apiGet,
  apiGetCustom,
  apiPost,
} from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AgentAccountStatsRes,
  AgentCommissionRes,
  AgentFundsRes,
  AgentNewAccountRes,
  AgentTradeRes,
  CreateCustomerFollowupParams,
  CustomerFollowupRes,
  KycInfoProtocolRes,
  KycInfoRes,
  UserWalletDetail,
  UserWalletListRes,
} from './types';
import { BasicParams } from '../review';

/**
 * 获取代理账户统计数据
 */
export function useGetAgentAccountStats(userId: string) {
  return useQuery({
    queryKey: ['GetAgentAccountStats', userId],
    queryFn: () => apiGet<AgentAccountStatsRes>(`/system/agentDashboard/account/${userId}`),
    enabled: !!userId,
  });
}
/**
 * 获取代理账户返佣统计数据
 */
export function useGetAgentCommissionStats(userId: string) {
  return useQuery({
    queryKey: ['GetAgentCommissionStats', userId],
    queryFn: () => apiGet<AgentCommissionRes>(`/system/agentDashboard/commission/${userId}`),
    enabled: !!userId,
  });
}
/**
 * 获取代理账户新账户统计数据
 */
export function useGetAgentNewAccountStats(userId: string, day: string) {
  return useQuery({
    queryKey: ['GetAgentNewAccountStats', userId, day],
    queryFn: () =>
      apiGet<AgentNewAccountRes>(`/system/agentDashboard/newAccount/${userId}?days=${day}`),
    enabled: !!userId,
  });
}
/**
 * 获取代理账户资金统计数据
 */
export function useGetAgentFundStats(userId: string, day: string, serverId: string) {
  return useQuery({
    queryKey: ['GetAgentFundStats', userId, day, serverId],
    queryFn: () =>
      apiGet<AgentFundsRes>(
        `/system/agentDashboard/found/${userId}?days=${day}&serverId=${serverId}`,
      ),
    enabled: !!userId && !!serverId,
  });
}
/**
 * 获取代理账户交易统计数据
 */
export function useGetAgentTradeStats(userId: string, day: string, serverId: string) {
  return useQuery({
    queryKey: ['GetAgentTradeStats', userId, day, serverId],
    queryFn: () =>
      apiGet<AgentTradeRes>(
        `/system/agentDashboard/trade/${userId}?days=${day}&serverId=${serverId}`,
      ),
    enabled: !!userId && !!serverId,
  });
}
/**
 * 获取客户跟进情况
 */
export function useGetAgentCustomerFollowup(
  userId: string,
  beginTime: string = '',
  endTime: string = '',
  remind?: number,
) {
  const searchParams = new URLSearchParams();
  searchParams.append('userId', userId);
  if (beginTime) searchParams.append('beginTime', beginTime || '');
  if (endTime) searchParams.append('endTime', endTime || '');
  if (remind) searchParams.append('remind', remind.toString());
  const queryString = searchParams.toString();
  return useQuery({
    queryKey: ['GetAgentCustomerFollowup', userId, beginTime, endTime, remind],
    queryFn: () =>
      apiGetCustom<CustomerFollowupRes>(`/system/customerFollowUp/list?${queryString}`),
    enabled: !!userId,
  });
}
/**
 * 创建跟进记录
 */
export function useCreateAgentCustomerFollowup() {
  return useMutation({
    mutationFn: (params: CreateCustomerFollowupParams) =>
      apiPost('/system/customerFollowUp/add', params),
  });
}
/**
 * 编辑跟进记录
 */
export function useEditAgentCustomerFollowup() {
  return useMutation({
    mutationFn: (params: { id: string; title: string; content: string }) =>
      apiPost('/system/customerFollowUp/edit', params),
  });
}
/**
 * 删除跟进记录
 */
export function useDeleteAgentCustomerFollowup() {
  return useMutation({
    mutationFn: (params: { id: string }) =>
      apiDelete(`/system/customerFollowUp/remove?id=${params.id}`),
  });
}
/**
 * 更新账户操作权限
 */
export function useEditAccountOperate() {
  return useMutation({
    mutationFn: (params: { id: string; permissionJson: string; crmAuthority: string }) =>
      apiPost('/system/crmUser/editAccountOperate', params),
  });
}
/**
 * 获取kyc信息 2个人信息 3财务信息 4身份信息
 */
export function useGetKycColumnInfo(userId: string, type: '2' | '3' | '4') {
  return useQuery({
    queryKey: ['getKycColumnInfo', userId, type],
    queryFn: () => apiGet<KycInfoRes>(`/system/crmUser/manageInfo/${type}/${userId}?from=1`),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
/**
 * 获取kyc信息-协议确认
 */
export function useGetKycInfoProtocolInfo(userId: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['getKycProtocolInfo', userId],
    queryFn: () =>
      apiGet<KycInfoProtocolRes>(
        `/system/crmUserProtocolRelation/oneUserProtocol/${userId}?from=1`,
      ),
    enabled: !!userId && options.enabled,
  });
}
/**
 * 编辑kyc信息 2个人信息 3财务信息 4身份信息
 */
export function useEditKycColumnInfo(type: '2' | '3' | '4', userId: string) {
  return useMutation({
    mutationFn: (params: { id: string; columnValue: string }[]) =>
      apiPost(`/system/crmUser/manage/${type}/${userId}`, params),
  });
}
/**
 * 获取用户钱包列表信息
 */
export function useGetUserWalletList(userId: string, params: BasicParams) {
  return useQuery({
    queryKey: ['getUserWalletList', userId, params],
    queryFn: () =>
      apiFormPostCustom<UserWalletListRes>(
        `/system/crmUserWallet/listByUser?userId=${userId}`,
        params,
      ),
    enabled: !!userId,
  });
}
/**
 * 删除用户钱包
 */
export function useDeleteUserWallet() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('system/crmUserWallet/remove', params),
  });
}
/**
 * 编辑钱包的账号权限
 */
export function useEditUserWalletAccountPerm() {
  return useMutation({
    mutationFn: (params: { id: string; permissionJson: string }) =>
      apiFormPost('/system/crmUserWallet/edit', params),
  });
}
/**
 * 获取用户钱包详情
 */
export function useGetUserWalletDetail(id: string) {
  return useQuery({
    queryKey: ['getUserWalletDetail', id],
    queryFn: () => apiGet<UserWalletDetail>(`/system/crmUserWallet/detailInfo/${id}`),
    enabled: !!id,
  });
}
