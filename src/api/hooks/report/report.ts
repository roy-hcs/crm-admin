import { apiFormPost, apiFormPostCustom, apiGet, apiGetCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ClientTrackingParams,
  AgencyClientTrackingResponse,
  OverviewParams,
  OverviewResponse,
  TradingParams,
  TradingResponse,
  DailyRebateParams,
  DailyRebateResponse,
  TradingHistoryParams,
  TradingHistoryListResponse,
  CrmUserDealDetailParams,
  WalletTransactionResponse,
  PaymentOrderListParams,
  PaymentOrderListResponse,
  CrmUserDealListParams,
  CrmUserDealListResponse,
  RefundFailLogListParams,
  RefundFailLogListResponse,
  TradingAccountFundsStatsParams,
  TradingAccountFundsStatsResponse,
  DataStatisticsParams,
  DataStatisticsResponse,
  PositionOrderParams,
  PositionOrderResponse,
  LimitOrderListResponse,
  LimitOrderListParams,
  AccountStatisticListResponse,
  AccountStatisticListParams,
  AccountStatisticSumResponse,
  AccountStatisticSumParams,
  SystemFundOperationRecordListParams,
  SystemFundOperationRecordListRes,
  SystemFundOperationRecordSumParams,
  SystemFundOperationRecordSumRes,
  WalletBalanceRes,
  WalletBalanceParams,
  WalletBalanceSumParams,
  WalletBalanceSumRes,
  CurrencyListRes,
  WalletTransactionSumParams,
  WalletTransactionSumRes,
  PositionAverageItem,
  PaymentOrderDepositItem,
  CrmUserDealListDetailRes,
  AgencyPreferenceRes,
  AgencyPreferenceParams,
  DownloadsListParams,
  DownloadsListRes,
} from './types';

/**
 * 获取ib报表-ib客户追踪
 */
export function useAgencyClientTrackingList(params: ClientTrackingParams) {
  return useQuery({
    queryKey: ['agencyClientTrackingList', params],
    queryFn: () =>
      apiFormPostCustom<AgencyClientTrackingResponse>(
        '/system/statistics/agencyClientTrackingList',
        params || {},
      ),
  });
}

/**
 * 获取ib报表-ib数据总览
 */
export function useAgencyOverviewList(params: OverviewParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['agencyOverviewList', params],
    queryFn: () =>
      apiFormPostCustom<OverviewResponse>('/system/statistics/agencyOverviewList', params || {}),
    enabled: options?.enabled ?? true,
  });
}
/**
 * ib数据总览-获取偏好设置 1 2 3 多个页面共用
 */
export function useGetAgencyPreference() {
  return useMutation({
    mutationFn: (type: number) =>
      apiGetCustom<AgencyPreferenceRes>(
        `/system/statistics/getAgencyPreference?bizType=${type}`,
        {},
      ),
  });
}

/**
 * ib数据总览-提交偏好设置 多个页面共用
 */
export function useAgencyPreference() {
  return useMutation({
    mutationFn: (params: AgencyPreferenceParams) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/statistics/agencyPreference', params),
  });
}

/**
 * 获取佣金报表-交易佣金报表 手续费 入金 通用接口
 */
export function useRebateList(params: TradingParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['rebateList', params],
    queryFn: () =>
      apiFormPostCustom<TradingResponse>('/system/statistics/rebateList', params || {}),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取佣金报表-日结佣金报表
 */
export function useDailyRebateList(params: DailyRebateParams) {
  return useQuery({
    queryKey: ['dailyRebateList', params],
    queryFn: () =>
      apiFormPostCustom<DailyRebateResponse>('/system/rebateSettle/list', params || {}),
  });
}
export function useTradingHistoryList(params: TradingHistoryParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['tradingHistory', params],
    queryFn: () =>
      apiFormPostCustom<TradingHistoryListResponse>(
        '/system/statistics/getHistoryList',
        params || {},
      ),
    enabled: options.enabled,
  });
}

/**
 * 获取钱包流水
 */
export function useWalletTransactionList(params: CrmUserDealDetailParams) {
  return useQuery({
    queryKey: ['walletTransactionList', params],
    queryFn: () =>
      apiFormPostCustom<WalletTransactionResponse>('/system/crmUserDealDetail/list', params || {}),
  });
}

/**
 * 获取钱包流水合计
 */
export function useWalletTransactionSum() {
  return useMutation({
    mutationFn: (params: WalletTransactionSumParams) =>
      apiFormPostCustom<WalletTransactionSumRes>('/system/crmUserDealDetail/listSum', params),
  });
}

/**
 * 导出钱包流水
 */
export function useWalletTransactionListExport() {
  return useMutation({
    mutationFn: (params: CrmUserDealDetailParams) =>
      apiFormPostCustom<WalletTransactionSumRes>('/system/crmUserDealDetail/export', params),
  });
}

/**
 * 交易历史导出
 */
export function useTradingHistoryExport() {
  return useMutation({
    mutationFn: (params: TradingHistoryParams) =>
      apiFormPost('/system/statistics/history-export', params),
  });
}

