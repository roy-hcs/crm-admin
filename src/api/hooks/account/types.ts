// Account module types
import { BasicParams, BasicRes, BaseEntity } from '../../types';

// CRM User related types
export type CrmUserParams = {
  params: {
    threeCons?: string;
    fiveCons?: string;
    regStartTime?: string;
    regEndTime?: string;
    fuzzyMobile?: string;
    fuzzyEmail?: string;
    inviter?: string;
    accounts?: string;
  };
  status?: string;
  role?: string;
  accounts?: string;
  certiricateNo?: string;
  accountType?: string;
  tags?: string;
} & BasicParams;

export type CrmUserItem = BaseEntity & {
  id: string;
  lastName: string;
  name: string;
  showId: string;
  sex: string | null;
  mzone: string;
  mobile: string;
  email: string;
  accountType: number;
  accountTypeStr: string;
  userRole: string | null;
  inviter: string;
  inviterName: string | null;
  inviterEmail: string;
  headImg: string;
  status: number;
  role: string;
  rebateLevelName: string | null;
  certiricateType: string | null;
  certiricateNo: string | null;
  source: string;
  country: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  postCode: string | null;
  birthday: string | null;
  verifyStatus: number;
  nameOne: string;
  nameTwo: string;
  inviterShowId: string;
  roleId: string | null;
  rebateLevelId: string | null;
  rebateAccountId: string;
  crmRebateLevel: {
    id: string;
    level: string;
    levelName: string;
  } | null;
  userInfo: string | null;
  applySource: string | null;
  account: string | null;
  permissionJson: string | null;
  inviterChain: string;
  preferenceLanguage: string;
  colorPreference: string;
  lastLoginTime: string | null;
  latestFollowupTime: string | null;
  spreadLinkCodeId: string;
  loginTwoFactorAuth: string | null;
  antiPhishingCode: string | null;
  tags: string;
  points: string | null;
  shortCode: string | null;
  userName: string;
  mtone: string;
  mttwo: string;
  adminRemark: string | null;
  countryName: string | null;
  registerSource: string | null;
  registerSourceText: string | null;
};

export type CrmUserResponse = BasicRes<CrmUserItem>;

export type TagUserItem = {
  userCount: string;
  id: string;
  tagName: string;
};

export type CustomRelationsItem = {
  childNames: string;
  crmRebateLevel: string;
  id: string;
  hasChildren: boolean;
  userName: string;
};

// Trading Account related types
export type CrmDealAccountListParams = BasicParams & {
  server?: string;
  serverGroupList?: string;
  accounts?: string;
  accountGroupList?: string;
  params: {
    regStartTime?: string;
    regEndTime?: string;
    fuzzyAccount?: string;
    fuzzyName?: string;
    accounts?: string;
    threeCons?: string;
  };
};

export type CrmDealAccountListItem = BaseEntity & {
  id: string | null;
  userId: string | null;
  username: string | null;
  name: string | null;
  account: string | null;
  serviceType: number | null;
  serviceProperty: number | null;
  servicePropertyStr: string | null;
  servicePropertyValue: string | null;
  server: string | null;
  serverName: string | null;
  accountSupervisorName: string | null;
  directBrokerName: string | null;
  accountGroupId: string | null;
  accountGroupName: string | null;
  accountSupervisorShowId: string | null;
  serverGroup: string | null;
  accountType: string | null;
  accountTypeName: string | null;
  lever: number | null;
  balance: number | null;
  netWorth: number | null;
  creditAmount: number | null;
  registerTime: string | null;
  registerTimeStr: string | null;
  dealAuth: number | null;
  usedAdvance: number | null;
  usableAdvance: number | null;
  advanceScale: number | null;
  status: number | null;
  initialAmount: number | null;
  currency: string | null;
  authority: string | null;
  directBroker: string | null;
  permissionJson: string | null;
  digits: number | null;
  hasClearAccount: '0' | null;
  buildRebateAccount: boolean | null;
  accountGroupList: string[] | null;
  accounts: string[] | null;
  accountIds: string[] | null;
  crmAuthority: number | null;
  source: string | null;
  roleName: string | null;
};

export type CrmDealAccountListRes = BasicRes<CrmDealAccountListItem>;

// Account Group related types
export type CrmDealAccountGroupListParams = BasicParams;

export type CrmDealAccountItem = BaseEntity & {
  id: string;
  name: string;
  sort: number | null;
  num: number | null;
  flag: boolean;
  delFlag: boolean;
  relatedRebateRuleCount: string;
};

export type CrmDealAccountGroupListRes = BasicRes<CrmDealAccountItem>;

