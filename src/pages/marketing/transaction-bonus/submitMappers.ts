import type {
  TransactionBonusSettingParams,
  BonusSettingTitleLanguageItem,
} from '@/api/hooks/marketing';
import type { FormValues } from './types';
import { toStringValue } from '../shared/formValueUtils';
import { normalizeDateValue } from '../shared/formValueUtils';

const hasValue = (value: unknown) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

const hasMeaningfulLadderRows = (data: FormValues) => {
  return (data.ladderBonusList || []).some(item => {
    return (
      hasValue(item?.startAmount) ||
      hasValue(item?.endAmount) ||
      hasValue(item?.bonusFixed) ||
      hasValue(item?.dealNum) ||
      hasValue(item?.dealBasis)
    );
  });
};

export function buildSubmitParams(
  data: FormValues,
  titleLanguageList: BonusSettingTitleLanguageItem[],
  activityPicture: string | null,
): TransactionBonusSettingParams {
  const serverGroupIds = (data.serverGroupIds || []).join(',') || null;
  const isAbsoluteTimeRange = data.timeRangeType === '2';
  const isTradingVolumeBonus = data.bonusType === '3';
  const hasTopLevelFlatReward = isTradingVolumeBonus
    ? hasValue(data.dealNum) || hasValue(data.dealBasis)
    : hasValue(data.bonusAmount);
  const ladderModeEnabled = !hasTopLevelFlatReward && hasMeaningfulLadderRows(data);

  const normalizedLadderList = ladderModeEnabled
    ? (data.ladderBonusList || []).map(item => ({
        startAmount: toStringValue(item.startAmount),
        endAmount: toStringValue(item.endAmount),
        bonusFixed: isTradingVolumeBonus ? '' : toStringValue(item.bonusFixed),
        dealNum: isTradingVolumeBonus ? toStringValue(item.dealNum) : '',
        dealBasis: isTradingVolumeBonus ? toStringValue(item.dealBasis) : '',
      }))
    : [];

  return {
    titleLanguageList,
    sort: data.sort,
    businessType: data.businessType,
    minimumAmount: toStringValue(data.minimumAmount),
    limitType: Number(data.limitType || 1),
    bonusType: Number(data.bonusType || 2),
    bonusMode: ladderModeEnabled ? 2 : 1,
    bonusScheme: Number(data.bonusScheme || 1),
    timeRangeType: Number(data.timeRangeType || 1),
    amountCapped: toStringValue(data.amountCapped) || null,
    rewardType: Number(data.rewardType || 0),
    bonusAmount: isTradingVolumeBonus ? null : toStringValue(data.bonusAmount) || null,
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
    dealServer: toStringValue(data.dealServer) || null,
    dealBreed: toStringValue(data.dealBreed) || null,
    dealNum: isTradingVolumeBonus ? toStringValue(data.dealNum) || null : null,
    dealBasis: isTradingVolumeBonus ? toStringValue(data.dealBasis) || null : null,
    issueTimeUnit: toStringValue(data.issueTimeUnit) || null,
    bonusIssueTime: toStringValue(data.bonusIssueTime) || null,
    ladderBonusListJsonStr: ladderModeEnabled ? JSON.stringify(normalizedLadderList) : null,
    toClientStatus: Number(data.toClientStatus || 0),
    activityPicture,
  };
}
