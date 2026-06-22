import { toast } from 'sonner';

const MIN_LADDER_COUNT = 2;
const MAX_LADDER_COUNT = 5;
const MIN_INTERVAL_START = 1;

export type LadderRangeItem = {
  startAmount?: unknown;
  endAmount?: unknown;
};

export type LadderRangeValidationOptions = {
  showToast?: boolean;
  errorMessage?: string;
};

const toNumberOrNull = (value: unknown): number | null => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const hasMeaningfulRangeValue = (value: unknown): boolean => {
  if (value === '' || value === null || value === undefined) return false;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return true;
  return parsed > 0;
};

export function validateLadderRangeList(
  ladderList: LadderRangeItem[],
  options: LadderRangeValidationOptions = {},
) {
  const { showToast = true, errorMessage = 'Validation failed' } = options;

  const fail = () => {
    if (showToast) {
      toast.error(errorMessage);
    }
    return false;
  };

  if (ladderList.length < MIN_LADDER_COUNT || ladderList.length > MAX_LADDER_COUNT) {
    return fail();
  }

  for (let index = 0; index < ladderList.length; index++) {
    const isLast = index === ladderList.length - 1;
    const currentStart = toNumberOrNull(ladderList[index]?.startAmount);
    const currentEnd = toNumberOrNull(ladderList[index]?.endAmount);

    if (currentStart === null) {
      return fail();
    }

    // 最后一档结束金额允许为空（表示无上限）
    if (!isLast && currentEnd === null) {
      return fail();
    }

    // 每一档开始金额都必须 >= 1
    if (currentStart < MIN_INTERVAL_START) {
      return fail();
    }

    if (currentEnd !== null) {
      // 结束金额有值时必须 >= 1，且满足前闭后开区间 end > start
      if (currentEnd < MIN_INTERVAL_START || currentEnd <= currentStart) {
        return fail();
      }
    }

    if (!isLast) {
      const nextStart = toNumberOrNull(ladderList[index + 1]?.startAmount);

      // 区间必须连贯：下一档开始金额必须等于当前档结束金额
      if (nextStart === null || nextStart !== currentEnd) {
        return fail();
      }
    }
  }

  return true;
}
