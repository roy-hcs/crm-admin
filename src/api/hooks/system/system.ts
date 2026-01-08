import { apiFormPost, apiFormPostCustom, apiGet, apiGetCustom, FormValue } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CrmRebateTradersItem,
  RebateLevelListResponse,
  ServerListResponse,
  CurrencyListResponse,
  DictTypeResponse,
  ChannelListResponse,
  InfoTypeItem,
  RoleListRes,
  RoleListParams,
  MenuListItem,
  EmailListParams,
  EmailListRes,
  UserOrderLogListParams,
  UserOrderLogListRes,
  UserListParams,
  UserListRes,
  AdminOperLogParams,
  AdminOperLogRes,
  AdminLoginParams,
  AdminLoginRes,
  CrmLoginInfoParams,
  CrmLogininforRes,
  UserInfoRes,
} from './types';

// Note: useWithDrawReport, useFundFlowReport, useSymbolReport, useRegCountReport, useDepositAllReport, useCustomerTransactionsReport, useSumReport moved to @/api/hooks/workbench

/**
 * 获取服务器列表 - shared across multiple modules
 */
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
// Note: useMtServiceUpdate, useServerExceptionNotice, useGetPreferences moved to @/api/hooks/workbench

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

// Note: useBonusSettingList moved to @/api/hooks/marketing

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
export function useCrmLoginInfo(params: CrmLoginInfoParams) {
  return useQuery({
    queryKey: ['crmLogininfor', params],
    queryFn: () => apiFormPostCustom<CrmLogininforRes>(`/monitor/crmLogininfor/list`, params),
  });
}

// Note: useAdsList, useRewardRecordsList moved to @/api/hooks/marketing

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

// Note: useGetMsgList moved to @/api/hooks/message

// Note: useCustomerRelationsPost moved to @/api/hooks/account

// Note: useGetRebateBasePoint, useSelectServerList moved to @/api/hooks/rebate

/**
 * 修改Crm账户密码
 */
export function useCrmUserResetPwd() {
  return useMutation({
    mutationFn: (params: { id: string; pwd: string; confirmPassword: string }) =>
      apiFormPost('/system/crmUser/resetPwd', params),
  });
}

/**
 * 修改Crm账户资金密码
 */
export function useCrmUserResetFundsPwd() {
  return useMutation({
    mutationFn: (params: { id: string; dealPwd: string; dealConfirmPassword: string }) =>
      apiFormPost('/system/crmUser/dealpwd', params),
  });
}
