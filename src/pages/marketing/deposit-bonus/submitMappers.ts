import type {
  DepositBonusSettingParams,
  BonusSettingTitleLanguageItem,
} from '@/api/hooks/marketing';
import type { FormValues } from './types';
import { toStringValue } from '../shared/formValueUtils';
import { normalizeDateValue } from '../shared/formValueUtils';

export function buildSubmitParams(
  data: FormValues,
  titleLanguageList: BonusSettingTitleLanguageItem[],
  activityPicture: string | null,
): DepositBonusSettingParams {
  const serverGroupIds = (data.serverGroupIds || []).join(',') || null;
  const isAbsoluteTimeRange = data.timeRangeType === '2';
  const isLadderMode = data.bonusMode === '2';
  const bonusType = Number(data.bonusType || 1);

  const normalizedLadderList = (data.ladderBonusList || []).map(item => ({
    startAmount: toStringValue(item.startAmount),
    endAmount: toStringValue(item.endAmount),
    bonusScale: bonusType === 1 ? toStringValue(item.bonusScale) : '',
    bonusFixed: bonusType === 2 ? toStringValue(item.bonusFixed) : '',
  }));

  return {
    titleLanguageList,
    sort: data.sort,
    businessType: data.businessType,
    minimumAmount: toStringValue(data.minimumAmount),
    limitType: Number(data.limitType || 1),
    bonusType,
    bonusMode: Number(data.bonusMode || 1),
    bonusScheme: Number(data.bonusScheme || 1),
    timeRangeType: Number(data.timeRangeType || 1),
    amountCapped: toStringValue(data.amountCapped) || null,
    rewardType: Number(data.rewardType || 0),
    bonusAmount:
      data.bonusMode === '1' && bonusType === 2 ? toStringValue(data.bonusAmount) || null : null,
    bonusPercentage:
      data.bonusMode === '1' && bonusType === 1
        ? toStringValue(data.bonusPercentage) || null
        : null,
    status: Number(data.status || 0),
    startTime: isAbsoluteTimeRange ? normalizeDateValue(data.activityTime?.from) : '',
    endTime: isAbsoluteTimeRange ? normalizeDateValue(data.activityTime?.to) : '',
    businessTimeType: isAbsoluteTimeRange ? null : toStringValue(data.businessTimeType) || null,
    expire: isAbsoluteTimeRange ? null : toStringValue(data.expire) || null,
    timeUnit: isAbsoluteTimeRange ? null : toStringValue(data.timeUnit) || null,
    accountLimitType: Number(data.accountLimitType || 0),
    crmRoleIds: (data.crmRoleIds || []).join(',') || null,
    serverId: toStringValue(data.serverId) || null,
    serverGroupIds,
    ladderBonusListJsonStr: isLadderMode ? JSON.stringify(normalizedLadderList) : null,
    toClientStatus: Number(data.toClientStatus || 0),
    activityPicture,
  };
}
