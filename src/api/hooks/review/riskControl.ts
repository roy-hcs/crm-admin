import { apiGet } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  RiskAccountRow,
  RiskCurrentStatParams,
  RiskOrderDetailParams,
  RiskOrderDetailRes,
  RiskStatParams,
  RiskUmbrellaStatParams,
} from './types';

const RISK_CONTROL_PREFIX = '/system/crmWithdrawVerify/crmWithdrawRiskControl';

function buildQuery(params: Record<string, string | number | null | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      search.append(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

/**
 * 本人全部交易账号
 */
export function useRiskControlOwnStat(
  userId: string,
  params: RiskStatParams,
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['riskControlOwnStat', userId, params],
    queryFn: async () => {
      const res = await apiGet<RiskAccountRow[]>(
        `${RISK_CONTROL_PREFIX}/stat/${userId}${buildQuery({ ...params })}`,
      );
      return res.code === 0 ? res.data || [] : [];
    },
    enabled: options.enabled && !!userId,
    staleTime: 60_000,
  });
}

/**
 * 本次出金账号（钱包出金时后端返回虚拟的 Wallet 行）
 */
export function useRiskControlCurrentStat(
  userId: string,
  params: RiskCurrentStatParams,
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['riskControlCurrentStat', userId, params],
    queryFn: async () => {
      const res = await apiGet<RiskAccountRow | null>(
        `${RISK_CONTROL_PREFIX}/currentStat/${userId}${buildQuery({ ...params })}`,
      );
      return res.code === 0 ? res.data || null : null;
    },
    enabled: options.enabled && !!userId,
    staleTime: 60_000,
  });
}

/**
 * 代理伞下账号
 */
export function useRiskControlUmbrellaStat(
  userId: string,
  params: RiskUmbrellaStatParams,
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['riskControlUmbrellaStat', userId, params],
    queryFn: async () => {
      const res = await apiGet<RiskAccountRow[]>(
        `${RISK_CONTROL_PREFIX}/umbrellaStat/${userId}${buildQuery({ ...params })}`,
      );
      return res.code === 0 ? res.data || [] : [];
    },
    enabled: options.enabled && !!userId,
    staleTime: 60_000,
  });
}

/**
 * 订单明细弹窗
 */
export function useRiskControlOrderDetail(
  params: RiskOrderDetailParams | null,
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['riskControlOrderDetail', params],
    queryFn: async () => {
      const res = await apiGet<RiskOrderDetailRes>(
        `${RISK_CONTROL_PREFIX}/orderDetail${buildQuery({ ...params! })}`,
      );
      if (res.code !== 0) {
        throw new Error(res.msg || '');
      }
      return res.data;
    },
    enabled: options.enabled && !!params,
    staleTime: 60_000,
  });
}