/**
 * 持仓订单导出
 */
export function usePositionOrderExport() {
  return useMutation({
    mutationFn: (params: PositionOrderParams) =>
      apiFormPost('/system/statistics/position-export/1', params),
  });
}

/**
 * 交易账号交易历史统计导出
 */
export function useAccountStatisticExport() {
  return useMutation({
    mutationFn: (params: AccountStatisticListParams) =>
      apiFormPost('/system/statistics/account-export', params),
  });
}

/**
 * 交易佣金报表导出
 */
export function useRebateExport() {
  return useMutation({
    mutationFn: (params: TradingParams) =>
      apiFormPost('/system/statistics/rebate-export/1', params),
  });
}

/**
 * 手续费报表导出
 */
export function useFeeExport() {
  return useMutation({
    mutationFn: (params: TradingParams) =>
      apiFormPost('/system/statistics/rebate-export/2', params),
  });
}

/**
 *  入金报表导出
 */
export function useDepositExport() {
  return useMutation({
    mutationFn: (params: TradingParams) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/statistics/rebate-export/3', params),
  });
}

/**
 *  日结返佣报表导出
 */
export function useRebateSettleExport() {
  return useMutation({
    mutationFn: (params: DailyRebateParams) => apiFormPost('/system/rebateSettle/export', params),
  });
}

/**
 * ib客户追踪导出
 */
export function useAgencyClientTrackingExport() {
  return useMutation({
    mutationFn: (params: ClientTrackingParams) =>
      apiFormPost('/system/statistics/agencyClientTrackingExport', params),
  });
}

/**
 * ib数据总览导出
 */
export function useAgencyOverviewExport() {
  return useMutation({
    mutationFn: (params: OverviewParams) =>
      apiFormPost('/system/statistics/agencyOverviewExport', params),
  });
}

/**
 *  交易账号数据统计导出
 */
export function useDealDataExport() {
  return useMutation({
    mutationFn: (params: DataStatisticsParams) =>
      apiFormPost('system/statistics/deal-data-export', params),
  });
}

/**
 * 交易历史批量删除
 */
export function useBatchDeleteTradingHistory() {
  return useMutation({
    mutationFn: (params: { ids: string; serverId: string; type: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: number;
      }>('/system/crmUserDeal/batchRemove', params),
  });
}

/**
 * 获取支付订单
 */
export function usePaymentOrderList(params: PaymentOrderListParams) {
  return useQuery({
    queryKey: ['paymentOrderList', params],
    queryFn: () =>
      apiFormPostCustom<PaymentOrderListResponse>('/system/userOrder/list', params || {}),
  });
}

// 获取支付订单详情
export function usePaymentOrderDepositDetail(id: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['paymentOrderDepositDetail', id],
    queryFn: () => {
      return apiGet<PaymentOrderDepositItem>(`/system/userOrder/detailInfo/${id}`);
    },
    enabled: enabled && !!id,
    staleTime: 0,
  });
}

// 导出支付订单
export function usePaymentOrderExport() {
  return useMutation({
    mutationFn: (params: PaymentOrderListParams) => apiFormPost('/system/userOrder/export', params),
  });
}

// 改变支付订单状态
export function useChangePaymentOrderStatus() {
  return useMutation({
    mutationFn: (params: {
      id: string;
      userId: string;
      orderStatus: number;
      createVerifyRecord: boolean;
    }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/userOrder/changeStatus', params),
  });
}

/**
 * 获取交易账号资金流水
 */
export function useCrmUserDealList(params: CrmUserDealListParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['crmUserDealList', params],
    queryFn: () =>
      apiFormPostCustom<CrmUserDealListResponse>('/system/crmUserDeal/list', params || {}),
    enabled: options.enabled,
  });
}

/**
 * 导出交易账号资金流水
 */
export function useCrmUserDealExport() {
  return useMutation({
    mutationFn: (params: CrmUserDealListParams) =>
      apiFormPost('/system/crmUserDeal/export', params),
  });
}
/**
 * 获取交易账号资金流水详情
 */
export function useCrmUserDealListDetail(id: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['userDealListDetail', id],
    queryFn: () => {
      return apiGet<CrmUserDealListDetailRes>(`/system/crmUserDeal/detailInfo/${id}`);
    },
    enabled: enabled && !!id,
    staleTime: 0,
  });
}

export function usePositionOrderList(params: PositionOrderParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['positionOrder', params],
    queryFn: () =>
      apiFormPostCustom<PositionOrderResponse>('/system/statistics/positionList/1', params || {}),
    enabled: options.enabled,
  });
}

/**
 * 持仓订单-持仓成本
 */
export function usePositionAverageList(params: PositionOrderParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['positionAverage', params],
    queryFn: () =>
      apiFormPostCustom<{
        code: number;
        msg: string | null;
        total: string;
        rows: PositionAverageItem[];
      }>(`/system/statistics/positionAverage?random=${params.params.random}`, params),
    enabled: options.enabled,
  });
}

