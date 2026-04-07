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
  taderType?: string;
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
  dealTicket?: string;
  method?: string;
  login?: string;
  orderNum?: string;
  exceptionFlag?: string;
  accounts?: string;
  params: {
    beginTime?: string;
    endTime?: string;
    outMoneyAccount?: string;
    accounts?: string;
    finishBeginTime?: string;
    finishEndTime?: string;
    userId?: string;
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
    finishBeginTime?: string;
    finishEndTime?: string;
    userId?: string;
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
  indexReviewCount: number | null;
  val: number | null;
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
export type ChannelFieldItem = BaseEntity & {
  id: string;
  channelId: string;
  fieldName: string;
  whetherRequired: string | null;
  type: number;
  length: string | null;
  sort: string | null;
  delFlag: string | null;
  showInfo: string | null;
  checkUnique: string | null;
  fieldValue: string;
  channelName: string;
};
export type VerifyLogItem = BaseEntity & {
  id: string;
  businessId: string;
  businessType: number;
  verifyStep: number;
  verifyUser: string;
  verifyStatus: number;
  isDone: boolean;
  userName: string;
  userLastName: string;
  verifyTime: string;
};

export type withdrawalDetailItem = WithdrawItem & {
  marginlevel: string;
  marginlevelTime: string;
  marginlevelTip: number;
  minAdvanceScale: number;
  maxAdvanceScale: number;
};
export type WithdrawalReviewDetailRes = {
  code: number;
  msg: string;
  data: {
    accountId: string;
    detail: withdrawalDetailItem;
    digits: number;
    directBroker: string;
    factWithdrawScale: number;
    isPermission: number;
    rateChange: number;
    reviewer: BaseEntity & {
      preferenceId: string;
      remark: string;
      roleId: string;
      roleName: string;
      sort: number;
      userId: string;
      userName: string;
      userLastName: string;
    };
    sysWithdrawChannelLanguages: ChannelFieldItem[];
    roleName: string;
    subTime: string;
    tLastLogin: string;
    userName: string;
    walletCurrency: string;
    verifyLogs: VerifyLogItem[];
    largeWithdrawAmountSingle?: string;
    orderTipSize: string | null;
    orderTipDays: string | null;
    orderTipSum: string | null;
    shortorderTipSum: string | null;
    shortorderTipDays: string | null;
    shortorderTipSize: string | null;
  };
};

export type WithdrawalVerifyParams = {
  id: string | null;
  status: string;
  remark: string;
  withdraw: string;
  fee: string;
  expectWithdraw: string;
  factWithdraw: string;
  rate: string;
  targetCurrency: string;
  withdrawUser: string;
  withdrawAddress: string;
  withdrawAccount: string;
  withdrawBank: string;
  swift: string;
  withdrawBankAddress: string;
  accountName: string;
  accountBank: string;
  cardNo: string;
  branchBank: string;
  verifyStep: number;
  ifscCode: string;
  bsbCode: string;
  orderComment: string;
};
export type SumWithdrawalAmountParams = {
  userId: string;
  subTime: string;
  days: string;
};
export type SumWithdrawalAmountRes = {
  size: number;
  sum: number;
  status: number;
}[];

export type DepositDetail = {
  factDeposit: number;
  orderComment: string;
  orderId: string | null;
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
  userShowId: string | null;
  subRemark: string | null;
  id: string;
  depositCurrency: string;
  channelId: string;
  walletId: string | null;
  aliasName: string;
  currencyPair: string;
  method: string;
  receiptCurrency: string | null;
  walletCurrency: string | null;
  dealTicket: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  feeType: number;
  userName: string;
  userId: string;
  deposit: string;
  channelName: string;
  digits: number;
  status: number;
};

export type DepositVerifyParams = {
  id: string;
  status: string;
  remark: string;
  deposit: string;
  fee: string;
  expectDeposit: string;
  factDeposit: string;
  rate: string;
  verifyStep: string;
  isNeedDeposit: string;
  orderComment: string;
};

export type DepositReviewDetailRes = {
  code: number;
  msg: string;
  data: {
    accountId: string;
    verifyLogs: VerifyLogItem[];
    directBroker: string;
    walletCurrency: string;
    isPermission: number;
    detail: DepositDetail;
    reviewer: {
      createBy: string | null;
      createTime: string | null;
      updateBy: string | null;
      updateTime: string | null;
      remark: string | null;
      params: object;
      id: string;
      preferenceId: string;
      roleId: string;
      userId: string | null;
      sort: number;
      userName: string | null;
      userLastName: string | null;
      roleName: string;
    };
    roleName: string;
    tLastLogin: string;
    rateChange: number;
    factDepositScale: number;
  };
};

export type LeverageDetail = {
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
  status: number | null;
};

export type BindDetail = {
  aliasName: string | null;
  verifyStep: number | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  serverName: string | null;
  verifyUser: string | null;
  remark: string | null;
  verifyTime: string | null;
  login: string | null;
  userName: string | null;
  vUserName: string | null;
  serverProperty: string | null;
  userId: string | null;
  serverId: string | null;
  subTime: string | null;
  severProperty: number | null;
  userLastName: string | null;
  serverType: string | null;
  userShowId: string | null;
  subRemark: string | null;
  id: string | null;
  status: number | null;
};

export type LeverageReview = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string | null;
  preferenceId: string | null;
  roleId: string | null;
  userId: string | null;
  sort: number | null;
  userName: string | null;
  userLastName: string | null;
  roleName: string | null;
};

