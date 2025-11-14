import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { PammCommissionListParams, PammCommissionListRes } from './type';

export function usePammCommissionList(params: PammCommissionListParams) {
  return useQuery({
    queryKey: ['PammCommissionList', params],
    queryFn: () => apiFormPostCustom<PammCommissionListRes>(`/system/pammCommission/list`, params),
  });
}
