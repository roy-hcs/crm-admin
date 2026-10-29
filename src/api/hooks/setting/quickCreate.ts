import { ApiResponse, FormParams, apiFormPost, apiGetCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';

/** 快速开始-服务器类型关联数据 */
export type AssociationQSData = {
  server: {
    id: string;
    serviceType: number;
    serviceProperty: number;
    aliasName: string;
  };
  serverTypes: Array<{ id: string; accountType: string }> | null;
  serverGroup: string[] | null;
  /** serviceType=3（Sirix）时按组别返回固定杠杆 */
  groupLever: Record<string, string> | null;
  allLever: string[] | null;
};

/** 快速开始-账号设置数据 */
export type AccountSettingQSData = {
  isReal: boolean;
  isFirst?: boolean;
  demoAccountAllowed?: string | null;
  demoAccountVerify?: string | null;
  mtServices: Array<{ id: string; aliasName: string }> | null;
  defaultSever?: string | null;
  accountTypeSel?: string | null;
  accountType?: string | null;
  accountTypeHide?: string | null;
  leverSel?: string | null;
  lever?: string | null;
  leverHide?: string | null;
};

export type ServerTypeInfo = {
  id: string;
  accountType: string;
  lever?: string | null;
};

export type SaveAssociationQSParams = {
  serverId: string;
  /** 已有账号类型 id；新建时留空并传 typeNameList */
  typeId: string;
  typeNameList: Array<{ language: string; accountTypeName: string }>;
  defaultMtGroup: string;
  leverList: string[];
  addLeverList: string[];
  openCreditBalance: string;
  roleIds: string[];
  status: number;
};

export type SaveAccountSettingQSParams = {
  serviceId: string;
  accountAllowed?: string;
  realAccountCondition?: string;
  realAccountConditionPersonInfo?: boolean;
  realAccountConditionPersonFinance?: boolean;
  realAccountConditionPersonIdentity?: boolean;
  realAccountConditionProtocol?: boolean;
  demoAccountVerify?: string;
  severEnable?: boolean;
  defaultSever: string;
  accountTypeSel: string;
  accountType: string;
  typeHide: boolean;
  leverSel: string;
  lever: string;
  leverHide: boolean;
};

/** 快速开始-新增服务器（返回新服务器 id） */
export function useAddServerQS() {
  return useMutation({
    mutationFn: (params: FormParams) =>
      apiFormPost<{ id: string }>('/system/mtService/add', params),
  });
}

/** 快速开始-服务器类型关联数据 */
export function useAssociationDataQS(serverId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['associationDataQS', serverId],
    queryFn: () =>
      apiGetCustom<ApiResponse<AssociationQSData>>(
        `/system/mtServerTypeAssociation/getAssociationDataByQS?serverId=${serverId}`,
      ),
    enabled: (options?.enabled ?? true) && !!serverId,
    retry: false,
  });
}

/** 快速开始-保存服务器类型关联 */
export function useSaveAssociationQS() {
  return useMutation({
    mutationFn: (params: SaveAssociationQSParams) => {
      // typeNameList 为 List<Map>，沿用旧版 jQuery 的 typeNameList[0][key] 形式
      const flat: FormParams = {
        serverId: params.serverId,
        typeId: params.typeId,
        defaultMtGroup: params.defaultMtGroup,
        leverList: params.leverList,
        addLeverList: params.addLeverList,
        openCreditBalance: params.openCreditBalance,
        roleIds: params.roleIds,
        status: params.status,
      };
      params.typeNameList.forEach((item, index) => {
        flat[`typeNameList[${index}][language]`] = item.language;
        flat[`typeNameList[${index}][accountTypeName]`] = item.accountTypeName;
      });
      return apiFormPost('/system/mtServerTypeAssociation/addByQS', flat);
    },
  });
}

/** 快速开始-账号设置数据 */
export function useAccountSettingInfoQS(serverId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['accountSettingInfoQS', serverId],
    queryFn: () =>
      apiGetCustom<ApiResponse<AccountSettingQSData>>(
        `/system/mtAccountSetting/getSettingInfoByQS?serverId=${serverId}`,
      ),
    enabled: (options?.enabled ?? true) && !!serverId,
    retry: false,
  });
}

/** 快速开始-保存账号设置 */
export function useSaveAccountSettingQS() {
  return useMutation({
    mutationFn: (params: SaveAccountSettingQSParams) =>
      apiFormPost('/system/mtAccountSetting/editByQS', params),
  });
}

/** 服务器可选账号类型（含可用杠杆） */
export function useServerTypeInfo(serverId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['serverTypeInfo', serverId],
    queryFn: () =>
      apiGetCustom<ApiResponse<ServerTypeInfo[]>>(
        `/system/mtAccountSetting/getAccountTypeInfo?serverId=${serverId}`,
      ),
    enabled: (options?.enabled ?? true) && !!serverId,
    retry: false,
  });
}
