import { apiFormPost, apiFormPostCustom, apiGet, apiGetCustom, apiPost } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BaseSettingsParams,
  BaseSettingsRes,
  MamFollowListParams,
  MamFollowListRes,
  MamFollowListByTraderParams,
  MamFollowListByTraderRes,
  MamSignalPositionOrderParams,
  MamSignalPositionOrderRes,
  MamSignalFundHistoryParams,
  MamSignalFundHistoryRes,
  MamClientTradeOrdersParams,
  MamClientPositionRes,
  MamClientHistoryRes,
  MamProtocolListParams,
  MamProtocolListRes,
  MamSignalSourceListParams,
  MamSignalSourceListRes,
  MamSignalSourceVerifyListParams,
  MamSignalSourceVerifyListRes,
  MamSymbolListParams,
  MamSymbolListRes,
  PerformanceFeeListParams,
  PerformanceFeeListRes,
  PerformanceFeeRebateReportListParams,
  PerformanceFeeRebateReportListRes,
  PerformanceFeeRebateVerifyListParams,
  PerformanceFeeRebateVerifyListRes,
  FeeConfigParams,
  SubscriptionSettingParams,
  PerformanceFeeParams,
  LoyaltyRewardParams,
  PayParams,
  ReceiveAccountsRes,
  PerformanceFeeRebateDetailRes,
  PerformanceFeeRebateVerifyParams,
  AddMamSymbolParams,
  MamSymbolDetailRes,
  MamFollowDetailRes,
  PerformanceFeeDetailRes,
  AddMamProtocolParams,
  EditMamProtocolParams,
  MamProtocolDetailRes,
  MamSignalSourceDetailRes,
  MamSignalSourceVerifyParams,
  MamSignalSourceEditDetailRes,
  MamSignalSourceEditParams,
  GetTradeAccounts,
  CopyTradingDashboardDataRes,
  GetEstimatedFeeRes,
  MamSignalSourceDetailViewRes,
  AccountHistoryRes,
  MapReportSymbolReportRes,
  MamSignalSourceParams,
  MamSignalSourceFundOverviewRes,
  crmDealAccountFundFlowParams,
  crmDealAccountFundFlowRes,
} from './type';

export function useChangeMamSignalSource() {
  return useMutation({
    mutationFn: (params: { id: string; publicShow: number }) =>
      apiFormPostCustom<{
        code: number;
      }>('/system/mamSignalSource/edit', params),
  });
}
/**
 * 信号源列表
 */
export function useMamSignalSourceList(params: MamSignalSourceListParams) {
  return useQuery({
    queryKey: ['mamSignalSourceList', params],
    queryFn: () =>
      apiFormPostCustom<MamSignalSourceListRes>(`/system/mamSignalSource/list`, params),
  });
}

/**
 * 信号源列表编辑详情
 */
export function useMamSignalSourceEditDetail() {
  return useMutation({
    mutationFn: (id: string) =>
      apiGetCustom<MamSignalSourceEditDetailRes>(`/system/mamSignalSource/detailInfo/${id}`),
  });
}

/**
 * 信号源编辑-修改接口
 */
export function useMamSignalSourceEdit() {
  return useMutation({
    mutationFn: (params: MamSignalSourceEditParams & { id: string }) =>
      apiFormPost(`/system/mamSignalSource/edit`, params),
  });
}

/**
 * 信号源编辑-新增接口
 */
export function useMamSignalSourceAdd() {
  return useMutation({
    mutationFn: (params: MamSignalSourceEditParams) =>
      apiFormPost(`/system/mamSignalSource/add`, params),
  });
}

/**
 * 信号源新增/编辑-获取账户列表
 */
export function useGetTradeAccounts(params: { userId: string }) {
  return useQuery({
    queryKey: ['getTradeAccounts', params],
    queryFn: () =>
      apiFormPostCustom<GetTradeAccounts>(
        `/system/mamSignalSource/getTradeAccounts?userId=${params.userId}`,
        {},
      ),
    enabled: !!params.userId,
  });
}

/**
 * 信号源审核列表
 */
export function useMamSignalSourceVerifyList(params: MamSignalSourceVerifyListParams) {
  return useQuery({
    queryKey: ['mamSignalSourceVerifyList', params],
    queryFn: () =>
      apiFormPostCustom<MamSignalSourceVerifyListRes>(
        `/system/mamSignalSourceVerify/verifyList`,
        params,
      ),
  });
}

export function useMamSignalSourceDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['mamSignalSourceDetail', id],
    queryFn: () =>
      apiGetCustom<MamSignalSourceDetailRes>(`/system/mamSignalSourceVerify/detailInfo/${id}`),
    enabled: options.enabled,
  });
}

