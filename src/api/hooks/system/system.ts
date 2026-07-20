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
  EmailFailListRes,
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
  CrmUsersTags,
  MyInfoRes,
  EmailVerificationCodeRes,
  CrmUserProfileData,
  EditCrmUserInfoParams,
  UserTagProgressRes,
  UserKycTabRes,
  CrmUserInfo,
  RoleItem,
  CrmUserWalletItem,
  AddCrmUserWalletParams,
  CrmDealAccountListRes,
  CrmDealAccountListParams,
  AdjustBalanceParams,
  AdjustBalanceRes,
  CrmGroupRes,
  CrmAccountTypeRes,
  AgencyPreforOverviewParams,
  AgencyPreforOverviewRes,
  AgencyPreforOverviewTreeParams,
  AgencyPreforOverviewItem,
  IpWhiteListRes,
  AddWhiteListParams,
  AddUser,
  AddTempUser,
  UserDetail,
  UserPwdParams,
  AddRole,
  RoleMenuTreeDataItem,
  AddUserRole,
  AddManagementMenu,
  AddUserMenu,
  EditManagementMenu,
  EditUserMenu,
  DeleteMenuParams,
} from './types';
import { UserAccountOperationRes, UserRebateAccountTabRes } from '../agent/types';
import { BasicParams } from '@/api/types';

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
/***
 * 管理员角色列表
 */
export function useRolesList(params: RoleListParams) {
  return useQuery({
    queryKey: ['getRolesList', params],
    queryFn: () => apiFormPostCustom<RoleListRes>('/system/role/list', params),
  });
}

/**
 * 获取角色权限树
 */
export function useRoleMenuTreeData(roleId: string) {
  return useQuery({
    queryKey: ['roleMenuTreeData', roleId],
    queryFn: () =>
      apiGetCustom<RoleMenuTreeDataItem[]>(
        `/system/menu/roleMenuTreeData${roleId ? `?roleId=${roleId}` : ''}`,
      ),
  });
}

/**
 * 获取前台用户角色权限树
 */
export function useUserRoleMenuTreeData(roleId: string) {
  return useQuery({
    queryKey: ['userRoleMenuTreeData', roleId],
    queryFn: () =>
      apiGetCustom<RoleMenuTreeDataItem[]>(
        `/system/user/menu/roleMenuTreeData${roleId ? `?roleId=${roleId}&roleSource=1` : ''}`,
      ),
  });
}

/***
 * 验证管理员角色名称是否唯一
 */
export function useCheckRoleNameUnique() {
  return useMutation({
    mutationFn: (params: { roleName: string; roleId?: string }) =>
      apiFormPostCustom<number>('/system/role/checkRoleNameUnique', params),
  });
}

/***
 * 验证前台用户角色名称是否唯一
 */
export function useCheckUserRoleNameUnique() {
  return useMutation({
    mutationFn: (params: { roleName: string; roleId?: string }) =>
      apiFormPostCustom<number>('/system/user/role/checkRoleNameUnique', params),
  });
}

/***
 * 管理员新增角色
 */
export function useAddRole() {
  return useMutation({
    mutationFn: (params: AddRole) => apiFormPost('/system/role/add', params),
  });
}

/***
 * 前台用户新增角色
 */
export function useAddUserRole() {
  return useMutation({
    mutationFn: (params: AddUserRole) => apiFormPost('/system/user/role/add', params),
  });
}

/***
 * 前台用户编辑角色
 */
export function useEditUserRole() {
  return useMutation({
    mutationFn: (params: AddUserRole & { roleId: string }) =>
      apiFormPost('/system/user/role/edit', params),
  });
}

/***
 * 管理员编辑角色
 */
export function useEditRole() {
  return useMutation({
    mutationFn: (params: AddRole & { roleId: string }) => apiFormPost('/system/role/edit', params),
  });
}

/***
 * 管理员删除角色
 */
export function useDeleteRole() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/role/remove', params),
  });
}

/***
 * 前台用户删除角色
 */
