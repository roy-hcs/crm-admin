import { apiFormPostCustom, apiGet, apiGetCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  WithDrawReportItem,
  SymbolReportParams,
  SymbolReportResponse,
  RegCountReportItem,
  SumReport,
  MtServiceUpdateRes,
  TclosureReportResponse,
  ServerExceptionNoticeRes,
  PreferencesRes,
} from './types';

/**
 * 工作台 - 平台概览 - 提现报表
 */
export function useWithDrawReport(type?: string) {
  return useQuery({
    queryKey: ['withdrawReport', type],
    queryFn: () =>
      apiGet<WithDrawReportItem[]>(`/system/withdrawReport${type ? `?type=${type}` : ''}`),
  });
}

/**
 * 工作台 - 平台概览 - 资金流水报表
 */
export function useFundFlowReport(type?: string) {
  return useQuery({
    queryKey: ['fundFlowReport', type],
    queryFn: () =>
      apiGet<Record<string, [number, number]>>(
        `/system/fundFlowReport${type ? `?type=${type}` : ''}`,
      ),
  });
}

/**
 * 工作台 - 平台概览 - 交易品种报表
 */
export function useSymbolReport(params: SymbolReportParams) {
  return useQuery({
    queryKey: ['symbolReport', params],
    queryFn: () => apiFormPostCustom<SymbolReportResponse>('/system/symbolReport', params),
  });
}

// Note: useServerList moved back to @/api/hooks/system (shared across multiple modules)

/**
 * 工作台 - 平台概览 - 注册统计报表
 */
export function useRegCountReport(type: string) {
  return useQuery({
    queryKey: ['regCountReport', type],
    queryFn: () => apiGet<RegCountReportItem>(`/system/regCountReport?type=${type}`),
  });
}

/**
 * 工作台 - 平台概览 - 入金报表
 */
export function useDepositAllReport(type: string) {
  return useQuery({
    queryKey: ['depositAllReport', type],
    queryFn: () =>
      apiGet<Record<string, [number, number]>>(`/system/depositAllReport?type=${type}`),
  });
}

/**
 * 工作台 - 平台概览 - 客户交易报表
 */
export function useCustomerTransactionsReport(params: { type: string; serverId: string }) {
  return useQuery({
    queryKey: ['customerTransactionsReport', params.type, params.serverId],
    queryFn: () =>
      apiGet<TclosureReportResponse>(
        `/system/tclosureReport?type=${params.type}&serverId=${params.serverId}`,
      ),
  });
}

/**
 * 工作台 - 平台概览 - 汇总报表
 */
export function useSumReport() {
  return useQuery({
    queryKey: ['sumReport'],
    queryFn: () => apiGet<SumReport>('/system/sumReport'),
  });
}

/**
 * 工作台 - 交易统计 - MT服务更新状态
 */
export function useMtServiceUpdate(
  params: {
    server: string;
  },
  options?: { enabled?: boolean },
) {
  const { server } = params;
  return useQuery({
    queryKey: ['MtServiceUpdate', server],
    queryFn: () =>
      apiFormPostCustom<MtServiceUpdateRes>(`/system/mtService/updateSta`, params || {}),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 工作台 - 平台概览 - 服务器异常通知
 */
export function useServerExceptionNotice() {
  return useQuery({
    queryKey: ['serverExceptionNotice'],
    queryFn: () => apiGetCustom<ServerExceptionNoticeRes | []>(`/system/serverExceptionNotice`),
  });
}

/**
 * 工作台 - 平台概览 - 获取待办事项
 */
export function useGetPreferences() {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: () => apiGetCustom<PreferencesRes | []>('/system/getPreferences'),
  });
}
