import type {
  BonusSettingInfoItem,
  ReferralBonusSettingParams,
  BonusSettingTitleLanguageItem,
} from '@/api/hooks/marketing';
import { uploadFilesInArr } from '@/lib/upload';
import type { FormTitleLanguageItem, FormValues } from './types';
import { toStringValue } from '../shared/formValueUtils';
import { normalizeDateValue } from '../shared/formValueUtils';

type LanguageDictItem = { dictValue?: string };

function normalizeTriggerSymbol(event: string, symbol: unknown): string {
  const symbolValue = toStringValue(symbol, '');
  if (event === '1') return '=';
  if (symbolValue === '>' || symbolValue === '>=') return '>=';
  if (symbolValue === '=') return '=';
  return '>=';
}

// 根据不同的模式处理不同的多语言列表数据，主要是为了在新增和编辑时都能正确地构建多语言列表数据结构 可以在多个活动类型中复用，避免重复代码
export function buildFallbackTitleLanguageList(
  mode: 'add' | 'edit',
  rewardTitle: string,
  languageList: LanguageDictItem[],
  infoList: BonusSettingInfoItem[] = [],
): FormTitleLanguageItem[] {
  const baseList =
    mode === 'edit'
      ? infoList
      : languageList.map(item => ({
          id: '',
          language: item.dictValue || '',
          rewardTitle: item.dictValue === 'zh-CN' ? rewardTitle : '',
          icon: '',
          activityContent: '',
        }));

  return baseList.map(item => ({
    id: toStringValue(item.id),
    language: item.language || '',
    rewardTitle: item.language === 'zh-CN' ? rewardTitle : toStringValue(item.rewardTitle),
    icon: item.icon || '',
    activityContent: toStringValue(item.activityContent),
  }));
}
// 提交数据前的预处理，主要是处理多语言列表中的图片上传，以及构建最终提交的多语言列表数据结构 和活动图片 (如果有的话，优先使用中文的图片) 通用方法，适用于多个活动类型
export async function resolveTitleLanguageListForSubmit(
  titleLanguageListData: FormTitleLanguageItem[],
  fallbackTitleLanguageList: FormTitleLanguageItem[],
  uploadFn: (file: File) => Promise<{ code: number; url: string; msg?: string }>,
  uploadErrorText: string,
  rewardTitle: string,
): Promise<{ titleLanguageList: BonusSettingTitleLanguageItem[]; activityPicture: string | null }> {
  const sourceTitleLanguageList =
    titleLanguageListData?.length > 0 ? titleLanguageListData : fallbackTitleLanguageList;

  const titleLanguageList: BonusSettingTitleLanguageItem[] = await Promise.all(
    sourceTitleLanguageList.map(async item => {
      let iconUrl = typeof item.icon === 'string' ? item.icon : '';
      if (item.icon instanceof File) {
        const fileData = await uploadFilesInArr([item.icon], uploadFn, uploadErrorText);
        iconUrl = fileData?.[0]?.fileUrls || '';
      }

      return {
        id: toStringValue(item.id),
        language: item.language || '',
        rewardTitle: item.language === 'zh-CN' ? rewardTitle : toStringValue(item.rewardTitle),
        icon: iconUrl,
        activityContent: toStringValue(item.activityContent),
      };
    }),
  );

  const zhCnIcon = titleLanguageList.find(item => item.language.toLowerCase() === 'zh-cn')?.icon;

  return {
    titleLanguageList,
    activityPicture: zhCnIcon || null,
  };
}

export function buildSubmitParams(
  data: FormValues,
  titleLanguageList: BonusSettingTitleLanguageItem[],
  activityPicture: string | null,
): ReferralBonusSettingParams {
  return {
    titleLanguageList,
    sort: data.sort,
    businessType: data.businessType,
    bonusType: 2,
    bonusMode: 1,
    bonusScheme: 1,
    timeRangeType: 2,
    amountCapped: data.amountCapped,
    period: data.period,
    rewardType: 2,
    bonusAmount: toStringValue(data.levelAmounts?.[0]?.amount),
    status: Number(data.status || 0),
    startTime: normalizeDateValue(data.activityTime?.from, 'yyyy-MM-dd'),
    endTime: normalizeDateValue(data.activityTime?.to, 'yyyy-MM-dd'),
    accountLimitType: Number(data.accountLimitType || 0),
    userIds: (data.userIds || []).join(',') || null,
    crmRoleIds: (data.crmRoleIds || []).join(',') || null,
    accounts: (data.accounts || []).join(',') || null,
    tagIds: (data.tagIds || []).join(',') || null,
    toClientStatus: Number(data.toClientStatus || 0),
    activityPicture,
    triggerListJsonStr: JSON.stringify(
      (data.triggers || []).map(item => ({
        event: item.event,
        symbol: normalizeTriggerSymbol(item.event, item.symbol),
        value: item.value,
      })),
    ),
    levelAmountListJsonStr: JSON.stringify(
      (data.levelAmounts || []).map(item => ({
        level: item.level,
        amount: item.amount,
      })),
    ),
  };
}
