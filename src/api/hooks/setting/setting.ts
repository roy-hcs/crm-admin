import { apiFormPost, apiFormPostCustom } from '@/api/client';
import { BasicParams } from '@/api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AddServerSetting,
  CrmMtServerGroupListRes,
  CrmMtServiceListRes,
  EditServerSetting,
} from './types';

// 服务器设置列表
export function useCrmMtServiceList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['crmMtServiceList', params],
    queryFn: () => apiFormPostCustom<CrmMtServiceListRes>('/system/mtService/list', params),
    enabled: options?.enabled ?? true,
  });
}
// 服务器设置列表修改状态
export function useModifyStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number; processStatus: number }) =>
      apiFormPost('/system/mtService/changeStatus', params),
  });
}
// 服务器设置列表修改进程状态
export function useModifyProcessStatus() {
  return useMutation({
    mutationFn: (params: { id: string; processStatus: number }) =>
      apiFormPost('/system/mtService/changeProcessStatus', params),
  });
}
// 服务器设置列表添加服务器
export function useAddServerSetting() {
  return useMutation({
    mutationFn: (params: AddServerSetting) => apiFormPost('/system/mtService/add', params),
  });
}

// 服务器设置列表编辑服务器
export function useEditServerSetting() {
  return useMutation({
    mutationFn: (params: EditServerSetting) => apiFormPost('/system/mtService/edit', params),
  });
}

// 服务器设置列表删除服务器
export function useRemoveServerSetting() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/mtService/remove', params),
  });
}

// 服务器组别列表
export function useCrmMtServerGroupList(
  params: BasicParams,
  id: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['crmMtServerGroupList', params, id],
    queryFn: () =>
      apiFormPostCustom<CrmMtServerGroupListRes>(
        `/system/mtServerGroup/list?serverId=${id}`,
        params,
      ),
    enabled: options?.enabled ?? true,
  });
}

// 服务器设置列表删除服务器组别
export function useRemoveServerGroupSetting() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/mtServerGroup/remove', params),
  });
}

// 服务器设置列表同步服务器组别
export function useSynchronizeServerGroupSetting() {
  return useMutation({
    mutationFn: (params: { serverId: string }) =>
      apiFormPost(`/system/mtServerGroup/synch?serverId=${params.serverId}`, {}),
  });
}

// 服务器设置列表编辑服务器组别
export function useEditServerGroupSetting() {
  return useMutation({
    mutationFn: (params: {
      id: string;
      serverId: string;
      accountStart: string;
      accountEnd: string;
    }) => apiFormPost(`/system/mtServerGroup/edit`, params),
  });
}
