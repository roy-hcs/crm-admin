import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  PammAuditLogListParams,
  PammAuditLogListRes,
  PammCommissionListParams,
  PammCommissionListRes,
  PammProductListParams,
  PammProductListRes,
  PammProtocolListParams,
  PammProtocolListRes,
  PammReportCommissionListParams,
  PammReportCommissionListRes,
  PammReportInvestListParams,
  PammReportInvestListRes,
  PammReportProfitSharingListParams,
  PammReportProfitSharingListRes,
  ProductReviewListParams,
  ProductReviewListRes,
} from './type';

export function usePammCommissionList(params: PammCommissionListParams) {
  return useQuery({
    queryKey: ['PammCommissionList', params],
    queryFn: () => apiFormPostCustom<PammCommissionListRes>(`/system/pammCommission/list`, params),
  });
}

export function usePammAuditLogList(params: PammAuditLogListParams) {
  return useQuery({
    queryKey: ['PammAuditLogList', params],
    queryFn: () => apiFormPostCustom<PammAuditLogListRes>(`/system/pammAuditLog/list`, params),
  });
}

export function useProductReviewList(params: ProductReviewListParams) {
  return useQuery({
    queryKey: ['ProductReviewList', params],
    queryFn: () =>
      apiFormPostCustom<ProductReviewListRes>(`/system/pammProject/verifyList`, params),
  });
}
export function usePammProductList(
  params: PammProductListParams,
  options: { enabled?: boolean } = { enabled: true },
) {
  return useQuery({
    queryKey: ['PammProductList', params],
    queryFn: () => apiFormPostCustom<PammProductListRes>(`/system/pammProject/list`, params),
    enabled: options.enabled,
  });
}
export function usePammProtocolList(params: PammProtocolListParams) {
  return useQuery({
    queryKey: ['PammProtocolList', params],
    queryFn: () => apiFormPostCustom<PammProtocolListRes>(`/system/pammProtocol/list`, params),
  });
}
export function usePammReportInvestList(params: PammReportInvestListParams) {
  return useQuery({
    queryKey: ['PammReportInvestList', params],
    queryFn: () =>
      apiFormPostCustom<PammReportInvestListRes>(`/system/pammReportForms/investHistory`, params),
  });
}
export function usePammReportCommissionList(params: PammReportCommissionListParams) {
  return useQuery({
    queryKey: ['PammReportCommissionList', params],
    queryFn: () =>
      apiFormPostCustom<PammReportCommissionListRes>(
        '/system/pammReportForms/projectCommission',
        params,
      ),
  });
}
export function usePammReportProfitSharingList(params: PammReportProfitSharingListParams) {
  return useQuery({
    queryKey: ['PammReportProfitSharingList', params],
    queryFn: () =>
      apiFormPostCustom<PammReportProfitSharingListRes>(
        '/system/pammReportForms/projectProfit',
        params,
      ),
  });
}
