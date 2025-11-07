import { BasicRes, BaseEntity } from '../../types';

// Base types for reusability
export type BaseReportItem = {
  amount: number;
  currency: string | null;
  statisticDate: string | null;
  usdAmount: number | null;
  rate: number | null;
  symbol: string | null;
  count: number | null;
  type: string | null;
  serverId: number | null;
  intDate: number | null;
  profit: number | null;
  loss: number | null;
  netProfit: number | null;
  volume: number | null;
  quantity: number | null;
};

// 提现报表
export type WithDrawReportItem = BaseReportItem;

// 交易品种报表
export type SymbolReportParams = {
  type: string;
  serverId: string;
  pageNum?: number;
  orderByColumn?: boolean;
  isAsc: string;
};

export type SymbolReportRowItem = BaseReportItem;
export type SymbolReportResponse = BasicRes<SymbolReportRowItem>;

// Note: ServerItem and ServerListResponse are in @/api/hooks/system (shared across multiple modules)

// 注册统计报表
export type RegCountReportItem = Record<string, [number, number, number]>;

// 汇总报表
export type SumReport = {
  crmUser: string;
  dealAccount: string;
  deposit: number;
  withdraw: number;
};

// MT服务更新状态
export type MtServiceUpdateRes = {
  allAccount: number;
  todayAccount: number;
  count: number[];
};

// 客户交易报表
export interface TclosureReportItem {
  amount: number | null;
  currency: string | null;
  statisticDate: string;
  usdAmount: number | null;
  rate: number | null;
  symbol: string | null;
  count: number | null;
  type: string | null;
  serverId: string | null;
  intDate: number | null;
  profit: number;
  loss: number;
  netProfit: number;
  volume: number;
  quantity: number;
}

export interface TclosureReportMonthSummary {
  volume: number;
  quantity: number;
}

export interface TclosureReportResponse {
  sumThisMonth: TclosureReportMonthSummary;
  data: TclosureReportItem[];
}

// 服务器异常通知
export type ServerExceptionNoticeItem = {
  id: number;
  code: number;
  server: string;
  vhost: string;
  time: string;
  createTime: string;
  reason: string;
  manager: string;
};

export type ServerExceptionNoticeRes = ServerExceptionNoticeItem[];

// 待办事项
export type PreferencesItem = BaseEntity & {
  id: string;
  nameText: string;
  code: string;
  indexReviewCount: string;
  val: string;
  sort: string;
  groupCode: string;
};

export type PreferencesRes = PreferencesItem[];
