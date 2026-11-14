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
 *
 * ── 决策留痕（11-14 17:4x 使用者裁定「使用你的方案，留好注释」）─────────────
 * P-2 以旧 RuoYi `add.html` / `edit.html` 的 19 个 name= 字段为事实来源，1:1 复刻、不砍字段；
 * P-3 路由与菜单采用 P3a 卡 §2 推荐值（见 settingsRoutes.tsx / Sidebar.tsx 的落点注释）；
 * P-4 顺序按 A0 卡 §5，本轮只到「补页 + 推 origin/develop」，weekly/export → V7 判卷 →
 *     P2 快照重生 → P3b 留下一轮，中间不留空档。
 *
 * 四项与旧 RuoYi 的口径差异（完整说明 = docs/testids.md §3，代码内落点见该卡 §6 索引）：
 *   ① 4 个 Thymeleaf 视图端点不迁移（本文件头 + 1:1 的 12 个业务端点）；
 *   ② 多语言列表不硬编码 sys_language 字典值（PermPackageDialog 多语言区）；
 *   ③ 编辑时 applicableUserSettings 无法回显（PermPackageDialog.fromListItem）；
 *   ④ 数组字段统一 join(',') 提交（本文件 toPermPackageFormParams）。
 * 四项均为「待人审确认的口径差异」而非自行简化，字段与可测边界一个未减。
 *
 * 契约层：本页 5 个端点（add / edit / checkNameUnique / checkCodeUnique / listEnabled）
 * 不在 947 条 atlas 快照（usage-driven，旧模板变量拼接调用提取不到 → 无 caller），
 * `test:contract` 的 C4 会如实报 5 条 MISS，属 P3a 卡 §7.3 预期停机项。
 * 收口路径 = 补页推 origin/develop → 一轮 weekly/export → verify-a0 --after-p3a（V7）
 * → 重跑 P2 快照；**不塞 allowlist.ts、不改 admin-paths.json、不改 atlas、不改断言**。
 *
 * ⚠️ 注释纪律：endpoints.test.ts 的 FN_RE 对整份源码文本扫描且不剥离注释，
 * 因此本文件注释里不要写出「API 函数名 + 左括号」的形态，否则会被当作新调用点计数。
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

/**
 * 把表单值转成 RuoYi 表单提交形状：数组字段 join 成逗号串，嵌套对象交给 flattenParams。
 *
 * 【口径差异 ④ / docs/testids.md §3.4】旧页 select2 multiple 由 jQuery serialize
 * 成「多个同名参数」；这里统一 join(',') 成单个逗号串。依据：后端实体
 * `CrmSpreadPermPackage` 的 serverIds / accountGroupIds / defaultRoleIds 本身即逗号串，
 * `CrmApplicableUserSettings` 的 List<String> 依赖 Spring 转换器。
 * ⚠️ 该形状差异**尚未被运行时/MSW 断言确认**：P3b 需用 MSW 断请求体形状，
 * 若后端实际要求多值同名参数，改本函数即可（不要改调用点或塞白名单）。
 */
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

/** 2. 新增（旧页 `prefix + "/add"`，后端 `addSave(CrmSpreadPermPackage)`）
 *  ⚠️ 契约缺口 ①：不在 947 条 atlas 快照（旧模板 add.html:1082 用 `prefix+"/add"` 变量拼接，
 *  usage-driven 提取器拿不到 caller）。C4 判红属 P3a 卡 §7.3 预期，收口路径见文件头。 */
export function useAddPermPackage() {
  return useMutation({
    mutationFn: (values: PermPackageFormValues) =>
      apiFormPost('/system/spreadPermPackage/add', toPermPackageFormParams(values)),
  });
}

/** 3. 编辑（旧页 `prefix + "/edit"`，后端 `editSave(CrmSpreadPermPackage)`）
 *  ⚠️ 契约缺口 ②：同 ①，旧模板 edit.html:1180 变量拼接调用 → 快照无此 path。 */
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

/** 5. 名称查重（旧页 remote；后端返回纯文本 "0"=唯一 / "1"=已存在）
 *  ⚠️ 契约缺口 ③：不在 947 条快照，原因同上（旧页 validate remote 规则非静态调用）。 */
export function useCheckNameUnique() {
  return useMutation({
    mutationFn: (params: { name: string; id?: string }) =>
      apiFormPostCustom<string | number>('/system/spreadPermPackage/checkNameUnique', {
        name: params.name,
        id: params.id ?? '',
      }),
  });
}

/** 6. 编码查重（旧页 remote；同上返回纯文本）
 *  ⚠️ 契约缺口 ④：不在 947 条快照，原因同上。 */
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

/** 10. 已启用权限包列表（旧页分配代理下拉 `prefix + "/listEnabled"`）
 *  ⚠️ 契约缺口 ⑤：不在 947 条快照（旧页下拉由服务端模板注入，非 UI caller）。
 *  另注：`apiGet` 的查询串会带 keyword，契约扫描按 path 归一化，不影响比对。 */
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
