// Rebate module types
import { BasicParams, BasicRes, BaseEntity } from '../../types';
import { ServerItem } from '../system';

// Rebate Base Point related types
export type RebateBasePointParams = BasicParams & {
  pointValueName?: string;
  serverType?: string;
  serverId?: string;
  pointValueType?: string;
};
export type AddRebateBasePointParams = {
  pointValueName: string;
  serverType: string;
  serverId: string;
  pointValueType: string;
  rebateType: string;
  pointValue: string;
  pointValueLots?: string;
  pointValueRules: string;
  pointValueCurrency: string;
  serialNumber?: string;
};
export type EditRebateBasePointParams = AddRebateBasePointParams & { id: string };

export type RebateBasePointRes = BasicRes<RebateBasePointItem>;

export type RebateBasePointItem = BaseEntity & {
  id: string;
  userId: string | null;
  accountId: string | null;
  serialNumber: number;
  pointValue: string;
  pointValueName: string;
  rebateType: string;
  serverType: string;
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
  serverType: string;
  serverName: string;
  flag: boolean;
  serverId: string;
};

export type MtRebateBaseTypeRes = {
  path: string;
  symbols: string[];
}[];

export type AddRebateBaseTypeParams = {
  typeGroupName: string;
  serverType: string;
  typeName: string;
  serverId: string;
};
export type EditRebateBaseTypeParams = AddRebateBaseTypeParams & { id: string };

export type RebateBaseTypeRes = BasicRes<RebateBaseTypeItem>;
export type RebateBaseTypeParams = BasicParams & {
  typeGroupName?: string;
  serverType?: string;
  serverId?: string;
};

export type RebateLevelParams = BasicParams & {
  model?: number;
};
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

// CRM rebate trader information
interface CrmRebateTrader {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string;
  userId: string | null;
  accountId: string | null;
  serialNumber: string;
  ruleName: string;
  hasUsed: string; // Could be '1' or '0'
  rebateGroupType: string | null;
  mtGroup: string | null;
  settleUnit: string;
  highestRebateLevel: string;
  relatedAccountCount: number | null;
  relatedRebateTemplateCount: number | null;
  serverType: string | null;
  serverName: string | null;
  serverId: string;
  groupTypeId: string | null;
  rebateType: number;
  accountGroups: string | null;
  model: number;
  settleType: number;
  commissionSettlementTiming: number;
  suitType: number;
  settleValue: number;
  highestLevel: string | null;
  crmRebateLevels: string[] | null;
  ruleAndModel: string;
  traderServers: TraderServer[] | null;
  traderLanguages: string[] | null;
}

// Default language information
interface DefaultLanguage {
  isDefault: string; // 'Y' or 'N'
  language: string;
  id: string | null;
  languageName: string;
}

// Account group information
interface AccountGroup {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string;
  name: string;
  sort: number;
  num: number | null;
  flag: boolean;
  delFlag: boolean;
  relatedRebateRuleCount: number | null;
}

// Server information
export interface TraderServerInfo {
  id: string;
  rebateTraderId: string;
  serverId: string;
  serverName: string;
  serverType: string;
  mtGroups: string[] | null;
  mtGroup: string | null;
  rebateGroupTypes: string[] | null;
  rebateGroupType: string | null;
}

// Language information
interface LanguageInfo {
  id: string;
  rebateTraderId: string;
  language: string;
  ruleName: string;
}

// Information list item
interface InfoListItem {
  isDefault: string; // 'Y' or 'N'
  language: string;
  id: string | null;
  languageName: string;
}

export type RebateTraderDealDetail = {
  crmRebateTrader: CrmRebateTrader;
  defaultLanguage: DefaultLanguage;
  allDealAccountGroup: AccountGroup[];
  serverList: TraderServerInfo[];
  model: string;
  languageList: LanguageInfo[];
  infoList: InfoListItem[];
};
export type RebateFeeSettingDetail = RebateTraderDealDetail;

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
export type TraderServerItem = {
  serverType: string;
  serverId: string;
  serverName: string;
  mtGroups?: string[];
  rebateGroupTypes?: string[];
};
export type TraderLanguageItem = {
  ruleName?: string;
  language: string;
  isDefault: string;
};
export type AddTradingRebateRuleParams = {
  rebateType: string;
  model: string;
  ruleName: string;
  accountGroups?: string[];
  hasUsed: string;
  settleType: string;
  settleValue: number;
  settleUnit: string;
  highestRebateLevel: string;
  serialNumber: string;
  commissionSettlementTiming: string;
  remark?: string;
  traderServers?: TraderServerItem[];
  traderLanguages: TraderLanguageItem[];
};
export type GetMtAndRebateTypeRes = {
  code: number;
  groups: string[];
  types: RebateBaseTypeItem[];
};

