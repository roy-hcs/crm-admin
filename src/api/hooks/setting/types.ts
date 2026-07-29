import { BasicRes, BaseEntity } from '@/api/types';
import { MtServerGroupRes } from '../agent/types';

export type CrmMtServiceListItem = BaseEntity & {
  id: string;
  serviceType: number;
  serviceProperty: number;
  servicePropertyValue: string | null;
  aliasName: string;
  serverName: string;
  serviceHost: string;
  managerAccount: string;
  managerSecret: string;
  salt: string | null;
  accountStart: number;
  accountEnd: number;
  status: number;
  processStatus: number;
  syncTime: string;
  lastTicket: number;
  checkTime: string;
  port: string;
  isBindAllowed: number;
  pid: string | null;
  flag: boolean;
  sort: number;
  generateType: number;
  interType: string;
  reportingHost: string | null;
  reportingDbName: string | null;
  reportingAccount: string | null;
  reportingSecret: string | null;
};
export type CrmMtServiceListRes = BasicRes<CrmMtServiceListItem>;

export type AddServerSetting = {
  serviceType: string;
  serviceProperty: string;
  aliasName: string;
  serviceHost: string;
  managerAccount: string;
  managerSecret: string;
  accountStart: number;
  accountEnd: number;
  reportingHost: string;
  reportingDbName: string;
  reportingAccount: string;
  reportingSecret: string;
  generateType: number;
  sort: number;
};

export type EditServerSetting = AddServerSetting & {
  id: string;
};

export type CrmMtServerGroupListRes = BasicRes<MtServerGroupRes>;

export type CrmMtServerTypeAssociationItem = BaseEntity & {
  id: string;
  serverId: string;
  typeId: string;
  defaultMtGroup: string;
  lever: string;
  openCreditBalance: number | null;
  status: number;
  typeName: string;
  defaultLever: string | null;
  roleIds: string[] | null;
  useableRange: number | null;
  accounts: string[] | null;
  accountNames: string[] | null;
  userIds: string[] | null;
  userNames: string[] | null;
};

export type CrmMtServerTypeAssociationRes = BasicRes<CrmMtServerTypeAssociationItem>;

export type CrmMtServerTypeAssociationAddInfoRes = {
  code: number;
  msg: string;
  data: {
    serverTypes: Array<{
      id: string;
      accountType: string;
    }>;
    serverGroup: string[];
    allLever: string[];
  };
};

export type SaveServerTypeAssociationParams = {
  id?: string;
  serverId: string;
  typeId: string;
  defaultMtGroup: string;
  lever: string[];
  openCreditBalance: string;
  useableRange: string;
  roleIds: string[];
  userIds: string[];
  accounts: string[];
  status: number;
};

export type AppDownloadItem = BaseEntity & {
  id: string;
  appName: string;
  downloadLink: string;
  qrCodeActive: number;
  qrCodeLink: string | null;
  status: number;
  icon: string;
  nameLanguageList: string | AppDownloadLanguageItem[] | null;
  applicableRoles: string;
};

export type AppDownloadDetailLanguageItem = {
  id: string;
  appId: string;
  appName: string;
  language: string;
  languageName: string;
};

export type AppDownloadDetailItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string;
  appName: string;
  downloadLink: string;
  qrCodeActive: number;
  qrCodeLink: string | null;
  status: number;
  icon: string;
  nameLanguageList: AppDownloadDetailLanguageItem[];
  applicableRoles: string;
};

export type AppDownloadDetailRes = {
  code: number;
  msg: string;
  data: AppDownloadDetailItem;
};

export type AppDownloadRes = BasicRes<AppDownloadItem>;

export type AppDownloadLanguageItem = {
  id?: string;
  language: string;
  appName: string;
};

export type SaveAppDownloadParams = {
  id?: string;
  downloadLink: string;
  icon: string;
  status: number;
  qrCodeActive: number;
  nameLanguageList: AppDownloadLanguageItem[];
  applicableRoles: string;
};

export type TradingAccountItem = BaseEntity & {
  id: string;
  serverType: number;
  accountType: string;
  associateServerCount: number;
  lever: string | null;
  nameLanguageList: string[] | null;
};

export type TradingAccountRes = BasicRes<TradingAccountItem>;

export type TradingAccountLanguageItem = {
  id?: string;
  language: string;
  accountTypeName: string;
};

export type SaveTradingAccountParams = {
  id?: string;
  serverType: string;
  nameLanguageList: TradingAccountLanguageItem[];
};

export type MtServerTypeDetailLanguageItem = {
  id: string;
  serverTypeId: string;
  accountTypeName: string | null;
  language: string;
  languageName: string;
};

export type MtServerTypeDetailItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string;
  serverType: number;
  accountType: string;
  associateServerCount: number;
  lever: string | null;
  nameLanguageList: MtServerTypeDetailLanguageItem[];
};

export type MtServerTypeDetailRes = {
  code: number;
  msg: string;
  data: MtServerTypeDetailItem;
};
