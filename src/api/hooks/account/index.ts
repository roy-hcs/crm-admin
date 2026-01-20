// Account module API hooks
import { apiFormPost, apiFormPostCustom, apiGet, apiGetCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CrmUserParams,
  CrmUserResponse,
  TagUserItem,
  CustomRelationsItem,
  CrmDealAccountListParams,
  CrmDealAccountListRes,
  WalletAccountsListParams,
  WalletAccountsListRes,
  WalletAccountsListSumParams,
  WalletAccountsListSumRes,
  CrmDealAccountGroupListParams,
  CrmDealAccountGroupListRes,
  GetGroupByServerResponse,
  DealAccountGroupListResponse,
  CustomerRelationsPostParams,
  CustomerRelationsPostRes,
  AddCrmUserParams,
} from './types';

export * from './types';

// CRM User hooks
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

export function useAddCrmUser() {
  return useMutation({
    mutationFn: (params: AddCrmUserParams) => apiFormPost<string>('/system/crmUser/add', params),
  });
}

export function useChangeUserStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiFormPost('/system/crmUser/changeStatus', params),
  });
}

// Trading Account hooks
export function useCrmDealAccountList(
  params: CrmDealAccountListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['crmDealAccountList', params],
    queryFn: () =>
      apiFormPostCustom<CrmDealAccountListRes>(`/system/crmDealAccount/serviceList`, params),
    enabled: options?.enabled ?? true,
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

// Wallet Account hooks
export function useWalletAccountsList(params: WalletAccountsListParams) {
  return useQuery({
    queryKey: ['walletAccountsList', params],
    queryFn: () => apiFormPostCustom<WalletAccountsListRes>(`/system/crmUserWallet/list`, params),
  });
}

export function useWalletAccountsListSum() {
  return useMutation({
    mutationFn: (params: WalletAccountsListSumParams) =>
      apiFormPostCustom<WalletAccountsListSumRes>('/system/crmUserWallet/listSum', params),
  });
}

// Account Group hooks
export function useCrmDealAccountGroupList(params: CrmDealAccountGroupListParams) {
  return useQuery({
    queryKey: ['crmDealAccountGroupList', params],
    queryFn: () =>
      apiFormPostCustom<CrmDealAccountGroupListRes>(`/system/crmDealAccountGroup/list`, params),
  });
}

// Customer Relations hooks
export function useCustomerRelationsPost(params: CustomerRelationsPostParams) {
  return useQuery({
    queryKey: ['customerRelationsPost', params],
    queryFn: () =>
      apiFormPostCustom<CustomerRelationsPostRes>(`/system/crmUser/customerRelationsPost`, params),
  });
}

/**
 * 交易账号-批量设置直属代理
 */
export function useSetBroker() {
  return useMutation({
    mutationFn: (params: { broker: string; ids: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/crmDealAccount/setBroker', params),
  });
}

/**
 * 交易账号-批量设置账号组
 */
export function useSetAccountGroup() {
  return useMutation({
    mutationFn: (params: { accountGroup: string; ids: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/crmDealAccount/setAccountGroup', params),
  });
}
/**
 * 交易账号-批量设置账号归属
 */
export function useSetAccountBelong() {
  return useMutation({
    mutationFn: (params: { newUserId: string; ids: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/crmDealAccount/setAccountBelong', params),
  });
}

/**
 * 交易账号-批量账号订单同步
 */
export function useBatchOrderSync() {
  return useMutation({
    mutationFn: (params: {
      startDate: string;
      endDate: string;
      accounts: string;
      serverId: string;
    }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/crmDealAccount/batchOrderSync', params),
  });
}

/**
 * 交易账号-余额调整
 */
export function useBalanceAdjust() {
  return useMutation({
    mutationFn: (params: {
      serverId: string;
      amount: string;
      operationType: string;
      remark: string;
      logins: string;
      opType: string;
    }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/crmUserDeal/adjustBalances', params),
  });
}
