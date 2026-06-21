import { BonusSettingDetailData } from '@/api/hooks/marketing';
import { LanguageDictItem, toStringValue } from '../referral-bonus/formInitMappers';
import { FormValues } from './types';

const splitValues = (value: string | null | undefined) =>
  toStringValue(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

export function buildFormValuesFromDetail(detail: BonusSettingDetailData): FormValues {
  const bonusSetting = detail.bonusSetting;
  const bonusSettingExtra = bonusSetting as typeof bonusSetting & {
    bonusLockAllowWithdraw?: string | number | null;
  };

  const selectedUserIds = (detail.selectedUsers || [])
    .map(user => toStringValue(user.id))
    .filter(Boolean);
  const selectedRoleIds = (detail.selectedRoles || [])
    .map(role => toStringValue(role.roleId))
    .filter(Boolean);
  const selectedAccountIds = (detail.selectedAccounts || [])
    .map(user => toStringValue(user.id))
    .filter(Boolean);
  const selectedTagIds = (detail.selectedTags || [])
    .map(tag => toStringValue(tag.id))
    .filter(Boolean);
  return {
    rewardTitle: toStringValue(bonusSetting.rewardTitle),
    sort: toStringValue(bonusSetting.sort),
    status: toStringValue(bonusSetting.status, '0'),
    toClientStatus: toStringValue(bonusSetting.toClientStatus, '0'),
    businessType: toStringValue(detail.businessType ?? bonusSetting.businessType, '5'),
    accountLimitType: toStringValue(bonusSetting.accountLimitType, '0'),
    activityTime: {
      from: toStringValue(bonusSetting.startTime),
      to: toStringValue(bonusSetting.endTime),
    },
    amountCapped: toStringValue(bonusSetting.amountCapped),
    maxAccount: toStringValue(bonusSetting.maxAccount),
    rewardType: toStringValue(bonusSetting.rewardType, '1'),
    bonusAmount: toStringValue(bonusSetting.bonusAmount),
    bonusLock: toStringValue(bonusSetting.bonusLock),
    bonusLockAllowWithdraw: toStringValue(bonusSettingExtra.bonusLockAllowWithdraw),
    unlockLimit: toStringValue(bonusSetting.unlockLimit, '1,2,3'),
    unlockDeposit: toStringValue(bonusSetting.unlockDeposit),
    unlockNet: toStringValue(bonusSetting.unlockNet),
    unlockVolume: toStringValue(bonusSetting.unlockVolume),
    dealBreed: toStringValue(bonusSetting.dealBreed),
    serverId: toStringValue(bonusSetting.serverId),
    accountTypes: splitValues(bonusSetting.accountTypes),
    serverGroupIds: splitValues(bonusSetting.serverGroupIds),
    userIds: selectedUserIds.length > 0 ? selectedUserIds : splitValues(bonusSetting.userIds),
    crmRoleIds: selectedRoleIds.length > 0 ? selectedRoleIds : splitValues(bonusSetting.crmRoleIds),
    accounts:
      selectedAccountIds.length > 0 ? selectedAccountIds : splitValues(bonusSetting.accounts),
    tagIds: selectedTagIds.length > 0 ? selectedTagIds : splitValues(bonusSetting.tagIds),
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
    ladderBonusList: bonusSetting.ladderBonusList || [],
  };
}

export function createDefaultFormValues(languageList: LanguageDictItem[] = []): FormValues {
  return {
    rewardTitle: '',
    sort: '',
    status: '',
    toClientStatus: '',
    businessType: '4',
    accountLimitType: '0',
    activityTime: { from: '', to: '' },
    amountCapped: '',
    maxAccount: '',
    rewardType: '',
    bonusAmount: '',
    bonusLock: '',
    bonusLockAllowWithdraw: '',
    unlockLimit: '',
    unlockDeposit: '',
    unlockNet: '',
    unlockVolume: '',
    dealBreed: '',
    serverId: '',
    accountTypes: [],
    serverGroupIds: [],
    userIds: [],
    crmRoleIds: [],
    accounts: [],
    tagIds: [],
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
