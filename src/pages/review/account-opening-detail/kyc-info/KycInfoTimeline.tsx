import { RrhCard } from '@/components/common/RrhCard';
import { cn } from '@/lib/utils';
import { KycInfoDetail, KycInfoStep } from './KycInfoDetail';

export const KycInfoTimeline = ({ steps }: { steps: KycInfoStep[] }) => {
  return (
    <div className="flex flex-col items-start">
      {steps.map((step, idx) => {
        return (
          <div key={idx} className="flex w-full">
            <div className="relative flex w-6 flex-col items-center overflow-hidden">
              {idx !== steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-6 bottom-0 left-1/2 z-0 h-full w-[1px] -translate-x-1/2',
                    step.status === 'pending' ? 'bg-amber-500' : '',
                    step.status === 'success' ? 'bg-green-600' : '',
                    step.status === 'fail' ? 'bg-red-500' : '',
                  )}
                />
              )}
              <div className="relative size-6 rounded-full">
                <div
                  className={cn(
                    'absolute inset-0 rounded-full opacity-35',
                    step.status === 'pending' ? 'bg-amber-500' : '',
                    step.status === 'success' ? 'bg-green-600' : '',
                    step.status === 'fail' ? 'bg-red-500' : '',
                  )}
                />
                <div
                  className={cn(
                    'absolute top-1/2 left-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full',
                    step.status === 'pending' ? 'bg-amber-500' : '',
                    step.status === 'success' ? 'bg-green-600' : '',
                    step.status === 'fail' ? 'bg-red-500' : '',
                  )}
                />
              </div>
            </div>
            <div className="flex-1 pb-6 pl-6">
              <RrhCard>
                <KycInfoDetail step={step} />
              </RrhCard>
            </div>
          </div>
        );
      })}
    </div>
  );
};
