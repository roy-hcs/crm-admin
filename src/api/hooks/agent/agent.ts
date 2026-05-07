import { apiDelete, apiGet, apiGetCustom, apiPost } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AgentAccountStatsRes,
  AgentCommissionRes,
  AgentFundsRes,
  AgentNewAccountRes,
  AgentTradeRes,
  CreateCustomerFollowupParams,
  CustomerFollowupRes,
} from './types';

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
