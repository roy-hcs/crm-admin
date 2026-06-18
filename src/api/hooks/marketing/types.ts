// Marketing module types
import { BasicParams, BasicRes, BaseEntity } from '../../types';
import { CrmUser, VerifyLogItem } from '../review';
import { CrmUserTagItem, RoleItem } from '../system';

// Bonus Setting (Reward Configs) related types
export type BonusSettingListParams = BasicParams & {
  businessType?: string;
  params: {
    rewardTitle?: string;
  };
};

export type BonusSettingListItem = BaseEntity & {
  id: string;
  rewardTitle: string;
  sort: string;
  businessType: number;
  rewardType: number;
  status: number;
  accountLimitType: number;
  crmRoleIds: string | null;
  accounts: string | null;
  userIds: string | null;
  tagIds: string | null;
  serverId: string;
  serverGroupIds: string;
  accountTypes: string | null;
  maxAccount: string | null;
  minimumAmount: string | null;
  limitType: number;
  bonusType: number;
  bonusPercentage: string | null;
  bonusMode: number;
  bonusAmount: string | null;
  amountCapped: number;
  timeRangeType: number;
  businessTimeType: number;
  expire: number;
  timeUnit: number;
  startTime: string;
  endTime: string;
  delFlag: boolean;
  dealServer: string | null;
  dealBreed: string | null;
  bonusScheme: number;
  dealNum: number;
  dealBasis: string | null;
  issueTimeUnit: string | null;
  bonusIssueTime: string | null;
  toClientStatus: number;
  activityPicture: string | null;
  activityContent: string | null;
  titleLanguageList: string | null;
  ladderBonusList: string | null;
  ladderBonusListJsonStr: string | null;
  bonusLock: string | null;
  unlockLimit: string | null;
  unlockDeposit: string | null;
  unlockNet: string | null;
  unlockVolume: string | null;
};

export type BonusSettingListRes = BasicRes<BonusSettingListItem>;

// Ads related types
export type AdsListParams = BasicParams;

export type AdsListItem = BaseEntity & {
  id: string | null;
  name: string | null;
  position: string | null;
  sort: string | null;
  status: number;
  clickCount: string | null;
  webPicture: string | null;
  appPicture: string | null;
  jumpType: number | null;
  customLink: string | null;
  msgId: string | null;
  crmRoleIds: string | null;
  delFlag: string | null;
};

export type AdsListRes = BasicRes<AdsListItem>;

// Reward Records related types
export type RewardRecordsListParams = BasicParams & {
  rewardId?: string;
  status?: string;
  params: {
    rewardTitle?: string;
    crmAccount?: string;
    businessType?: string;
    bonusTimeStart?: string;
    bonusTimeEnd?: string;
  };
};

export type RewardRecordsListItem = {
  recordId: string | null;
  orderNo: string | null;
  userId: string | null;
  lastName: string | null;
  name: string | null;
  showId: string | null;
  businessType: string | null;
  rewardTitle: string | null;
  targetType: string | null;
  rewardType: string | null;
  rewardTarget: string | null;
  amount: string | null;
  status: string;
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  verifyFlag: boolean | null;
  lockStatus: string | null;
  unlockAmount: string | null;
  unlockTime: string | null;
  unlockLimit: string | null;
  unlockDeposit: string | null;
  unlockNet: string | null;
  unlockVolume: string | null;
};

export type RewardRecordsListRes = BasicRes<RewardRecordsListItem>;

export type AddAdsParams = {
  name: string;
  position: string;
  sort: string;
  status: string;
  webPicture: string;
  appPicture: string;
  jumpType: string;
  customLink: string;
  msgId: string | null;
  crmRoleIds: string | null;
  languageList: Array<{
    language: string;
    webPicture: string;
    appPicture: string;
  }>;
};

