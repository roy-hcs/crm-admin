import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';
import {
  hasMeaningfulRangeValue,
  LadderRangeValidationOptions,
  validateLadderRangeList,
} from '../shared/ladderRangeValidator';

export function shouldValidateLadderBonusRanges(form: UseFormReturn<FormValues>) {
  if (form.getValues('bonusMode') !== '2') {
    return false;
  }

  const ladderList = form.getValues('ladderBonusList') || [];

  return ladderList.some(
    item => hasMeaningfulRangeValue(item?.startAmount) || hasMeaningfulRangeValue(item?.endAmount),
  );
}

export function validateLadderBonusRanges(
  form: UseFormReturn<FormValues>,
  options: LadderRangeValidationOptions = {},
) {
  if (form.getValues('bonusMode') !== '2') {
    return true;
  }

  const ladderList = form.getValues('ladderBonusList') || [];

  return validateLadderRangeList(ladderList, options);
}
