import { FormTitleLanguageItem } from '../referral-bonus/types';

export type BonusSettingTitleLanguageItem = {
  id: string;
  language: string;
  rewardTitle: string;
  icon: string;
  activityContent: string;
};

export type DepositLadderBonusFormItem = {
  id?: string;
  rewardId?: string;
  startAmount: string;
  endAmount: string;
  bonusScale: string;
  bonusFixed: string;
};

export type FormValues = {
  rewardTitle: string;
  sort: string;
  status: string;
  toClientStatus: string;
  businessType: string;
  accountLimitType: string;
  activityTime: { from: Date | string; to: Date | string };
  amountCapped: string;
  rewardType: string;
  bonusAmount: string;
  serverId: string;
  serverGroupIds: string[];
  titleLanguageList: FormTitleLanguageItem[];
  crmRoleIds?: string[];
  minimumAmount: string;
  limitType: string;
  timeRangeType: string;
  businessTimeType: string;
  expire: string;
  timeUnit: string;
  bonusScheme: string;
  bonusType: string;
  bonusMode: string;
  bonusPercentage: string;
  ladderBonusList: DepositLadderBonusFormItem[];
};