export type LeverageReviewDetailRes = {
  code: number;
  msg: string;
  data: {
    detail: LeverageDetail;
    reviewer: LeverageReview;
    verifyLogs: VerifyLogItem[];
  };
};
export type LeverageVerifyParams = {
  id: string;
  status: string;
  remark: string;
  verifyStep: string;
};

export type BindingReviewDetailRes = {
  code: number;
  msg: string;
  data: {
    detail: BindDetail;
    reviewer: LeverageReview;
    verifyLogs: VerifyLogItem[];
  };
};

export type BindingVerifyParams = {
  id: string;
  status: string;
  remark: string;
  verifyStep: string;
};

export type InternalTransferDetail = {
  orderComment: string | null;
  verifyStep: number;
  verifyUser: string | null;
  marginlevelTip: number;
  remark: string | null;
  verifyTime: string | null;
  outAccount: string;
  type: string | null;
  vUserName: string | null;
  subTime: string;
  inMoney: string;
  maxAdvanceScale: number;
  rate: string | null;
  inAccount: string;
  isNeedDeposit: string | null;
  userLastName: string;
  minAdvanceScale: number;
  userShowId: string;
  id: string;
  marginlevel: number;
  aliasName: string;
  currencyPair: string;
  inServer: string;
  dealTicket: string | null;
  vUserLastName: string | null;
  marginlevelTime: string;
  verifyUserName: string | null;
  inUnit: string;
  outMoney: string;
  userName: string;
  userId: string;
  outAliasName: string;
  outUnit: string;
  outStatus: number;
  outServer: string;
  inAliasName: string;
  status: number;
};

export type InternalTransferReviewDetailRes = {
  code: number;
  data: {
    detail: InternalTransferDetail;
    reviewer: LeverageReview;
    verifyLogs: VerifyLogItem[];
  };
};

export type InternalTransferVerifyParams = {
  id: string;
  status: string;
  remark: string;
  rate: string;
  inMoney: string;
  isNeedDeposit: string;
  orderComment?: string;
  outMoney?: string;
};

export type InternalTransferDealTicketListParams = BasicParams & {
  ticket: string;
};

export type InternalTransferDealTicketItem = {
  id: string;
  dealTicket: string;
  amount: string;
  time: string;
  comment: string;
};

export type InternalTransferDealTicketListRes = BasicRes<InternalTransferDealTicketItem>;

