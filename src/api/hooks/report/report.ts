import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
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
