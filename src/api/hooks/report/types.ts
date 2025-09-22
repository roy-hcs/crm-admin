// ib客户追踪
export type ClientTrackingParams = {
  pageSize: number;
  pageNum: number;
  isAsc?: string;
  Level?: string;
  userName: string;
  email: string;
  statisticMonth: string;
  level: string;
  drirectFlag?: string;
  orderByColumn?: string;
};
export type AgencyClientTrackingItem = {
  allFirstDeposit: string | null;
  userName: string | null;
  email: string | null;
  levelName: string | null;
  level: string | null;
  statisticMonthStr: string | null;
  depositFirstStr: string | null;
  newClient: string | null;
  kycProved: string | null;
  taCreateLive: string | null;
  newFirstDeposit: string | null;
  depositClient: string | null;
  tradeClient: string | null;
  depositTotalStr: string | null;
  withdrawTotalStr: string | null;
  netTotalStr: string | null;
};
export type AgencyClientTrackingResponse = {
  code: number;
  msg: string;
  total: string;
  rows: AgencyClientTrackingItem[];
};
// ib数据总览
export type OverviewParams = {
  pageSize: number;
  pageNum: number;
  isAsc?: string;
  Level?: string;
  userName: string;
  email: string;
  beginTime: string;
  endTime: string;
  level: string;
  drirectFlag?: string;
  orderByColumn?: string;
  serverId?: string;
  serverType?: string;
};
export type OverviewItem = {
  rebateLevel: string | null;
  username: string | null;
  email: string | null;
  userNumber: string | null;
  depositUserNumber: string | null;
  accountNumber: string | null;
  balance: string | null;
  depositAmount: string | null;
  withdrawAmount: string | null;
  netDeposit: string | null;
  volume: string | null;
  profitAndLoss: string | null;
  commission: string | null;
  swaps: string | null;
  rebateOnTrade: string | null;
  rebateOnCommission: string | null;
  rebateOnDeposit: string | null;
};
export type OverviewResponse = {
  code: number;
  msg: string;
  total: string;
  rows: OverviewItem[];
};
// 交易佣金报表
export type TradingParams = {
  pageSize: number;
  pageNum: number;
  isAsc?: string;
  rebateType?: string;
  serverId?: string;
  serverGroupList?: string;
  serverGroup?: string;
  mtOrder?: string;
  trderAccount?: string;
  taderType?: string;
  conditionName?: string;
  rebateTraderIdList?: string;
  accounts?: string;
  orderByColumn?: string;
  params: {
    startTraderTime?: string;
    endTraderTime?: string;
    beginVerifyTime?: string;
    endVerifyTime?: string;
    accounts?: string;
  };
};
export type TradingItem = {
  serverName: string | null;
  mtOrder: string | null;
  login: string | null;
  symbol: string | null;
  volume: string | null;
  traderTime: string | null;
  userName: string | null;
  showId: string | null;
  rebateTotalAmt: string | null;
  rebateAccountName: string | null;
  rebateTime: string | null;
  rebateTraderName: string | null;
  currency: string | null;
  rebateFixedAmt: string | null;
  rebatePointsAmt: string | null;
};
export type TradingResponse = {
  code: number;
  msg: string;
  total: string;
  rows: TradingItem[];
};

// 日结返佣报表
export type DailyRebateParams = {
  pageSize: number;
  pageNum: number;
  isAsc?: string;
  orderByColumn?: string;
  settleStyle?: string;
  rebateType?: string;
  rebateStatus?: string;
  id?: string;
  params: {
    beginTime?: string;
    endTime?: string;
    account?: string;
  };
};
export type DailyRebateItem = {
  settleTime: string | null;
  lastName: string | null;
  name: string | null;
  userName: string | null;
  showId: string | null;
  rebateType: string | null;
  relatedRecord: string | null;
  volume: string | null;
  rebateTotalAmt: string | null;
  rebateStatus: string | null;
  updateTime: string | null;
  relatedCount: string | null;
  id: string | null;
  account: string | null;
};
export type DailyRebateResponse = {
  code: number;
  msg: string;
  total: string;
  rows: DailyRebateItem[];
};

