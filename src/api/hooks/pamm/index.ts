import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  PammAuditLogListParams,
  PammAuditLogListRes,
  PammCommissionListParams,
  PammCommissionListRes,
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
