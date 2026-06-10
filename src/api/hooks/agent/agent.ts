import {
  apiDelete,
  apiFormPost,
  apiFormPostCustom,
  apiGet,
  apiGetCustom,
  apiPost,
} from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AccountOperationListParams,
  AgentAccountStatsRes,
  AgentCommissionRes,
  AgentFundsRes,
  AgentNewAccountRes,
  AgentTradeRes,
  CreateCustomerFollowupParams,
  CustomerFollowupRes,
  CustomRebateData,
  GetRuleGroupsParams,
  GetTraderListParams,
  InviterCustomRebateItem,
  InviterLevelData,
  KycInfoProtocolRes,
  KycInfoRes,
  MtServerGroupRes,
  RebateSettingPageData,
  ReceiveAccountInfoParams,
  ReceiveAccountInfoRes,
  RuleGroupItem,
  SaveRebateSettingModel1Params,
  SaveRebateSettingModel2Params,
  SpreadLinkItem,
  TraderListItem,
  UpperInputRule,
  UserAccountActivityListRes,
  UserWalletDetail,
  UserWalletListRes,
} from './types';
import { BasicParams } from '../review';

/**
 * 获取代理账户统计数据
 */
export function useGetAgentAccountStats(userId: string) {
  return useQuery({
    queryKey: ['GetAgentAccountStats', userId],
    queryFn: () => apiGet<AgentAccountStatsRes>(`/system/agentDashboard/account/${userId}`),
    enabled: !!userId,
  });
}
/**
 * 获取代理账户返佣统计数据
 */
export function useGetAgentCommissionStats(userId: string) {
  return useQuery({
    queryKey: ['GetAgentCommissionStats', userId],
    queryFn: () => apiGet<AgentCommissionRes>(`/system/agentDashboard/commission/${userId}`),
    enabled: !!userId,
  });
}
/**
 * 获取代理账户新账户统计数据
 */
export function useGetAgentNewAccountStats(userId: string, day: string) {
  return useQuery({
    queryKey: ['GetAgentNewAccountStats', userId, day],
    queryFn: () =>
      apiGet<AgentNewAccountRes>(`/system/agentDashboard/newAccount/${userId}?days=${day}`),
    enabled: !!userId,
  });
}
/**
 * 获取代理账户资金统计数据
 */
export function useGetAgentFundStats(userId: string, day: string, serverId: string) {
  return useQuery({
    queryKey: ['GetAgentFundStats', userId, day, serverId],
    queryFn: () =>
      apiGet<AgentFundsRes>(
        `/system/agentDashboard/found/${userId}?days=${day}&serverId=${serverId}`,
      ),
    enabled: !!userId && !!serverId,
  });
}
/**
 * 获取代理账户交易统计数据
 */
export function useGetAgentTradeStats(userId: string, day: string, serverId: string) {
  return useQuery({
    queryKey: ['GetAgentTradeStats', userId, day, serverId],
    queryFn: () =>
      apiGet<AgentTradeRes>(
        `/system/agentDashboard/trade/${userId}?days=${day}&serverId=${serverId}`,
      ),
    enabled: !!userId && !!serverId,
  });
}
/**
 * 获取客户跟进情况
 */
export function useGetAgentCustomerFollowup(
  userId: string,
  beginTime: string = '',
  endTime: string = '',
  remind?: number,
) {
  const searchParams = new URLSearchParams();
  searchParams.append('userId', userId);
  if (beginTime) searchParams.append('beginTime', beginTime || '');
  if (endTime) searchParams.append('endTime', endTime || '');
  if (remind) searchParams.append('remind', remind.toString());
  const queryString = searchParams.toString();
  return useQuery({
    queryKey: ['GetAgentCustomerFollowup', userId, beginTime, endTime, remind],
    queryFn: () =>
      apiGetCustom<CustomerFollowupRes>(`/system/customerFollowUp/list?${queryString}`),
    enabled: !!userId,
  });
}
/**
 * 创建跟进记录
 */
