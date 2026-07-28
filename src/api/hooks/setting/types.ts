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
  serviceType: string; // 1
  serviceProperty: string; // 1
  aliasName: string; // "test-add-sever"
  serviceHost: string; // "154.48.231.170:443"
  managerAccount: string; // "121212"
  managerSecret: string; // "ae21fa2add2b94d96615011f48217273"
  accountStart: number; // 900000
  accountEnd: number; // 999999
  reportingHost: string;
  reportingDbName: string;
  reportingAccount: string;
  reportingSecret: string;
  generateType: number; // 1
  sort: number; // 111
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