export type AdsDetail = {
  advertise: {
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    remark: string | null;
    params: Record<string, unknown>;
    id: string;
    name: string;
    position: number;
    sort: string;
    status: number;
    clickCount: number;
    webPicture: string;
    appPicture: string;
    jumpType: number;
    customLink: string;
    msgId: string | null;
    crmRoleIds: string;
    delFlag: string | null;
    languageList: string | null;
  };
};
export type NetBonusRewardReportsListParams = BasicParams & {
  status?: number;
  orderNo?: string;
  bonusUser?: string;
  params: {
    beginTime?: string;
    endTime?: string;
    beginBonusTime?: string;
    endBonusTime?: string;
  };
};

export interface NetBonusRewardReportsRes {
  total: string;
  rows: NetBonusRewardItem[];
  code: number;
  msg: string | null;
  totalVolume: number;
  totalCommission: number;
  totalProfit: number;
  totalSwaps: number;
  priceSum: number;
  serverType: string;
}

export interface NetBonusRewardItem {
  createTime: string;
  updateTime: string;
  createBy: string;
  updateBy: string;
  remark: string;
  params: Record<string, string>;
  id: string;
  orderNo: string;
  bonusMonth: number;
  bonusMonthStr: string;
  avgNetReward: number;
  personalAvgNet: number | null;
  tierNet: number | null;
  rewardParam: number;
  bonusType: number;
  bonusAmount: number;
  actualAmount: number;
  bonusBase: string;
  bonusUser: string;
  account: string;
  accountName: string;
  serverId: string | null;
  status: number;
  distributionTime: string;
  bonusBaseName: string;
  bonusBaseShowId: string;
  bonusUserName: string;
  bonusUserShowId: string;
  verifyStep: string;
  verifyUserName: string | null;
  deleteFlag: string;
  bonusBaseAccountType: string;
  bonusUserAccountType: string;
}

export type NetBonusRewardReportsTotal = {
  bonusAmount: number;
  actualAmount: number;
}[];
export type NetBonusRewardStatisticsListParams = BasicParams & {
  userName?: string;
  accountType?: string;
  bonusMonth?: string;
  params: {
    beginTime?: string;
    endTime?: string;
    agentUserId?: string;
    drirectFlag?: 'a' | 'd';
  };
};

export interface NetBonusRewardStatisticsRes {
  total: string;
  rows: NetBonusRewardRow[];
  code: number;
  msg: string | null;
  totalVolume: number;
  totalCommission: number;
  totalProfit: number;
  totalSwaps: number;
  priceSum: number;
  serverType: string | null;
}

export interface NetBonusRewardRow {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string;
  userId: string;
  bonusMonth: number;
  personalAvgNet: number;
  tierAvgNet: number;
  avgNetReward: number | null;
  rewardParam: number;
  fixedParam: number;
  expectedBonus: number | null;
  actualBonus: number | null;
  statisticsTime: string;
  statisticsTimeRange: number;
  userName: string;
  accountType: string;
  showId: string;
}

export type RewardRecordReviewDetailRes = {
  code: number;
  msg: string | null;
  data: {
    detail: {
      unlockLimit: null;
      unlockVolume: null;
      unlockDeposit: null;
      rewardType: number | null;
      verifyStep: number | null;
      rewardTypeStr: string | null;
      verifyUser: null;
      remark: string | null;
      lockStatusStr: string | null;
      verifyTime: string | null;
      login: string | null;
      referredUserId: string | null;
      vUserName: string | null;
      serverId: string | null;
      subTime: string | null;
      unlockNet: null;
      recordId: string | null;
      rewardId: string | null;
      rewardAmountUnit: string | null;
      lockStatus: string | null;
      referredUserName: string | null;
      userLastName: string | null;
      userShowId: string | null;
      subRemark: string | null;
      dealBreed: string | null;
      id: string | null;
      rewardAmount: number | null;
      bonusType: number | null;
      aliasName: string | null;
      vUserLastName: string | null;
      verifyUserName: string | null;
      dealNum: number | null;
      userName: string | null;
      userId: string | null;
      countTime: string | null;
      unlockConditions: string | null;
      dealNumUnit: string | null;
      hitActivity: string | null;
      dealBreeds: string | null;
      rewardStandard: string | null;
      dealNumStr: string | null;
      businessType: number | null;
      bonusTypeStr: string | null;
      rewardAmountStr: string | null;
      status: number | null;
    };
    verifyLogs: VerifyLogItem[];
  };
};

