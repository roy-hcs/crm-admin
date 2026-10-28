import { apiFormPost, apiGet } from '@/api/client';
import { CrmDealAccountListItem } from '@/api/hooks/account/types';
import { CrmUserWalletItem } from '@/api/hooks/system/types';
import { useMutation, useQuery } from '@tanstack/react-query';

const DEPOSIT_PREFIX = '/system/crmDeposit';

function buildQuery(params: Record<string, string | number | null | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      search.append(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

export type DepositTradeAccounts = {
  accountList: CrmDealAccountListItem[];
  walletList: CrmUserWalletItem[];
};

export type DepositExchangeRateParams = {
  method: string;
  /** 账户币种 */
  source: string;
  /** 收款币种 */
  dest: string;
  userId: string;
};

export type DepositExchangeRateResult = {
  rate: string | number | null;
  inRate: string | number | null;
  outRate: string | number | null;
  currencyPair?: string | null;
};

export type DepositCalcReceiveParams = {
  deposit: string;
  fee: string;
  feeCurrency: string;
  rate: string;
  currencyPair: string;
  targetCurrency: string;
  source: string;
};

export type DepositCalcDepositParams = {
  payAmount: string;
  fee: string;
  feeCurrency: string;
  rate: string;
  currencyPair: string;
  targetCurrency: string;
  source: string;
};

export type SaveAgentDepositParams = {
  userId: string;
  accountType: string;
  login?: string;
  serverId?: string;
  walletId?: string;
  deposit: string;
  fee: string;
  rate: string;
  dest: string;
  source: string;
  subRemark: string;
  feeCurrency: string;
  depositCurrency: string;
  currencyPair: string;
  targetDeposit: string;
  method: string;
  voucher: string;
  googleCode: string;
};

/**
 * 用户可入金的交易账号与钱包
 */
export function useDepositTradeAccounts(userId: string) {
  return useQuery({
    queryKey: ['depositTradeAccounts', userId],
    queryFn: async () => {
      const res = await apiGet<DepositTradeAccounts>(
        `${DEPOSIT_PREFIX}/getTradeAccounts${buildQuery({ userId })}`,
      );
      return res.code === 0 ? res.data : null;
    },
    enabled: !!userId,
  });
}

/**
 * 获取汇率（与旧版一致：后端以 source=收款币种、dest=账户币种查询）
 */
export function useDepositExchangeRate() {
  return useMutation({
    mutationFn: (params: DepositExchangeRateParams) =>
      apiGet<DepositExchangeRateResult>(
        `${DEPOSIT_PREFIX}/exchangeRate${buildQuery({
          method: params.method,
          source: params.dest,
          dest: params.source,
          userId: params.userId,
        })}`,
      ),
  });
}

export function useCalcReceiveAmount() {
  return useMutation({
    mutationFn: (params: DepositCalcReceiveParams) =>
      apiGet<string | number | null>(`${DEPOSIT_PREFIX}/calcReceiveAmount${buildQuery(params)}`),
  });
}

export function useCalcDepositAmount() {
  return useMutation({
    mutationFn: (params: DepositCalcDepositParams) =>
      apiGet<string | number | null>(`${DEPOSIT_PREFIX}/calcDepositAmount${buildQuery(params)}`),
  });
}

export function useSaveAgentDeposit() {
  return useMutation({
    mutationFn: (params: SaveAgentDepositParams) =>
      apiFormPost<unknown>(`${DEPOSIT_PREFIX}/save`, params),
  });
}
