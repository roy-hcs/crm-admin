import { apiFormPost, apiFormPostCustom, apiGetCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AgentApplyListParams,
  AgentApplyListRes,
  BasicParams,
  CurrencyListRes,
  DepositListParams,
  DepositListRes,
  DepositListSumRes,
  InternalTransferListParams,
  InternalTransferListRes,
  OutMoneyMethodListRes,
  RebateCommissionListParams,
  RebateCommissionListRes,
  RebateCommissionListSumRes,
  RebateCommissionRuleItem,
  ThirdPaymentListRes,
  WithdrawListParams,
  WithdrawListRes,
  WithdrawListSumRes,
  BindVerifyListParams,
  BindVerifyListRes,
  CrmInfoVerifyListParams,
  CrmInfoVerifyListRes,
  CrmNewLoginVerifyListParams,
  CrmNewLoginVerifyListRes,
  CrmPreferenceListParams,
  CrmPreferenceListRes,
  LeverageVerifyListParams,
  LeverageVerifyListRes,
  WithdrawalReviewDetailRes,
  WithdrawalVerifyParams,
  SumWithdrawalAmountParams,
  SumWithdrawalAmountRes,
  DepositReviewDetailRes,
  DepositVerifyParams,
  LeverageReviewDetailRes,
  LeverageVerifyParams,
} from './types';

export function useAgentApplyList(params: AgentApplyListParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['agentApplyList', params],
    queryFn: () => apiFormPostCustom<AgentApplyListRes>('/system/agentApply/list', params),
    enabled: options.enabled,
  });
}

export function useRebateCommissionList(
  params: RebateCommissionListParams & { taderType?: string },
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['rebateCommissionList', params],
    queryFn: () =>
      apiFormPostCustom<RebateCommissionListRes>(
        `/system/crmRebateCommission/list/${params.rebateType}`,
        params,
      ),
    enabled: options.enabled,
  });
}

export function useRebateCommissionRuleList(type: number) {
  return useQuery({
    queryKey: ['rebateCommissionRuleList', type],
    queryFn: () =>
      apiFormPostCustom<RebateCommissionRuleItem[]>(
        `/system/crmRebateCommissionRule/getCrmRebateTraders?type=${type}`,
        {},
      ),
  });
}

export function useRebateCommissionListSum() {
  return useMutation({
    mutationFn: (
      params: Omit<RebateCommissionListParams & { taderType?: string }, keyof BasicParams>,
    ) =>
      apiFormPostCustom<RebateCommissionListSumRes>(`/system/crmRebateCommission/listSum`, params),
  });
}

export function useInternalTransferList(
  params: InternalTransferListParams,
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['internalTransferList', params],
    queryFn: () =>
      apiFormPostCustom<InternalTransferListRes>(`/system/crmInternalTransferVerify/list`, params),
    enabled: options.enabled,
  });
}

export function useWithdrawList(params: WithdrawListParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['withdrawList', params],
    queryFn: () => apiFormPostCustom<WithdrawListRes>(`/system/crmWithdrawVerify/list`, params),
    enabled: options.enabled,
  });
}

export function useWithdrawListSum() {
  return useMutation({
    mutationFn: (params: Omit<WithdrawListParams, keyof BasicParams>) =>
      apiFormPostCustom<WithdrawListSumRes>(`/system/crmWithdrawVerify/listSum`, params),
  });
}

export function useDepositList(params: DepositListParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['depositList', params],
    queryFn: () => apiFormPostCustom<DepositListRes>(`/system/crmDepositVerify/list`, params),
    enabled: options.enabled,
  });
}

export function useDepositListSum() {
  return useMutation({
    mutationFn: (params: Omit<DepositListParams, keyof BasicParams>) =>
      apiFormPostCustom<DepositListSumRes>(`/system/crmDepositVerify/listSum`, params),
  });
}

export function useThirdPaymentList() {
  return useQuery({
    queryKey: ['thirdPaymentList'],
    queryFn: () => apiFormPostCustom<ThirdPaymentListRes>(`/system/thirdPaymentSetting/list`, {}),
  });
}
export function useOutMoneyMethodList() {
  return useQuery({
    queryKey: ['outMoneyMethodList'],
    queryFn: () => apiGetCustom<OutMoneyMethodListRes>(`/system/inOutMoneySetting/outMoneyMethod`),
  });
}