export type RewardRecordVerifyParams = {
  id: string;
  recordId: string;
  status: string;
  remark: string;
  verifyStep: string;
};

export type NetBonusRewardRecordsListParams = BasicParams & {
  bonusUser?: string;
  bonusMonth?: string;
  status?: string;
  orderNo?: string;
  params: {
    agentUserId?: string;
    drirectFlag?: string;
    beginTime?: string;
    endTime?: string;
    beginReviewTime?: string;
    endReviewTime?: string;
    beginBonusTime?: string;
    endBonusTime?: string;
  };
};
export type RewardRecordsItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string;
  orderNo: string;
  bonusMonth: number;
  bonusMonthStr: string;
  avgNetReward: number | null;
  personalAvgNet: number;
  tierNet: number;
  rewardParam: number;
  bonusType: number;
  bonusAmount: number;
  actualAmount: number;
  bonusBase: string;
  bonusUser: string;
  account: string;
  accountName: string;
  serverId: string | null;
  status: number;
  distributionTime: string | null;
  bonusBaseName: string | null;
  bonusBaseShowId: string | null;
  bonusUserName: string | null;
  bonusUserShowId: string | null;
  verifyStep: number | null;
  verifyUserName: string | null;
  deleteFlag: number | null;
  bonusBaseAccountType: string | null;
  bonusUserAccountType: string | null;
};

export type NetBonusRewardRecordsRes = BasicRes<RewardRecordsItem>;

export type NetBonusRewardRecordsTotalRes = NetBonusRewardReportsTotal; // 和奖励报表总计接口返回一致

export type NetBonusRewardRecordReviewDetailRes = {
  code: number;
  msg: string | null;
  data: {
    detail: RewardRecordsItem;
    verifyLogs: VerifyLogItem[];
  };
};

export type NetBonusRewardRecordVerifyParams = {
  id: string;
  status: string;
  actualAmount: number | string;
  remark: string;
  verifyStep: string;
  serverId: string;
  account: string;
};

export type NetBonusRewardFixedParamItem = {
  id: string;
  type: string;
  startAmount: number | null;
  endAmount: number | null;
  rewardParam: number;
  userId: string;
  userName: string;
  showId: string;
};
export type NetBonusRewardConfigFixed = {
  rewardParam: string;
  type: string;
  userId: string;
};

export type EditNetBonusRewardConfigFixedParams = NetBonusRewardConfigFixed[];
export type NetBonusRewardDepositSetting = {
  id: string;
  rewardTarget: string;
  status: string;
  crmDeposit: string;
  sysDeposit: string;
  depositSubType: string;
  crmWithdraw: string;
  sysWithdraw: string;
  withdrawSubType: string;
  dataStatisticsTimeRange: number;
  executionTime: string | null;
  autoReview: number;
};

export type NetBonusRewardSubscription = {
  remainingDays: number;
  startTime: string;
  endTime: string;
  status: number;
  totalDay: number;
};

export type NetBonusRewardConfigData = {
  agent: string;
  fixedParams: NetBonusRewardFixedParamItem[];
  netDepositBonus: NetBonusRewardDepositSetting;
  business: string;
  subscription: NetBonusRewardSubscription;
  subStatus: string;
  sales: string;
};

export type NetBonusRewardConfigRes = {
  code: number;
  msg?: string | null;
  data: NetBonusRewardConfigData;
};

export type EditNetBonusRewardConfigParams = {
  id: string;
  status: string;
  autoReview: string;
  rewardTarget: string[];
  crmDeposit: string;
  sysDeposit: string;
  crmWithdraw: string;
  sysWithdraw: string;
  dataStatisticsTimeRange: number;
  depositSubType: string[];
  withdrawSubType: string[];
};

