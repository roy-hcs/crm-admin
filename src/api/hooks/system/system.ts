import { apiFormPostCustom, apiGet, FormValue } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  CrmUserParams,
  CrmUserResponse,
  RegCountReportItem,
  ServerListResponse,
  SumReport,
  SymbolReportParams,
  SymbolReportResponse,
  TagUserItem,
  WithDrawReportItem,
} from './types';

export function useWithDrawReport(type?: string) {
  return useQuery({
    queryKey: ['withdrawReport', type],
    queryFn: () =>
      apiGet<WithDrawReportItem[]>(`/system/withdrawReport${type ? `?type=${type}` : ''}`),
  });
}

export function useFundFlowReport(type?: string) {
  return useQuery({
    queryKey: ['fundFlowReport', type],
    queryFn: () =>
      apiGet<Record<string, [number, number]>>(
        `/system/fundFlowReport${type ? `?type=${type}` : ''}`,
      ),
  });
}

export function useSymbolReport(params: SymbolReportParams) {
  return useQuery({
    queryKey: ['symbolReport', params],
    queryFn: () => apiFormPostCustom<SymbolReportResponse>('/system/symbolReport', params),
  });
}

export function useServerList(params: Record<string, FormValue> = {}) {
  return useQuery({
    queryKey: ['serverList', params],
    queryFn: () => apiFormPostCustom<ServerListResponse>('/system/mtService/list', params),
  });
}

export function useRegCountReport(type: string) {
  return useQuery({
    queryKey: ['regCountReport', type],
    queryFn: () => apiGet<RegCountReportItem>(`/system/regCountReport?type=${type}`),
  });
}

export function useDepositAllReport(type: string) {
  return useQuery({
    queryKey: ['depositAllReport', type],
    queryFn: () =>
      apiGet<Record<string, [number, number]>>(`/system/depositAllReport?type=${type}`),
  });
}

export function useSumReport() {
  return useQuery({
    queryKey: ['sumReport'],
    queryFn: () => apiGet<SumReport>('/system/sumReport'),
  });
}

// query can be route, userId, accounts, origin
export function useCrmUser(params: CrmUserParams, query?: string) {
  return useQuery({
    queryKey: ['crmUser', params, query],
    queryFn: () =>
      apiFormPostCustom<CrmUserResponse>(`/system/crmUser/list${query ? '?' + query : ''}`, params),
  });
}

export function useTagUserCountList() {
  return useQuery({
    queryKey: ['tagUserCountList'],
    queryFn: () => apiGet<TagUserItem[]>('/system/crmUser/tagsUserCountList'),
  });
}
