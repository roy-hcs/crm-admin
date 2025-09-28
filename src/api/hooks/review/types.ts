export type BasicParams = {
  pageNum?: number;
  pageSize?: number;
  orderByColumn?: string;
  isAsc?: string;
};

export type AgentApplyItem = {
  createBy: string;
  createTime: string;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
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

export type AgentApplyListRes = {
  code: number;
  msg: string;
  rows: AgentApplyItem[];
  total: string;
};

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

export type RebateCommissionItem = {
  // generate type according to above json
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
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

export type RebateCommissionListRes = {
  code: number;
  msg: string;
  rows: RebateCommissionItem[];
  total: string;
};

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

export type RebateCommissionRuleItem = {
  createBy: string | null;
  createTime: string;
  updateBy: string | null;
  updateTime: string;
  remark: string | null;
  params: Record<string, unknown>;
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
export type InternalTransferListRes = {
  code: number;
  msg: string;
  rows: InternalTransferItem[];
  total: string;
};

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
export type WithdrawListRes = {
  code: number;
  msg: string;
  rows: WithdrawItem[];
  total: string;
};
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
export type DepositListRes = {
  code: number;
  msg: string;
  rows: DepositListItem[];
  total: string;
};
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

export type ThirdPaymentListRes = {
  code: number;
  msg: string;
  rows: ThirdPaymentItem[];
};
export type CurrencyItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
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

export type CurrencyListRes = {
  code: number;
  msg: string;
  rows: CurrencyItem[];
};

export type ThirdPaymentItem = {
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string;
  params: Record<string, unknown>;
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
