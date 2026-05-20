import { BasicParams, BasicRes, BaseEntity } from '../../types';
import { ServerItem } from '../system/types';

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
  isAsc?: string;
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
  parentId?: number; // 用来获取一级分类列表
  status?: number; // 用来获取一级分类列表
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

export type GoodDetailInfo = {
  receivePhone: string | null;
  amount: string | null;
  exchangePoints: string | null;
  receiveAddress: string | null;
  goodsId: string | null;
  virtualGoodsType: string | null;
  exchangeTime: string | null;
  exchangeType: string | null;
  updateTime: string | null;
  remark: string | null;
  userName: string | null;
  paymentAmount: string | null;
  goodsType: string | null;
  showId: string | null;
  receiveName: string | null;
  payType: string | null;
  verifyStatus: string | null;
  updateBy: string | null;
  currency: string | null;
  id: string | null;
  goodsName: string | null;
  email: string | null;
  exchangeAccount: string | null;
};

export type LanguageItem = {
  classificationName: string;
  language: string;
};

export type AddGoodsClassificationParams = {
  classificationName: string;
  parentId: string;
  sort: string;
  languageList: LanguageItem[];
};

export type languageItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string | null;
  classificationId: string | null;
  classificationName: string | null;
  language: string | null;
};

export type GoodsClassificationDetail = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string | null;
  parentId: string | null;
  status: string | null;
  sort: string | null;
  classificationName: string | null;
  parentClassificationName: string | null;
  languageList: languageItem[];
  secondClassificationList: string | null;
  language: string | null;
  searchName: string | null;
  classificationLanguageId: string | null;
};

export type PointsConfigBusinessTypeKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type PointsConfigSettingItem = BaseEntity & {
  id: string;
  businessType: number;
  subType: number | null;
  bonusPoints: number;
  bonusBasis: number | null;
  cappedPoints: number;
  cappedTimeUnit: number;
  dealServer: string | null;
  dealBreed: string | null;
  delFlag: boolean;
  multipleRewards: number | null;
};

export type PointsConfigRes = {
  code: number;
  data: {
    productExchangeEnable: string;
    pointsDigits: string;
    selected: string;
    status: string;
    settingsData: Partial<Record<PointsConfigBusinessTypeKey, PointsConfigSettingItem[]>>;
    deductionDays: string;
    deductionRatio: string;
    allRoles: Array<{
      roleId: string;
      roleName: string;
    }>;
    allTags: Array<{
      id: string;
      tagName: string;
    }>;
    allSysUser: Array<{
      userId: string;
      wholeName: string;
    }>;
    roleIds: string[];
    exemptRoleIds: string[];
    exemptTagIds: string[];
    mindUserIds: string[];
    subscription: {
      endTime?: string;
      remainingDays?: number;
      startTime?: string;
      status?: number;
      totalDay?: number;
    };
    mtServiceList: Array<ServerItem>;
  };
};

export type PointsSubscription = PointsConfigRes['data']['subscription'];

export type PointsIntroRes = {
  code: number;
  data: {
    infoList: Array<{
      id: string | null;
      language: string | null;
      languageName: string | null;
      pointsIntro: string | null;
    }>;
  };
};

type EditPointsConfigCommonItem = {
  id: string;
  bonusPoints: string;
  cappedPoints: string;
  cappedTimeUnit: string;
};

type EditPointsConfigTransactionItem = EditPointsConfigCommonItem & {
  businessType: '2' | '7';
  dealServer: string;
  dealBreed: string;
  bonusBasis: string;
};

type EditPointsConfigCommissionItem = EditPointsConfigCommonItem & {
  businessType: '8';
  subType: string;
  bonusBasis?: string;
};

export type EditPointsConfigItem =
  | (EditPointsConfigCommonItem & {
      businessType: '1' | '6';
      bonusBasis: string;
    })
  | EditPointsConfigTransactionItem
  | (EditPointsConfigCommonItem & {
      businessType: '3' | '5';
    })
  | (EditPointsConfigCommonItem & {
      businessType: '4';
      multipleRewards: string | number;
    })
  | EditPointsConfigCommissionItem;

export type EditPointsConfig = {
  selectedValues: string[];
  configList: EditPointsConfigItem[];
  pointsDigits: string;
  productExchangeEnable: string;
  roleIds: string[];
  mindUserIds: string[];
  deductionDays: string;
  deductionRatio: string;
  exemptRoles: string[];
  exemptTags: string[];
  intervalMode: string;
  globalIntervalValue: string;
  groupIntervalConfigs: Array<{
    serverId: string;
    group: string;
    timeInterval: string;
  }>;
};

type NumberLike = string | number;

export type CreateProductLanguageItem = {
  language: string;
  goodsName: string;
  goodsContent: string;
};

export type CreateProductCombinationPaymentItem = {
  exchangePoint: NumberLike;
  exchangeAmount: NumberLike;
};

type ProductSharedFields<
  TExchangePoints,
  TVirtualGoodsType,
  TAmount,
  TCurrency,
  TFirstClassificationId,
  TSecondClassificationId,
  TApplicableRoles,
  TCombinationPaymentItem,
  TSort,
> = {
  exchangePoints: TExchangePoints;
  goodsType: number;
  virtualGoodsType: TVirtualGoodsType;
  amount: TAmount;
  currency: TCurrency;
  coverPicture: string;
  goodsPicture: string;
  countryId: string;
  firstClassificationId: TFirstClassificationId;
  secondClassificationId: TSecondClassificationId;
  applicableRoles: TApplicableRoles;
  paymentPlan: string;
  combinationPaymentList: TCombinationPaymentItem[];
  sort: TSort;
};

export type CreateProductParams = ProductSharedFields<
  NumberLike,
  NumberLike,
  NumberLike,
  string,
  string,
  string,
  string,
  CreateProductCombinationPaymentItem,
  NumberLike
> & {
  status: number;
  languageList: CreateProductLanguageItem[];
};

export type EditProductLanguageItem = CreateProductLanguageItem & {
  id?: string;
};

export type EditProductCombinationPaymentItem = CreateProductCombinationPaymentItem & {
  id?: string;
  goodsId?: string;
};

export type EditProductParams = ProductSharedFields<
  NumberLike,
  NumberLike | null,
  NumberLike | null,
  string | null,
  string | null,
  string | null,
  string | null,
  EditProductCombinationPaymentItem,
  NumberLike
> & {
  id: NumberLike;
  status: number;
  languageList: EditProductLanguageItem[];
};

export type CountryItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: number;
  status: boolean;
  sort: number;
  countryName: string;
  continent: string;
  continentName: string;
  language: string | null;
  countryCode: string | null;
};

export type ChooseCountriesRes = {
  code: number;
  data: {
    dataList: Array<{
      continent: string;
      country: CountryItem[];
    }>;
  };
};

export type ProductDetailCombinationPaymentItem = {
  id: string;
  goodsId: string;
  exchangePoint: number;
  exchangeAmount: number;
};

export type ProductDetailGoodsObject = BaseEntity &
  ProductSharedFields<
    string,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    ProductDetailCombinationPaymentItem,
    number
  > & {
    id: string;
    goodsName: string;
    goodsContent: string;
    status: number;
    viewCount: number;
    exchangeCount: number;
    delFlag: boolean;
    languageList: string | null;
  };

export type ProductDetailRes = {
  code: number;
  data: {
    goodsObject: ProductDetailGoodsObject;
  };
};
