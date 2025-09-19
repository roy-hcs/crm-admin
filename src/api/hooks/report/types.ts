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

// generated type according to the above json
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
export type RefundFailLogListResponse = {
  code: number;
  msg: string;
  total: string;
  rows: RefundFailLogItem[];
};
