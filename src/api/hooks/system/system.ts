import {
  apiFormPost,
  apiFormPostCustom,
  apiGet,
  apiGetCustom,
  apiPost,
  apiPostFormData,
} from '@/api/client';
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
  AccountItem,
  WalletItem,
  MtServerItem,
  AccountInfo,
  AddAccountParams,
  CrmUsers,
  CrmUsersParams,
  CrmUsersTagsParams,
  CrmUsersTags,
  MyInfoRes,
  EmailVerificationCodeRes,
  CrmUserProfileData,
  EditCrmUserInfoParams,
  UserTagProgressRes,
  UserKycTabRes,
  CrmUserInfo,
  RoleItem,
} from './types';
import { UserAccountOperationRes, UserRebateAccountTabRes } from '../agent/types';

// Note: useWithDrawReport, useFundFlowReport, useSymbolReport, useRegCountReport, useDepositAllReport, useCustomerTransactionsReport, useSumReport moved to @/api/hooks/workbench

/**
 * 获取服务器列表 - shared across multiple modules
 */
export function useServerList() {
  return useQuery({
    queryKey: ['serverList'],
    queryFn: () => apiFormPostCustom<ServerListResponse>('/system/mtService/list'),
  });
}

export function useRebateLevelList() {
  return useQuery({
    queryKey: ['rebateLevelList'],
    queryFn: () => apiFormPostCustom<RebateLevelListResponse>('/system/crmRebateLevel/list'),
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
 * 获取操作类型 操作方式 非hook版本
 */
export function useGetDictType() {
  return useMutation({
    mutationFn: (type: string) =>
      apiGetCustom<DictTypeResponse>(`/system/dict/type?dictType=${type}`, {}),
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
    queryFn: () => apiGetCustom<ChannelListResponse>(`/system/userOrder/getChannelList`, {}),
  });
}

/***
 * 获取信息类型
 */
export function useInfoTypeList() {
  return useQuery({
    queryKey: ['getInfoTypeList'],
    queryFn: () => apiGetCustom<InfoTypeItem[]>(`/system/crmInfoVerify/getInfoVerifyType`, {}),
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
export function useUserList(params?: UserListParams) {
  return useQuery({
    queryKey: ['userList', params],
    queryFn: () => apiFormPostCustom<UserListRes>(`/system/user/list`, params || {}),
  });
}
export function useMutationUserList() {
  return useMutation({
    mutationFn: (params: UserListParams) =>
      apiFormPostCustom<UserListRes>(`/system/user/list`, params),
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

/**
 * 删除Crm账户
 */
export function useCrmUserRemove() {
  return useMutation({
    mutationFn: (params: { id: string; deleteType: string }) =>
      apiFormPost('/system/crmUser/remove', params),
  });
}

/**
 * 交易账号-重置密码
 */
export function useCrmDealAccountResetPwd() {
  return useMutation({
    mutationFn: (params: { accountId: string; pwdType: string; pwd: string }) =>
      apiFormPost('/system/crmDealAccount/resetPwd', params),
  });
}

/**
 * 交易账号-重置密码mt5获取密码长度配置
 */

export function useMtServerGroup(serverId?: string, account?: string) {
  return useQuery({
    queryKey: ['MtServerGroup', { serverId, account }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (serverId !== undefined) params.append('serverId', serverId);
      if (account !== undefined) params.append('account', String(account));

      const queryString = params.toString();
      const url = `/system/mtServerGroup/getGroupByServerAndAccount${queryString ? `?${queryString}` : ''}`;

      return apiGetCustom<{
        groupId: string | null;
        minpwdlength: number | null;
        maxpwdlength: number | null;
      }>(url);
    },
  });
}

/**
 * crm账户 删除账户 账户信息
 */
export function useCrmUserConfirmRemoveInfo(userId: string) {
  return useQuery({
    queryKey: ['CrmUserConfirmRemoveInfo', userId],
    queryFn: () =>
      apiFormPostCustom<{
        accountList: AccountItem[];
        walletList: WalletItem[];
      }>(`/system/crmUser/confirmCrmRemoveInfo/${userId}`, {}),
  });
}

/**
 * crm账户-新增交易账号-获取服务器 /system/crmDealAccount/mtgroup/3/1
 */
export function useGetServer() {
  return useMutation({
    // 服务器类型 1 2 3 4 5
    mutationFn: (serverType: string) =>
      apiFormPostCustom<MtServerItem[]>(`/system/crmDealAccount/mtgroup/${serverType}/1`, {}),
  });
}

/**
 * crm账户-新增交易账号-获取杠杆
 */
export function useGetLever() {
  return useMutation({
    // 服务器类型 1 2 3 4 5
    mutationFn: (serverType: string) =>
      apiFormPostCustom<string[]>(`/system/crmDealAccount/mtlever/${serverType}`, {}),
  });
}

/**
 * crm账户-新增交易账号-获取组别 上面有相同的接口 这个接口不需要直接获取数据
 */

export function useGetGroup() {
  return useMutation({
    mutationFn: (serverId: string) =>
      apiFormPostCustom<string[]>(`/system/crmDealAccount/getGroup/${serverId}`, {}),
  });
}

/**
 * crm账户-新增交易账号-选择组别后 获取账号信息
 */
export function useGetAccountInfo() {
  return useMutation({
    mutationFn: (params: { serverId: string; groupName: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: AccountInfo;
      }>('/system/mtServerGroup/getMtServerGroupByServerIdAndGroupName', params),
  });
}
/**
 * crm账户-新增交易账号-提交
 */
export function useAddAccount() {
  return useMutation({
    mutationFn: (params: AddAccountParams) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: AccountInfo;
      }>('/system/crmDealAccount/add', params),
  });
}

/**
 * 钱包账户-获取钱包
 */
export function useGetCurrencies(userId: string) {
  return useQuery({
    queryKey: ['currencies', userId],
    queryFn: () => apiFormPostCustom<string[]>('/system/crmUserWallet/getCurrencies', { userId }),
    enabled: !!userId,
  });
}

/**
 * 上传文件 common/upload
 */
export function useUploadFile() {
  return useMutation({
    // 直接传入 File，由 hook 内部构造 FormData
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiPostFormData<{ url: string; code: number }>('/common/upload', formData);
    },
  });
}
/*
 * 获取系统配置信息
 */
export function useGetSysConfig(key: string) {
  return useQuery({
    queryKey: ['GetSysConfig', key],
    queryFn: () => apiGetCustom<number | string>(`/system/config/getConfig?key=${key}`),
  });
}
/**
 * 获取crm用户
 */
export function useCrmUsers() {
  return useMutation({
    mutationFn: (params: CrmUsersParams) =>
      apiFormPostCustom<CrmUsers>('/system/crmUser/listBase', params),
  });
}

/**
 * 获取crm用户标签
 */
export function useCrmUserTags() {
  return useMutation({
    mutationFn: (params: CrmUsersTagsParams) =>
      apiFormPostCustom<CrmUsersTags>('/system/crmUserTag/list', params),
  });
}

/**
 * 获取当前登录用户信息
 */
export function useGetMyInfo() {
  return useQuery({
    queryKey: ['GetMyInfo'],
    queryFn: () => apiGetCustom<MyInfoRes>('/system/user/profile/getMyInfo'),
  });
}

/**
 * 获取邮箱验证码
 */
export function useGetEmailVerificationCode() {
  return useMutation({
    mutationFn: (params: { method: string; target: string; email: string }) =>
      apiGetCustom<EmailVerificationCodeRes>(
        `/verify/message/email/${params.method}/${params.target}?email=${params.email}`,
      ),
  });
}

/**
 * 获取手机验证码
 */
export function useGetPhoneVerificationCode() {
  return useMutation({
    mutationFn: (params: { method: string; target: string; phone: string }) =>
      apiGetCustom<EmailVerificationCodeRes>(
        `/verify/message/phone/${params.method}/${params.target}?phoneNum=${params.phone}`,
      ),
  });
}

/**
 * 提交修改邮箱 或者 手机
 */
export function usePostEmailChange() {
  return useMutation({
    mutationFn: (params: { method: string; target: string; address: string; code: string }) =>
      apiFormPostCustom<EmailVerificationCodeRes>(`/verify/message/check`, params),
  });
}

/**
 * 个人中心-重置密码
 */
export function useRestPwd() {
  return useMutation({
    mutationFn: (params: { newPassword: string; confirmPassword: string }) =>
      apiFormPost('/system/user/profile/resetPwd', params),
  });
}

/**
 * 个人中心-解绑谷歌验证器
 */
export function useUnbind() {
  return useMutation({
    mutationFn: (params: { code: string; password: string }) =>
      apiPost('/googleAuthenticator/unbind', params),
  });
}

/**
 * 个人中心-绑定谷歌验证器
 */
export function useBind() {
  return useMutation({
    mutationFn: (params: { code: string; password: string; key: string }) =>
      apiPost('/googleAuthenticator/bind', params),
  });
}

/**
 * 个人中心-更新用户信息
 */
export function useUpdateUserProfile() {
  return useMutation({
    mutationFn: (params: { userLastName: string; userName: string }) =>
      apiFormPost('/system/user/profile/update', params),
  });
}

/**
 * 个人中心-更新用户头像
 */
export function useUpdateUserAvatar() {
  return useMutation({
    mutationFn: (params: { filePath: string }) =>
      apiFormPost('/system/user/profile/updateAvatar', params),
  });
}

/**
 * 获取谷歌绑定信息
 */
export function useGetGoogleBindInfo() {
  return useQuery({
    queryKey: ['GetGoogleBindInfo'],
    queryFn: () =>
      apiGet<{
        code: string;
        key: string;
      }>('/googleAuthenticator/bindInfo'),
  });
}
/**
 * 获取用户信息
 */
export function useGetUserProfile(userId: string) {
  return useQuery({
    queryKey: ['GetUserProfile', userId],
    queryFn: () => apiGet<CrmUserProfileData>(`/system/crmUser/getUserInfo?id=${userId}`),
    enabled: !!userId,
  });
}
/**
 * 获取用户关键信息
 */
export function useGetUserTagProgress(userId: string) {
  return useQuery({
    queryKey: ['GetUserTagProgress', userId],
    queryFn: () => apiGet<UserTagProgressRes>(`/system/crmUser/getUserTagProgress?id=${userId}`),
    enabled: !!userId,
  });
}
/**
 * 获取用户kyc tab信息
 */
export function useGetUserKycTab(userId: string) {
  return useQuery({
    queryKey: ['GetUserKycTab', userId],
    queryFn: () => apiGet<UserKycTabRes>(`/system/crmUser/getKycInfo/${userId}`),
    enabled: !!userId,
  });
}
/**
 * 获取账户操作信息
 */
export function useGetUserAccountOperation(userId: string) {
  return useQuery({
    queryKey: ['GetUserAccountOperation', userId],
    queryFn: () => apiFormPost<UserAccountOperationRes>(`/system/crmUser/manage/6/${userId}`),
    enabled: !!userId,
  });
}
/**
 * 获取返佣账户tab信息
 */
export function useGetUserRebateAccountTab(userId: string) {
  return useQuery({
    queryKey: ['GetUserRebateAccountTab', userId],
    queryFn: () =>
      apiGet<UserRebateAccountTabRes>(`/system/crmUserRebateTemplate/getRebateAccount/${userId}`),
    enabled: !!userId,
  });
}
/**
 * 编辑用户备注信息
 */
export function useEditUserRemark() {
  return useMutation({
    mutationFn: (params: { id: string; adminRemark: string }) =>
      apiFormPost('/system/crmUser/editAdminRemark', params),
  });
}
/**
 * 编辑用户信息
 */
export function useEditCrmUserInfo() {
  return useMutation({
    mutationFn: (params: EditCrmUserInfoParams) => apiFormPost('/system/crmUser/edit', params),
  });
}
//

/**
 * 获取用户信息
 */
export function useGeCrmUserInfo(userId: string) {
  return useQuery({
    queryKey: ['GetUserInfo', userId],
    queryFn: () => apiGetCustom<CrmUserInfo>(`/system/crmUser/getUserInfo?id=${userId}`),
  });
}

export function useGetUserRoles() {
  return useQuery({
    queryKey: ['GetUserRoles'],
    queryFn: () => apiFormPost<RoleItem[]>(`/system/user/role/getAllRole`),
  });
}
