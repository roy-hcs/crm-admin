import { BaseEntity, BasicParams, BasicRes } from '@/api/types';

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

export type MamProtocolItem = BaseEntity & {
  id: string;
  applicableScenarios: number;
  status: number;
  sort: number;
  delFlag: number;
  name: string;
  language: string | null;
  languages: string | null;
};
export type MamProtocolListRes = BasicRes<MamProtocolItem>;
export type MamProtocolListParams = BasicParams & {
  name: string;
  applicableScenarios: string;
};

export type MamFollowListParams = BasicParams & {
  signalSourceName?: string;
  userName?: string;
  traderServerId?: string;
  trader?: string;
  client?: string;
  arrivalStatus?: string;
  params: {
    signalSourceOwner?: string;
    beginTime?: string;
    endTime?: string;
    beginArrivalTime?: string;
    endArrivalTime?: string;
  };
};
export type MamFollowItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string;
  userId: string;
  signalSourceId: string;
  trader: string;
  traderServer: string;
  traderServerId: string;
  client: string;
  clientServer: string;
  clientServerId: string;
  symbol: string | null;
  strategy: number;
  size: number | null;
  fixedVolumn: number | null;
  netWorthRatio: number | null;
  direction: number | null;
  status: number | null;
  stopTime: string | null;
  subscribeFee: number | null;
  managementFeeRatio: number | null;
  actualSubscribeFee: number | null;
  followDays: number | null;
  followEndTime: string | null;
  followStartTime: string | null;
  followPreEndTime: string | null;
  tp: number | null;
  sl: number | null;
  selectivityFollow: string | null;
  maxVolumn: number | null;
  minVolumn: number | null;
  symbolPreference: string | null;
  includeSymbol: string | null;
  excludeSymbol: string | null;
  followType: string | null;
  historyProfit: number | null;
  historyNum: number | null;
  renewalStatus: number | null;
  signalSourceName: string | null;
  icon: string | null;
  traderName: string | null;
  traderEmail: string | null;
  payType: string | null;
  payServerId: string | null;
  payAccount: string | null;
  payAccountName: string | null;
  orderNo: string | null;
  userName: string | null;
  email: string | null;
  estimatedManagementFee: number | null;
  managementFee: number | null;
  arrivalStatus: number | null;
  reason: string | null;
  reviewStatus: number | null;
  reviewTime: string | null;
  reviewRemark: string | null;
  renewalType: number | null;
  pauseStartTime: string | null;
  pauseEndTime: string | null;
  totalPausedDays: number | null;
  performanceFeeEnable: boolean | null;
  performanceFeeCycle: number | null;
  performanceFeeRatio: number | null;
  hwm: number | null;
  lastPerformanceFeeTime: string | null;
  mtReviewTime: string | null;
  mtStopTime: string | null;
};

type TotalItem = {
  totalActualSubscribeFee: number;
  totalSubscribeFee: number;
  totalEstimatedManagementFee: number;
  totalManagementFee: number;
};

export type MamFollowListRes = BasicRes<MamFollowItem> & {
  totalList: TotalItem[];
};
