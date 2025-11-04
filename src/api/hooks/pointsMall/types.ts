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
