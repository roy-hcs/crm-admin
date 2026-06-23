import { BonusSettingDetailData } from '@/api/hooks/marketing';
import { LanguageDictItem, toStringValue } from '../referral-bonus/formInitMappers';
import { FormValues, LadderBonusFormItem } from './types';
import { toStringArray } from '../shared/value';

const splitValues = (value: string | null | undefined) => toStringArray(value);

const parseLadderBonusList = (detail: BonusSettingDetailData): LadderBonusFormItem[] => {
  const rawList = detail.bonusSetting.ladderBonusList;
  if (Array.isArray(rawList) && rawList.length > 0) {
    return rawList.map(item => ({
      startAmount: toStringValue(item.startAmount),
      endAmount: toStringValue(item.endAmount),
      bonusFixed: toStringValue(item.bonusFixed),
      dealNum: toStringValue(item.dealNum),
      dealBasis: toStringValue(item.dealBasis),
    }));
  }

  const ladderJsonStr = toStringValue(detail.bonusSetting.ladderBonusListJsonStr);
  if (!ladderJsonStr) return [];

  try {
    const parsed = JSON.parse(ladderJsonStr);
    if (!Array.isArray(parsed)) return [];

    return parsed.map(item => ({
      startAmount: toStringValue(item?.startAmount),
      endAmount: toStringValue(item?.endAmount),
      bonusFixed: toStringValue(item?.bonusFixed),
      dealNum: toStringValue(item?.dealNum),
      dealBasis: toStringValue(item?.dealBasis),
    }));
  } catch {
    return [];
  }
};

export function buildFormValuesFromDetail(detail: BonusSettingDetailData): FormValues {
  const bonusSetting = detail.bonusSetting;
  const selectedRoleIds = (detail.selectedRoles || [])
    .map(role => toStringValue(role.roleId))
    .filter(Boolean);

  return {
    rewardTitle: toStringValue(bonusSetting.rewardTitle),
    sort: toStringValue(bonusSetting.sort),
    status: toStringValue(bonusSetting.status, '0'),
    toClientStatus: toStringValue(bonusSetting.toClientStatus, '0'),
    businessType: toStringValue(detail.businessType ?? bonusSetting.businessType, '2'),
    accountLimitType: toStringValue(bonusSetting.accountLimitType, '0'),
    activityTime: {
      from: toStringValue(bonusSetting.startTime),
      to: toStringValue(bonusSetting.endTime),
    },
    amountCapped: toStringValue(bonusSetting.amountCapped),
    rewardType: toStringValue(bonusSetting.rewardType, '1'),
    bonusAmount: toStringValue(bonusSetting.bonusAmount),
    dealBreed: toStringValue(bonusSetting.dealBreed),
    serverId: toStringValue(bonusSetting.serverId),
    dealServer: toStringValue(bonusSetting.dealServer),
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
    bonusType: toStringValue(bonusSetting.bonusType, '2'),
    ladderBonusList: parseLadderBonusList(detail),
    issueTimeUnit: toStringValue(bonusSetting.issueTimeUnit),
    bonusIssueTime: toStringValue(bonusSetting.bonusIssueTime),
    dealNum: toStringValue(bonusSetting.dealNum),
    dealBasis: toStringValue(bonusSetting.dealBasis),
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
    rewardType: '1',
    bonusAmount: '',
    dealBreed: '',
    serverId: '',
    dealServer: '',
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
    bonusType: '2',
    ladderBonusList: [],
    issueTimeUnit: '',
    bonusIssueTime: '',
    dealNum: '',
    dealBasis: '',
  };
}