/**
 * 信号源审核
 */
export function useMamSignalSourceVerify() {
  return useMutation({
    mutationFn: (params: MamSignalSourceVerifyParams) =>
      apiFormPost('/system/mamSignalSourceVerify/verify', params),
  });
}

/**
 * 品种管理
 */
export function useMamSymbolList(params: MamSymbolListParams) {
  return useQuery({
    queryKey: ['mamSymbolList', params],
    queryFn: () => apiFormPostCustom<MamSymbolListRes>(`/system/mamSymbol/list`, params),
  });
}

/**
 * 品种管理-删除
 */
export function useRemoveMamSymbol() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/mamSymbol/remove', params),
  });
}

/**
 * 品种管理添加
 */
export function useAddMamSymbol() {
  return useMutation({
    mutationFn: (params: AddMamSymbolParams) => apiFormPost('/system/mamSymbol/add', params),
  });
}

/**
 * 品种管理编辑
 */
export function useEditMamSymbol() {
  return useMutation({
    mutationFn: (params: AddMamSymbolParams & { id: string }) =>
      apiFormPost('/system/mamSymbol/edit', params),
  });
}

/**
 * 品种管理详情
 */
export function useMamSymbolDetail() {
  return useMutation({
    mutationFn: (id: string) => apiGet<MamSymbolDetailRes>(`/system/mamSymbol/detailInfo/${id}`),
  });
}

/**
 * 品种管理新增校验标准名称
 */
export function useCheckNameUnique() {
  return useMutation({
    mutationFn: (params: { symbol: string }) =>
      apiFormPostCustom<boolean>('/system/mamSymbol/checkNameUnique', params),
  });
}

/**
 * 品种管理新增修改校验默认名称
 */
export function useCheckDefaultNameUnique() {
  return useMutation({
    mutationFn: (params: { name: string; id: string }) =>
      apiFormPostCustom<boolean>('/system/mamSymbol/checkDefaultNameUnique', params),
  });
}

/**
 * 表现费记录
 */
export function usePerformanceFeeList(params: PerformanceFeeListParams) {
  return useQuery({
    queryKey: ['performanceFeeList', params],
    queryFn: () => apiFormPostCustom<PerformanceFeeListRes>(`/system/performanceFee/list`, params),
  });
}

export function usePerformanceFeeDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['performanceFeeDetail', id],
    queryFn: () => apiGetCustom<PerformanceFeeDetailRes>(`/system/performanceFee/detailInfo/${id}`),
    enabled: options.enabled,
  });
}

/**
 * 表现费返佣审核列表
 */
export function usePerformanceFeeRebateVerifyList(params: PerformanceFeeRebateVerifyListParams) {
  return useQuery({
    queryKey: ['performanceFeeRebateVerifyList', params],
    queryFn: () =>
      apiFormPostCustom<PerformanceFeeRebateVerifyListRes>(
        '/system/performanceFeeRebate/verifyList',
        params,
      ),
  });
}

/**
 * 表现费返佣审核详情
 */
export function usePerformanceFeeRebateDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['performanceFeeRebateDetail', id],
    queryFn: () =>
      apiGetCustom<PerformanceFeeRebateDetailRes>(`/system/performanceFeeRebate/detailInfo/${id}`),
    enabled: options.enabled,
  });
}

/**
 * 表现费返佣审核提交
 */
export function usePerformanceFeeRebateVerify() {
  return useMutation({
    mutationFn: (params: PerformanceFeeRebateVerifyParams) =>
      apiFormPost(`/system/performanceFeeRebate/verify`, params),
  });
}

/**
 * 表现费返佣报表列表
 */
export function usePerformanceFeeRebateReportList(params: PerformanceFeeRebateReportListParams) {
  return useQuery({
    queryKey: ['performanceFeeRebateReportList', params],
    queryFn: () =>
      apiFormPostCustom<PerformanceFeeRebateReportListRes>(
        '/system/performanceFeeRebate/reportList',
        params,
      ),
  });
}

/**
 * 表现费返佣报表-获取支付账号列表
 */
export function useGetReceiveAccounts(userId: string) {
  return useQuery({
    queryKey: ['getReceiveAccounts', userId],
    queryFn: () =>
      apiGetCustom<ReceiveAccountsRes>(
        `/system/performanceFeeRebate/getReceiveAccounts?userId=${userId}`,
      ),
    enabled: !!userId,
  });
}

/**
 * 返佣报表支付
 */
export function usePay() {
  return useMutation({
    mutationFn: (params: PayParams) => apiFormPost('/system/performanceFeeRebate/doPay', params),
  });
}

