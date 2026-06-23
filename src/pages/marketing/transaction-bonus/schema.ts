import { TFunction } from 'i18next';
import * as z from 'zod';

export function createTransactionBonusSchema(t: TFunction) {
  const required = (field: string) => t('rules.required', { field });
  const dateLike = z.union([z.date(), z.string()]);
  const hasValue = (value: unknown) => String(value ?? '').trim().length > 0;

  return z
    .object({
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
      ladderBonusList: z.array(
        z.object({
          startAmount: z.string(),
          endAmount: z.string(),
          bonusFixed: z.string(),
          dealNum: z.string(),
          dealBasis: z.string(),
        }),
      ),
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
    })
    .superRefine((values, ctx) => {
      const isLadderMode = (values.ladderBonusList || []).length > 0;
      const isFixedBonus = values.bonusType === '2';
      const isTradingBonus = values.bonusType === '3';

      if (!isLadderMode && isFixedBonus && !hasValue(values.bonusAmount)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: required(t('table.fixedAmount')),
          path: ['bonusAmount'],
        });
      }

      if (!isLadderMode && isTradingBonus) {
        if (!hasValue(values.dealNum)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: required(t('table.rewardAmount')),
            path: ['dealNum'],
          });
        }
        if (!hasValue(values.dealBasis)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: required(t('table.tradingVolume')),
            path: ['dealBasis'],
          });
        }
      }

      if (isLadderMode) {
        values.ladderBonusList.forEach((item, index) => {
          if (!hasValue(item.startAmount)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: required(t('rewardConfigPage.tradingVolumeRange')),
              path: ['ladderBonusList', index, 'startAmount'],
            });
          }

          if (!hasValue(item.endAmount)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: required(t('rewardConfigPage.tradingVolumeRange')),
              path: ['ladderBonusList', index, 'endAmount'],
            });
          }

          if (isFixedBonus && !hasValue(item.bonusFixed)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: required(t('table.fixedAmount')),
              path: ['ladderBonusList', index, 'bonusFixed'],
            });
          }

          if (isTradingBonus) {
            if (!hasValue(item.dealNum)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: required(t('table.rewardAmount')),
                path: ['ladderBonusList', index, 'dealNum'],
              });
            }
            if (!hasValue(item.dealBasis)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: required(t('table.tradingVolume')),
                path: ['ladderBonusList', index, 'dealBasis'],
              });
            }
          }
        });
      }
    });
}
