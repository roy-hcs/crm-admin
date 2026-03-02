// Message module API hooks
import { apiFormPostCustom, apiGetCustom, apiPost } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
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
    queryFn: () =>
      apiGetCustom<{
        code: number;
        data: Array<{
          id: string;
          email: string;
        }>;
      }>('/system/msg/getEmailConfig'),
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
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/msgTemplate/add', params),
  });
}

/**
 * 编辑模板
 */
export function useEditMsgTemplate() {
  return useMutation({
    mutationFn: (params: { id: string; title: string; content: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/msgTemplate/edit', params),
  });
}

/**
 * 删除模板
 */
export function useRemoveMsgTemplate() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/msgTemplate/remove', params),
  });
}

/**
 * 新增消息
 */
export function useMsgAdd() {
  return useMutation({
    mutationFn: (params: {
      accountNames: string;
      accounts?: string;
      expire?: string | null;
      isNow: string;
      language: string[];
      msgLangs: {
        content: string;
        language: string;
        title: string;
      }[];
      primaryLanguage: string;
      receiveType: string;
      roles?: string[] | null;
      sendEmail: string[];
      sendEmails: string[];
      sendTime: string;
      tags?: string[] | null;
      type: string;
      userIds?: string[] | null;
    }) => apiPost('/system/msg/add', params),
  });
}
/**
 * 编辑消息
 */
export function useMsgEdit() {
  return useMutation({
    mutationFn: (params: {
      id: string;
      accountNames: string;
      accounts?: string;
      expire?: string | null;
      isNow: string;
      language: string[];
      msgLangs: {
        content: string;
        language: string;
        title: string;
      }[];
      primaryLanguage: string;
      receiveType: string;
      roles?: string[] | null;
      sendEmail: string[];
      sendEmails: string[];
      sendTime: string;
      tags?: string[] | null;
      type: string;
      userIds?: string[] | null;
    }) => apiPost('/system/msg/edit', params),
  });
}
/**
 * 获取信息详情
 */
export function useMsgDetail() {
  return useMutation({
    mutationFn: (id: string) =>
      apiGetCustom<{
        code: number;
        data: MsgDetail;
      }>(`/system/msg/detail/${id}?number=1`),
  });
}

/**
 * 删除消息
 */
export function useRemoveMsg() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('system/msg/remove', params),
  });
}