export function useCreateAgentCustomerFollowup() {
  return useMutation({
    mutationFn: (params: CreateCustomerFollowupParams) =>
      apiPost('/system/customerFollowUp/add', params),
  });
}
/**
 * 编辑跟进记录
 */
export function useEditAgentCustomerFollowup() {
  return useMutation({
    mutationFn: (params: { id: string; title: string; content: string }) =>
      apiPost('/system/customerFollowUp/edit', params),
  });
}
/**
 * 删除跟进记录
 */
export function useDeleteAgentCustomerFollowup() {
  return useMutation({
    mutationFn: (params: { id: string }) =>
      apiDelete(`/system/customerFollowUp/remove?id=${params.id}`),
  });
}
/**
 * 更新账户操作权限
 */
export function useEditAccountOperate() {
  return useMutation({
    mutationFn: (params: { id: string; permissionJson: string; crmAuthority: string }) =>
      apiPost('/system/crmUser/editAccountOperate', params),
  });
}
/**
 * 获取kyc信息 2个人信息 3财务信息 4身份信息
 */
export function useGetKycColumnInfo(userId: string, type: '2' | '3' | '4') {
  return useQuery({
    queryKey: ['getKycColumnInfo', userId, type],
    queryFn: () => apiGet<KycInfoRes>(`/system/crmUser/manageInfo/${type}/${userId}?from=1`),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
/**
 * 获取kyc信息-协议确认
 */
export function useGetKycInfoProtocolInfo(userId: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['getKycProtocolInfo', userId],
    queryFn: () =>
      apiGet<KycInfoProtocolRes>(
        `/system/crmUserProtocolRelation/oneUserProtocol/${userId}?from=1`,
      ),
    enabled: !!userId && options.enabled,
  });
}
/**
 * 编辑kyc信息 2个人信息 3财务信息 4身份信息
 */
export function useEditKycColumnInfo(type: '2' | '3' | '4', userId: string) {
  return useMutation({
    mutationFn: (params: { id: string; columnValue: string }[]) =>
      apiPost(`/system/crmUser/manage/${type}/${userId}`, params),
  });
}
/**
 * 获取用户钱包列表信息
 */
export function useGetUserWalletList(userId: string, params: BasicParams) {
  return useQuery({
    queryKey: ['getUserWalletList', userId, params],
    queryFn: () =>
      apiFormPostCustom<UserWalletListRes>(
        `/system/crmUserWallet/listByUser?userId=${userId}`,
        params,
      ),
    enabled: !!userId,
  });
}
/**
 * 删除用户钱包
 */
export function useDeleteUserWallet() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('system/crmUserWallet/remove', params),
  });
}
/**
 * 编辑钱包的账号权限
 */
export function useEditUserWalletAccountPerm() {
  return useMutation({
    mutationFn: (params: { id: string; permissionJson: string }) =>
      apiFormPost('/system/crmUserWallet/edit', params),
  });
}
/**
 * 获取用户钱包详情
 */
export function useGetUserWalletDetail(id: string) {
  return useQuery({
    queryKey: ['getUserWalletDetail', id],
    queryFn: () => apiGet<UserWalletDetail>(`/system/crmUserWallet/detailInfo/${id}`),
    enabled: !!id,
  });
}
/**
 * 获取用户账户活动记录
 */
export function useGetUserAccountActivityList(userId: string, params: AccountOperationListParams) {
  return useQuery({
    queryKey: ['getUserAccountActivityList', userId, params],
    queryFn: () =>
      apiFormPostCustom<UserAccountActivityListRes>(
        `/system/crmUser/userActivityList?userId=${userId}`,
        params,
      ),
    enabled: !!userId,
  });
}
/**
 * 设置风险评级信息
 */
