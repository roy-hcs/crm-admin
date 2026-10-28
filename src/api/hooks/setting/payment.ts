import { apiFormPost, apiFormPostCustom, apiGetCustom, apiPost, apiPut } from '@/api/client';
import { BasicParams } from '@/api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CrmBankListRes,
  CrmEWalletListRes,
  CurrencyListRes,
  ExchangeRateListRes,
  PayIdAccountListRes,
  RemittanceAccountListRes,
  SaveCrmBankParams,
  SaveCrmEWalletParams,
  SaveCryptoCurrencyParams,
  SaveCurrencyParams,
  SaveExchangeRateParams,
  SavePayIdAccountParams,
  SaveRemittanceAccountParams,
  SaveWithdrawChannelParams,
  SaveWithdrawFeeParams,
  CryptoCurrencyListRes,
  WithdrawChannelListRes,
  WithdrawFeeListRes,
} from './types';

// ==================== 货币设置 ====================

// 货币设置列表
export function useCurrencyList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['currencyList', params],
    queryFn: () => apiFormPostCustom<CurrencyListRes>('/system/currency/list', params),
    enabled: options?.enabled ?? true,
  });
}

// 新增货币（同时保存默认汇率）
export function useAddCurrency() {
  return useMutation({
    mutationFn: (params: SaveCurrencyParams) => apiFormPost('/system/currency/add', params),
  });
}

// 编辑货币
export function useEditCurrency() {
  return useMutation({
    mutationFn: (params: SaveCurrencyParams) => apiFormPost('/system/currency/edit', params),
  });
}

// 删除货币
export function useRemoveCurrency() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/currency/remove', params),
  });
}

// ==================== 汇率设置 ====================

// 汇率设置列表
export function useExchangeRateList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['exchangeRateList', params],
    queryFn: () => apiFormPostCustom<ExchangeRateListRes>('/system/exchangeRate/list', params),
    enabled: options?.enabled ?? true,
  });
}

// 新增汇率
export function useAddExchangeRate() {
  return useMutation({
    mutationFn: (params: SaveExchangeRateParams) => apiFormPost('/system/exchangeRate/add', params),
  });
}

// 编辑汇率
export function useEditExchangeRate() {
  return useMutation({
    mutationFn: (params: SaveExchangeRateParams) =>
      apiFormPost('/system/exchangeRate/edit', params),
  });
}

// 删除汇率
export function useRemoveExchangeRate() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/exchangeRate/remove', params),
  });
}

// 获取最新市场价格（手动填充市场价格）
export function useLatestExchangePrice() {
  return useMutation({
    mutationFn: (params: { sCurrency: string; tCurrency: string }) =>
      apiGetCustom<{ code: number; msg: string; data: number }>(
        `/system/exchangeRate/latest-exchange?sCurrency=${params.sCurrency}&tCurrency=${params.tCurrency}`,
      ),
  });
}

// ==================== 收款账户 ====================

// ---------- 银行 ----------
export function useCrmBankList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['crmBankList', params],
    queryFn: () => apiFormPostCustom<CrmBankListRes>('/system/crmBank/list', params),
    enabled: options?.enabled ?? true,
  });
}

export function useAddCrmBank() {
  return useMutation({
    mutationFn: (params: SaveCrmBankParams) => apiFormPost('/system/crmBank/add', params),
  });
}

export function useEditCrmBank() {
  return useMutation({
    mutationFn: (params: SaveCrmBankParams) => apiFormPost('/system/crmBank/edit', params),
  });
}

export function useRemoveCrmBank() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/crmBank/remove', params),
  });
}

export function useChangeCrmBankStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiFormPost('/system/crmBank/changeStatus', params),
  });
}

// ---------- 加密货币 ----------
export function useCryptoCurrencyList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['cryptoCurrencyList', params],
    queryFn: () => apiFormPostCustom<CryptoCurrencyListRes>('/system/cryptoCurrency/list', params),
    enabled: options?.enabled ?? true,
  });
}

export function useAddCryptoCurrency() {
  return useMutation({
    mutationFn: (params: SaveCryptoCurrencyParams) =>
      apiFormPost('/system/cryptoCurrency/add', params),
  });
}

export function useEditCryptoCurrency() {
  return useMutation({
    mutationFn: (params: SaveCryptoCurrencyParams) =>
      apiFormPost('/system/cryptoCurrency/edit', params),
  });
}

export function useRemoveCryptoCurrency() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/cryptoCurrency/remove', params),
  });
}

export function useChangeCryptoCurrencyStatus() {
  return useMutation({
    mutationFn: (params: { id: number; status: number }) =>
      apiPut(`/system/cryptoCurrency/change-status?status=${params.status}&id=${params.id}`),
  });
}