export type NetBonusIntervalsItem = {
  id: string | null;
  type: string | null;
  startAmount: number | null;
  endAmount: number | null;
  rewardParam: number | null;
  userId: string | null;
  userName: string | null;
  showId: string | null;
};

export type NetBonusIntervalsRes = {
  code: number;
  msg: string | null;
  data: NetBonusIntervalsItem[];
};

export type NetBonusIntervalsParamsItem = {
  endAmount: number;
  rewardParam: number;
  startAmount: number;
  type: string;
};

export type EditNetBonusIntervalsParams = NetBonusIntervalsParamsItem[];

export type BonusSettingTriggerItem = {
  id: string | null;
  rewardId: string | null;
  event: number | string;
  symbol: string | null;
  value: number | string | null;
};

export type BonusSettingLevelAmountItem = {
  id: string | null;
  rewardId: string | null;
  level: number | string;
  amount: number | string;
};

export type BonusSettingDetailItem = BonusSettingListItem & {
  period?: number | string | null;
};

export type BonusSettingInfoItem = {
  id: string | null;
  rewardId: string | null;
  rewardTitle: string | null;
  activityContent: string | null;
  language: string;
  languageName: string | null;
  icon: string | null;
  isDefault: 'Y' | 'N' | null;
};

export type BonusSettingDetailData = {
  bonusSetting: BonusSettingDetailItem;
  triggers: BonusSettingTriggerItem[];
  levelAmounts: BonusSettingLevelAmountItem[];
  businessType?: number | string;
  infoList: BonusSettingInfoItem[];
  selectedUsers: CrmUser[]; // 这个字段是我在接口返回数据基础上添加的，用于编辑时回显已选择的用户
  selectedRoles: RoleItem[]; // 这个字段是我在接口返回数据基础上添加的，用于编辑时回显已选择的角色
  selectedAccounts: CrmUser[]; // 这个字段是我在接口返回数据基础上添加的，用于编辑时回显已选择的指定用户-下级
  selectedTags: CrmUserTagItem[]; // 这个字段是我在接口返回数据基础上添加的，用于编辑时回显已选择的指定标签
  [key: string]: unknown;
};

export type BonusSettingDetailRes = {
  code: number;
  data: BonusSettingDetailData;
  msg?: string;
};

export type BonusSettingTitleLanguageItem = {
  id: string;
  language: string;
  rewardTitle: string;
  icon: string;
  activityContent: string;
};

export type BonusSettingCommonParams = {
  titleLanguageList: BonusSettingTitleLanguageItem[];
  sort: string;
  businessType: string;
  bonusType: number;
  bonusMode: number;
  bonusScheme: number;
  timeRangeType: number;
  status: number;
  startTime: string;
  endTime: string;
  accountLimitType: number;
  userIds?: string | null;
  crmRoleIds?: string | null;
  accounts?: string | null;
  tagIds?: string | null;
  toClientStatus: number;
  activityPicture: string | null;
};

export type ReferralBonusSettingParams = BonusSettingCommonParams & {
  amountCapped: string;
  period: string;
  rewardType: number;
  bonusAmount: string | null;
  triggerListJsonStr: string;
  levelAmountListJsonStr: string;
};

export type EditReferralBonusSettingParams = ReferralBonusSettingParams & {
  id: string;
};

export type AccountOpeningBonusSettingParams = BonusSettingCommonParams & {
  limitType: number;
  amountCapped?: string;
  rewardType: number;
  maxAccount: string | null;
  bonusAmount: string | null;
  bonusLock: number | string | null;
  bonusLockAllowWithdraw: number | string | null;
  unlockLimit: string | null;
  unlockDeposit: string | null;
  unlockNet: string | null;
  unlockVolume: string | null;
  serverId: string | null;
  serverGroupIds: string | null;
  accountTypes: string | null;
  dealBreed: string | null;
};

export type EditAccountOpeningBonusSettingParams = AccountOpeningBonusSettingParams & {
  id: string;
};

export type AddBonusSettingParams = ReferralBonusSettingParams;

export type EditBonusSettingParams = EditReferralBonusSettingParams;
