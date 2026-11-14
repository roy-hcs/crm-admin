/**
 * 权限包管理 · 类型定义（P3a）
 *
 * 事实来源 = 旧 RuoYi 模板
 * `CRM/crm-admin/src/main/resources/templates/system/spreadPermPackage/{add,edit,spreadPermPackage}.html`
 * 与 `SpreadPermPackageController.java`。19 个表单字段一个不少，命名与旧页 `name=` 对齐，
 * 便于后端 `CrmSpreadPermPackage` / `CrmApplicableUserSettings` 直接绑定。
 * 详见 `crm-admin/docs/P3a-PAGE-PLAN.md` §5。
 */

/** 适用用户配置：对应旧页 `applicableUserSettings.*` 的 8 个子字段 */
export interface ApplicableUserSettingsForm {
  /** 旧页为 fixed hidden value=1（按适用类型筛选），保留可写以兼容编辑回显 */
  applicableMode: number;
  /** 1 不限 / 2 角色 / 3 指定用户 / 4 用户下级 / 5 代理下级 / 6 国家地区 / 7 标签 */
  applicableTypes: string[];
  roles: string[];
  tags: string[];
  countryId: string;
  userIds: string[];
  userSubIds: string[];
  agentSubIds: string[];
}

/** 多语言条目：旧页 `.lang-name`(maxlength=50) / `.lang-remark`(maxlength=200) */
export interface PermPackageLanguageItem {
  language: string;
  name: string;
  remark: string;
}

/**
 * 旧页 `#form-spreadPermPackage-add` 的 19 个 `name=` 字段（含 1 个 hidden id）。
 * `nameLanguageList` 为旧页多语言弹窗收集后随表单提交的附加结构
 * （Controller `checkNameLanguageUnique(...getNameLanguageList())` 消费）。
 */
export interface PermPackageFormValues {
  id: string;
  name: string;
  code: string;
  remark: string;
  purpose: string;
  purposeDisabled: string;
  status: string;
  serverIds: string[];
  accountGroupIds: string[];
  lever: string;
  defaultRoleIds: string[];
  walletCurrency: string;
  applicableUserSettings: ApplicableUserSettingsForm;
  nameLanguageList: PermPackageLanguageItem[];
}

export const EMPTY_PERM_PACKAGE_FORM: PermPackageFormValues = {
  id: '',
  name: '',
  code: '',
  remark: '',
  purpose: '',
  purposeDisabled: '',
  status: '1',
  serverIds: [],
  accountGroupIds: [],
  lever: '',
  defaultRoleIds: [],
  walletCurrency: '',
  applicableUserSettings: {
    applicableMode: 1,
    applicableTypes: [],
    roles: [],
    tags: [],
    countryId: '',
    userIds: [],
    userSubIds: [],
    agentSubIds: [],
  },
  nameLanguageList: [],
};

/** 旧页列表行（`/list` 返回 RuoYi TableDataInfo） */
export interface PermPackageItem {
  id: number | string;
  name: string;
  code: string;
  remark?: string;
  status?: string;
  purpose?: string;
  purposeDisabled?: string;
  serverIds?: string;
  accountGroupIds?: string;
  lever?: string;
  defaultRoleIds?: string;
  walletCurrency?: string;
  applicableUserCount?: number;
  createTime?: string;
}

/** RuoYi TableDataInfo：`apiFormPostCustom` 直接返回该结构 */
export interface PermPackageListResult {
  rows: PermPackageItem[];
  total: number;
  code?: number;
  msg?: string;
}

/** RuoYi AjaxResult：`apiFormPost` 返回该结构 */
export interface AjaxResult<T> {
  code: number;
  msg?: string;
  data?: T;
}

/** `/getServerAccountTypes` 返回 { [serverId]: 账号类型列表 } */
export type ServerAccountTypesResult = Record<string, unknown>;

/** `/applicableUserList` 行 */
export interface ApplicableUserItem {
  id?: number | string;
  userName?: string;
  nickName?: string;
  [key: string]: unknown;
}

export interface ApplicableUserListResult {
  rows: ApplicableUserItem[];
  total: number;
  code?: number;
  msg?: string;
}

export interface PermPackageListParams {
  pageNum: number;
  pageSize: number;
  name?: string;
  status?: string;
  orderByColumn?: string;
  isAsc?: string;
}

export type PermPackageDialogMode = 'add' | 'edit';
