// Rebate module types
import { BasicParams, BasicRes, BaseEntity } from '../../types';

// Rebate Base Point related types
export type RebateBasePointParams = BasicParams & {
  pointValueName?: string;
  serverType?: string;
  serverId?: string;
  pointValueType?: string;
};

export type RebateBasePointRes = BasicRes<RebateBasePointItem>;

export type RebateBasePointItem = BaseEntity & {
  id: string;
  userId: string | null;
  accountId: string | null;
  serialNumber: number;
  pointValue: string;
  pointValueName: string;
  rebateType: string;
  serverType: number;
  serverName: string;
  serverId: string;
  pointValueType: number;
  pointValueLots: string;
  pointValueCurrency: string;
  sourceCurrency: string | null;
  pointValueRules: number;
};

// Select Server List related types
export type SelectServerListParams = {
  serverProperty: string | number;
  serverType: string | number;
};

export type SelectServerListRes = SelectServerListItem[];

export type SelectServerListItem = {
  id: string;
  serviceType: number;
  serviceProperty: number;
  serverName: string;
  serverUrl: string;
  status: number;
};

export type RebateBaseTypeItem = BaseEntity & {
  id: string;
  userId: string | null;
  accountId: string | null;
  typeName: string;
  typeGroupName: string;
  serverType: number;
  serverName: string;
  flag: boolean;
  serverId: string;
};

export type RebateBaseTypeRes = BasicRes<RebateBaseTypeItem>;
export type RebateBaseTypeParams = BasicParams & {
  typeGroupName?: string;
  serverType?: string;
  serverId?: string;
};
