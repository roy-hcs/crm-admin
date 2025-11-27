import { BasicParams, BasicRes, BaseEntity } from '../../types';

// Re-export shared types for backward compatibility
export type { BasicParams, BasicRes, BaseEntity };

export type AgentApplyItem = BaseEntity & {
  id: string;
  lastName: string;
  name: string;
  mzone: string;
  mobile: string;
  email: string;
  pwd: string;
  salt: string;
  certiricateType: string | null;
  certiricateNo: string | null;
  certiricateFront: string | null;
  certiricateBack: string | null;
  havingAgent: number;
  verifyStatus: number;
  applySource: number;
  inviter: string;
  spreadLinkCodeId: string;
  userId: string | null;
  showId: string | null;
  verifyTime: string | null;
  verifyUser: string | null;
  inviterName: string | null;
  verifyStep: number;
  verifyUserName: string | null;
  language: string;
  identityInfo: string;
  defaultRole: string;
  columns: string | null;
  userName: string;
  vuserName: string;
};

export type AgentApplyListRes = BasicRes<AgentApplyItem>;

export type AgentApplyListParams = BasicParams & {
  name?: string;
  mobile?: string | number;
  email?: string;
  verifyStatus?: number | string;
  applySource?: number | string;
  verifyUserName?: string;
  params: {
    beginTime?: string;
    endTime?: string;
  };
};

export type RebateCommissionItem = BaseEntity & {
  id: string;
  userId: string;
  orderId: string;
  mtOrder: string;
  serverName: string;
  serverId: string;
  serverType: string;
  taderType: string | null;
  lastName: string;
  name: string;
  showId: string;
  rebateTotalAmt: string;
  rebateFixedAmt: string;
  rebatePointsAmt: string;
  rebateTime: string;
  rebateStatus: string;
  trderAccount: string;
  trderCount: string;
  amtUnit: string;
  verifyId: string | null;
  traderTime: string;
  traderTimeStr: string;
  verifyTime: string | null;
  rebateTraderId: string;
  rebateCommissionId: string;
  rebateType: string;
  rebateTraderRuleId: string;
  commissionBase: string;
  accountGroupList: string | null;
  model: number;
  rebateAccountType: string | null;
  rebateAccount: string | null;
  settleStyle: number;
  ticket: string;
  deal: string;
  login: string;
  symbol: string;
  volume: string;
  userName: string;
  rebateUser: string;
  totalAmtText: string;
  currency: string;
  inMoneyAmt: string;
  percentage: string;
  commission: string;
  rebateTraderName: string;
  verifyName: string;
  rebateAccountName: string | null;
  verifyStep: number;
  verifyUserName: string | null;
  orderComment: string;
};

export type RebateCommissionListRes = BasicRes<RebateCommissionItem>;

export type RebateCommissionListParams = BasicParams & {
  serverId?: string;
  rebateType?: string | number;
  serverGroup?: string;
  serverGroupList?: string;
  mtOrder?: number | string;
  trderAccount?: string;
  rebateStatus?: number | string;
  id?: string | null;
  rebateTraderId?: string | null;
  verifyUserName?: string;
  accountGroupList?: string;
  conditionName?: string;
  params: {
    startTraderTime?: string;
    endTraderTime?: string;
    beginTime?: string;
    endTime?: string;
  };
};

export type RebateCommissionRuleItem = BaseEntity & {
  updateBy: string | null;
  id: string;
  userId: string | null;
  accountId: string | null;
  serialNumber: string;
  ruleName: string;
  hasUsed: string;
  rebateGroupType: string | null;
  mtGroup: string | null;
  settleUnit: string | null;
  highestRebateLevel: string;
  relatedAccountCount: string | null;
  relatedRebateTemplateCount: string | null;
  serverType: string;
  serverName: string | null;
  serverId: string;
  groupTypeId: string | null;
  rebateType: string;
  accountGroups: string | null;
  model: number;
  settleType: string | null;
  commissionSettlementTiming: number;
  suitType: number;
  settleValue: number;
  crmRebateLevels: string | null;
  ruleAndModel: string;
  traderServers: string | null;
  traderLanguages: string | null;
};

export type RebateCommissionListSumItem = {
  totalVolume: string;
  totalList: {
    amtUnit: string;
    commissionBase: string;
    rebateFixedAmt: string;
    rebateTotalAmt: string;
  }[];
};

export type RebateCommissionListSumRes = {
  code: number;
  msg: string;
  data: RebateCommissionListSumItem[];
};

export type InternalTransferListParams = BasicParams & {
  userId?: string;
  status?: number | string;
  verifyUserName?: string;
  dealTicket?: string | number;
  params: {
    fuzzyStartTime?: string;
    fuzzyEndTime?: string;
    fuzzyOutAccount?: string;
    fuzzyInAccount?: string;
  };
};

