import { apiFormPostCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CrmTicketParams, CrmTicketRes, tabs } from './types';

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
/**
 * 我的工单 全部 待处理 等等
 */
export function useMyTicketAllList(params: CrmTicketParams, tab: tabs) {
  return useQuery({
    queryKey: ['MyTicketAllList', params, tab],
    queryFn: () => apiFormPostCustom<CrmTicketRes>(`/system/ticket/list?tab=${tab}`, params),
  });
}
