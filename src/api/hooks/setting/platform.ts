import { ApiResponse, apiFormPostCustom, apiGetCustom, apiPost } from '@/api/client';
import { BasicRes } from '@/api/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CrmUserItem } from '../account/types';
import {
  AgentDataScopeSetting,
  InterTransAdvanceScaleSetting,
  SaveAgentDataScopeParams,
  SaveInterTransAdvanceScaleParams,
} from './types';

/**
 * 读取内转可转出预付金比例设置
 * 约定接口：旧版由 Thymeleaf 模型注入，需后端补充该 JSON 读取接口后才能回显
 */
export function useInterTransAdvanceScaleSetting(enabled = true) {
  return useQuery({
    queryKey: ['interTransAdvanceScaleSetting'],
    queryFn: () =>
      apiGetCustom<ApiResponse<InterTransAdvanceScaleSetting>>(
        '/system/inOutMoneySetting/interTransAdvanceScale',
      ),
    enabled,
    retry: false,
  });
}

/** 保存内转可转出预付金比例设置 */
export function useSaveInterTransAdvanceScale() {
  return useMutation({
    mutationFn: (data: SaveInterTransAdvanceScaleParams) =>
      apiPost('/system/inOutMoneySetting/editInterTransAdvanceScale', data),
  });
}

/**
 * 读取代理业务数据可见范围（统一范围 + 代理单独规则）
 * 约定接口：旧版由 Thymeleaf 模型注入，需后端补充该 JSON 读取接口后才能回显
 */
export function useAgentDataScopeSetting(enabled = true) {
  return useQuery({
    queryKey: ['agentDataScopeSetting'],
    queryFn: () =>
      apiGetCustom<ApiResponse<AgentDataScopeSetting>>('/system/platFormSetting/agentDataScope'),
    enabled,
    retry: false,
  });
}

/** 保存代理业务数据可见范围；agentScopeRules 非空时后端会全量替换规则 */
export function useSaveAgentDataScope() {
  return useMutation({
    mutationFn: (data: SaveAgentDataScopeParams) => apiPost('/system/platFormSetting/edit', data),
  });
}

/** 规则覆盖账号数：指定代理 + 代理及下级（后端按账号去重统计） */
export function useAgentScopeCoverCount() {
  return useMutation({
    mutationFn: (data: { selectedIds: string[]; subIds: string[] }) =>
      apiPost<number>('/system/crmUser/scopeCoverCount', data),
  });
}

/** 搜索可配置的代理账号（仅代理/业务/销售） */
export function useAgentScopeCandidateSearch(keyword: string) {
  return useQuery({
    queryKey: ['agentScopeCandidates', keyword],
    queryFn: () =>
      apiFormPostCustom<BasicRes<CrmUserItem>>('/system/crmUser/listBase', {
        origin: 0,
        pageNum: 1,
        pageSize: 500,
        params: { fiveCons: keyword, targetAccountType: '2,3,4' },
      }),
    enabled: !!keyword.trim(),
    staleTime: 5 * 60 * 1000,
  });
}

/** 某个代理下的全部下级（预览用，最多 200 条） */
export function useAgentScopeSubordinateList(agentId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['agentScopeSubordinates', agentId],
    queryFn: () =>
      apiFormPostCustom<BasicRes<CrmUserItem>>('/system/crmUser/listBase', {
        origin: 0,
        pageNum: 1,
        pageSize: 200,
        params: { accountIds: agentId, targetAccountType: '2,3,4' },
      }),
    enabled: enabled && !!agentId,
    staleTime: 5 * 60 * 1000,
  });
}
