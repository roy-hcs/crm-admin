import { BaseEntity, BasicParams, BasicRes } from '@/api/types';
import { LeverageReview, VerifyLogItem } from '../review/types';

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

export type PerformanceFeeRebateVerifyListParams = BasicParams & {
  orderNo?: string;
  performanceFeeOrderNo?: string;
  signalSourceName?: string;
  trader?: string;
  client?: string;
  status?: string;
  userId?: string;
  params: {
    beginTime?: string;
    endTime?: string;
    beginReviewTime?: string;
    endReviewTime?: string;
  };
};

export type PerformanceFeeRebateReportListParams = BasicParams & {
  orderNo?: string;
  performanceFeeOrderNo?: string;
  signalSourceName?: string;
  trader?: string;
  client?: string;
  payStatus?: string;
  userId?: string;
  params: {
    beginTime?: string;
    endTime?: string;
    beginPayTime?: string;
    endPayTime?: string;
  };
};

export type PerformanceFeeRebateVerifyItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string | null;
  followId: string | null;
  performanceFeeOrderNo: string | null;
  orderNo: string | null;
  performanceFee: number | null;
  managementFee: number | null;
  netPerformanceFee: number | null;
  baseRebateRatio: number | null;
  extraRebateRatio: number | null;
  rebateAmount: number | null;
  userId: string | null;
  userName: string | null;
  userShowId: string | null;
  payAccount: string | null;
  payAccountName: string | null;
  payServerId: string | null;
  status: number | null;
  currency: string | null;
  verifyTime: string | null;
  verifyUser: string | null;
  verifyRemark: string | null;
  verifyStep: number | null;
  verifyUserName: string | null;
  payStatus: number | null;
  payTime: string | null;
  signalSourceName: string | null;
  signalSourceOwner: string | null;
  signalSourceEmail: string | null;
  trader: string | null;
  traderServer: string | null;
  traderServerId: string | null;
  client: string | null;
  clientServer: string | null;
  clientServerId: string | null;
  clientName: string | null;
  clientShowId: string | null;
};

export type PerformanceFeeRebateVerifyListRes = BasicRes<PerformanceFeeRebateVerifyItem>;

export type PerformanceFeeRebateReportListRes = BasicRes<PerformanceFeeRebateVerifyItem>;

export type Setting = {
  id: string;
  key: string;
  name: string;
  value: string;
};

export type BaseSettingsRes = {
  mamConfigs: Setting[];
  userVipList: Array<{
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    id: string | null;
    name: string | null;
    sort: number | null;
    description: string | null;
    userCount: number | null;
    status: number | null;
    performanceFeeReduce: number | null;
    performanceFeeRebatBonus: number | null;
    delFlag: string | null;
    language: string | null;
    languageList: string | null;
    crmUserVipAndRuleList: string | null;
    crmUserVipOrRuleList: string | null;
  }>;
};

export type BaseSettingsParams = {
  addSignalPermSwitch: string;
  dealAccountPasswordMethod: string;
  dealAccountPasswordSwitch: string;
  signalAddModelSwitch: string;
  signalAuditSwitch: string;
  signalAuthorShow: string;
  tab: number;
};

export type FeeConfigParams = {
  chargingMethod: string;
  collectionAccount: string;
  collectionWallet: string;
  managementFeeSwitch: string;
  payMethod: string;
  platformManagementFeeRatio: string;
  refundSwitch: string;
  signalSourceFeeSwitch: string;
  tab: number;
};

export type SubscriptionSettingParams = {
  directionFollowingSwitch: string;
  multipleNumberSwitch: string;
  selectiveFollowingSwitch: string;
  subscribeToOrder: string;
  trackingMethod: string;
  tab: number;
};

export type PerformanceFeeParams = {
  allowedSignalSelfRebateSet: string;
  performanceFeeRebateAutoApprove: string;
  performanceFeeRebateSwitch: string;
  rabateUpperType: string;
  rebateLevel: string;
  rebateLevel1: number;
  rebateLevel2: number;
  rebateTarget: string;
  tab: number;
};

export type LoyaltyRewardParams = {
  vipData: string;
  tab: number;
};

export type PayParams = {
  id: string;
  payAccount: string;
  payServerId: string;
};

export type ReceiveAccountsRes = {
  code: number;
  msg: string;
  data: {
    accountList: Array<{
      account: string;
      serverId: string;
      serverName: string;
      currency: string;
      id: string;
    }>;
    walletList: Array<{
      id: string;
    }>;
  };
};

export type PerformanceFeeRebateDetailRes = {
  code: number;
  msg: string;
  data: {
    detail: PerformanceFeeRebateVerifyItem;
    verifyLogs: VerifyLogItem[];
    reviewer: LeverageReview;
  };
};

export type PerformanceFeeRebateVerifyParams = {
  id: string;
  status: string;
  verifyRemark: string;
  verifyStep: string;
};