/**
 * 协议设置
 */
export function useMamProtocolList(params: MamProtocolListParams) {
  return useQuery({
    queryKey: ['mamProtocolList', params],
    queryFn: () => apiFormPostCustom<MamProtocolListRes>('/system/mamProtocol/list', params),
  });
}

/**
 * 新增协议
 */
export function useAddMamProtocol() {
  return useMutation({
    mutationFn: (params: AddMamProtocolParams) => apiPost('/system/mamProtocol/add', params),
  });
}

/**
 * 修改协议
 */
export function useEditMamProtocol() {
  return useMutation({
    mutationFn: (params: EditMamProtocolParams) => apiPost('/system/mamProtocol/edit', params),
  });
}

/**
 * 协议详情
 */
export function useMamProtocolDetail() {
  return useMutation({
    mutationFn: (id: string) =>
      apiGet<MamProtocolDetailRes>(`/system/mamProtocol/detailInfo/${id}`),
  });
}

/**
 * 删除协议
 */
export function useDeleteMamProtocol() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/mamProtocol/remove', params),
  });
}

/**
 * 订单管理
 */
export function useMamFollowList(params: MamFollowListParams) {
  return useQuery({
    queryKey: ['mamFollowList', params],
    queryFn: () => apiFormPostCustom<MamFollowListRes>('/system/mamFollow/list', params),
  });
}

/**
 * 信号源详情-订阅情况（按信号源账号）
 */
export function useMamFollowListByTrader(
  params: MamFollowListByTraderParams,
  options: { traderServerId: string; trader: string },
) {
  return useQuery({
    queryKey: ['mamFollowListByTrader', options.traderServerId, options.trader, params],
    queryFn: () =>
      apiFormPostCustom<MamFollowListByTraderRes>(
        `/system/mamFollow/listByTrader?traderServerId=${options.traderServerId}&trader=${options.trader}`,
        params,
      ),
    enabled: Boolean(options.traderServerId && options.trader),
  });
}

export function useMamFollowDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['mamFollowDetail', id],
    queryFn: () => apiGetCustom<MamFollowDetailRes>(`/system/mamFollow/detailInfo/${id}`),
    enabled: options.enabled,
  });
}

/**
 * 信号源详情-交易订单(信号源)-持仓订单
 */
export function useMamSignalPositionOrder(
  accountId: string,
  params: MamSignalPositionOrderParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['mamSignalPositionOrder', accountId, params],
    queryFn: () =>
      apiFormPostCustom<MamSignalPositionOrderRes>(
        `/system/crmDealAccount/positionOrder/1/${accountId}`,
        params,
      ),
    enabled: (options?.enabled ?? true) && Boolean(accountId),
  });
}

/**
 * 信号源详情-交易订单(信号源)-交易历史
 */
export function useMamSignalFundHistory(
  accountId: string,
  params: MamSignalFundHistoryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['mamSignalFundHistory', accountId, params],
    queryFn: () =>
      apiFormPostCustom<MamSignalFundHistoryRes>(
        `/system/crmDealAccount/fundHistory/${accountId}`,
        params,
      ),
    enabled: (options?.enabled ?? true) && Boolean(accountId),
  });
}

/**
 * 信号源详情-交易订单(订阅者)-持仓订单
 */
export function useMamClientPositionList(
  account: string,
  serverId: string,
  params: MamClientTradeOrdersParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['mamClientPositionList', account, serverId, params],
    queryFn: () =>
      apiFormPostCustom<MamClientPositionRes>(
        `/system/mapReport/getClientPositionList?account=${account}&serverId=${serverId}`,
        params,
      ),
    enabled: (options?.enabled ?? true) && Boolean(account && serverId),
  });
}

/**
 * 信号源详情-交易订单(订阅者)-交易历史
 */
export function useMamClientHistoryList(
  account: string,
  serverId: string,
  params: MamClientTradeOrdersParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['mamClientHistoryList', account, serverId, params],
    queryFn: () =>
      apiFormPostCustom<MamClientHistoryRes>(
        `/system/mapReport/getClientHistoryList?account=${account}&serverId=${serverId}`,
        params,
      ),
    enabled: (options?.enabled ?? true) && Boolean(account && serverId),
  });
}

/**
 * 获取copytranding 所有配置信息
 */
export function useGetBaseSettings() {
  return useQuery({
    queryKey: ['BaseSettings'],
    queryFn: () => apiGet<BaseSettingsRes>(`/system/mamConfig/info?tab=1`),
  });
}

/**
 * 编辑copytranding 基础配置信息
 */
