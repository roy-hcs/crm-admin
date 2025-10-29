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
  CurrencyListResponse,
  DictTypeResponse,
  ChannelListResponse,
  InfoTypeItem,
  RoleListRes,
  RoleListParams,
  MtServiceUpdateRes,
  TclosureReportResponse,
  ServerExceptionNoticeRes,
  PreferencesRes,
  MenuListItem,
  EmailListParams,
  EmailListRes,
  UserOrderLogListParams,
  UserOrderLogListRes,
  UserListParams,
  UserListRes,
  BonusSettingListParams,
  BonusSettingListRes,
  AdminOperLogParams,
  AdminOperLogRes,
  AdminLoginParams,
  AdminLoginRes,
  CrmLogininforParams,
  CrmLogininforRes,
  AdsListParams,
  AdsListRes,
  RewardRecordsListParams,
  RewardRecordsListRes,
  WalletAccountsListParams,
  WalletAccountsListRes,
  WalletAccountsListSumRes,
  WalletAccountsListSumParams,
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
export function useCustomerTransactionsReport(params: { type: string; serverId: string }) {
  return useQuery({
    queryKey: ['customerTransactionsReport', params.type, params.serverId],
    queryFn: () =>
      apiGet<TclosureReportResponse>(
        `/system/tclosureReport?type=${params.type}&serverId=${params.serverId}`,
      ),
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
/**
 * 获取操作类型 操作方式
 */
export function useDictType(type: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['DictType', type],
    queryFn: () => apiGetCustom<DictTypeResponse>(`/system/dict/type?dictType=${type}`, {}),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取钱包货币
 */
export function useCurrencyList() {
  return useQuery({
    queryKey: ['CurrencyList'],
    queryFn: () => apiFormPostCustom<CurrencyListResponse>(`/system/currency/list`, {}),
  });
}

/**
 * 获取支付通道
 */
export function useChannelList() {
  return useQuery({
    queryKey: ['getChannelList'],
    queryFn: () => apiGet<ChannelListResponse>(`/system/userOrder/getChannelList`, {}),
  });
}

/***
 * 获取信息类型
 */
export function useInfoTypeList() {
  return useQuery({
    queryKey: ['getInfoTypeList'],
    queryFn: () => apiGet<InfoTypeItem[]>(`/system/crmInfoVerify/getInfoVerifyType`, {}),
  });
}

export function useRolesList(params: RoleListParams) {
  return useQuery({
    queryKey: ['getRolesList', params],
    queryFn: () => apiFormPostCustom<RoleListRes>('/system/role/list', params),
  });
}

export function useUserRoleList(params: RoleListParams) {
  return useQuery({
    queryKey: ['getUserRoleList', params],
    queryFn: () => apiFormPostCustom<RoleListRes>('/system/user/role/list', params),
  });
}
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
 * 获取服务器异常
 */
export function useServerExceptionNotice() {
  return useQuery({
    queryKey: ['serverExceptionNotice'],
    queryFn: () => apiGetCustom<ServerExceptionNoticeRes | []>(`/system/serverExceptionNotice`),
  });
}
/**
 * 获取代办事项
 */
export function useGetPreferences() {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: () => apiGetCustom<PreferencesRes | []>('/system/getPreferences'),
  });
}

export function useMenuList(menuName?: string, visible?: string) {
  return useQuery({
    queryKey: ['menuList', { menuName, visible }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (menuName !== undefined) params.append('menuName', menuName);
      if (visible !== undefined) params.append('visible', String(visible));

      const queryString = params.toString();
      const url = `/system/menu/list${queryString ? `?${queryString}` : ''}`;

      return apiGetCustom<MenuListItem[]>(url);
    },
  });
}

export function useUserMenuList(menuName?: string, visible?: string) {
  return useQuery({
    queryKey: ['userMenuList', { menuName, visible }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (menuName !== undefined) params.append('menuName', menuName);
      if (visible !== undefined) params.append('visible', String(visible));

      const queryString = params.toString();
      const url = `/system/user/menu/list${queryString ? `?${queryString}` : ''}`;

      return apiGetCustom<MenuListItem[]>(url);
    },
  });
}

export function useEmailList(params: EmailListParams) {
  return useQuery({
    queryKey: ['emailList', params],
    queryFn: () => apiFormPostCustom<EmailListRes>('/system/msg/emailList', params),
  });
}

export function useUserOrderLogList(params: UserOrderLogListParams) {
  return useQuery({
    queryKey: ['userOrderLogList', params],
    queryFn: () => apiFormPostCustom<UserOrderLogListRes>('/system/crmUserOrderLog/list', params),
  });
}
/**
 * 系统管理-管理员账户
 */
export function useUserList(params: UserListParams) {
  return useQuery({
    queryKey: ['userList', params],
    queryFn: () => apiFormPostCustom<UserListRes>(`/system/user/list`, params || {}),
  });
}

/**
 * 获取角色列表
 */
export function useRoleList() {
  return useQuery({
    queryKey: ['roleList'],
    queryFn: () => apiFormPostCustom<RoleListRes>('/system/role/list', {}),
  });
}

export function useBonusSettingList(params: BonusSettingListParams) {
  return useQuery({
    queryKey: ['bonusSettingList', params],
    queryFn: () =>
      apiFormPostCustom<BonusSettingListRes>(`/system/marketing/bonusSetting/list`, params),
  });
}
/**
 * 系统管理-日志管理-管理员操作日志
 */
export function useAdminOperLogList(params: AdminOperLogParams) {
  return useQuery({
    queryKey: ['adminOperLogList', params],
    queryFn: () => apiFormPostCustom<AdminOperLogRes>(`/monitor/operlog/list`, params),
  });
}

/**
 * 系统管理-日志管理-管理员登录日志
 */
export function useAdminLoginList(params: AdminLoginParams) {
  return useQuery({
    queryKey: ['adminLoginList', params],
    queryFn: () => apiFormPostCustom<AdminLoginRes>(`/monitor/logininfor/list`, params),
  });
}

/**
 * 系统管理-日志管理-CRM用户登录日志
 */
export function useCrmLogininfor(params: CrmLogininforParams) {
  return useQuery({
    queryKey: ['crmLogininfor', params],
    queryFn: () => apiFormPostCustom<CrmLogininforRes>(`/monitor/crmLogininfor/list`, params),
  });
}

/**
 * 获取广告管理
 */
export function useAdsList(params: AdsListParams) {
  return useQuery({
    queryKey: ['adsList', params],
    queryFn: () => apiFormPostCustom<AdsListRes>(`/system/marketing/advertise/list`, params),
  });
}

/**
 * 获取奖励记录
 */
export function useRewardRecordsList(params: RewardRecordsListParams) {
  return useQuery({
    queryKey: ['rewardRecordsList', params],
    queryFn: () =>
      apiFormPostCustom<RewardRecordsListRes>(`/system/marketing/rewardRecord/list`, params),
  });
}

/**
 * 获取钱包账户列表
 */
export function useWalletAccountsList(params: WalletAccountsListParams) {
  return useQuery({
    queryKey: ['walletAccountsList', params],
    queryFn: () => apiFormPostCustom<WalletAccountsListRes>(`/system/crmUserWallet/list`, params),
  });
}

/**
 * 获取钱包账户列表合计
 */
export function useWalletAccountsListSum() {
  return useMutation({
    mutationFn: (params: WalletAccountsListSumParams) =>
      apiFormPostCustom<WalletAccountsListSumRes>('/system/crmUserWallet/listSum', params),
  });
}