export type DealAccountGroup = CrmDealAccountItem;

export type DealAccountGroupListResponse = DealAccountGroup[];

export type GetGroupByServerResponse = string[];

// Wallet Account related types
export type WalletAccountsListParams = BasicParams & {
  currency?: string;
  params: {
    threeCons?: string;
    regStartTime?: string;
    regEndTime?: string;
  };
};

export type WalletAccountsItem = BaseEntity & {
  id: string | null;
  crmUserId: string | null;
  balance: string | null;
  currency: string | null;
  major: string | null;
  permissionJson: string | null;
  delFlag: string | null;
  crmUserName: string | null;
  crmUserShowId: string | null;
  allIn: string | null;
  allOut: string | null;
  accounts: string | null;
};

export type WalletAccountsListRes = BasicRes<WalletAccountsItem>;

export type SumWalletAccountsItem = {
  totalBalance: number;
  currency: string | null;
};

export type WalletAccountsListSumRes = {
  code: number;
  msg: string;
  data: SumWalletAccountsItem[];
};

export type WalletAccountsListSumParams = {
  currency?: string;
  params: {
    threeCons?: string;
    regStartTime?: string;
    regEndTime?: string;
  };
};

// Customer Relations types
export type CustomerRelationsPostParams = {
  userId?: string;
};

export type CustomerRelationsGetItem = {
  childNames: null | Array<string>;
  hasChildren: boolean;
  id: string | null;
  levelName: string | null;
  rebateLevel: string | null;
  userName: string | null;
};

export type CustomerRelationsPostRes = CustomerRelationsGetItem[];

export type AddCrmUserParams = {
  deptId: string;
  lastName: string;
  name: string;
  fullName: string;
  mzone: string;
  mobile: string;
  email: string;
  inviter: string;
  pwd: string;
  preferenceLanguage: string;
  accountType: string;
  roleId: string;
  colorPreference: string;
  source: string;
  status: string;
};

export type WalletBalanceChangeParams = {
  line: number;
  username: string;
  showId: number;
  email: string;
  phone: string;
  currency: string;
  operateName: string;
  operationType: number;
  opTypeName: string;
  opType: number | null;
  amount: number;
  remark: string;
};

export type WalletPerm = {
  insideTransfer: number;
  outMoney: number;
};

export type accountOperateInfoPerm = {
  enableInternalTransferOut: number;
  insideTransfer: number;
  outMoney: number;
};

export type FundFlowParams = BasicParams & {
  walletId?: string;
  operationType?: string;
  serialNum?: string;
  params: {
    inMethod?: string;
    outMethod?: string;
    transMethod?: string;
    remaidMethod?: string;
    operationStart?: string;
    operationEnd?: string;
  };
};

export type FundFlowItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string | null;
  walletId: string | null;
  preAmount: string | null;
  amount: string | null;
  serialNum: string | null;
  operationType: number | null;
  operationMethod: number | null;
  operationTime: string | null;
  dealServerId: string | null;
  dealAccount: string | null;
  mtOrder: string | null;
  rebateId: string | null;
  crmUserId: string | null;
  currency: string | null;
  accounts: string | null;
  postAmount: string | null;
};

export type FundFlowListRes = BasicRes<FundFlowItem>;

export type AccountDetailInfo = {
  crmDealAccount: {
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: Record<string, string>;
    id: string | null;
    userId: string | null;
    username: string | null;
    name: string | null;
    account: string | null;
    serviceType: number | null;
    serviceProperty: number | null;
    servicePropertyStr: string | null;
    servicePropertyValue: string | null;
    server: string | null;
    serverName: string | null;
    accountSupervisorName: string | null;
    directBrokerName: string | null;
    accountGroupId: string | null;
    accountGroupName: string | null;
    accountSupervisorShowId: string | null;
    serverGroup: string | null;
    accountType: string | null;
    accountTypeName: string | null;
    lever: string | null;
    balance: number | null;
    netWorth: number | null;
    creditAmount: number | null;
    registerTime: string | null;
    registerTimeStr: string | null;
    dealAuth: number | null;
    usedAdvance: number | null;
    usableAdvance: number | null;
    advanceScale: number | null;
    status: number | null;
    initialAmount: number | null;
    currency: string | null;
    authority: string | null;
    directBroker: string | null;
    permissionJson: string | null;
    digits: number | null;
    hasClearAccount: string | null;
    buildRebateAccount: boolean | null;
    accountGroupList: string | null;
    accounts: string | null;
    accountIds: string | null;
    crmAuthority: number | null;
    source: string | null;
    roleName: string | null;
    triggeringEvent: string | null;
  };
  allAccountType: Array<{
    value: string;
    label: string;
  }>;
  allGroup: string[];
  allDealAccountGroup: Array<{
    id: string;
    name: string;
  }>;
  allLever: string[];
  dbName: string | null;
  aspName: string | null;
};

