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

export type RebateLevelParams = BasicParams;
export type RebateLevelRes = BasicRes<RebateLevelItem>;
export type RebateLevelItem = BaseEntity & {
  id: string;
  userId: string | null;
  accountId: string | null;
  serialNumber: number | null;
  level: string;
  levelName: string;
  relatedAccountCount: string;
  relatedRebateRuleCount: string;
  relatedRebateTemplateCount: string;
  model: number;
};

export type RebateTraderDealListParams = BasicParams & {
  rebateType: string;
  model: string;
  ruleName: string;
  serverType: string;
  serverId: string;
  hasUsed: string;
};
export type RebateTraderDealListRes = BasicRes<RebateTraderDealItem>;
export type RebateTraderDealItem = BaseEntity & {
  id: string;
  userId: string | null;
  accountId: string | null;
  serialNumber: string;
  ruleName: string;
  hasUsed: string;
  rebateGroupType: string;
  mtGroup: string;
  settleUnit: string;
  highestRebateLevel: string;
  relatedAccountCount: string;
  relatedRebateTemplateCount: string;
  serverType: number | null;
  serverName: string | null;
  serverId: string | null;
  groupTypeId: string;
  rebateType: string;
  accountGroups: string;
  model: number;
  settleType: number | null;
  commissionSettlementTiming: number;
  suitType: number;
  settleValue: number;
  crmRebateLevels: string | null;
  ruleAndModel: string;
  traderServers: TraderServer[] | null;
  traderLanguages: string | null;
  accountGroupNames: string;
};

export type TraderServer = {
  id: string;
  rebateTraderId: string;
  serverId: string;
  serverName: string;
  serverType: string;
  mtGroups: string | null;
  mtGroup: string;
  rebateGroupTypes: string | null;
  rebateGroupType: string | null;
};

export type RebateFeeSettingsListParams = RebateTraderDealListParams;
export type RebateFeeSettingsListRes = RebateTraderDealListRes;
export type RebateFeeSettingsItem = RebateTraderDealItem;

export type RebateDepositSettingsListParams = RebateTraderDealListParams;
export type RebateDepositSettingsListRes = RebateTraderDealListRes;
export type RebateDepositSettingsItem = RebateTraderDealItem;
