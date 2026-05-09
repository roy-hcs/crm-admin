import { KycReviewInfoItem } from '@/api/hooks/review';
import { toKycStatus } from '@/components/common/RrhKycStatus';
import { Step } from './KycReviewCard';

export type KycReviewTimelineStep = Step & {
  key: string;
};

export const mapKycReviewInfoToStep = (
  item: KycReviewInfoItem,
  index = 0,
): KycReviewTimelineStep => {
  const displayTime = item?.detail?.subTime ?? item?.detail?.verifyTime ?? '';

  return {
    key: (item.detail?.userName || '') + index,
    label: item?.infoName,
    status: toKycStatus(item?.detail?.status),
    remark: item?.detail?.remark,
    infoType: item?.infoType,
    time: displayTime,
    columns: item?.columns || [],
    isFold: false,
    name: `${item?.detail?.userLastName} ${item?.detail?.userName}`,
    verifyLogs: item?.verifyLogs || [],
    verifyStep: item?.detail?.verifyStep,
  };
};
