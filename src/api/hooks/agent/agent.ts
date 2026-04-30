import { apiGet } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  AgentAccountStatsRes,
  AgentCommissionRes,
  AgentFundsRes,
  AgentNewAccountRes,
  AgentTradeRes,
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
