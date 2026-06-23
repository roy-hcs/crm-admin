import { TFunction } from 'i18next';
import * as z from 'zod';

const toNumberOrNull = (value: unknown): number | null => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const hasValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

const hasValidDateLikeValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return false;
};

export function createDepositBonusSchema(t: TFunction) {
  const required = (field: string) => t('rules.required', { field });
  const dateLike = z.union([z.date(), z.string()]);

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
      status: z
        .string()
        .trim()
        .min(1, required(t('table.status'))),
      toClientStatus: z.string().trim(),
      businessType: z
        .string()
        .trim()
        .min(1, required(t('table.triggerBusiness'))),
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
      serverId: z.string(),
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
      expire: z.string(),
      timeUnit: z.string(),
      bonusScheme: z
        .string()
        .trim()
        .min(1, required(t('rewardConfigPage.bonusScheme'))),
      bonusType: z
        .string()
        .trim()
        .min(1, required(t('rewardConfigPage.bonusType'))),
      bonusMode: z
        .string()
        .trim()
        .min(1, required(t('rewardConfigPage.bonusMode'))),
      bonusPercentage: z.string(),
      ladderBonusList: z.array(z.any()),
    })
    .superRefine((values, ctx) => {
      if (
        values.accountLimitType === '1' &&
        (!values.crmRoleIds || values.crmRoleIds.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['crmRoleIds'],
          message: required(t('rewardConfigPage.accountLimitTypeOptions.1')),
        });
      }

      if (values.accountLimitType === '2') {
        if (!hasValue(values.serverId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['serverId'],
            message: required(t('common.server')),
          });
        }

        if (!values.serverGroupIds || values.serverGroupIds.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['serverGroupIds'],
            message: required(t('rewardConfigPage.accountLimitTypeOptions.2')),
          });
        }
      }

      if (values.timeRangeType === '1') {
        if (!hasValue(values.businessTimeType)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['businessTimeType'],
            message: required(t('rewardConfigPage.timeRangeTypeOptions.1')),
          });
        }

        if (!hasValue(values.expire)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['expire'],
            message: required(t('rewardConfigPage.timeRangeTypeOptions.1')),
          });
        }

        if (!hasValue(values.timeUnit)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['timeUnit'],
            message: required(t('rewardConfigPage.timeRangeTypeOptions.1')),
          });
        }
      }

      if (values.timeRangeType === '2') {
        if (
          !hasValidDateLikeValue(values.activityTime?.from) ||
          !hasValidDateLikeValue(values.activityTime?.to)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['activityTime'],
            message: required(t('rewardConfigPage.activityTime')),
          });
        }
      }

      if (values.rewardType !== '1') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rewardType'],
          message: required(t('rewardConfigPage.rewardType')),
        });
      }

      if (values.bonusMode === '1') {
        if (values.bonusType === '1' && !hasValue(values.bonusPercentage)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['bonusPercentage'],
            message: required(t('rewardConfigPage.bonusTypeOptions.1')),
          });
        }

        if (values.bonusType === '2' && !hasValue(values.bonusAmount)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['bonusAmount'],
            message: required(t('rewardConfigPage.bonusTypeOptions.2')),
          });
        }
      }

      if (values.bonusMode === '2') {
        const ladderList = values.ladderBonusList || [];

        if (ladderList.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['ladderBonusList'],
            message: required(t('rewardConfigPage.bonusModeOptions.2')),
          });
          return;
        }

        for (let index = 0; index < ladderList.length; index++) {
          const isLast = index === ladderList.length - 1;
          const row = ladderList[index] || {};
          const currentStart = toNumberOrNull(row.startAmount);
          const currentEnd = toNumberOrNull(row.endAmount);
          const bonusScale = toNumberOrNull(row.bonusScale);
          const bonusFixed = toNumberOrNull(row.bonusFixed);

          if (currentStart === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['ladderBonusList', index, 'startAmount'],
              message: required(t('common.amountRange')),
            });
          }

          if (!isLast && currentEnd === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['ladderBonusList', index, 'endAmount'],
              message: required(t('common.amountRange')),
            });
          }

          if (values.bonusType === '1' && bonusScale === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['ladderBonusList', index, 'bonusScale'],
              message: required(t('table.percentage')),
            });
          }

          if (values.bonusType === '2' && bonusFixed === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['ladderBonusList', index, 'bonusFixed'],
              message: required(t('rewardConfigPage.bonusTypeOptions.2')),
            });
          }
        }
      }
    });
}
