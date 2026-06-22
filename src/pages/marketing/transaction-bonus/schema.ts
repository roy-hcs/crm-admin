import { TFunction } from 'i18next';
import * as z from 'zod';

export function createTransactionBonusSchema(t: TFunction) {
  const required = (field: string) => t('rules.required', { field });
  const dateLike = z.union([z.date(), z.string()]);

  return z.object({
    rewardTitle: z
      .string()
      .trim()
      .min(
        1,
        required(t('rewardConfigPage.activityName', { field: t('productCategories.zhName') })),
      ),
    sort: z
      .string()
      .trim()
      .min(1, required(t('table.sort'))),
    // status、toClientStatus按需求不做必填校验
    status: z.string().trim(),
    toClientStatus: z.string().trim(),
    businessType: z
      .string()
      .trim()
      .min(1, required(t('table.triggerBusiness')))
      .refine(value => value === '2', {
        message: required(t('table.triggerBusiness')),
      }),
    accountLimitType: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.accountLimitType'))),
    activityTime: z.object({
      from: dateLike,
      to: dateLike,
    }),
    amountCapped: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.amountCapped'))),
    rewardType: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.rewardType'))),
    bonusAmount: z.string(),
    dealBreed: z.string(),
    serverId: z.string(),
    dealServer: z
      .string()
      .trim()
      .min(1, required(t('table.server'))),
    serverGroupIds: z.array(z.string()),
    titleLanguageList: z.array(z.any()),
    crmRoleIds: z.array(z.string()).optional(),
    minimumAmount: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.minimumAmount'))),
    limitType: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.limitType'))),
    timeRangeType: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.timeRangeType'))),
    businessTimeType: z.string(),
    expire: z.string().trim().min(1, required('')),
    timeUnit: z.string(),
    bonusScheme: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.bonusScheme'))),
    bonusType: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.bonusAmount'))),
    ladderBonusList: z.array(z.any()),
    issueTimeUnit: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.bonusIssueTime'))),
    bonusIssueTime: z
      .string()
      .trim()
      .min(1, required(t('rewardConfigPage.bonusIssueTime'))),
    dealNum: z.string(),
    dealBasis: z.string(),
  });
}
