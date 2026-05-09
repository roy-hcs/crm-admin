import { RrhCard } from '@/components/common/RrhCard';
import { KycInfoDetail, KycInfoStep } from './KycInfoDetail';
import { RrhKycTimelineItem } from '@/components/common/RrhKycTimelineItem';

export const KycInfoTimeline = ({ steps }: { steps: KycInfoStep[] }) => {
  return (
    <div className="flex flex-col items-start">
      {steps.map((i, idx) => {
        return (
          <RrhKycTimelineItem
            key={`${i.label}-${i.time}-${idx}`}
            status={i.status}
            isLast={idx === steps.length - 1}
          >
            <RrhCard>
              <KycInfoDetail step={i} />
            </RrhCard>
          </RrhKycTimelineItem>
        );
      })}
    </div>
  );
};
