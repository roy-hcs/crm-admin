import type {
  AccountOpeningBonusSettingParams,
  BonusSettingTitleLanguageItem,
} from '@/api/hooks/marketing';
import { format } from 'date-fns';
import type { FormValues } from './types';
import { toStringValue } from '../referral-bonus/formInitMappers';

function normalizeDateValue(value: Date | string | undefined): string {
  if (!value) return '';
  return value instanceof Date ? format(value, 'yyyy-MM-dd HH:mm:ss') : toStringValue(value);
}

export function buildSubmitParams(
  data: FormValues,
  titleLanguageList: BonusSettingTitleLanguageItem[],
  activityPicture: string | null,
): AccountOpeningBonusSettingParams {
  const serverGroupIds = (data.serverGroupIds || []).join(',') || null;
  const accountTypes = (data.accountTypes || []).join(',') || null;

  return {
    titleLanguageList,
    sort: data.sort,
    businessType: data.businessType,
    limitType: serverGroupIds ? 1 : 0,
    bonusType: 2,
    bonusMode: 1,
    bonusScheme: 1,
    timeRangeType: 2,
    amountCapped: data.amountCapped || undefined,
    rewardType: Number(data.rewardType || 0),
    maxAccount: toStringValue(data.maxAccount) || null,
    bonusAmount: toStringValue(data.bonusAmount) || null,
    status: Number(data.status || 0),
    startTime: normalizeDateValue(data.activityTime?.from),
    endTime: normalizeDateValue(data.activityTime?.to),
    bonusLock: Number(data.bonusLock || 0),
    bonusLockAllowWithdraw: Number(data.bonusLockAllowWithdraw || 0),
    unlockLimit: data.unlockLimit || null,
    unlockDeposit: toStringValue(data.unlockDeposit) || null,
    unlockNet: toStringValue(data.unlockNet) || null,
    unlockVolume: toStringValue(data.unlockVolume) || null,
    accountLimitType: Number(data.accountLimitType || 0),
    userIds: (data.userIds || []).join(',') || null,
    crmRoleIds: (data.crmRoleIds || []).join(',') || null,
    accounts: (data.accounts || []).join(',') || null,
    tagIds: (data.tagIds || []).join(',') || null,
    serverId: toStringValue(data.serverId) || null,
    serverGroupIds,
    accountTypes,
    dealBreed: toStringValue(data.dealBreed) || null,
    toClientStatus: Number(data.toClientStatus || 0),
    activityPicture,
  };
}
