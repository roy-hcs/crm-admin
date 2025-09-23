import { apiFormPost, apiFormPostCustom, apiGetCustom } from '@/api/client';
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
  crmUserDealDetailParams,
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
export function useWalletTransactionList(params: crmUserDealDetailParams) {
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
 * 获取支付订单
 */
export function usePaymentOrderList(params: PaymentOrderListParams) {
  return useQuery({
    queryKey: ['paymentOrderList', params],
    queryFn: () =>
      apiFormPostCustom<PaymentOrderListResponse>('/system/userOrder/list', params || {}),
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

export function usePositionOrderList(params: PositionOrderParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['positionOrder', params],
    queryFn: () =>
      apiFormPostCustom<PositionOrderResponse>('/system/statistics/positionList/1', params || {}),
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
