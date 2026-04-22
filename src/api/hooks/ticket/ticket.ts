import { apiFormPost, apiFormPostCustom, apiGetCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AllocatedUsers,
  CrmTicketDetailRes,
  CrmTicketParams,
  CrmTicketRes,
  ReplayOrderParams,
  TicketAddParams,
  TicketEditParams,
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
 * 编辑工单
 */
export function useTicketEdit() {
  return useMutation({
    mutationFn: (params: TicketEditParams) => apiFormPost('/system/ticket/edit', params),
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

/**
 * 删除工单回复
 */
export function useDeleteReply() {
  return useMutation({
    mutationFn: (params: { id: string }) => apiFormPost('/system/ticket/removeReply', params),
  });
}

/**
 * 工单详情
 */
export function useTicketDetail(id: string, options?: { enabled: boolean }) {
  return useQuery({
    queryKey: ['TicketDetail', id],
    queryFn: () => apiGetCustom<CrmTicketDetailRes>(`/system/ticket/detailInfo/${id}`),
    enabled: options?.enabled,
  });
}

/**
 * 回复工单
 */
export function useReplyOrder() {
  return useMutation({
    mutationFn: (params: ReplayOrderParams) => apiFormPost('/system/ticket/reply', params),
  });
}