export type rebateCommissionDetail = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string | null;
  userId: string | null;
  orderId: string | null;
  mtOrder: string | null;
  serverName: string | null;
  serverId: string | null;
  serverType: number | null;
  taderType: string | null;
  lastName: string | null;
  name: string | null;
  showId: string | null;
  rebateTotalAmt: string | null;
  rebateFixedAmt: string | null;
  rebatePointsAmt: string | null;
  rebateTime: string | null;
  rebateStatus: number | null;
  trderAccount: string | null;
  trderCount: string | null;
  amtUnit: string | null;
  verifyId: string | null;
  traderTime: string | null;
  traderTimeStr: string | null;
  verifyTime: string | null;
  rebateTraderId: string | null;
  rebateCommissionId: string | null;
  rebateType: number | null;
  rebateTraderRuleId: string | null;
  commissionBase: string | null;
  accountGroupList: string | null;
  model: number | null;
  rebateAccountType: string | null;
  rebateAccount: string | null;
  settleStyle: number | null;
  ticket: string | null;
  deal: string | null;
  login: string | null;
  symbol: string | null;
  volume: string | null;
  userName: string | null;
  rebateUser: string | null;
  totalAmtText: string | null;
  currency: string | null;
  inMoneyAmt: string | null;
  percentage: string | null;
  commission: string | null;
  rebateTraderName: string | null;
  verifyName: string | null;
  rebateAccountName: string | null;
  verifyStep: number | null;
  verifyUserName: string | null;
  orderComment: string | null;
  accountName: string | null;
};

export type RebateReviewDetailRes = {
  code: number;
  msg: string;
  data: {
    detail: rebateCommissionDetail;
    reviewer: LeverageReview;
    verifyLogs: VerifyLogItem[];
  };
};

export type RebateVerifyParams = {
  id: string;
  rebateStatus: string;
  remark: string;
  verifyStep: string;
};

export type FeeRebateDetail = rebateCommissionDetail;

export type FeeRebateReviewDetailRes = {
  code: number;
  msg: string;
  data: {
    detail: FeeRebateDetail;
    reviewer: LeverageReview;
    verifyLogs: VerifyLogItem[];
  };
};
export type DepositRebateDetail = rebateCommissionDetail;

export type DepositRebateReviewDetailRes = {
  code: number;
  msg: string;
  data: {
    detail: DepositRebateDetail;
    reviewer: LeverageReview;
    verifyLogs: VerifyLogItem[];
  };
};

export type AccountOpenVerifyParams = {
  id: string;
  status: string;
  remark: string;
  accountName: string;
  lever: string;
  mtGroup: string;
  credit: string;
  initialAmount: string;
  account: string;
  accountGroupId: string;
  sendPasswordOnly: string;
  directBroker: string;
  verifyStep: string;
};

export type OpenReviewDetail = {
  directBrokerName: string | null;
  accountName: string | null;
  directBroker: string | null;
  accountGroupId: string | null;
  accountGroupName: string | null;
  verifyStep: number | null;
  serverName: string | null;
  verifyUser: string | null;
  remark: string | null;
  language: 'zh-CN';
  verifyTime: string | null;
  source: string | null;
  vUserName: string | null;
  serverProperty: number | null;
  serverId: string | null;
  subTime: string | null;
  mtGroup: string | null;
  staName: string | null;
  userLastName: string | null;
  userShowId: string | null;
  id: string | null;
  credit: number | null;
  sendPasswordOnly: string | null;
  vUserLastName: string | null;
  verifyUserName: string | null;
  lever: string | null;
  userName: string | null;
  userId: string | null;
  allDealAccountGroup: Array<{
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: Record<string, unknown>;
    id: string | null;
    name: string | null;
    sort: number | null;
    num: number | null;
    flag: boolean | null;
    delFlag: boolean | null;
    relatedRebateRuleCount: number | null;
  }>;
  initialAmount: string | null;
  serverType: string | null;
  aid: string | null;
  mtServerGroup: {
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: Record<string, unknown>;
    id: string | null;
    serverId: string | null;
    groupName: string | null;
    accountStart: number | null;
    accountEnd: number | null;
    maxAccount: number | null;
    sort: number | null;
  };
  account: string | null;
  status: string | null;
};