export function useEditBaseSettings() {
  return useMutation({
    mutationFn: (params: BaseSettingsParams) => apiPost('/system/mamConfig/edit', params),
  });
}

/**
 * 编辑copytranding 费用配置信息
 */
export function useEditFeeConfig() {
  return useMutation({
    mutationFn: (params: FeeConfigParams) => apiPost('/system/mamConfig/edit', params),
  });
}

/**
 * 编辑copytranding 订阅跟单设置
 */
export function useEditSubscriptionSetting() {
  return useMutation({
    mutationFn: (params: SubscriptionSettingParams) => apiPost('/system/mamConfig/edit', params),
  });
}

/**
 * 编辑copytranding 表现费返佣
 */
export function useEditPerformanceFeeRebate() {
  return useMutation({
    mutationFn: (params: PerformanceFeeParams) => apiPost('/system/mamConfig/edit', params),
  });
}

/**
 * 编辑copytranding 忠诚奖励
 */
export function useEditLoyaltyReward() {
  return useMutation({
    mutationFn: (params: LoyaltyRewardParams) => apiPost('/system/mamConfig/edit', params),
  });
}

/**
 * dashboard 数据
 */
export function useMamDashboardInfo() {
  return useQuery({
    queryKey: ['mamDashboardInfo'],
    queryFn: () => apiGetCustom<CopyTradingDashboardDataRes>(`/system/mamDashboard/info`),
  });
}

/**
 * dashboard CopyTrading收益情况
 */
export function useGetEstimatedFee() {
  return useQuery({
    queryKey: ['getEstimatedFee'],
    queryFn: () => apiGetCustom<GetEstimatedFeeRes>(`/system/mapReport/getEstimatedFee?stime=30`),
  });
}

/**
 * 编辑copytranding 启用关闭
 */
export function useEditCopyTradingStatus() {
  return useMutation({
    mutationFn: (params: { status: number }) => apiPost('/system/mamConfig/edit', params),
  });
}
/**
 * 编辑copytranding 设置适用用户
 */
export function useEditCopyTradingApplicableUsers() {
  return useMutation({
    mutationFn: (params: { roleIds: string }) => apiPost('/system/mamConfig/edit', params),
  });
}
/**
 * 信号源详情
 */
export function useMamSignalSourceDetailView(id: string) {
  return useQuery({
    queryKey: ['mamFollowDetail', id],
    queryFn: () =>
      apiGetCustom<MamSignalSourceDetailViewRes>(`/system/mamSignalSource/detailView/${id}`),
    enabled: Boolean(id),
  });
}

/**
 * 信号源详情-收益率-平仓收益-净值/余额
 */
export function useGetAccountHistory(params: { serverId: string; account: string; stime: string }) {
  return useQuery({
    queryKey: ['getAccountHistory', params.serverId, params.account, params.stime],
    queryFn: () =>
      apiGetCustom<AccountHistoryRes>(
        `/system/mapReport/getAccountHistory?serverId=${params.serverId}&account=${params.account}&stime=${params.stime || 30}`,
      ),
    enabled: Boolean(params.serverId && params.account),
  });
}

/**
 * 信号源详情-交易品种概览
 */
export function useMapReportSymbolReport(params: {
  pageNum?: string;
  orderByColumn?: string;
  isAsc?: string;
  stime: string;
  serverId: string;
  login: string;
}) {
  return useQuery({
    queryKey: ['mapReportSymbolReport', params],
    queryFn: () =>
      apiFormPostCustom<MapReportSymbolReportRes>('/system/mapReport/symbolReport', params),
  });
}

/**
 * 信号源详情 关闭开启信号源
 */
export function useEditSignalSourceStatus() {
  return useMutation({
    mutationFn: (params: MamSignalSourceParams) =>
      apiFormPost('/system/mamSignalSource/close', params),
  });
}

/**
 * 信号源详情 资金总览-总数据
 */
export function useMamSignalSourceFundOverview(id: string) {
  return useQuery({
    queryKey: ['mamSignalSourceFundOverview', id],
    queryFn: () =>
      apiGetCustom<MamSignalSourceFundOverviewRes>(`/system/mamSignalSource/fundOverview?id=${id}`),
    enabled: Boolean(id),
  });
}

/**
 * 信号源详情 资金总览-table数据
 */
export function useCrmDealAccountFundFlow(params: crmDealAccountFundFlowParams, accountId: string) {
  return useQuery({
    queryKey: ['crmDealAccountFundFlow', params],
    queryFn: () =>
      apiFormPostCustom<crmDealAccountFundFlowRes>(
        `/system/crmDealAccount/fundFlow/${accountId}`,
        params,
      ),
  });
}
