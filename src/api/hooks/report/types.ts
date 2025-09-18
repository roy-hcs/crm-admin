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