export type InternalTransferItem = {
  orderComment: string;
  verifyStep: number;
  verifyUser: string | null;
  remark: string | null;
  verifyTime: string | null;
  outAccount: string;
  type: number;
  vUserName: string | null;
  subTime: string;
  inMoney: number;
  rate: number;
  inAccount: string;
  isNeedDeposit: string | null;
  userLastName: string;
  userShowId: string;
  id: string;
  currencyPair: string;
  inServer: string;
  dealTicket: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  inUnit: string;
  outMoney: number;
  userName: string;
  userId: string;
  outAliasName: string;
  outUnit: string;
  outStatus: number;
  outServer: string;
  inAliasName: string;
  status: number;
};

export type InternalTransferListRes = BasicRes<InternalTransferItem>;

export type WithdrawItem = {
  orderComment: string;
  accountMobile: string | null;
  orderId: string | null;
  fee: string;
  verifyStep: number;
  feeCurrency: string;
  verifyUser: string | null;
  verifyTime: string | null;
  vUserName: string | null;
  subTime: string;
  serverId: string;
  cardNo: string;
  operator: string | null;
  accountBank: string;
  balance: number;
  expectWithdraw: number;
  userLastName: string;
  userShowId: string;
  subRemark: string | null;
  id: string;
  swift: string | null;
  operTime: string | null;
  walletId: string | null;
  aliasName: string;
  method: number;
  targetCurrency: string;
  vUserLastName: string | null;
  creditDeducted: number;
  withdrawCurrency: string;
  withdrawBankAddress: string | null;
  roleName: string;
  exceptionFlag: string | null;
  factWithdraw: string | null;
  status: number;
  exceptionRemark: string | null;
  customChannelJson: string | null;
  withdrawBank: string | null;
  accountName: string;
  orderNum: string;
  remark: string | null;
  login: string;
  rate: number;
  withdrawUser: string | null;
  userEmail: string;
  bsbCode: string;
  ifscCode: string;
  channelId: string | null;
  abnCode: string | null;
  branchBank: string;
  currencyPair: string;
  factWithdrawScale: number;
  dealTicket: string;
  verifyUserName: string | null;
  userName: string;
  userId: string;
  withdrawAccount: string | null;
  accountEmail: string | null;
  isWithdraw: number;
  operatorType: string | null;
  withdrawAddress: string | null;
  withdraw: string;
  walletCurrency?: string;
};

export type WithdrawListRes = BasicRes<WithdrawItem>;

export type WithdrawListParams = BasicParams & {
  userId?: string;
  status?: number | string;
  verifyUserName?: string;
  dealTicket?: string | number;
  method?: string;
  login?: string;
  orderNum?: string;
  exceptionFlag?: string | number;
  accounts?: string;
  params: {
    beginTime?: string;
    endTime?: string;
    outMoneyAccount?: string;
    accounts?: string;
    finishBeginTime?: string;
    finishEndTime?: string;
  };
};

export type WithdrawListSumRes = {
  code: number;
  msg: string;
  data: {
    currency: string;
    sumFee: string;
    sumWithdraw: string;
    sumFactWithdraw: string;
  }[];
};

export type DepositListParams = BasicParams & {
  userId?: string;
  status?: number | string;
  verifyUserName?: string;
  dealTicket?: string | number;
  method?: string;
  login?: string;
  orderNum?: string;
  orderId?: string;
  channelId?: string;
  depositCurrency?: string;
  accounts?: string;
  params: {
    beginTime?: string;
    endTime?: string;
    inMoneyAccount?: string;
    accounts?: string;
  };
};

export type DepositListRes = BasicRes<DepositListItem>;

export type DepositListSumRes = {
  code: number;
  msg: string;
  data: {
    currency: string;
    sumDeposit: number;
    sumFee: number;
    type: string;
  }[];
};
export type DepositListItem = {
  factDeposit: number;
  orderComment: string;
  orderId: string | null;
  directBroker: string;
  voucher: string;
  fee: string;
  verifyStep: number;
  feeCurrency: string;
  orderNum: string;
  verifyUser: string | null;
  remark: string | null;
  verifyTime: string | null;
  login: string;
  vUserName: string | null;
  serverId: string;
  subTime: string;
  receiptAmount: string | null;
  rate: number;
  isNeedDeposit: string | null;
  userLastName: string;
  expectDeposit: number;
  userShowId: string;
  subRemark: string | null;
  id: string;
  depositCurrency: string;
  channelId: string;
  walletId: string | null;
  aliasName: string;
  currencyPair: string;
  method: number;
  receiptCurrency: string | null;
  walletCurrency: string | null;
  dealTicket: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  userName: string;
  userId: string;
  roleName: string;
  depositScale: number;
  deposit: string;
  factDepositScale: number;
  status: number;
};

export type ThirdPaymentListRes = BasicRes<ThirdPaymentItem>;

export type CurrencyItem = BaseEntity & {
  id: string;
  currencyNameChn: string;
  currencyNameEng: string;
  currencyAbbr: string;
  currencyRemark: string | null;
  status: number;
  isDefault: number;
  currencyType: number;
  decimalPrecision: number;
  sort: string;
  network: string | null;
};

