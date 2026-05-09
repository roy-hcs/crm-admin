import { apiFormPost, apiFormPostCustom, apiGetCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createEmptyCrmInfoVerifyDetailData,
  CrmInfoVerifyDetailQueryData,
  mapDetailOneResponse,
  mapDetailThreeResponse,
  mapDetailTwoResponse,
} from './informationDetailMappers';
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
  BindingReviewDetailRes,
  BindingVerifyParams,
  InternalTransferReviewDetailRes,
  InternalTransferVerifyParams,
  InternalTransferDealTicketListParams,
  InternalTransferDealTicketListRes,
  RebateReviewDetailRes,
  RebateVerifyParams,
  FeeRebateReviewDetailRes,
  DepositRebateReviewDetailRes,
  AccountOpenVerifyParams,
  OpenReviewDetailRes,
  CrmUserDealAccountListParams,
  CrmUserDealAccountListRes,
  CrmUserManageInfoRes,
  CrmUserFinanceInfoRes,
  CrmUserIdentityBasicInfoRes,
  CrmUserProtocolInfoRes,
  AagentVerifyParams,
  AgentReviewDetailRes,
  CrmInfoVerifyDetailThreeRes,
  CrmInfoVerifyParams,
  CrmInfoVerifyDetailOneRes,
  CrmInfoVerifyDetailTwoRes,
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

export function useCrmInfoVerifyDetailQuery(
  params: {
    id: string;
    userId?: string;
    infoType?: string;
    status?: string | null;
    sumsubId?: string | null;
  },
  options?: { enabled?: boolean },
) {
  const buildDetailError = (message?: string) => {
    return new Error(message || 'Failed to load crm info verify detail');
  };

  return useQuery({
    queryKey: [
      'crmInfoVerifyDetail',
      params.id,
      params.userId || '',
      params.infoType || '',
      params.status || '',
      params.sumsubId || '',
    ],
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async (): Promise<CrmInfoVerifyDetailQueryData> => {
      const detailId = params.id || '';
      const detailUserId = params.userId || '';
      const statusNumber = Number(params.status);
      const hasSumsubId =
        Boolean(params.sumsubId) && params.sumsubId !== 'null' && params.sumsubId !== 'undefined';
      const isViewStatus = statusNumber === 0 || statusNumber === 1;
      const isAuditStatus = statusNumber === 2 || statusNumber === -1;

      if (!detailId) {
        return createEmptyCrmInfoVerifyDetailData();
      }

      // 查看（非 Sumsub）
      if (isViewStatus && !hasSumsubId) {
        if (!params.infoType) {
          return createEmptyCrmInfoVerifyDetailData();
        }

        const oneRes = await apiGetCustom<CrmInfoVerifyDetailOneRes>(
          `/system/crmInfoVerify/viewDetailInfo/${detailId}/${params.infoType}`,
        );

        if (oneRes?.code === 0 && oneRes.data) {
          return mapDetailOneResponse(oneRes);
        }
        throw buildDetailError((oneRes as { msg?: string })?.msg);
      }

      // Sumsub 查看
      if (isViewStatus && hasSumsubId) {
        const twoRes = await apiGetCustom<CrmInfoVerifyDetailTwoRes>(
          `/system/crmInfoVerify/viewSumsubDetailInfo?id=${detailId}`,
        );

        if (twoRes?.code === 0 && twoRes.data?.info) {
          return mapDetailTwoResponse(twoRes);
        }
        throw buildDetailError((twoRes as { msg?: string })?.msg);
      }

      // 待审核/审核中
      if (isAuditStatus) {
        if (!detailUserId) {
          return createEmptyCrmInfoVerifyDetailData();
        }

        const threeRes = await apiGetCustom<CrmInfoVerifyDetailThreeRes>(
          `/system/crmInfoVerify/viewDetailInfo/${detailId}?userId=${detailUserId}`,
        );

        if (threeRes?.code === 0 && threeRes.data) {
          return mapDetailThreeResponse(threeRes);
        }
        throw buildDetailError(threeRes?.msg);
      }

      return createEmptyCrmInfoVerifyDetailData();
    },
  });
}
/**
 * 提交审核-信息审核详情
 */
export function useCrmInfoVerify() {
  return useMutation({
    mutationFn: (params: CrmInfoVerifyParams) =>
      apiFormPost(`/system/crmInfoVerify/verify`, params),
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
 * 获取绑定审核详情
 */
export function useBindingReviewDetail(bindingId: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['bindingReviewDetail', bindingId],
    queryFn: () =>
      apiGetCustom<BindingReviewDetailRes>(`/system/crmUserBindVerify/detail/${bindingId}`),
    enabled: options.enabled,
  });
}

/**
 * 绑定审核提交
 */
export function useBindingVerify() {
  return useMutation({
    mutationFn: (params: BindingVerifyParams) =>
      apiFormPost(`/system/crmUserBindVerify/verify`, params),
  });
}

/**
 * 获取内部转账审核详情
 */
export function useInternalTransferReviewDetail(transferId: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['internalTransferReviewDetail', transferId],
    queryFn: () =>
      apiGetCustom<InternalTransferReviewDetailRes>(
        `/system/crmInternalTransferVerify/detail/${transferId}`,
      ),
    enabled: options.enabled,
  });
}