export function useDeleteUserRole() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/user/role/remove', params),
  });
}

/***
 * 管理员前台角色列表
 */
export function useUserRoleList(params: RoleListParams) {
  return useQuery({
    queryKey: ['getUserRoleList', params],
    queryFn: () => apiFormPostCustom<RoleListRes>('/system/user/role/list', params),
  });
}

/***
 * 管理员前台角色列表All
 */
export function useUserRoleListAll() {
  return useQuery({
    queryKey: ['getUserRoleListAll'],
    queryFn: () => apiFormPostCustom<RoleListRes>('/system/user/role/list', {}),
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

/***
 * 管理后台新增菜单
 */
export function useAddManagementMenu() {
  return useMutation({
    mutationFn: (params: AddManagementMenu) => apiFormPost('/system/menu/add', params),
  });
}

/***
 * 用户前台新增菜单
 */
export function useAddUserMenu() {
  return useMutation({
    mutationFn: (params: AddUserMenu) => apiFormPost('/system/user/menu/add', params),
  });
}

/***
 * 管理后台编辑菜单
 */
export function useEditManagementMenu() {
  return useMutation({
    mutationFn: (params: EditManagementMenu) => apiFormPost('/system/menu/edit', params),
  });
}

/***
 * 用户前台编辑菜单
 */
export function useEditUserMenu() {
  return useMutation({
    mutationFn: (params: EditUserMenu) => apiFormPost('/system/user/menu/edit', params),
  });
}

/***
 * 管理后台删除菜单
 */
export function useDeleteManagementMenu() {
  return useMutation({
    mutationFn: (params: DeleteMenuParams) => apiGet(`/system/menu/remove/${params.menuId}`),
  });
}

/***
 * 用户前台删除菜单
 */
export function useDeleteUserMenu() {
  return useMutation({
    mutationFn: (params: DeleteMenuParams) => apiGet(`/system/user/menu/remove/${params.menuId}`),
  });
}
// 邮件列表

export function useEmailList(params: EmailListParams) {
  return useQuery({
    queryKey: ['emailList', params],
    queryFn: () => apiFormPostCustom<EmailListRes>('/system/msg/emailList', params),
  });
}

// 邮件失败记录
export function useEmailFailList(
  msgUserId: string,
  open: boolean,
  params: Pick<BasicParams, 'pageNum' | 'orderByColumn' | 'isAsc'>,
) {
  return useQuery({
    queryKey: ['emailFailList', msgUserId, params],
    queryFn: () =>
      apiFormPostCustom<EmailFailListRes>(
        `/system/msgResendLog/emailFailList?msgUserId=${msgUserId}`,
        params,
      ),
    enabled: !!msgUserId && open,
  });
}
// 失败邮件重发配置详情
export function useGetFailEmailConfig() {
  return useMutation({
    mutationFn: () =>
      apiGetCustom<{
        code: number;
        data: {
          resendStatus: string;
          resendTimes: string;
        };
        msg: string;
      }>(`/system/msg/getFailEmailConfig`),
  });
}
// 失败邮件重发配置编辑
export function useSetFailEmailConfig() {
  return useMutation({
    mutationFn: (params: { resendStatus: string; resendTimes: string }) =>
      apiPost(
        `system/msg/editEmailAutoResendConfig?resendStatus=${params.resendStatus}&resendTimes=${params.resendTimes}`,
        {},
      ),
  });
}
// 邮箱详情
export function useGetEmailMsgDetail() {
  return useMutation({
    mutationFn: (id: string) =>
      apiGetCustom<{
        code: number;
        data: {
          content: string;
        };
        msg: string;
      }>(`/system/msg/getEmailMsgDetail/${id}`),
  });
}

// 重发邮箱详情
export function useGetResendEmailMsgDetail() {
  return useMutation({
    mutationFn: (params: { id: string; userMsgId: string }) =>
      apiGetCustom<{
        code: number;
        data: {
          allEmailConfig: Array<{
            id: string;
            email: string;
          }>;
        };
        msg: string;
      }>(`/system/msg/getResendInfo/${params.id}?userMsgId=${params.userMsgId}`),
  });
}

// 重发邮箱发送
export function useResendEmail() {
  return useMutation({
    mutationFn: (params: { id: string; userMsgId: string; sendEmail: string }) =>
      apiFormPost(`/system/msg/resend`, params),
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
      return apiPostFormData<{ url: string; code: number; msg?: string }>(
        '/common/upload',
        formData,
      );
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
 * 获取crm角色
 */
export function useCrmRole() {
  return useMutation({
    mutationFn: (params: {
      origin?: string;
      roleName?: string;
      pageNum?: number;
      pageSize?: number;
    }) => apiFormPostCustom<RoleListRes>('/system/user/role/list', params),
  });
}

/**
 * 获取crm组
 */
export function useCrmGroup() {
  return useMutation({
    mutationFn: ({
      params,
      serverId,
    }: {
      params: {
        origin?: string;
        pageNum?: number;
        pageSize?: number;
        params: {
          threeCons?: string;
        };
      };
      serverId: string;
    }) => apiFormPostCustom<CrmGroupRes>(`/system/mtServerGroup/list?serverId=${serverId}`, params),
  });
}

/**
 * 获取crm账号类型
 */
export function useCrmAccountType() {
  return useMutation({
    mutationFn: ({ serverId }: { serverId: string }) =>
      apiFormPostCustom<CrmAccountTypeRes>(
        `/system/mtServerTypeAssociation/allList?serverId=${serverId}`,
        {},
      ),
  });
}

/**
 * 获取crm标签
 */
export function useCrmTag() {
  return useMutation({
    mutationFn: (params: {
      status: string;
      tagName?: string;
      pageNum?: number;
      pageSize?: number;
    }) => apiFormPostCustom<CrmUsersTags>('/system/crmUserTag/list', params),
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
export function useGetUserWallets(crmUserId: string) {
  return useQuery({
    queryKey: ['GetUserWallet', crmUserId],
    queryFn: () =>
      apiFormPostCustom<CrmUserWalletItem[]>('system/crmUserWallet/crmUserWallets', { crmUserId }),
    enabled: !!crmUserId,
    staleTime: 0, // 数据立即视为过期，每次都重新请求
    gcTime: 0, // 不保留缓存
  });
}
export function useAddUserWallet() {
  return useMutation({
    mutationFn: (params: AddCrmUserWalletParams) =>
      apiFormPost('/system/crmUserDealDetail/add', params),
  });
}
export function useGetCrmDealAccountList(serverId: string) {
  return useMutation({
    mutationFn: (params: CrmDealAccountListParams) =>
      apiFormPostCustom<CrmDealAccountListRes>(
        `/system/crmDealAccount/accountList?serverId=${serverId}`,
        params,
      ),
  });
}
export function useAdjustBalance() {
  return useMutation({
    mutationFn: (params: AdjustBalanceParams) =>
      apiFormPost<AdjustBalanceRes>('/system/crmUserDeal/adjustBalances', params),
  });
}

/**
 * ib业绩概览普通列表
 */
export function useAgencyPreforOverviewList(
  params: AgencyPreforOverviewParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['agencyPreforOverviewList', params],
    queryFn: () =>
      apiFormPostCustom<AgencyPreforOverviewRes>(
        `/system/statistics/agencyPreforOverviewList`,
        params,
      ),
    enabled: options?.enabled ?? true,
  });
}

/**
 * ib业绩概览树形列表
 */
export function useAgencyPreforOverviewTreeList(
  params: AgencyPreforOverviewTreeParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['agencyPreforOverviewTreeList', params],
    queryFn: () =>
      apiGetCustom<AgencyPreforOverviewRes>(
        `/system/statistics/agencyPreforOverviewTreeList?pageSize=${params.pageSize}&pageNum=${params.pageNum}&serverId=${params.serverId}&serverType=${params.serverType}&parentId=${params.parentId}`,
      ),
    enabled: options?.enabled ?? true,
  });
}

/**
 * ib业绩概览树形查看子数据
 */
export function useAgencyPreforOverviewTreeChildren() {
  return useMutation({
    mutationFn: (params: { serverId: string; serverType: string; parentId: string }) =>
      apiGetCustom<AgencyPreforOverviewItem[]>(
        `/system/statistics/agencyPreforOverviewTreeChildren?serverId=${params.serverId}&serverType=${params.serverType}&parentId=${params.parentId}`,
      ),
  });
}

/**
 * 系统管理-ip白名单
 */
export function useIpWhiteList(params?: BasicParams) {
  return useQuery({
    queryKey: ['ipWhiteList', params],
    queryFn: () => apiFormPostCustom<IpWhiteListRes>(`/system/ip/white/list`, params || {}),
  });
}

/**
 * 修改ip白名单状态
 */
export function useChangeIpWhiteStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiFormPost('/system/ip/white/changeStatus', params),
  });
}

/**
 * 删除ip白名单
 */
export function useDeleteIpWhiteList() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/ip/white/remove', params),
  });
}