export function useLimitOrderList(params: LimitOrderListParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['limitOrderList', params],
    queryFn: () =>
      apiFormPostCustom<LimitOrderListResponse>('/system/statistics/positionList/2', params || {}),
    enabled: options.enabled,
  });
}

export function useAccountStatisticList(
  params: AccountStatisticListParams,
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['accountStatisticList', params],
    queryFn: () =>
      apiFormPostCustom<AccountStatisticListResponse>(
        '/system/statistics/accountStatisticList',
        params || {},
      ),
    enabled: options.enabled,
  });
}

/**
 * 获取资金回退失败日志
 */
export function useRefundFailLogList(params: RefundFailLogListParams) {
  return useQuery({
    queryKey: ['refundFailLogList', params],
    queryFn: () =>
      apiFormPostCustom<RefundFailLogListResponse>('/system/refundFailLog/list', params || {}),
  });
}

/**
 * 获取交易账号资金统计
 */
export function useTradingAccountFundsStats(
  params: TradingAccountFundsStatsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['tradingAccountFundsStats', params],
    queryFn: () =>
      apiFormPostCustom<TradingAccountFundsStatsResponse>(
        '/system/statistics/dealStatisticList',
        params || {},
      ),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取交易账号数据统计
 */
export function useDataStatistics(params: DataStatisticsParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['dataStatistics', params],
    queryFn: () =>
      apiFormPostCustom<DataStatisticsResponse>(
        '/system/statistics/dealDataStatisticList',
        params || {},
      ),
    enabled: options?.enabled ?? true,
  });
}
export function useAccountStaticsSum() {
  return useMutation({
    mutationFn: (params: AccountStatisticSumParams) =>
      apiFormPostCustom<AccountStatisticSumResponse>(
        '/system/statistics/accountStaticsSum',
        params,
      ),
  });
}

export function useExportAccountStatisticList() {
  return useMutation({
    mutationFn: (params: AccountStatisticListParams) =>
      apiFormPost('/system/statistics/account-export', params),
  });
}

export function useSystemFundOperationRecordList(
  params: SystemFundOperationRecordListParams,
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['systemFundOperationRecordList', params],
    queryFn: () =>
      apiFormPostCustom<SystemFundOperationRecordListRes>(
        '/system/statistics/systemFundOperRecordList',
        params || {},
      ),
    enabled: options.enabled,
  });
}

export function useSystemFundOperationRecordSum() {
  return useMutation({
    mutationFn: (params: SystemFundOperationRecordSumParams) =>
      apiFormPostCustom<SystemFundOperationRecordSumRes>(
        '/system/statistics/systemFundOperRecordSum',
        params,
      ),
  });
}

export function useWalletBalanceList(
  params: WalletBalanceParams,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ['walletBalanceList', params],
    queryFn: () =>
      apiFormPostCustom<WalletBalanceRes>(
        '/system/crmUserWallet/walletOverview/list',
        params || {},
      ),
    enabled: options.enabled ?? true,
  });
}

export function useWalletBalanceSum() {
  return useMutation({
    mutationFn: (params: WalletBalanceSumParams) =>
      apiFormPostCustom<WalletBalanceSumRes>(
        '/system/crmUserWallet/walletOverview/listSum',
        params,
      ),
  });
}

export function useCurrencyList() {
  return useQuery({
    queryKey: ['currencyList'],
    queryFn: () => apiFormPostCustom<CurrencyListRes>('/system/currency/list', {}),
  });
}

export function useAllCurrencies() {
  return useQuery({
    queryKey: ['allCurrencies'],
    queryFn: () => apiGetCustom<string[]>('/system/crmUserWallet/getAllWalletCurrencies'),
  });
}

/**
 *  交易账号资金统计导出
 */
export function useStatisticsExport() {
  return useMutation({
    mutationFn: (params: TradingAccountFundsStatsParams) =>
      apiFormPost('/system/statistics/deal-export', params),
  });
}

/**
 *  周结返佣报表导出
 */
export function useWeekRebateSettleExport() {
  return useMutation({
    mutationFn: (params: DailyRebateParams) => apiFormPost('/system/rebateSettle/export', params),
  });
}
/**
 *  系统资金操作记录导出
 */
export function useSystemFundOperationRecordExport() {
  return useMutation({
    mutationFn: (params: SystemFundOperationRecordListParams) =>
      apiFormPost('/system/statistics/systemFundOperRecordExport', params),
  });
}

/**
 * 下载管理列表
 */
export function useDownloadsList(params: DownloadsListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['downloadsList', params],
    queryFn: () => apiFormPostCustom<DownloadsListRes>('/system/export/list', params),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 下载管理-删除文件
 */
export function useRemoveFile() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost(`/system/export/remove/${params.ids}`, {}),
  });
}

/**
 * 下载管理-标记文件为已下载
 */
export function useMarkFileAsDownloaded() {
  return useMutation({
    mutationFn: (params: { taskId: string }) =>
      apiFormPost(`/system/export/markDownloaded/${params.taskId}`, {}),
  });
}