/**
 * 内部转账审核提交
 */
export function useInternalTransferVerify() {
  return useMutation({
    mutationFn: (params: InternalTransferVerifyParams) =>
      apiFormPost(`/system/crmInternalTransferVerify/verify`, params),
  });
}

/**
 * 内部转账交易服务器订单列表
 */
export function useInternalTransferDealTicketList({
  id,
  params,
}: {
  id: string;
  params: InternalTransferDealTicketListParams;
}) {
  return useQuery({
    queryKey: ['InternalTransferDealTicketList', params, id],
    queryFn: () =>
      apiFormPostCustom<InternalTransferDealTicketListRes>(
        `/system/crmInternalTransferVerify/dealTicket/list/${id}`,
        params,
      ),
  });
}

/**
 * 获取交易返佣审核详情
 */
export function useRebateDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['rebateDetail', id],
    queryFn: () =>
      apiGetCustom<RebateReviewDetailRes>(`/system/crmRebateCommission/detail/1/${id}`),
    enabled: options.enabled,
  });
}

/**
 * 交易返佣审核提交
 */
export function useRebateVerify() {
  return useMutation({
    mutationFn: (params: RebateVerifyParams) =>
      apiFormPost(`/system/crmRebateCommission/verify/1`, params),
  });
}

/**
 * 获取手续费返佣审核详情
 */
export function useFeeRebateDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['feeRebateDetail', id],
    queryFn: () =>
      apiGetCustom<FeeRebateReviewDetailRes>(`/system/crmRebateCommission/detail/2/${id}`),
    enabled: options.enabled,
  });
}

/**
 * 手续费返佣审核提交
 */
export function useFeeRebateVerify() {
  return useMutation({
    mutationFn: (params: RebateVerifyParams) =>
      apiFormPost(`/system/crmRebateCommission/verify/2`, params),
  });
}

/**
 * 获取入金返佣审核详情
 */
export function useDepositRebateDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['depositRebateDetail', id],
    queryFn: () =>
      apiGetCustom<DepositRebateReviewDetailRes>(`/system/crmRebateCommission/detail/3/${id}`),
    enabled: options.enabled,
  });
}

/**
 * 入金返佣审核提交
 */
export function useDepositRebateVerify() {
  return useMutation({
    mutationFn: (params: RebateVerifyParams) =>
      apiFormPost(`/system/crmRebateCommission/verify/3`, params),
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

/**
 * 开户审核详情
 */
export function useAccountOpeningDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['accountOpeningDetail', id],
    queryFn: () => apiGetCustom<OpenReviewDetailRes>(`/system/crmNewLoginVerify/detailInfo/${id}`),
    enabled: options.enabled,
  });
}

/**
 * 开户审核提交
 */
export function useAccountOpeningVerify() {
  return useMutation({
    mutationFn: (params: AccountOpenVerifyParams) =>
      apiFormPost(`/system/crmNewLoginVerify/verify`, params),
  });
}

/**
 * 开户审核详情
 */
export function useCrmUserDealAccountList(
  id: string,
  params: CrmUserDealAccountListParams,
  options: { enabled: boolean },
) {
  return useQuery({
    queryKey: ['crmUserDealAccountList', params, id],
    queryFn: () =>
      apiFormPostCustom<CrmUserDealAccountListRes>(`/system/crmDealAccount/list/${id}`, params),
    enabled: options.enabled,
  });
}

/**
 * 用户kyc个人信息详情
 */
export function useCrmUserManageInfo(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['crmUserManageInfo', id],
    queryFn: () => apiGetCustom<CrmUserManageInfoRes>(`/system/crmUser/manageInfo/2/${id}?from=1`),
    enabled: options.enabled,
  });
}

/**
 * 用户kyc财务信息详情
 */
export function useCrmUserFinanceInfo(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['crmUserFinanceInfo', id],
    queryFn: () => apiGetCustom<CrmUserFinanceInfoRes>(`/system/crmUser/manageInfo/3/${id}?from=1`),
    enabled: options.enabled,
  });
}

/**
 * 用户kyc身份信息详情
 */
export function useCrmUserIdentityBasicInfo(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['crmUserIdentityBasicInfo', id],
    queryFn: () =>
      apiGetCustom<CrmUserIdentityBasicInfoRes>(`/system/crmUser/manageInfo/4/${id}?from=1`),
    enabled: options.enabled,
  });
}

/**
 * 用户kyc协议确认详情
 */
export function useCrmUserProtocolInfo(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['crmUserProtocolInfo', id],
    queryFn: () =>
      apiGetCustom<CrmUserProtocolInfoRes>(
        `/system/crmUserProtocolRelation//oneUserProtocol/${id}?from=1`,
      ),
    enabled: options.enabled,
  });
}

/**
 * 代理审核详情
 */
export function useAgentReviewDetail(id: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['agentReviewDetail', id],
    queryFn: () => apiGetCustom<AgentReviewDetailRes>(`/system/agentApply/detail/${id}`),
    enabled: options.enabled,
  });
}
/**
 * 代理审核提交
 */
export function useAgentReviewVerify() {
  return useMutation({
    mutationFn: (params: AagentVerifyParams) => apiFormPost(`/system/agentApply/verify`, params),
  });
}
