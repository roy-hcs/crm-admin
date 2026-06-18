import type { BonusSettingTitleLanguageItem } from '@/api/hooks/marketing';

export type FormTitleLanguageItem = Omit<BonusSettingTitleLanguageItem, 'icon'> & {
  icon: string | File;
};

export type TriggerItem = {
  id: string;
  rewardId: string;
  event: string;
  symbol: string;
  value: string;
};

export type LevelAmountItem = {
  id: string;
  rewardId: string;
  level: string;
  amount: string;
};

export type FormValues = {
  rewardTitle: string;
  sort: string;
  status: string;
  toClientStatus: string;
  businessType: string;
  accountLimitType: string;
  activityTime: { from: Date | string; to: Date | string };
  triggers: TriggerItem[];
  levelAmounts: LevelAmountItem[];
  amountCapped: string;
  period: string;
  titleLanguageList: FormTitleLanguageItem[];
  userIds?: string[];
  crmRoleIds?: string[];
  accounts?: string[];
  tagIds?: string[];
};

export type ReferralBonusLanguageOption = BonusSettingTitleLanguageItem & {
  languageLabel: string;
};
