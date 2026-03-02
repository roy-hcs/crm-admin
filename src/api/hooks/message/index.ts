// Message module API hooks
import { apiFormPost, apiFormPostCustom, apiGet, apiPost } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AddMsgParams,
  GetMsgListParams,
  GetMsgListRes,
  MsgDetail,
  MsgTemplateListParams,
  MsgTemplateListRes,
} from './types';

export * from './types';

/**
 * 获取消息列表
 */
export function useGetMsgList(params: GetMsgListParams) {
  return useQuery({
    queryKey: ['MsgList', params],
    queryFn: () => apiFormPostCustom<GetMsgListRes>('/system/msg/list', params),
  });
}

/**
 * 获取发件邮箱
 */
export function useGetEmailConfig() {
  return useQuery({
    queryKey: ['EmailConfig'],
    queryFn: () => apiGet<Array<{ id: string; email: string }>>('/system/msg/getEmailConfig'),
  });
}

/**
 * 获取模板列表
 */
export function useMsgTemplateList(params: MsgTemplateListParams) {
  return useQuery({
    queryKey: ['MsgTemplateList', params],
    queryFn: () => apiFormPostCustom<MsgTemplateListRes>('/system/msgTemplate/list', params),
  });
}

/**
 * 添加模板
 */
export function useAddMsgTemplate() {
  return useMutation({
    mutationFn: (params: { title: string; content: string }) =>
      apiFormPost('/system/msgTemplate/add', params),
  });
}

/**
 * 编辑模板
 */
export function useEditMsgTemplate() {
  return useMutation({
    mutationFn: (params: { id: string; title: string; content: string }) =>
      apiFormPost('/system/msgTemplate/edit', params),
  });
}

/**
 * 删除模板
 */
export function useRemoveMsgTemplate() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/msgTemplate/remove', params),
  });
}

/**
 * 新增消息
 */
export function useMsgAdd() {
  return useMutation({
    mutationFn: (params: AddMsgParams) => apiPost('/system/msg/add', params),
  });
}
/**
 * 编辑消息
 */
export function useMsgEdit() {
  return useMutation({
    mutationFn: (params: AddMsgParams & { id: string }) => apiPost('/system/msg/edit', params),
  });
}
/**
 * 获取信息详情
 */
export function useMsgDetail() {
  return useMutation({
    mutationFn: (id: string) => apiGet<MsgDetail>(`/system/msg/detail/${id}?number=1`),
  });
}

/**
 * 删除消息
 */
export function useRemoveMsg() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('system/msg/remove', params),
  });
}