/**
 * 新增白名单
 */
export function useAddWhiteList() {
  return useMutation({
    mutationFn: (params: AddWhiteListParams) => apiFormPost('/system/ip/white/add', params),
  });
}

/**
 * 编辑白名单
 */
export function useEditWhiteList() {
  return useMutation({
    mutationFn: (
      params: AddWhiteListParams & {
        id: string;
      },
    ) => apiFormPost('/system/ip/white/edit', params),
  });
}

/**
 * 系统管理-ip白名单 是否启用
 */
export function useChangeWhiteListStatus() {
  return useMutation({
    mutationFn: (params: { ipWhiteStatus: boolean }) =>
      apiFormPost(`/system/ip/white/ipWhiteStatus`, params),
  });
}

/**
 * 系统管理-ip白名单 默认状态
 */
export function useIpWhiteListDefaultStatus() {
  return useMutation({
    mutationFn: () => apiGet('/system/ip/white/isOpen'),
  });
}

/**
 * 管理员账户-普通账户-修改状态
 */
export function useChangeUserStatus() {
  return useMutation({
    mutationFn: (params: { userId: string; status: number }) =>
      apiFormPost('/system/user/changeStatus', params),
  });
}

/**
 * 管理员账户-普通账户-新增普通用户
 */
export function useAddUser() {
  return useMutation({
    mutationFn: (params: AddUser) => apiFormPost('/system/user/add', params),
  });
}

