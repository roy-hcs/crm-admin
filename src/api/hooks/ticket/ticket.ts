import { apiFormPostCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CrmTicketParams, CrmTicketRes } from './types';

export function useTicketList(params: CrmTicketParams) {
  return useQuery({
    queryKey: ['TicketList', params],
    queryFn: () => apiFormPostCustom<CrmTicketRes>(`/system/ticket/list`, params),
  });
}
/**
 * 修改是否关注
 */
export function useTicketFollow() {
  return useMutation({
    mutationFn: (params: { id: string; follow: number }) =>
      apiFormPostCustom<{
        code: number;
      }>('/system/ticket/follow', params),
  });
}
