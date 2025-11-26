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
