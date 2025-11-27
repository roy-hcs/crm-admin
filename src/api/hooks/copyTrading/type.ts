import { BasicParams, BasicRes } from '@/api/types';

export type OrderByColumn =
  | 'totalProfit'
  | 'totalProfitRate'
  | 'subscribeFee'
  | 'subscribeNum'
  | 'status'
  | 'createTime'
  | 'updateTime'
  | '';

export type signalReviewOrderByColumn =
  | 'subscribeFee'
  | 'upperLimit'
  | 'verifyStatus'
  | 'createTime'
  | 'verifyTime'
  | '';
export type MamSignalSourceListParams = BasicParams & {
  name?: string;
  userName?: string;
  serverId?: string;
  account?: string;
  status?: string;

  params: {
    beginTime?: string;
    endTime?: string;
  };
};
export type MamSignalSourceItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string;
  name: string;
  serverId: string;
  server: string;
  account: string;
  userId: string;
  icon: string;
  upperLimit: number;
  publicShow: number;
  charge: number;
  subscribeFee: number;
  receiveType: number;
  receiveAccount: string;
  receiveServerId: string | null;
  description: string | null;
  status: number;
  subTime: string | null;
  verifyTime: string | null;
  verifyUser: string | null;
  verifyStatus: number;
  delFlag: number;
  closeType: string | null;
  closeReason: string | null;
  closeTime: string | null;
  userName: string;
  userLastName: string;
  showId: string;
  email: string;
  subscribeNum: number;
  totalProfit: number;
  totalProfitRate: number;
  currency: string;
  serverProperty: string | null;
  subscriptionReview: number;
  minBalanceForSubscription: null;
  performanceFeeEnable: number;
  performanceFeeCycle: number;
  performanceFeeRatio: number;
};

export type MamSignalSourceListRes = BasicRes<MamSignalSourceItem>;

export type MamSignalSourceVerifyListParams = BasicParams & {
  name?: string;
  userName?: string;
  serverId?: string;
  account?: string;
  verifyStatus?: string;

  params: {
    beginTime?: string;
    endTime?: string;
    beginReviewTime?: string;
    endReviewTime?: string;
  };
};

export type MamSignalSourceVerifyListRes = BasicRes<MamSignalSourceItem>;

export type MamSymbolListParams = BasicParams & {
  symbolCategory?: string;
  symbol?: string;
};

export type MamSymbolItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string | null;
  symbolCategory: string | null;
  symbol: string | null;
  cname: string | null;
  enname: string | null;
  name: string | null;
  defaultNames: string | null;
  sort: number;
};

export type MamSymbolListRes = BasicRes<MamSymbolItem>;

export type PerformanceFeeListParams = BasicParams & {
  signalSourceName?: string;
  traderServerId?: string;
  trader?: string;
  client?: string;
  payStatus?: string;

  params: {
    signalSourceOwner?: string;
    follower?: string;
    beginTime?: string;
    endTime?: string;
    beginPayTime?: string;
    endPayTime?: string;
  };
};

export type PerformanceFeeItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string | null;
  followId: string | null;
  orderNo: string | null;
  performanceFee: number | null;
  managementFee: number | null;
  payType: number | null;
  payStatus: number | null;
  payTime: string | null;
  payAccount: string | null;
  currency: string | null;
  payServerId: string | null;
  payAccountName: string | null;
  signalSourceName: string | null;
  trader: string | null;
  traderServer: string | null;
  traderServerId: string | null;
  client: string | null;
  clientServer: string | null;
  clientServerId: string | null;
  clientName: string | null;
  clientEmail: string | null;
};

export type PerformanceFeeListRes = BasicRes<PerformanceFeeItem>;
