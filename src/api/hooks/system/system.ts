import { apiFormPost, apiFormPostCustom, apiGet, apiGetCustom, FormValue } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CrmRebateTradersItem,
  CrmUserParams,
  CrmUserResponse,
  CustomRelationsItem,
  DealAccountGroupListResponse,
  GetGroupByServerResponse,
  RebateLevelListResponse,
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

export function useRebateLevelList(params: Record<string, FormValue> = {}) {
  return useQuery({
    queryKey: ['rebateLevelList', params],
    queryFn: () =>
      apiFormPostCustom<RebateLevelListResponse>('/system/crmRebateLevel/list', params),
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

export function useCustomerRelationsPostList(params: { userId: string } | null = null) {
  return useQuery({
    queryKey: ['customerRelationsPostList', params],
    queryFn: () =>
      apiFormPostCustom<CustomRelationsItem[]>(
        '/system/crmUser/customerRelationsPostList',
        params || {},
      ),
  });
}

export function useChangeUserStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiFormPost('/system/crmUser/changeStatus', params),
  });
}

/**
 * 获取组别列表
 */
export function useGroupList(serverId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['groupList', serverId],
    queryFn: () => apiFormPostCustom<string[]>(`/system/crmDealAccount/getGroup/${serverId}`, {}),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取命中规则列表
 * type: 1-交易返佣，2-手续费返佣， 3-入金返佣
 */
export function useGetCrmRebateTraders(type: string) {
  return useQuery({
    queryKey: ['getCrmRebateTraders', type],
    queryFn: () =>
      apiFormPostCustom<CrmRebateTradersItem[]>(
        `/system/crmRebateCommissionRule/getCrmRebateTraders?type=${type}`,
        {},
      ),
  });
}

export function useGetGroupByServer(params: { serverId: string }) {
  return useQuery({
    queryKey: ['getGroupByServer', params],
    queryFn: () =>
      apiFormPostCustom<GetGroupByServerResponse>('/system/mtServerGroup/getGroupByServer', params),
    enabled: !!params.serverId,
  });
}

export function useGetDealAccountGroupList() {
  return useQuery({
    queryKey: ['getDealAccountGroupList'],
    queryFn: () =>
      apiGetCustom<DealAccountGroupListResponse>('/system/crmDealAccount/getDealAccountGroupList'),
  });
}