export type CrmUser = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string | null;
  lastName: string | null;
  name: string | null;
  showId: string | null;
  sex: string | null;
  mzone: string | null;
  mobile: string | null;
  email: string | null;
  accountType: number | null;
  accountTypeStr: string | null;
  userRole: string | null;
  inviter: string | null;
  inviterName: string | null;
  inviterEmail: string | null;
  headImg: string | null;
  status: number | null;
  role: string | null;
  rebateLevelName: string | null;
  certiricateType: string | null;
  certiricateNo: string | null;
  source: string | null;
  sourceText: string | null;
  country: string | null;
  countryId: string | null;
  countryName: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  postCode: string | null;
  birthday: string | null;
  verifyStatus: number | null;
  nameOne: string | null;
  nameTwo: string | null;
  inviterShowId: string | null;
  roleId: string | null;
  rebateLevelId: string | null;
  rebateAccountId: string | null;
  crmRebateLevel: string | null;
  userInfo: string | null;
  applySource: string | null;
  account: string | null;
  permissionJson: string | null;
  inviterChain: string | null;
  preferenceLanguage: string | null;
  colorPreference: string | null;
  lastLoginTime: string | null;
  latestFollowupTime: string | null;
  spreadLinkCodeId: string | null;
  loginTwoFactorAuth: string | null;
  antiPhishingCode: string | null;
  tags: string | null;
  points: number | null;
  shortCode: string | null;
  adminRemark: string | null;
  applicantId: string | null;
  registerSource: string | null;
  registerSourceText: string | null;
  sourceUpdateTime: string | null;
  sourceUpdateCount: number | null;
  vipId: string | null;
  vipName: string | null;
  vipLevel: string | null;
  childId: string | null;
  language: string | null;
  pammUserId: string | null;
  userName: string | null;
  mtone: string | null;
  mttwo: string | null;
};

export type LastLogininfor = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  operId: string | null;
  title: string | null;
  businessType: string | null;
  businessTypes: string | null;
  method: string | null;
  operatorType: string | null;
  operName: string | null;
  operUrl: string | null;
  operIp: string | null;
  operLocation: string | null;
  operParam: string | null;
  status: string | null;
  operTime: string | null;
  browser: string | null;
  riskScore: number | null;
  os: string | null;
  ipRiskyFlag: string | null;
  devRiskyFlag: string | null;
};

export type OpenReviewDetailRes = {
  code: number;
  msg: string;
  data: {
    detail: OpenReviewDetail;
    reviewer: LeverageReview | null;
    verifyLogs: VerifyLogItem[];
    allGroup: string[];
    allDealAccountGroup: Array<{
      id: string;
      name: string;
    }>;
    allLever: string[];
    crmUser: CrmUser;
    lastLogininfor: LastLogininfor;
    userLanguage: string | null;
  };
};

export type CrmUserDealAccountListParams = BasicParams & {
  login?: string;
  userId?: string;
};

export type CrmUserDealAccountItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: {
    typeName: string | null;
    serverName: string | null;
  };
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

export type CrmUserDealAccountListRes = BasicRes<CrmUserDealAccountItem>;

export type CrmUserManageInfoRes = {
  code: number;
  data: {
    columns: Array<{
      columnName: string;
      columnValue: string;
    }>;
    verifyStatus: number;
    crmUser: CrmUser;
  };
};

export type CrmUserFinanceInfoRes = CrmUserManageInfoRes; // 需要的数据结构和CrmUserManageInfoRes一样，所以直接复用
export type CrmUserIdentityBasicInfoRes = {
  code: number;
  data: {
    columns: Array<{
      columnName: string;
      columnValue: string;
      columnType: number; // 5 是图片类型
    }>;
    verifyStatus: number;
    crmUser: CrmUser;
  };
};

export type CrmUserProtocolInfoRes = {
  code: number;
  data: {
    allProtocol: Array<{
      protocolName: string;
      status: number;
      createTime: string;
    }>;
  };
};
