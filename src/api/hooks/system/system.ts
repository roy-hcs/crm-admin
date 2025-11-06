import { apiFormPostCustom, apiGet, apiGetCustom, FormValue } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  CrmRebateTradersItem,
  RebateLevelListResponse,
  RegCountReportItem,
  ServerListResponse,
  SumReport,
  SymbolReportParams,
  SymbolReportResponse,
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
  UserInfoRes,
  GetMsgListParams,
  GetMsgListRes,
  RebateBasePointParams,
  RebateBasePointRes,
  SelectServerListRes,
  SelectServerListParams,
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

// Note: useCrmUser, useTagUserCountList, useCustomerRelationsPostList, useChangeUserStatus moved to @/api/hooks/account

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

// Note: useGetGroupByServer, useGetDealAccountGroupList moved to @/api/hooks/account
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

// Note: useCrmDealAccountList, useWalletAccountsList, useWalletAccountsListSum, useCrmDealAccountGroupList moved to @/api/hooks/account

/**
 * 获取用户信息
 */

export function useGetUserInfo() {
  return useQuery({
    queryKey: ['GetUserInfo'],
    queryFn: () => apiGetCustom<UserInfoRes>('/system/user/profile/getUserInfo'),
  });
}

export function useGetMsgList(params: GetMsgListParams) {
  return useQuery({
    queryKey: ['MsgList', params],
    queryFn: () => apiFormPostCustom<GetMsgListRes>('/system/msg/list', params),
  });
}
// Note: useCustomerRelationsPost moved to @/api/hooks/account

export function useGetRebateBasePoint(params: RebateBasePointParams) {
  return useQuery({
    queryKey: ['getRebateBasePoint', params],
    queryFn: () =>
      apiFormPostCustom<RebateBasePointRes>('/system/crmRebateBasePointValue/list', params),
  });
}

export function useSelectServerList(
  params: SelectServerListParams,
  options: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['selectServerList', params],
    queryFn: () => apiFormPostCustom<SelectServerListRes>('/system/mtService/servers', params),
    enabled: options?.enabled ?? true,
  });
}
