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
};
export type OverviewItem = {
  rebateLevelId: string | null;
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
