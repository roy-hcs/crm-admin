// Marketing module types
import { BasicParams, BasicRes, BaseEntity } from '../../types';

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