export type TradingHistoryParams = {
  serverType: number | string;
  serverId?: string;
  serverGroupList?: string;
  serverGroup?: string;
  type?: number | string;
  symbol?: string;
  breedGroup?: string;
  ticket?: string;
  login?: string;
  accountGroupList?: string;
  accounts?: string;
  positionID?: string;
  entry?: string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
  params: {
    selectOther?: string;
    historyFuzzyName?: string;
    accounts?: string;
    historyDealBJStartTime?: string;
    historyDealBJEndTime?: string;
    historyCloseStartTime?: string;
    historyCloseEndTime?: string;
  };
};

export type TradingHistoryItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  login: string | null;
  serverId: string | null;
  server: string | null;
  deal: string | null;
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
  entry: string | null;
  serverType: number | null;
  accountGroupList: string[] | null;
  positionID: string | null;
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
  dealTime: string | null;
  traderCount: number | null;
  primId: string | null;
  openDate: string | null;
};

export type TradingHistoryListResponse = {
  code: number;
  msg: string;
  total: string;
  priceSum: number;
  rebateTotalAmtStr: string;
  rows: TradingHistoryItem[];
  serverType: string;
};
// 资金报表- 钱包流水
export type crmUserDealDetailParams = {
  pageSize: number;
  pageNum: number;
  isAsc?: string;
  orderByColumn?: string;
  operationType?: string;
  serialNum?: string;
  accounts?: string;
  mtOrder?: string;
  params: {
    account?: string;
    operationType?: string;
    inMethod?: string;
    selectOther?: string;
    currencyId?: string;
    operationStart?: string;
    operationEnd?: string;
    accounts?: string;
  };
};
export type WalletTransactionItem = {
  id: string | null;
  lastName: string | null;
  name: string | null;
  showId: string | null;
  operationType: number | null;
  operationTypeTxt: string | null;
  operationMethodTxt: string | null;
  currency: string | null;
  preAmountTxt: string | null;
  amountTxt: string | null;
  afterAmountTxt: string | null;
  operationTime: string | null;
  serialNum: string | null;
  rebateId: string | null;
  dealServerId: string | null;
  walletId: string | null;
  dealAccount: string | null;
  preAmount: string | null;
  amount: string | null;
  operationMethod: number | null;
  mtOrder: string | null;
  remark: string | null;
  postAmount: string | null;
};
export type WalletTransactionResponse = {
  code: number;
  msg: string;
  total: string;
  rows: WalletTransactionItem[];
};
// 支付订单
export type PaymentOrderListParams = {
  params: {
    userName?: string;
    account?: string;
    accounts?: string;
    operationStart?: string;
    operationEnd?: string;
  };
  channelId?: string;
  orderStatus?: string;
  orderId?: string;
  accounts?: string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
};
export type PaymentOrderItem = {
  id: string | null;
  orderId: string | null;
  account: string | null;
  depositAmount: string | null;
  payAmount: string | null;
  receiptAmount: string | null;
  orderStatus: string | null;
  createTime: string | null;
  channelName: string | null;
  userName: string | null;
};
export type PaymentOrderListResponse = {
  code: number;
  msg: string;
  total: string;
  rows: PaymentOrderItem[];
};

// 交易账号资金流水
export type CrmUserDealListParams = {
  params: {
    ticket?: string;
    historyFuzzyName?: string;
    login?: string;
    comment?: string;
    accounts?: string;
    operationStart?: string;
    operationEnd?: string;
    fuzzyCrmAccount?: string;
  };
  serverId?: string;
  opeTypeList?: string;
  opeType?: string;
  serverGroupList?: string;
  serverGroup?: string;
  accountGroupList?: string;
  accounts?: string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
};

