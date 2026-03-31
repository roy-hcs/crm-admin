import { apiFormPost, apiFormPostCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AllocatedUsers,
  CrmTicketParams,
  CrmTicketRes,
  TicketAddParams,
  TicketTabsParams,
} from './types';

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
      apiFormPost('/system/ticket/follow', params),
  });
}
/**
 * 我的工单 全部 待处理 等等
 */
export function useMyTicketAllList(params: CrmTicketParams, tab: TicketTabsParams) {
  return useQuery({
    queryKey: ['MyTicketAllList', params, tab],
    queryFn: () => apiFormPostCustom<CrmTicketRes>(`/system/ticket/list?tab=${tab}`, params),
  });
}

/**
 * 删除工单
 */
export function useTicketRemove() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/ticket/remove', params),
  });
}

/**
 * 新增工单
 */
export function useTicketAdd() {
  return useMutation({
    mutationFn: (params: TicketAddParams) => apiFormPost('/system/ticket/add', params),
  });
}

/**
 * 获取下级用户
 */
export function useGetAllocatedUsers() {
  return useMutation({
    mutationFn: (params: { roleId: string }) =>
      apiFormPostCustom<AllocatedUsers>('/system/role/authUser/allocatedList', params),
  });
}

/**
 * 分配工单
 */
export function useAssignOrder() {
  return useMutation({
    mutationFn: (params: { userId: string; ids: string }) =>
      apiFormPost('/system/ticket/assign', params),
  });
}

/**
 * 清除受理人
 */
export function useClearAssignee() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/ticket/clear', params),
  });
}

/**
 * 关闭工单
 */
export function useCloseOrder() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/ticket/close', params),
  });
}
