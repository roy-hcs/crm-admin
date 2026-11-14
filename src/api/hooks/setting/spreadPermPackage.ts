/**
 * 权限包管理 · API hooks（P3a）
 *
 * URL 全部写成字面量全路径，供 `scripts/gen-api-contract.mjs` / `endpoints.test.ts`
 * 的调用点扫描识别（不隐藏在变量拼接里），便于契约缺口如实暴露。
 *
 * 端点对照 `SpreadPermPackageController.java`（`prefix = /system/spreadPermPackage`）：
 * 旧 RuoYi 共 16 个映射，其中 4 个返回 Thymeleaf 视图页
 * （`GET ""`、`GET /add`、`GET /edit/{id}`、`GET /applicableUserList/{id}`），
 * React 为 SPA、用客户端弹窗替代服务端渲染页，**不迁移这 4 个视图端点**；
 * 其余 12 个业务端点在此 1:1 落地。视图页里的字段与行为由 PermPackageDialog 承接。
 */
import { apiFormPost, apiFormPostCustom, apiGet, apiPut } from '@/api/client';
import type { FormParams } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  ApplicableUserListResult,
  PermPackageFormValues,
  PermPackageItem,
  PermPackageListParams,
  PermPackageListResult,
  ServerAccountTypesResult,
} from './permPackageTypes';

/** 把表单值转成 RuoYi 表单提交形状：数组字段 join 成逗号串，嵌套对象交给 flattenParams */
export function toPermPackageFormParams(values: PermPackageFormValues): FormParams {
  const settings = values.applicableUserSettings;
  return {
    id: values.id,
    name: values.name,
    code: values.code,
    remark: values.remark,
    purpose: values.purpose,
    purposeDisabled: values.purposeDisabled,
    status: values.status,
    serverIds: values.serverIds.join(','),
    accountGroupIds: values.accountGroupIds.join(','),
    lever: values.lever,
    defaultRoleIds: values.defaultRoleIds.join(','),
    walletCurrency: values.walletCurrency,
    applicableUserSettings: {
      applicableMode: settings.applicableMode,
      applicableTypes: settings.applicableTypes.join(','),
      roles: settings.roles.join(','),
      tags: settings.tags.join(','),
      countryId: settings.countryId,
      userIds: settings.userIds.join(','),
      userSubIds: settings.userSubIds.join(','),
      agentSubIds: settings.agentSubIds.join(','),
    },
    nameLanguageList: values.nameLanguageList.map(item => ({
      language: item.language,
      name: item.name,
      remark: item.remark,
    })),
  };
}

/** 1. 列表（旧页 `prefix + "/list"`） */
export function usePermPackageList(params: PermPackageListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['spreadPermPackageList', params],
    queryFn: () =>
      apiFormPostCustom<PermPackageListResult>('/system/spreadPermPackage/list', {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        name: params.name ?? '',
        status: params.status ?? '',
        orderByColumn: params.orderByColumn ?? '',
        isAsc: params.isAsc ?? 'asc',
      }),
    enabled: options?.enabled ?? true,
  });
}

/** 2. 新增（旧页 `prefix + "/add"`，后端 `addSave(CrmSpreadPermPackage)`） */
export function useAddPermPackage() {
  return useMutation({
    mutationFn: (values: PermPackageFormValues) =>
      apiFormPost('/system/spreadPermPackage/add', toPermPackageFormParams(values)),
  });
}

/** 3. 编辑（旧页 `prefix + "/edit"`，后端 `editSave(CrmSpreadPermPackage)`） */
export function useEditPermPackage() {
  return useMutation({
    mutationFn: (values: PermPackageFormValues) =>
      apiFormPost('/system/spreadPermPackage/edit', toPermPackageFormParams(values)),
  });
}

/** 4. 删除（旧页 `prefix + "/remove"`） */
export function useRemovePermPackage() {
  return useMutation({
    mutationFn: (ids: string) => apiFormPost('/system/spreadPermPackage/remove', { ids }),
  });
}

/** 5. 名称查重（旧页 remote；后端返回纯文本 "0"=唯一 / "1"=已存在） */
export function useCheckNameUnique() {
  return useMutation({
    mutationFn: (params: { name: string; id?: string }) =>
      apiFormPostCustom<string | number>('/system/spreadPermPackage/checkNameUnique', {
        name: params.name,
        id: params.id ?? '',
      }),
  });
}

/** 6. 编码查重（旧页 remote；同上返回纯文本） */
export function useCheckCodeUnique() {
  return useMutation({
    mutationFn: (params: { code: string; id?: string }) =>
      apiFormPostCustom<string | number>('/system/spreadPermPackage/checkCodeUnique', {
        code: params.code,
        id: params.id ?? '',
      }),
  });
}

/** 7. 适用用户数（旧页 `prefix + "/countApplicableUsers"`，返回 AjaxResult<Integer>） */
export function useCountApplicableUsers() {
  return useMutation({
    mutationFn: (settings: PermPackageFormValues['applicableUserSettings']) =>
      apiFormPost<number>('/system/spreadPermPackage/countApplicableUsers', {
        applicableMode: settings.applicableMode,
        applicableTypes: settings.applicableTypes.join(','),
        roles: settings.roles.join(','),
        tags: settings.tags.join(','),
        countryId: settings.countryId,
        userIds: settings.userIds.join(','),
        userSubIds: settings.userSubIds.join(','),
        agentSubIds: settings.agentSubIds.join(','),
      }),
  });
}

/** 8. 服务器 → 账号类型联动（旧页 `prefix + "/getServerAccountTypes"`） */
export function useServerAccountTypes(serverIds: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['spreadPermPackageServerAccountTypes', serverIds],
    queryFn: () =>
      apiGet<ServerAccountTypesResult>(
        `/system/spreadPermPackage/getServerAccountTypes?serverIds=${encodeURIComponent(serverIds)}`,
      ),
    enabled: (options?.enabled ?? true) && serverIds.length > 0,
  });
}

/** 9. 启停（旧页 `$.operate.put(prefix + "/change-status?status=&id=")`） */
export function useChangePermPackageStatus() {
  return useMutation({
    mutationFn: (params: { id: string | number; status: string }) =>
      apiPut(`/system/spreadPermPackage/change-status?status=${params.status}&id=${params.id}`),
  });
}

/** 10. 已启用权限包列表（旧页分配代理下拉 `prefix + "/listEnabled"`） */
export function useListEnabledPermPackages(keyword: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['spreadPermPackageListEnabled', keyword],
    queryFn: () =>
      apiGet<PermPackageItem[]>(
        `/system/spreadPermPackage/listEnabled?keyword=${encodeURIComponent(keyword)}`,
      ),
    enabled: options?.enabled ?? true,
  });
}

/** 11. 分配代理（旧页 `prefix + "/assignAgent"`） */
export function useAssignPermPackageAgent() {
  return useMutation({
    mutationFn: (params: { id: string; agentIds: string }) =>
      apiFormPost('/system/spreadPermPackage/assignAgent', {
        id: params.id,
        agentIds: params.agentIds,
      }),
  });
}

/** 12. 适用用户列表（旧页 `applicableUserList.html` 的表格数据） */
export function useApplicableUserList(
  params: { id: string; pageNum: number; pageSize: number },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['spreadPermPackageApplicableUserList', params],
    queryFn: () =>
      apiFormPostCustom<ApplicableUserListResult>('/system/spreadPermPackage/applicableUserList', {
        id: params.id,
        pageNum: params.pageNum,
        pageSize: params.pageSize,
      }),
    enabled: (options?.enabled ?? true) && params.id.length > 0,
  });
}
