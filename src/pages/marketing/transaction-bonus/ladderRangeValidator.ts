import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';
import {
  hasMeaningfulRangeValue,
  LadderRangeValidationOptions,
  validateLadderRangeList,
} from '../shared/ladderRangeValidator';

const hasValue = (value: unknown): boolean => {
  if (value === '' || value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

const shouldTreatAsLadderMode = (form: UseFormReturn<FormValues>) => {
  const bonusType = form.getValues('bonusType');
  if (bonusType === '2') {
    // 固定金额模式下，有顶层奖励金额时视为非阶梯
    if (hasValue(form.getValues('bonusAmount'))) return false;
  }

  if (bonusType === '3') {
    // 交易量模式下，有顶层dealNum/dealBasis时视为非阶梯
    if (hasValue(form.getValues('dealNum')) || hasValue(form.getValues('dealBasis'))) return false;
  }

  const ladderList = form.getValues('ladderBonusList') || [];
  return ladderList.some(item => {
    return (
      hasMeaningfulRangeValue(item?.startAmount) ||
      hasMeaningfulRangeValue(item?.endAmount) ||
      hasValue(item?.bonusFixed) ||
      hasValue(item?.dealNum) ||
      hasValue(item?.dealBasis)
    );
  });
};

export function shouldValidateLadderBonusRanges(form: UseFormReturn<FormValues>) {
  return shouldTreatAsLadderMode(form);
}

export function validateLadderBonusRanges(
  form: UseFormReturn<FormValues>,
  options: LadderRangeValidationOptions = {},
) {
  if (!shouldTreatAsLadderMode(form)) {
    return true;
  }

  const ladderList = form.getValues('ladderBonusList') || [];

  return validateLadderRangeList(ladderList, options);
}