export function useSetRiskRatingInfo() {
  return useMutation({
    mutationFn: (params: {
      ipAddr: string;
      ipTrust: string;
      device: string;
      deviceTrust: string;
      userId: string;
    }) => apiFormPost('/system/crmUser/setRisky', params),
  });
}
/**
 * 设置返佣账号
 */
export function useSetRebateAccount() {
  return useMutation({
    mutationFn: (params: { userId: string; accounts: { type: number; value: string }[] }) =>
      apiPost('/system/crmUser/setRebateAccount', params),
  });
}
/**
 * 获取组别对应的货币单位
 */
export function useGetGroupCurrency(params: { serverId: string; groupName: string }) {
  return useQuery({
    queryKey: ['getGroupCurrency', params],
    queryFn: () =>
      apiFormPostCustom<{
        currency: string;
        resultCode: number;
        resultMsg: string;
      }>('/system/crmDealAccount/currencyByGroup', params),
    enabled: !!params.serverId && !!params.groupName,
  });
}
/**
 * 获取MtServer信息
 */
export function useMtServerGroupInfo(params: { serverId: string; groupName: string }) {
  return useQuery({
    queryKey: ['getMtServerGroup', params],
    queryFn: () =>
      apiFormPost<MtServerGroupRes>(
        '/system/mtServerGroup/getMtServerGroupByServerIdAndGroupName',
        params,
      ),
    enabled: !!params.serverId && !!params.groupName,
  });
}
/**
 * 获取收款账户信息
 */
export function useGetReceiveAccountInfo(
  userId: string,
  type: string,
  params: ReceiveAccountInfoParams,
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['getReceiveAccountInfo', userId, type, params],
    queryFn: () =>
      apiFormPostCustom<ReceiveAccountInfoRes>(
        `/system/crmUserBankInfo/list/${userId}/${type}`,
        params,
      ),
    enabled: !!userId && !!type && options.enabled,
  });
}

// ─── 返佣设置页面 API ────────────────────────────────────────────────────────

/**
 * 获取返佣设置页面初始数据
 * TODO: 原始页面为 Thymeleaf 服务端渲染，model/commissionType/paramFillType/rebateLevelSetting
 *       由控制器注入，需与后端确认对应的 JSON REST 接口路径及返回结构
 */
export function useGetRebateSettingPageData(userId: string, rebateType: number) {
  return useQuery({
    queryKey: ['getRebateSettingPageData', userId, rebateType],
    queryFn: () =>
      apiGet<RebateSettingPageData>(
        `/system/crmUserRebateTemplate/oneUserTemplateInfo/${rebateType}/${userId}`,
      ),
    enabled: !!userId,
  });
}

/**
 * 获取指定返佣层级下的交易规则列表
 * POST /system/crmRebateTraderDeal/getTraderList
 */
export function useGetTraderListForLevel() {
  return useMutation({
    mutationFn: (params: GetTraderListParams) =>
      apiFormPostCustom<TraderListItem[]>('/system/crmRebateTraderDeal/getTraderList', params),
  });
}

/**
 * 获取交易规则对应的佣金组选项（model=2，commissionType=1）
 * POST /system/crmRebateTwoCommissionGroup/getRuleGroups
 */
export function useGetRuleGroups() {
  return useMutation({
    mutationFn: (params: GetRuleGroupsParams) =>
      apiFormPostCustom<{ code: number; data: RuleGroupItem[] }>(
        '/system/crmRebateTwoCommissionGroup/getRuleGroups',
        params,
      ),
  });
}

/**
 * 获取自定义返佣值及上下限（model=2，commissionType=2）
 * POST /system/crmRebateTwoCommissionGroup/getCustomRebate
 */
export function useGetCustomRebate() {
  return useMutation({
    mutationFn: (params: { rebateTraderId: string; userId: string; inviter?: string }) =>
      apiFormPostCustom<{ code: number; data: CustomRebateData }>(
        '/system/crmRebateTwoCommissionGroup/getCustomRebate',
        params,
      ),
  });
}

