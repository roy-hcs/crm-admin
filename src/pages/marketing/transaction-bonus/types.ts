import { FormTitleLanguageItem } from '../referral-bonus/types';

export type LadderBonusFormItem = {
  startAmount: string;
  endAmount: string;
  bonusFixed: string;
  dealNum: string;
  dealBasis: string;
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
  dealBreed: string;
  serverId: string;
  dealServer: string;
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
  ladderBonusList: LadderBonusFormItem[];
  issueTimeUnit: string;
  bonusIssueTime: string;
  dealNum: string;
  dealBasis: string;
};
