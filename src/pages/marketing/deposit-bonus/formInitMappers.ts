import { BonusSettingDetailData } from '@/api/hooks/marketing';
import { LanguageDictItem } from '../referral-bonus/formInitMappers';
import { toStringValue } from '../shared/formValueUtils';
import { FormValues } from './types';
import { toStringArray } from '../shared/formValueUtils';

const splitValues = (value: string | null | undefined) => toStringArray(value);

export function buildFormValuesFromDetail(detail: BonusSettingDetailData): FormValues {
  const bonusSetting = detail.bonusSetting;
  const selectedRoleIds = (detail.selectedRoles || [])
    .map(role => toStringValue(role.roleId))
    .filter(Boolean);

  const parseLadderList = () => {
    if (bonusSetting.ladderBonusList && bonusSetting.ladderBonusList.length > 0) {
      return bonusSetting.ladderBonusList.map(item => ({
        id: toStringValue(item.id),
        rewardId: toStringValue(item.rewardId),
        startAmount: toStringValue(item.startAmount),
        endAmount: toStringValue(item.endAmount),
        bonusScale: toStringValue(item.bonusScale),
        bonusFixed: toStringValue(item.bonusFixed),
      }));
    }

    const raw = toStringValue(bonusSetting.ladderBonusListJsonStr);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(item => ({
        id: '',
        rewardId: '',
        startAmount: toStringValue(item?.startAmount),
        endAmount: toStringValue(item?.endAmount),
        bonusScale: toStringValue(item?.bonusScale),
        bonusFixed: toStringValue(item?.bonusFixed),
      }));
    } catch {
      return [];
    }
  };

  return {
    rewardTitle: toStringValue(bonusSetting.rewardTitle),
    sort: toStringValue(bonusSetting.sort),
    status: toStringValue(bonusSetting.status, '0'),
    toClientStatus: toStringValue(bonusSetting.toClientStatus, '0'),
    businessType: toStringValue(detail.businessType ?? bonusSetting.businessType, '1'),
    accountLimitType: toStringValue(bonusSetting.accountLimitType, '0'),
    activityTime: {
      from: toStringValue(bonusSetting.startTime),
      to: toStringValue(bonusSetting.endTime),
    },
    amountCapped: toStringValue(bonusSetting.amountCapped),
    rewardType: toStringValue(bonusSetting.rewardType, '1'),
    bonusAmount: toStringValue(bonusSetting.bonusAmount),
    serverId: toStringValue(bonusSetting.serverId),
    serverGroupIds: splitValues(bonusSetting.serverGroupIds),
    crmRoleIds: selectedRoleIds.length > 0 ? selectedRoleIds : splitValues(bonusSetting.crmRoleIds),
    titleLanguageList: (detail.infoList || []).map(item => ({
      id: toStringValue(item.id),
      language: item.language || '',
      rewardTitle:
        item.language === 'zh-CN'
          ? toStringValue(bonusSetting.rewardTitle)
          : toStringValue(item.rewardTitle),
      icon: item.icon || '',
      activityContent: item.activityContent || '',
    })),
    minimumAmount: toStringValue(bonusSetting.minimumAmount),
    limitType: toStringValue(bonusSetting.limitType, '1'),
    timeRangeType: toStringValue(bonusSetting.timeRangeType, '1'),
    businessTimeType: toStringValue(bonusSetting.businessTimeType, '1'),
    expire: toStringValue(bonusSetting.expire, ''),
    timeUnit: toStringValue(bonusSetting.timeUnit, '1'),
    bonusScheme: toStringValue(bonusSetting.bonusScheme, '1'),
    bonusType: toStringValue(bonusSetting.bonusType, '1'),
    bonusMode: toStringValue(bonusSetting.bonusMode, '1'),
    bonusPercentage: toStringValue(bonusSetting.bonusPercentage),
    ladderBonusList: parseLadderList(),
  };
}

export function createDefaultFormValues(languageList: LanguageDictItem[] = []): FormValues {
  return {
    rewardTitle: '',
    sort: '',
    status: '',
    toClientStatus: '',
    businessType: '',
    accountLimitType: '0',
    activityTime: { from: '', to: '' },
    amountCapped: '',
    rewardType: '',
    bonusAmount: '',
    serverId: '',
    serverGroupIds: [],
    crmRoleIds: [],
    titleLanguageList: languageList.map(item => ({
      id: '',
      language: item.dictValue || '',
      rewardTitle: '',
      icon: '',
      activityContent: '',
    })),
    minimumAmount: '',
    limitType: '1',
    timeRangeType: '1',
    businessTimeType: '1',
    expire: '',
    timeUnit: '1',
    bonusScheme: '1',
    bonusType: '1',
    bonusMode: '1',
    bonusPercentage: '',
    ladderBonusList: [],
  };
}
