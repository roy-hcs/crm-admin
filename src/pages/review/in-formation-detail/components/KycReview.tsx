import { useMemo } from 'react';
import { KycReviewCard, Step } from './KycReviewCard';
import { KycReviewInfoItem } from '@/api/hooks/review';
import { useTranslation } from 'react-i18next';
import { RrhKycTimelineItem } from '@/components/common/RrhKycTimelineItem';
import { mapKycReviewInfoToStep } from './kycReviewMappers';

export function KycReview({
  id,
  infoDetails,
  onSuccess,
}: {
  id: string;
  infoDetails: KycReviewInfoItem[];
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const steps: Array<Step & { key: string }> = useMemo(() => {
    if (!infoDetails.length) {
      return [];
    }
    return infoDetails.map((item, index) => mapKycReviewInfoToStep(item, index));
  }, [infoDetails]);
  return (
    <div className="w-full">
      {steps.length ? (
        steps.map((i, idx) => {
          return (
            <RrhKycTimelineItem key={i.key} status={i.status} isLast={idx === steps.length - 1}>
              <KycReviewCard step={i} id={id} onSuccess={onSuccess} />
            </RrhKycTimelineItem>
          );
        })
      ) : (
        <div className="text-muted-foreground flex size-30 items-center justify-center text-xs">
          {t('common.NoData')}
        </div>
      )}
    </div>
  );
}