/**
 * 管理员账户-普通账户-编辑普通用户
 */
export function useEditUser() {
  return useMutation({
    mutationFn: (
      params: AddUser & {
        userId: string;
      },
    ) => apiFormPost('/system/user/edit', params),
  });
}

/**
 * 管理员账户-普通账户-新增临时管理员
 */
export function useAddTempUser() {
  return useMutation({
    mutationFn: (params: AddTempUser) => apiFormPost('/system/user/add/temp', params),
  });
}

export function useCheckUserEmailUnique() {
  return useMutation({
    mutationFn: (params: { email: string; name: string; userId?: string }) =>
      apiFormPostCustom<number>('/system/user/checkEmailUnique', params),
  });
}

/**
 * 管理员账户-普通账户-获取用户详情
 */
export function useGetUserDetail() {
  return useMutation({
    mutationFn: (params: { userId: string }) =>
      apiGetCustom<UserDetail>(`/system/user/detail/${params.userId}`),
  });
}

export function useResetUserPwd() {
  return useMutation({
    mutationFn: (params: UserPwdParams) => apiFormPost('/system/user/resetPwd', params),
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/user/remove', params),
  });
}

export function useForceLogoutUser() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost(`/system/user/forceLogout/${params.ids}`, {}),
  });
}

export function useUnbindGoogleUser() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost(`/system/user/google/unbind/${params.ids}`, {}),
  });
}