// ---------- 电子钱包 ----------
export function useCrmEWalletList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['crmEWalletList', params],
    queryFn: () => apiFormPostCustom<CrmEWalletListRes>('/system/crmEWallet/list', params),
    enabled: options?.enabled ?? true,
  });
}

export function useAddCrmEWallet() {
  return useMutation({
    mutationFn: (params: SaveCrmEWalletParams) => apiFormPost('/system/crmEWallet/add', params),
  });
}

export function useEditCrmEWallet() {
  return useMutation({
    mutationFn: (params: SaveCrmEWalletParams) => apiFormPost('/system/crmEWallet/edit', params),
  });
}

export function useRemoveCrmEWallet() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/crmEWallet/remove', params),
  });
}

export function useChangeCrmEWalletStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiFormPost('/system/crmEWallet/changeStatus', params),
  });
}

// ---------- PayID ----------
export function usePayIdAccountList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['payIdAccountList', params],
    queryFn: () => apiFormPostCustom<PayIdAccountListRes>('/system/payIDAccount/list', params),
    enabled: options?.enabled ?? true,
  });
}

export function useAddPayIdAccount() {
  return useMutation({
    mutationFn: (params: SavePayIdAccountParams) => apiFormPost('/system/payIDAccount/add', params),
  });
}

export function useEditPayIdAccount() {
  return useMutation({
    mutationFn: (params: SavePayIdAccountParams) =>
      apiFormPost('/system/payIDAccount/edit', params),
  });
}

export function useRemovePayIdAccount() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/payIDAccount/remove', params),
  });
}

export function useChangePayIdAccountStatus() {
  return useMutation({
    mutationFn: (params: { id: number; status: number }) =>
      apiPut(`/system/payIDAccount/change-status?status=${params.status}&id=${params.id}`),
  });
}

// ---------- 电汇/汇款 ----------
export function useRemittanceAccountList(
  params: BasicParams & { accountType?: number },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['remittanceAccountList', params],
    queryFn: () =>
      apiFormPostCustom<RemittanceAccountListRes>('/system/remittanceAccount/list', params),
    enabled: options?.enabled ?? true,
  });
}

export function useAddRemittanceAccount() {
  return useMutation({
    mutationFn: (params: SaveRemittanceAccountParams) =>
      apiFormPost('/system/remittanceAccount/add', params),
  });
}

export function useEditRemittanceAccount() {
  return useMutation({
    mutationFn: (params: SaveRemittanceAccountParams) =>
      apiFormPost('/system/remittanceAccount/edit', params),
  });
}

export function useRemoveRemittanceAccount() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/remittanceAccount/remove', params),
  });
}

export function useChangeRemittanceAccountStatus() {
  return useMutation({
    mutationFn: (params: { id: number; status: number }) =>
      apiPut(`/system/remittanceAccount/change-status?status=${params.status}&id=${params.id}`),
  });
}

// ==================== 出金渠道 ====================

// 出金渠道列表
export function useWithdrawChannelList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['withdrawChannelList', params],
    queryFn: () =>
      apiFormPostCustom<WithdrawChannelListRes>('/system/withdrawChannel/list', params),
    enabled: options?.enabled ?? true,
  });
}

// 新增出金渠道（JSON body）
export function useAddWithdrawChannel() {
  return useMutation({
    mutationFn: (params: SaveWithdrawChannelParams) =>
      apiPost('/system/withdrawChannel/add', params),
  });
}

// 编辑出金渠道（JSON body）
export function useEditWithdrawChannel() {
  return useMutation({
    mutationFn: (params: SaveWithdrawChannelParams) =>
      apiPost('/system/withdrawChannel/edit', params),
  });
}

// 删除出金渠道
export function useRemoveWithdrawChannel() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/withdrawChannel/remove', params),
  });
}

// 修改出金渠道状态
export function useChangeWithdrawChannelStatus() {
  return useMutation({
    mutationFn: (params: { id: number; status: number }) =>
      apiFormPost('/system/withdrawChannel/changeStatus', params),
  });
}

// ==================== 出金手续费设置 ====================

// 出金手续费列表
export function useWithdrawFeeList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['withdrawFeeList', params],
    queryFn: () => apiFormPostCustom<WithdrawFeeListRes>('/system/withdrawFeeSetting/list', params),
    enabled: options?.enabled ?? true,
  });
}

// 保存出金手续费（新增与编辑共用 save）
export function useSaveWithdrawFee() {
  return useMutation({
    mutationFn: (params: SaveWithdrawFeeParams) =>
      apiFormPost('/system/withdrawFeeSetting/save', params),
  });
}

// 修改出金手续费状态
export function useUpdateWithdrawFeeStatus() {
  return useMutation({
    mutationFn: (params: { id: number; status: number }) =>
      apiFormPost('/system/withdrawFeeSetting/updateStatus', params),
  });
}

// 删除出金手续费
export function useRemoveWithdrawFee() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/withdrawFeeSetting/remove', params),
  });
}
