import { apiFormPost, apiFormPostCustom, apiGetCustom, apiPost } from '@/api/client';
import { BasicParams } from '@/api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AddServerSetting,
  AppDownloadDetailRes,
  AppDownloadRes,
  CrmMtServerGroupListRes,
  CrmMtServerTypeAssociationAddInfoRes,
  CrmMtServerTypeAssociationRes,
  CrmMtServiceListRes,
  EditServerSetting,
  MtServerTypeDetailRes,
  SaveAppDownloadParams,
  SaveServerTypeAssociationParams,
  SaveTradingAccountParams,
  TradingAccountRes,
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

// 服务器账号类型列表
export function useCrmMtServerTypeAssociationList(
  params: BasicParams,
  id: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['crmMtServerTypeAssociationList', params, id],
    queryFn: () =>
      apiFormPostCustom<CrmMtServerTypeAssociationRes>(
        `/system/mtServerTypeAssociation/list?serverId=${id}`,
        params,
      ),
    enabled: options?.enabled ?? true,
  });
}

// 服务器账号类型列表删除服务器账号类型
export function useRemoveServerTypeAssociation() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPost('/system/mtServerTypeAssociation/remove', params),
  });
}

// 服务器账号类型列表修改服务器账号类型状态
export function useModifyServerTypeAssociationStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiFormPost('/system/mtServerTypeAssociation/changeStatus', params),
  });
}

// 服务器账号类型列表获取添加信息
export function useCrmMtServerTypeAssociationAddInfo(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['crmMtServerTypeAssociationAddInfo', id],
    queryFn: () =>
      apiGetCustom<CrmMtServerTypeAssociationAddInfoRes>(
        `/system/mtServerTypeAssociation/getAddInfo?serverId=${id}`,
      ),
    enabled: options?.enabled ?? true,
  });
}

// 服务器账号类型新增编辑
export function useAddServerTypeAssociation() {
  return useMutation({
    mutationFn: (params: SaveServerTypeAssociationParams) =>
      apiFormPost(`/system/mtServerTypeAssociation/${params.id ? 'edit' : 'add'}`, params),
  });
}

// 下载管理列表
export function useDownLoadsList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['downLoadsList', params],
    queryFn: () => apiFormPostCustom<AppDownloadRes>('/system/appDownload/list', params),
    enabled: options?.enabled ?? true,
  });
}

// 下载管理列表删除
export function useRemoveAppDownload() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/appDownload/remove', params),
  });
}

// 设置-交易平台设置-下载管理修改状态
export function useModifyAppDownloadStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status?: number; qrCodeActive?: number }) =>
      apiPost('/system/appDownload/edit', params),
  });
}

// 下载管理获取详情
export function useDownLoadsDetail(params: { id: string }, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['downLoadsDetail', params],
    queryFn: () => apiGetCustom<AppDownloadDetailRes>(`/system/appDownload/detail?id=${params.id}`),
    enabled: options?.enabled ?? true,
  });
}

// 设置-交易平台设置-下载管理新增编辑app
export function useAddAppDownload() {
  return useMutation({
    mutationFn: (params: SaveAppDownloadParams) =>
      apiPost(`/system/appDownload/${params.id ? 'edit' : 'add'}`, params),
  });
}

// 交易账号类型列表
export function useTradingAccountList(params: BasicParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['tradingAccountList', params],
    queryFn: () => apiFormPostCustom<TradingAccountRes>('/system/mtServerType/list', params),
    enabled: options?.enabled ?? true,
  });
}

// 交易账号类型列表删除
export function useRemoveTradingAccount() {
  return useMutation({
    mutationFn: (params: { ids: string }) => apiFormPost('/system/mtServerType/remove', params),
  });
}

// 设置-交易平台设置-交易账号类型新增编辑
export function useAddTradingAccount() {
  return useMutation({
    mutationFn: (params: SaveTradingAccountParams) =>
      apiPost(`/system/mtServerType/${params.id ? 'edit' : 'add'}`, params),
  });
}

// 设置-交易平台设置-交易账号类型获取详情
export function useMtServerTypeDetail(params: { id: string }, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['mtServerTypeDetail', params],
    queryFn: () =>
      apiGetCustom<MtServerTypeDetailRes>(`/system/mtServerType/detail?id=${params.id}`),
    enabled: options?.enabled ?? true,
  });
}