export type PositionOrderParams = {
  server?: string;
  serverGroupList?: string;
  type?: number | string;
  accountGroupList?: string;
  accounts?: string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
  params: {
    random?: string;
    positionFuzzyName?: string;
    positionFuzzyLogin?: string;
    positionFuzzySymbol?: string;
    positionFuzzyTicket?: string;
    accounts?: string;
    positionDealBJStartTime?: string;
    positionDealBJEndTime?: string;
  };
};
export type CrmUserDealItem = {
  server: string | null;
  symbol: string | null;
  open_time: string | null;
  login: string | null;
  type: string | null;
  swaps: string | null;
  uuid: string | null;
  close_price: number | null;
  balance: number | null;
  sl: number | null;
  commission: number | null;
  lot_size: number | null;
  currency: string | null;
  id: string | null;
  open_price: number | null;
  crmLastName: string | null;
  profit: number | null;
  crmShowId: string | null;
  ticket: number | null;
  time_stamp: string | null;
  close_time: string | null;
  server_id: string | null;
  volume: number | null;
  name: string | null;
  digits: number | null;
  comment: string | null;
  time: string | null;
  order_num: string | null;
  tp: number | null;
  server_type: string | null;
  crmName: string | null;
};
export type CrmUserDealListResponse = {
  code: number;
  msg: string;
  total: string;
  rows: CrmUserDealItem[];
};

// 资金回退失败日志
export type RefundFailLogListParams = {
  params: {
    beginTime?: string;
    endTime?: string;
  };
  userId?: string;
  status?: string;
  refundAccount?: string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
};

export type PositionOrderItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: {
    currency: string | null;
    accountName: string | null;
    accountGroupId: string | null;
  };
  uuid: string | null;
  login: string | null;
  server: string | null;
  deal: string | null;
  ticket: number | null;
  symbol: string | null;
  digits: number | null;
  type: number | null;
  entry: string | null;
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

export type PositionOrderResponse = {
  code: number;
  msg: string | null;
  total: string;
  rows: PositionOrderItem[];
  totalList: {
    currency: string;
    totalCommission: number;
    totalProfit: number;
    totalSwaps: number;
    totalVolume: number;
  }[];
};

export type LimitOrderListResponse = PositionOrderResponse;
export type LimitOrderListItem = PositionOrderItem;
export type LimitOrderListParams = {
  server?: string;
  serverGroupList?: string;
  accounts?: string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
  params: {
    positionFuzzyType?: number | string;
    positionFuzzyName?: string;
    positionFuzzyLogin?: string;
    positionFuzzySymbol?: string;
    positionFuzzyTicket?: string;
    accounts?: string;
    positionDealBJStartTime?: string;
    positionDealBJEndTime?: string;
  };
};

export type AccountStatisticListParams = {
  server?: string;
  accountGroupList?: string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
  params: {
    serverGroupList?: number | string;
    fuzzyAccount?: string;
    fuzzyName?: string;
    statisticStartTime?: string;
    statisticEndTime?: string;
  };
};
export type RefundFailLogItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: string | null;
  id: string | null;
  userId: string | null;
  operType: string | null;
  operTime: string | null;
  refundAmount: string | null;
  refundCurrency: string | null;
  serverName: string | null;
  login: string | null;
  walletId: string | null;
  status: string | null;
  lastName: string | null;
  showId: string | null;
  name: string | null;
  refundAccount: string | null;
};

export type AccountStatisticListItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  name: string | null;
  login: string | null;
  countOrder: number | null;
  countHistory: number | null;
  countPosition: number | null;
  countVolume: number | null;
  historyVolume: number | null;
  positionVolume: number | null;
  countCommission: number | null;
  countSwaps: number | null;
  countProfit: number | null;
  balance: number | null;
  currency: string | null;
  serviceType: number | null;
};
export type RefundFailLogListResponse = {
  code: number;
  msg: string;
  total: string;
  rows: RefundFailLogItem[];
};
// 交易账号资金统计
export type TradingAccountFundsStatsParams = {
  params: {
    serverGroupList?: string;
    fuzzyAccount?: string;
    fuzzyName?: string;
    statisticStartTime?: string;
    statisticEndTime?: string;
    accounts?: string;
  };
  serverGroup?: string;
  accounts?: string;
  accountGroupList?: string;
  server?: string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
};