export type AddRebateFeeSettingParams = Omit<
  AddTradingRebateRuleParams,
  'settleType' | 'settleValue'
>;

export type AddRebateDepositSettingParams = Omit<
  AddTradingRebateRuleParams,
  'settleType' | 'settleValue'
> & {
  suitType: string;
};

export type RebateFeeSettingsHistoryListParams = BasicParams & {
  timestamp: number;
  serverId: string;
  serverGroupList: string;
  serverGroup: string;
  login: string;
  ticket: string;
  symbol: string;
  type: string | number;
  accountGroupList: string;
  dealAccountGroupIds: string;
  accounts: string;
  entry: string | number;
  params: {
    historyFuzzyName?: string;
    accounts?: string;
    historyDealBJStartTime?: string;
    historyDealBJEndTime?: string;
    historyDealBJStartTimeRingOut?: string;
    historyDealBJEndTimeRingOut?: string;
  };
};

export type RebateFeeSettingsHistoryItem = {
  server: string;
  symbol: string;
  deal: number;
  ratemargin: number;
  login: string;
  type: number;
  swaps: number;
  uuid: string;
  positionID: number;
  balance: number;
  price: number;
  sl: number;
  commission: number;
  currency: string;
  profit: number;
  ticket: number;
  server_id: string;
  BJTime: string;
  volume: number;
  entry: number;
  name: string;
  digits: number;
  comment: string;
  time: string;
  tp: number;
  rateprofit: number;
  server_type: string;
};

export type RebateFeeSettingsHistoryListRes = {
  total: string;
  rows: RebateFeeSettingsHistoryItem[];
  code: number;
  msg: string | null;
  totalVolume: number;
  totalCommission: number;
  totalProfit: number;
  totalSwaps: number;
  priceSum: number;
  serverType: string | null;
  totalList: string[] | null;
};
export type RebateDepositSettingsHistoryItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string;
  login: string;
  serverId: string;
  server: string;
  serverType: number;
  ticket: number;
  type: number;
  time: string;
  profit: number;
  comment: string;
  currency: string;
  digits: number;
  flowType: number;
  serviceProperty: string | null;
  timeStr: string;
  accountGroupList: string | null;
  serverGroupList: string | null;
  opeTypeList: string | null;
  accounts: string | null;
  orderNum: string | null;
  balance: number;
  crmShowId: string | null;
  name: string;
  crmUserName: string | null;
  typeName: string | null;
};

export type RebateDepositSettingsHistoryListRes = {
  total: string;
  rows: RebateDepositSettingsHistoryItem[];
  code: number;
  msg: string | null;
  totalVolume: number;
  totalCommission: number;
  totalProfit: number;
  totalSwaps: number;
  priceSum: number;
  serverType: string | null;
  totalList: string[] | null;
};
export type RebateBasicSettingRes = {
  code: number;
  data: {
    manyRebate: string;
    num: string;
    setting: string;
  };
};

export type RebateBaseAddOrUpdate = {
  code: number;
  data: {
    rebateBase: EditRebateBaseAddOrUpdateParams;
    mtServiceList: ServerItem[];
  };
};

type CommonRebateBaseParams = {
  id: string;
  hasOpen: string;
  getMyselfRebate: string;
  closeTimeInterval: string;
  lastOrderRebateTime: string;
  personRabateCheck: string;
  settleStyle: string;
  settleTime: string;
  settleWeek: string;
  settleWeekTime: string;
  rebateType: string;
};

export type EditRebateBaseAddOrUpdateParams = CommonRebateBaseParams & {
  timeIntervalSetting: string;
};

export type RebateFeeAddOrUpdate = {
  code: number;
  data: {
    rebateBase: EditRebateFeeAddOrUpdateParams;
  };
};

export type EditRebateFeeAddOrUpdateParams = CommonRebateBaseParams;

export type RebateDepositAddOrUpdate = {
  code: number;
  data: {
    rebateBase: EditRebateDepositAddOrUpdateParams;
  };
};

export type EditRebateDepositAddOrUpdateParams = CommonRebateBaseParams & {
  lowLimit: string;
  remarkLimit: string;
};