export function useCurrencyList() {
  return useQuery({
    queryKey: ['currencyList'],
    queryFn: () => apiFormPostCustom<CurrencyListRes>(`/system/currency/list`, {}),
  });
}

/**
 * 获取审核设置列表
 */
export function useCrmPreferenceList(
  params: CrmPreferenceListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['crmPreferenceList', params],
    queryFn: () => apiFormPostCustom<CrmPreferenceListRes>('/system/crmPreference/list', params),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 获取审核-信息审核
 */
export function useCrmInfoVerifyList(params: CrmInfoVerifyListParams) {
  return useQuery({
    queryKey: ['crmInfoVerifyList', params],
    queryFn: () => apiFormPostCustom<CrmInfoVerifyListRes>('/system/crmInfoVerify/list', params),
  });
}

/**
 * 获取审核-开户审核
 */
export function useCrmNewLoginVerifyList(params: CrmNewLoginVerifyListParams) {
  return useQuery({
    queryKey: ['crmNewLoginVerifyList', params],
    queryFn: () =>
      apiFormPostCustom<CrmNewLoginVerifyListRes>('/system/crmNewLoginVerify/list', params),
  });
}

/**
 * 获取审核-绑定审核
 */
export function useBindVerifyList(params: BindVerifyListParams) {
  return useQuery({
    queryKey: ['crmUserBindVerifyList', params],
    queryFn: () => apiFormPostCustom<BindVerifyListRes>('/system/crmUserBindVerify/list', params),
  });
}

/**
 * 获取审核-杠杆审核
 */
export function useLeverageVerifyList(params: LeverageVerifyListParams) {
  return useQuery({
    queryKey: ['crmLeverageVerifyList', params],
    queryFn: () => apiFormPostCustom<LeverageVerifyListRes>('system/crmLeverVerify/list', params),
  });
}

export function useWithdrawalReviewDetail(withdrawalId: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['withdrawalReviewDetail', withdrawalId],
    queryFn: () =>
      apiGetCustom<WithdrawalReviewDetailRes>(
        `/system/crmWithdrawVerify/verifyDetail/${withdrawalId}`,
      ),
    enabled: options.enabled,
  });
}

export function useWithdrawalVerify() {
  return useMutation({
    mutationFn: (params: WithdrawalVerifyParams) =>
      apiFormPostCustom(`/system/crmWithdrawVerify/verify`, params),
  });
}
export function useSumWithdrawAmount(params: SumWithdrawalAmountParams) {
  return useQuery({
    queryKey: ['sumWithdrawAmount', params],
    queryFn: () =>
      apiFormPostCustom<SumWithdrawalAmountRes>(
        `/system/crmWithdrawVerify/sumWithdrawalAmount`,
        params,
      ),
  });
}

/**
 * 获取入金审核详情
 */
export function useDepositReviewDetail(depistId: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['depositReviewDetail', depistId],
    queryFn: () =>
      apiGetCustom<DepositReviewDetailRes>(`/system/crmDepositVerify/verifyDetail/${depistId}`),
    enabled: options.enabled,
  });
}

/**
 * 入金审核提交
 */
export function useDepositVerify() {
  return useMutation({
    mutationFn: (params: DepositVerifyParams) =>
      apiFormPostCustom(`/system/crmDepositVerify/verify`, params),
  });
}

/**
 * 获取杠杆审核详情
 */
export function useLeverageReviewDetail(leverId: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['leverageReviewDetail', leverId],
    queryFn: () =>
      apiGetCustom<LeverageReviewDetailRes>(`/system/crmLeverVerify/detail/${leverId}`),
    enabled: options.enabled,
  });
}

/**
 * 杠杆审核提交
 */
export function useLeverageVerify() {
  return useMutation({
    mutationFn: (params: LeverageVerifyParams) =>
      apiFormPost(`/system/crmLeverVerify/verify`, params),
  });
}

/**
 * 获取入金交易服务器订单
 */
export function useDepositDealTicketList(params: {
  ticket: string;
  pageSize: number;
  pageNum: number;
  orderByColumn: string;
  isAsc: string;
}) {
  return useQuery({
    queryKey: ['DepositDealTicketList', params],
    queryFn: () =>
      apiFormPostCustom<{
        rows: [];
        code: number;
        total: number;
      }>(`/system/crmDepositVerify/dealTicket/list/${params.ticket}`, params),
  });
}