/**
 * 初始化时获取上级用户返佣规则输入区（model=2）
 * POST /system/crmUserRebateTwo/getUpperInput
 */
export function useGetUpperInput() {
  return useMutation({
    mutationFn: (params: { userId: string; levelId: string; upperId: string }) =>
      apiFormPostCustom<{ code: number; data: UpperInputRule[] }>(
        '/system/crmUserRebateTwo/getUpperInput',
        params,
      ),
  });
}

/**
 * 切换上级后获取新上级的返佣规则（model=2）
 * POST /system/crmUserRebateTwo/getUpperUserRebateTwo
 */
export function useGetUpperUserRebateTwo() {
  return useMutation({
    mutationFn: (params: { upperUserId: string; levelId: string }) =>
      apiFormPostCustom<{ code: number; data: UpperInputRule[] }>(
        '/system/crmUserRebateTwo/getUpperUserRebateTwo',
        params,
      ),
  });
}

/**
 * 校验上级关系（不能将自身设为下级的上级）
 * POST /system/crmUser/notInviteBoss
 */
export function useCheckNotInviteBoss() {
  return useMutation({
    mutationFn: (params: { userId: string; inviterId: string }) =>
      apiFormPostCustom<boolean>('/system/crmUser/notInviteBoss', params),
  });
}

/**
 * 获取上级用户姓名及返佣层级信息
 * POST /system/crmUser/getUserInviterLevel
 */
export function useGetUserInviterLevel() {
  return useMutation({
    mutationFn: (params: { userId: string }) =>
      apiFormPostCustom<{ code: number; data: InviterLevelData }>(
        '/system/crmUser/getUserInviterLevel',
        params,
      ),
  });
}

/**
 * 获取推荐来源下拉选项（Select2 异步搜索）
 * POST /system/spreadLink/link
 */
export function useGetSpreadLinks() {
  return useMutation({
    mutationFn: (params: { userId?: string; keyword?: string; linkType?: number }) =>
      apiFormPostCustom<{ code: number; rows: SpreadLinkItem[] }>(
        '/system/spreadLink/link',
        params,
      ),
  });
}

/**
 * 保存前校验：子用户佣金组设置是否与上级冲突（model=2）
 * POST /system/crmUserRebateTemplate/checkSubUserGroupSetting
 */
export function useCheckSubUserGroupSetting() {
  return useMutation({
    mutationFn: (params: SaveRebateSettingModel2Params) =>
      apiPost('/system/crmUserRebateTemplate/checkSubUserGroupSetting', params),
  });
}

/**
 * 保存返佣设置（model=1 模板模式）
 * POST /system/crmUserRebateTemplate/oneUserTemplateInfo/edit
 */
export function useSaveRebateSettingModel1() {
  return useMutation({
    mutationFn: (params: SaveRebateSettingModel1Params) =>
      apiFormPost('/system/crmUserRebateTemplate/oneUserTemplateInfo/edit', params),
  });
}

/**
 * 保存返佣设置（model=2 直接配置模式）
 * POST /system/crmUserRebateTemplate/oneUserTemplateInfo/editSaveModel2
 */
export function useSaveRebateSettingModel2() {
  return useMutation({
    mutationFn: (params: SaveRebateSettingModel2Params) =>
      apiPost('/system/crmUserRebateTemplate/oneUserTemplateInfo/editSaveModel2', params),
  });
}

/**
 * 查看上级返佣链详情（自定义方案，commissionType=2）
 * POST /system/crmRebateTwoCommissionGroup/getInviterCustomRebate
 */
export function useGetInviterCustomRebate() {
  return useMutation({
    mutationFn: (params: { rebateTraderId: string; userId: string; inviter?: string }) =>
      apiFormPostCustom<{ code: number; data: InviterCustomRebateItem[] }>(
        '/system/crmRebateTwoCommissionGroup/getInviterCustomRebate',
        params,
      ),
  });
}
