import { BasicParams, BasicRes, BaseEntity } from '../../types';

export type CrmDealGoodsListParams = BasicParams & {
  isAsc?: 'asc' | 'desc';
  params: {
    goodsName?: string;
  };
};

export type GoodsListItem = BaseEntity & {
  id: string;
  goodsName: string;
  exchangePoints: string;
  goodsType: 2;
  virtualGoodsType: string | null;
  amount: string | null;
  currency: string | null;
  status: number;
  viewCount: number;
  exchangeCount: number;
  coverPicture: string;
  goodsPicture: string;
  goodsContent: string;
  countryId: string;
  delFlag: boolean;
  firstClassificationId: string | null;
  secondClassificationId: string | null;
  languageList: string | null;
  paymentPlan: string;
  combinationPaymentList: [
    {
      id: string;
      goodsId: string;
      exchangePoint: number;
      exchangeAmount: number;
    },
  ];
  applicableRoles: string | null;
};

export type CrmDealGoodsListRes = BasicRes<GoodsListItem>;

export type PointsHistoryListParams = BasicParams & {
  isAsc?: 'asc' | 'desc';
  payType?: string;
  params: {
    fuzzyName?: string;
    fuzzyEmail?: string;
    fuzzyGoods?: string;
    verifyStatus?: string;
    exchangeTimeStart?: string;
    exchangeTimeEnd?: string;
    updateTimeStart?: string;
    updateTimeEnd?: string;
  };
};

export type PointsHistoryItem = BaseEntity & {
  id: string;
  orderNo: string;
  userId: string;
  goodsId: string;
  goodsName: string;
  exchangePoints: string;
  exchangeType: number;
  exchangeTime: string;
  receiveName: string;
  receivePhone: string;
  receiveAddress: string;
  verifyStatus: number;
  userName: string;
  showId: string;
  exchangeAccountType: number;
  exchangeAccountId: string | null;
  pointChangeStatus: number;
  payType: number;
  paymentAmount: number;
};

export type PointsHistoryListRes = BasicRes<PointsHistoryItem>;

export type PointsChangeListParams = BasicParams & {
  isAsc?: 'asc' | 'desc';
  businessType?: string;
  params: {
    fuzzyName?: string;
    fuzzyEmail?: string;
    timeStart?: string;
    timeEnd?: string;
  };
};

export type PointsChangeItem = BaseEntity & {
  id: string;
  serialNo: string;
  userId: string;
  inviteSourceId: string | null;
  businessType: number;
  subType: string | null;
  bonusPoints: number;
  pointsBalance: number;
  bonusType: number;
  source: number;
  userName: string;
  showId: string;
};

export type PointsChangeListRes = BasicRes<PointsChangeItem>;

export type PointsBalanceParams = BasicParams & {
  isAsc?: 'asc' | 'desc';
  params: {
    fuzzyName?: string;
    email?: string;
    timeStart?: string;
    timeEnd?: string;
  };
};

export type PointsBalanceItem = {
  lastName: string;
  name: string;
  showId: string;
  email: string;
  pointsBalance: number;
  earnPoints: string;
  usedPoints: string;
  params: string | null;
};

export type PointsBalanceRes = BasicRes<PointsBalanceItem>;

export type GoodsClassificationParams = BasicParams & {
  isAsc?: 'asc' | 'desc';
  searchName?: string;
};

export type GoodsClassificationItem = BaseEntity & {
  id: number;
  parentId: number;
  status: number;
  sort: number;
  classificationName: string;
  parentClassificationName: string | null;
  languageList: string | null;
  secondClassificationList: string | null;
  language: string | null;
  searchName: string | null;
  classificationLanguageId: string | null;
};

export type GoodsClassificationRes = BasicRes<GoodsClassificationItem>;