export type OutMoneyMethodListRes = {
  code: number;
  msg: string;
  data: { name: string; id: string }[];
};

export type CurrencyListRes = BasicRes<CurrencyItem>;

export type ThirdPaymentItem = BaseEntity & {
  id: number;
  channelName: string;
  payWay: string | null;
  mchId: string | null;
  apiUrl: string | null;
  enterSecret: string | null;
  backSecret: string | null;
  payType: number;
  currency: string;
  status: boolean;
  sort: number;
  minDeposit: number | null;
  maxDeposit: number;
  commissionMod: number;
  commissionRate: number;
  minCommission: number | null;
  maxCommission: number | null;
  fixCommission: number | null;
  needVerify: number;
  delFlag: boolean;
  payJoinType: number;
  payUrl: string;
  payKey: string;
  inRemark: string;
  amountDigits: number;
  roleIds: string | null;
  inRemarkType: number;
  logo: string;
  digitsCompensate: boolean;
  restrictCurrency: number;
};

// 获取审核设置列表
export type CrmPreferenceListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
};

export type CrmPreferenceItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: string | null;
  id: string | null;
  nameText: string | null;
  code: string | null;
  indexReviewCount: string | null;
  val: string | null;
  sort: string | null;
  groupCode: string | null;
};

export type CrmPreferenceListRes = BasicRes<CrmPreferenceItem>;

// 审核-信息审核
export type CrmInfoVerifyListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: string;
  userId?: string;
  infoType?: string;
  status?: string;
  verifyUserName?: string;
  params: {
    beginTime?: string;
    endTime?: string;
  };
};
export type CrmInfoVerifyItem = {
  id: string | null;
  userId: string | null;
  userName: string | null;
  userLastName: string | null;
  userShowId: string | null;
  infoType: string | null;
  status: string | null;
  subTime: string | null;
  verifyUser: string | null;
  vUserName: string | null;
  vUserLastName: string | null;
  verifyTime: string | null;
  remark: string | null;
  verifyStep: string | null;
  verifyUserName: string | null;
  sumsubId: string | null;
  sumsubName: string | null;
  params: string | null;
};

export type CrmInfoVerifyListRes = BasicRes<CrmInfoVerifyItem>;

// 审核-开户审核
export type CrmNewLoginVerifyListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc' | '';
  userId?: string;
  status?: string;
  source?: string;
  verifyUserName?: string;
  params: {
    server?: string;
    serverType?: string;
    serverProperty?: string;
    beginTime?: string;
    endTime?: string;
  };
};
export type CrmNewLoginVerifyItem = {
  accountName: string | null;
  directBroker: string | null;
  accountGroupId: string | null;
  verifyStep: string | null;
  verifyUser: string | null;
  remark: string | null;
  language: string | null;
  verifyTime: string | null;
  source: string | null;
  vUserName: string | null;
  serverProperty: 1;
  serverId: string | null;
  subTime: string | null;
  mtGroup: string | null;
  staName: string | null;
  userLastName: string | null;
  userShowId: string | null;
  id: string | null;
  credit: string | null;
  aliasName: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  lever: string | null;
  userName: string | null;
  userId: string | null;
  initialAmount: string | null;
  serverType: string | null;
  aid: string | null;
  account: string | null;
  status: string | null;
};

export type CrmNewLoginVerifyListRes = BasicRes<CrmNewLoginVerifyItem>;

// 审核-绑定审核
export type BindVerifyListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc' | '';
  userId?: string;
  status?: string;
  login?: string;
  verifyUserName?: string;
  params: {
    server?: string;
    serverProperty?: string;
    beginTime?: string;
    endTime?: string;
  };
};
export type BindVerifyListItem = {
  aliasName: string | null;
  verifyStep: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  verifyUser: string | null;
  remark: string | null;
  verifyTime: string | null;
  login: string | null;
  userName: string | null;
  vUserName: string | null;
  params: string | null;
  userId: string | null;
  serverId: string | null;
  subTime: string | null;
  severProperty: string | null;
  userLastName: string | null;
  userShowId: string | null;
  subRemark: string | null;
  id: string | null;
  status: string | null;
};

export type BindVerifyListRes = BasicRes<BindVerifyListItem>;

// 审核-杠杆审核
export type LeverageVerifyListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc' | '';
  userId?: string;
  status?: string;
  login?: string;
  verifyUserName?: string;
  params: {
    server?: string;
    beginTime?: string;
    endTime?: string;
  };
};
export type LeverageVerifyListItem = {
  aliasName: string | null;
  verifyStep: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  currentLever: string | null;
  verifyUser: string | null;
  remark: string | null;
  verifyTime: string | null;
  login: string | null;
  userName: string | null;
  vUserName: string | null;
  userId: string | null;
  serverId: string | null;
  subTime: string | null;
  targetLever: string | null;
  userLastName: string | null;
  userShowId: string | null;
  id: string | null;
  status: string | null;
};

export type LeverageVerifyListRes = BasicRes<LeverageVerifyListItem>;