export type AccountStatisticListResponse = {
  code: number;
  msg: string | null;
  rows: AccountStatisticListItem[];
  total: string;
};

export type AccountStatisticSumParams = {
  server?: string;
  accountGroupList?: string;
  params: {
    serverGroupList?: number | string;
    fuzzyAccount?: string;
    fuzzyName?: string;
    statisticStartTime?: string;
    statisticEndTime?: string;
    accounts?: string;
  };
  serverGroup?: string;
  accounts?: string;
};

export type AccountStatisticSumItem = {
  balanceTotal: number | null;
  countCommissionTotal: number | null;
  countOrderTotal: number | null;
  countProfitTotal: number | null;
  countSwapsTotal: number | null;
  currency: string | null;
  historyVolumeTotal: number | null;
  positionVolumeTotal: number | null;
};

export type AccountStatisticSumResponse = {
  code: number;
  msg: string | null;
  data: AccountStatisticSumItem[];
};

export type SystemFundOperationRecordListRes = {
  code: number;
  msg: string | null;
  rows: SystemFundOperationRecordItem[];
  total: string;
};

export type SystemFundOperationRecordItem = {
  id: string | null;
  orderNumber: string | null;
  crmUserId: string | null;
  crmName: string | null;
  crmShowId: string | null;
  accountType: number | null;
  accountId: string | null;
  currency: string | null;
  serverId: string | null;
  server: string | null;
  type: number | null;
  amount: number | null;
  comment: string | null;
  operName: string | null;
  operIp: string | null;
  operAddress: string | null;
  operTime: string | null;
  serverOrder: string | null;
  annotation: string | null;
  params: Record<string, string> | null;
};

export type SystemFundOperationRecordListParams = {
  type?: number | string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
  params: {
    name?: string;
    login?: string;
    ticket?: string;
    operationStart?: string;
    operationEnd?: string;
    operName?: string;
  };
};
export type TradingAccountFundsStatsItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: string | null;
  userId: string | null;
  username: string | null;
  directBroker: string | null;
  directBrokerName: string | null;
  name: string | null;
  login: string | null;
  serviceType: string | null;
  userLevel: string | null;
  positiveBalance: string | null;
  positiveBalanceCount: string | null;
  inputAmount: string | null;
  inputAmountCount: string | null;
  sysInputAmount: string | null;
  sysInputAmountCount: string | null;
  commissionInputAmount: string | null;
  commissionInputAmountCount: string | null;
  insideTransferInputAmount: string | null;
  insideTransferInputAmountCount: string | null;
  negativeBalance: string | null;
  negativeBalanceCount: string | null;
  outAmount: string | null;
  outAmountCount: string | null;
  sysOutAmount: string | null;
  sysOutAmountCount: string | null;
  insideTransferOutAmount: string | null;
  insideTransferOutAmountCount: string | null;
  creditInputAmount: string | null;
  creditInputAmountCount: string | null;
  creditOutAmount: string | null;
  creditOutAmountCount: string | null;
  profitLoss: string | null;
  balance: string | null;
  currency: string | null;
  netWorth: string | null;
  credit: string | null;
  usedAdvance: string | null;
  usableAdvance: string | null;
  advanceScale: string | null;
  riskScale: string | null;
  commission: string | null;
  swaps: string | null;
  volumeLoss: string | null;
  volumePosition: string | null;
  profitPosition: string | null;
  netProfit: string | null;
  netProfitRatio: string | null;
  swapsPosition: string | null;
  rebateTraderAmount: string | null;
  rebateCommissionAmount: string | null;
  rebateDepositAmount: string | null;
  pammDepositCount: string | null;
  pammDepositAmount: string | null;
  pammWithdrawalCount: string | null;
  pammWithdrawalAmount: string | null;
};

export type TradingAccountFundsStatsResponse = {
  code: number;
  msg: string;
  total: string;
  rows: TradingAccountFundsStatsItem[];
};
// 交易账号数据统计
export type DataStatisticsParams = {
  params: {
    serverGroupList?: string;
    fuzzyAccount?: string;
    fuzzyName?: string;
    statisticStartTime?: string;
    statisticEndTime?: string;
    accounts?: string;
  };
  serverGroup?: string;
  accounts?: string;
  accountGroupList?: string;
  server?: string;
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
};

