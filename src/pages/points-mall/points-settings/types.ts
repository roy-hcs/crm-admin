export type PointsMallTransactionItem = {
  bonusBasis: string;
  bonusPoints: string;
  businessType: string;
  cappedPoints: string;
  cappedTimeUnit: string;
  dealBreed?: string;
  dealServer: string;
  id: string;
};

export type PointsMallCommissionRewardItem = {
  businessType: string;
  id: string;
  subType: string;
  bonusPoints: string;
  bonusBasis: string;
  cappedPoints: string;
  cappedTimeUnit: string;
};

export type PointsMallSettingsFormValues = {
  productExchangeEnable: string;
  pointsDigits: string;
  selected: string[];
  commissionRewardSelectedId: string;
  depositSuccess: {
    businessType: string;
    id: string;
    bonusPoints: string;
    bonusBasis: string;
    cappedPoints: string;
    cappedTimeUnit: string;
  };
  transaction: PointsMallTransactionItem[];
  agentCustomerTransaction: PointsMallTransactionItem[];
  inviteRegister: {
    businessType: string;
    id: string;
    bonusPoints: string;
    cappedPoints: string;
    cappedTimeUnit: string;
  };
  inviteOpenAccount: {
    businessType: string;
    id: string;
    bonusPoints: string;
    cappedPoints: string;
    cappedTimeUnit: string;
    multipleRewards: string;
  };
  inviteDeposit: {
    businessType: string;
    id: string;
    bonusPoints: string;
    cappedPoints: string;
    cappedTimeUnit: string;
  };
  agentCustomerDeposit: {
    businessType: string;
    id: string;
    bonusPoints: string;
    bonusBasis: string;
    cappedPoints: string;
    cappedTimeUnit: string;
  };
  commissionReward: PointsMallCommissionRewardItem[];
  deductionDays?: string;
  deductionRatio?: string;
  exemptRoleIds: string[];
  exemptTagIds: string[];
  roleIds: string[];
  mindUserIds: string[];
  content?: {
    [key: string]: string;
  };
};

export const createEmptyTransaction = (businessType: string = '2'): PointsMallTransactionItem => ({
  bonusBasis: '',
  bonusPoints: '',
  businessType,
  cappedPoints: '',
  cappedTimeUnit: '',
  dealBreed: '',
  dealServer: '',
  id: '',
});

export const createEmptyCommissionReward = (
  id: string,
  subType: string,
): PointsMallCommissionRewardItem => ({
  businessType: '8',
  id,
  subType,
  bonusPoints: '',
  bonusBasis: '',
  cappedPoints: '',
  cappedTimeUnit: '',
});
