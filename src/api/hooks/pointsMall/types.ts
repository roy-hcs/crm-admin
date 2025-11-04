export type CrmDealGoodsListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';

  params: {
    goodsName?: string;
  };
};

export type GoodsListItem = {
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string;
  params: object;
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

export type CrmDealGoodsListRes = {
  code: number;
  msg: string;
  total: string;
  rows: GoodsListItem[];
};

export type PointsHistoryListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
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

export type PointsHistoryItem = {
  createBy: string;
  createTime: string;
  updateBy: string | null;
  updateTime: string;
  remark: string;
  params: object;
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

export type PointsHistoryListRes = {
  code: number;
  msg: string;
  total: string;
  rows: PointsHistoryItem[];
};

export type PointsChangeListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';

  businessType?: string;

  params: {
    fuzzyName?: string;
    fuzzyEmail?: string;
    timeStart?: string;
    timeEnd?: string;
  };
};

export type PointsChangeItem = {
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string;
  params: object;
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

export type PointsChangeListRes = {
  code: number;
  msg: string;
  total: string;
  rows: PointsChangeItem[];
};

export type PointsBalanceParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
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

export type PointsBalanceRes = {
  code: number;
  msg: string;
  total: string;
  rows: PointsBalanceItem[];
};

export type GoodsClassificationParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';

  searchName?: string;
};

export type GoodsClassificationItem = {
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string | null;
  params: object;
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

export type GoodsClassificationRes = {
  code: number;
  msg: string;
  total: string;
  rows: GoodsClassificationItem[];
};