export type SystemFundOperationRecordSumRes = {
  code: number;
  msg: string | null;
  data: {
    amount: number | null;
    currency: string | null;
    type: string | null;
  }[];
};

export type SystemFundOperationRecordSumParams = {
  type?: number | string;
  params: {
    name?: string;
    login?: string;
    ticket?: string;
    operationStart?: string;
    operationEnd?: string;
    operName?: string;
  };
};

export type WalletBalanceRes = {
  code: number;
  msg: string | null;
  rows: WalletBalanceItem[];
  total: string;
};

export type WalletBalanceItem = {
  email: string | null;
  lastName: string | null;
  name: string | null;
  showId: string | null;
  [key: string]: number | string | null;
};

export type WalletBalanceParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
  accounts: string;
  params: {
    fuzzyName?: string;
    email?: string;
    currencyList?: string;
    timeStart?: string;
    timeEnd?: string;
    accounts?: string;
  };
};

export type DataStatisticsItem = {
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
  params?: string;
  userId?: string;
  username?: string;
  directBroker?: string;
  directBrokerName?: string;
  name?: string;
  login?: string;
  serviceType?: string;
  userLevel?: string;
  positiveBalance?: string;
  positiveBalanceCount?: string;
  inputAmount?: string;
  inputAmountCount?: string;
  sysInputAmount?: string;
  sysInputAmountCount?: string;
  commissionInputAmount?: string;
  commissionInputAmountCount?: string;
  insideTransferInputAmount?: string;
  insideTransferInputAmountCount?: string;
  negativeBalance?: string;
  negativeBalanceCount?: string;
  outAmount?: string;
  outAmountCount?: string;
  sysOutAmount?: string;
  sysOutAmountCount?: string;
  insideTransferOutAmount?: string;
  insideTransferOutAmountCount?: string;
  creditInputAmount?: string;
  creditInputAmountCount?: string;
  creditOutAmount?: string;
  creditOutAmountCount?: string;
  profitLoss?: string;
  balance?: string;
  currency?: string;
  netWorth?: string;
  credit?: string;
  usedAdvance?: string;
  usableAdvance?: string;
  advanceScale?: string;
  riskScale?: string;
  commission?: string;
  swaps?: string;
  volumeLoss?: string;
  volumePosition?: string;
  profitPosition?: string;
  netProfit?: string;
  netProfitRatio?: string;
  swapsPosition?: string;
  rebateTraderAmount?: string;
  rebateCommissionAmount?: string;
  rebateDepositAmount?: string;
  pammDepositCount?: string;
  pammDepositAmount?: string;
  pammWithdrawalCount?: string;
  pammWithdrawalAmount?: string;
};

export type DataStatisticsResponse = {
  code: number;
  msg: string;
  total: string;
  rows: DataStatisticsItem[];
  accounts: string;
  params: {
    fuzzyName?: string;
    email?: string;
    currencyList?: string;
    timeStart?: string;
    timeEnd?: string;
    accounts?: string;
  };
};

export type WalletBalanceSumRes = {
  code: number;
  msg: string | null;
  data: {
    currency: string | null;
    totalAmount: number | null;
  }[];
};

export type WalletBalanceSumParams = {
  accounts: string;
  params: {
    fuzzyName?: string;
    email?: string;
    currencyList?: string;
    timeStart?: string;
    timeEnd?: string;
    accounts?: string;
  };
};

export type CurrencyListItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string | null;
  currencyNameChn: string | null;
  currencyNameEng: string | null;
  currencyAbbr: string | null;
  currencyRemark: string | null;
  status: number | null;
  isDefault: number | null;
  currencyType: number | null;
  decimalPrecision: number | null;
  sort: string | null;
  network: string | null;
};

export type CurrencyListRes = {
  code: number;
  msg: string | null;
  rows: CurrencyListItem[];
  total: string;
};
