import { apiFormPostCustom, apiGetCustom } from '@/api/client';
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
