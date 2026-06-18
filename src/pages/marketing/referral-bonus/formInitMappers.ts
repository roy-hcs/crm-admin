import type { BonusSettingDetailData } from '@/api/hooks/marketing';
import type { FormValues } from './types';

export type LanguageDictItem = {
  dictValue?: string;
};

function createTriggerItem(event = '') {
  return {
    id: '',
    rewardId: '',
    event,
    symbol: event === '1' ? '=' : event ? '>=' : '',
    value: '',
  };
}

function createLevelAmountItem(level = '', amount = '') {
  return {
    id: '',
    rewardId: '',
    level,
    amount,
  };
}

export function createDefaultFormValues(languageList: LanguageDictItem[] = []): FormValues {
  return {
    rewardTitle: '',
    sort: '',
    status: '',
    toClientStatus: '',
    businessType: '5',
    accountLimitType: '0',
    activityTime: { from: '', to: '' },
    triggers: [
      createTriggerItem('1'),
      createTriggerItem('2'),
      createTriggerItem('3'),
      createTriggerItem('4'),
    ],
    levelAmounts: [createLevelAmountItem()],
    amountCapped: '',
    period: '1',
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
  };
}

export function toStringValue(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function normalizeTriggerEvent(event: unknown): string {
  return toStringValue(event);
}

function normalizeTriggerSymbol(event: string, symbol: unknown): string {
  const symbolValue = toStringValue(symbol, '');
  if (event === '1') return '=';
  if (symbolValue === '>' || symbolValue === '>=') return '>=';
  if (symbolValue === '=') return '=';
  return '>=';
}

export function buildFormValuesFromDetail(detail: BonusSettingDetailData): FormValues {
  const bonusSetting = detail.bonusSetting;
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

  const normalizedTriggers = (detail.triggers || [])
    .map(item => {
      const event = normalizeTriggerEvent(item.event);
      return {
        id: toStringValue(item.id),
        rewardId: toStringValue(item.rewardId),
        event,
        symbol: normalizeTriggerSymbol(event, item.symbol),
        value: toStringValue(item.value),
      };
    })
    .sort((a, b) => Number(a.event || 0) - Number(b.event || 0));

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
    triggers: normalizedTriggers,
    levelAmounts:
      (detail.levelAmounts || []).map(item => ({
        id: toStringValue(item.id),
        rewardId: toStringValue(item.rewardId),
        level: toStringValue(item.level),
        amount: toStringValue(item.amount),
      })) || [],
    amountCapped: toStringValue(bonusSetting.amountCapped),
    period: toStringValue(bonusSetting.period, '1'),
    userIds:
      selectedUserIds.length > 0
        ? selectedUserIds
        : toStringValue(bonusSetting.userIds)
            .split(',')
            .map(item => item.trim())
            .filter(Boolean),
    crmRoleIds:
      selectedRoleIds.length > 0
        ? selectedRoleIds
        : toStringValue(bonusSetting.crmRoleIds)
            .split(',')
            .map(item => item.trim())
            .filter(Boolean),
    accounts:
      selectedAccountIds.length > 0
        ? selectedAccountIds
        : toStringValue(bonusSetting.accounts)
            .split(',')
            .map(item => item.trim())
            .filter(Boolean),
    tagIds:
      selectedTagIds.length > 0
        ? selectedTagIds
        : toStringValue(bonusSetting.tagIds)
            .split(',')
            .map(item => item.trim())
            .filter(Boolean),
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
  };
}