export type DetailInfoEditParams = {
  name: string;
  accountType: string;
  serverGroup: string;
  userId: string;
  directBroker: string;
  accountGroupId: string;
  lever: string;
};

export type AccountInfo = {
  crmDealAccount: {
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: Record<string, string>;
    id: string | null;
    userId: string | null;
    username: string | null;
    name: string | null;
    account: string | null;
    serviceType: number | null;
    serviceProperty: number | null;
    servicePropertyStr: string | null;
    servicePropertyValue: string | null;
    server: string | null;
    serverName: string | null;
    accountSupervisorName: string | null;
    directBrokerName: string | null;
    accountGroupId: string | null;
    accountGroupName: string | null;
    accountSupervisorShowId: string | null;
    serverGroup: string | null;
    accountType: string | null;
    accountTypeName: string | null;
    lever: string | null;
    balance: number | null;
    netWorth: number | null;
    creditAmount: number | null;
    registerTime: string | null;
    registerTimeStr: string | null;
    dealAuth: number | null;
    usedAdvance: number | null;
    usableAdvance: number | null;
    advanceScale: number | null;
    status: number | null;
    initialAmount: number | null;
    currency: string | null;
    authority: string | null;
    directBroker: string | null;
    permissionJson: string | null;
    digits: number | null;
    hasClearAccount: string | null;
    buildRebateAccount: boolean | null;
    accountGroupList: string | null;
    accounts: string | null;
    accountIds: string | null;
    crmAuthority: number | null;
    source: string | null;
    roleName: string | null;
    triggeringEvent: string | null;
  };
};

export type CrmDealAccountFundFlowParams = BasicParams & {
  ticket?: string;
  opeTypeList?: string;
  comment?: string;
  params: {
    operationStart?: string;
    operationEnd?: string;
  };
};

export type CrmDealAccountFundFlowItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string | null;
  login: string | null;
  serverId: string | null;
  server: string | null;
  serverType: number | null;
  ticket: number | null;
  type: number | null;
  time: string | null;
  profit: number | null;
  comment: string | null;
  currency: string | null;
  digits: number | null;
  flowType: number | null;
  timeStr: string | null;
  accountGroupList: string | null;
  serverGroupList: string | null;
  opeTypeList: string | null;
  accounts: string | null;
  orderNum: string | null;
  balance: number | null;
  crmShowId: string | null;
  name: string | null;
  crmUserName: string | null;
  typeName: string | null;
};

export type CrmDealAccountFundFlowRes = BasicRes<CrmDealAccountFundFlowItem> & {
  priceSum: number;
};

export type CrmDealAccountFundHistoryParams = BasicParams & {
  ticket?: string;
  type?: string;
  symbol?: string;
  positionID?: string;
  entry?: string;
  params: {
    historyDealBJStartTime?: string;
    historyDealBJEndTime?: string;
  };
};

export type CrmDealAccountFundHistoryItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  login: string | null;
  serverId: string | null;
  server: string | null;
  deal: number | null;
  ticket: number | null;
  symbol: string | null;
  digits: number | null;
  type: number | null;
  volume: number | null;
  sl: number | null;
  tp: number | null;
  swaps: number | null;
  profit: number | null;
  comment: string | null;
  commission: number | null;
  matchRuleType: string | null;
  entry: number | null;
  serverType: number | null;
  serviceProperty: string | null;
  accountGroupList: string | null;
  positionID: number | null;
  accounts: string | null;
  accountIds: string | null;
  breedGroup: string | null;
  id: string | null;
  uuid: string | null;
  name: string | null;
  currency: string | null;
  openTime: string | null;
  openPrice: number | null;
  closeTime: string | null;
  closePrice: number | null;
  time: string | null;
  price: number | null;
  lotSize: number | null;
  flowType: number | null;
  traderCount: number | null;
  dealTime: string | null;
  openDate: string | null;
  primId: string | null;
};

export type CrmDealAccountFundHistoryRes = BasicRes<CrmDealAccountFundHistoryItem> & {
  totalVolume: number;
  totalProfit: number;
};

export type CrmDealAccountPositionOrderParams = BasicParams & {
  type?: string;
  params: {
    positionDealBJStartTime?: string;
    positionDealBJEndTime?: string;
    positionFuzzyTicket?: string;
    positionFuzzySymbol?: string;
  };
};

export type CrmDealAccountPositionOrderItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: {
    currency: string | null;
    accountName: string | null;
  };
  uuid: string | null;
  login: string | null;
  server: string | null;
  deal: number | null;
  ticket: number | null;
  symbol: string | null;
  digits: number | null;
  type: number | null;
  entry: number | null;
  volume: number | null;
  time: string | null;
  dealDate: string | null;
  price: number | null;
  sl: number | null;
  tp: number | null;
  commission: number | null;
  swaps: number | null;
  profit: number | null;
  comment: string | null;
  positionID: number | null;
  priceCur: number | null;
  rateprofit: number | null;
  ratemargin: number | null;
  synTime: string | null;
  serverType: number | null;
  accounts: string | null;
  accountIds: string | null;
  accountGroupList: string | null;
  currency: string | null;
  lotSize: number | null;
};

export type CrmDealAccountPositionOrderRes = BasicRes<CrmDealAccountPositionOrderItem> & {
  totalVolume: number;
  totalProfit: number;
  totalSwaps: number;
};

export type CrmDealAccountLimitOrderParams = BasicParams & {
  params: {
    positionFuzzyTicket?: string;
    positionFuzzyType?: string;
    positionFuzzySymbol?: string;
    positionDealBJStartTime?: string;
    positionDealBJEndTime?: string;
  };
};

export type CrmDealAccountLimitOrderItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: {
    currency: string | null;
    accountName: string | null;
  };
  uuid: string | null;
  login: string | null;
  server: string | null;
  deal: number | null;
  ticket: number | null;
  symbol: string | null;
  digits: number | null;
  type: number | null;
  entry: number | null;
  volume: number | null;
  time: string | null;
  dealDate: string | null;
  price: number | null;
  sl: number | null;
  tp: number | null;
  commission: number | null;
  swaps: number | null;
  profit: number | null;
  comment: string | null;
  positionID: number | null;
  priceCur: number | null;
  rateprofit: number | null;
  ratemargin: number | null;
  synTime: string | null;
  serverType: number | null;
  accounts: string | null;
  accountIds: string | null;
  accountGroupList: string | null;
  currency: string | null;
  lotSize: number | null;
};

export type CrmDealAccountLimitOrderRes = BasicRes<CrmDealAccountLimitOrderItem> & {
  totalVolume: number;
};

export type CustomerLoyaltyPlanItem = BaseEntity & {
  id: string;
  name: string;
  sort: number;
  description: string;
  userCount: number;
  status: number;
  performanceFeeReduce: number | null;
  performanceFeeRebatBonus: number | null;
  delFlag: string;
  language: string | null;
  languageList: string[] | null;
  crmUserVipAndRuleList: unknown[] | null;
  crmUserVipOrRuleList: unknown[] | null;
};

export type CustomerLoyaltyPlanRes = {
  code: number;
  data: {
    userVipStatus: string;
    userVipList: CustomerLoyaltyPlanItem[];
  };
};

export type CrmUserVipUpdateSortParams = {
  id: string;
  sort: number;
};

export type CrmUserVipGetPreferenceRes = {
  code: number;
  data: {
    targetAccount: string;
    evaluationMode: string;
  };
};

export type CrmUserVipPreferenceEditParams = {
  targetAccount: string;
  evaluationMode: string;
};

export type CrmUserVipLanguageItem = {
  id?: string;
  vipId?: string;
  language: string;
  languageName?: string;
  name: string;
  description: string;
  delFlag?: string | null;
};

export type CrmUserVipRuleItem = {
  id?: string;
  vipId?: string;
  ruleType: string;
  ruleEvent: string | number;
  ruleSymbol: string;
  ruleValue: string | number;
  ruleLevel: string | null;
  ruleTag: string | null;
  delFlag?: string | null;
};

export type CrmUserVipAddParams = {
  sort: number;
  status: number;
  languageList: CrmUserVipLanguageItem[];
  crmUserVipAndRuleList: CrmUserVipRuleItem[];
  crmUserVipOrRuleList: CrmUserVipRuleItem[];
};

export type CrmUserVipEditParams = CrmUserVipAddParams & {
  id: string;
};

export type CrmUserVipDetailRes = {
  code: number;
  data: {
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: Record<string, unknown>;
    id: string;
    name: string | null;
    sort: number;
    description: string | null;
    userCount: number | null;
    status: number;
    performanceFeeReduce: number | null;
    performanceFeeRebatBonus: number | null;
    delFlag: string;
    language: string | null;
    languageList: CrmUserVipLanguageItem[];
    crmUserVipAndRuleList: CrmUserVipRuleItem[];
    crmUserVipOrRuleList: CrmUserVipRuleItem[];
  };
};
