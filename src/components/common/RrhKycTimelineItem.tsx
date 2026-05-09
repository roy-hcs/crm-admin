import { KycStatus, getKycStatusBgClass } from '@/components/common/RrhKycStatus';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type KycTimelineItemProps = {
  status: KycStatus;
  isLast: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function RrhKycTimelineItem({
  status,
  isLast,
  children,
  className,
  contentClassName,
}: KycTimelineItemProps) {
  const statusBgClass = getKycStatusBgClass(status);

  return (
    <div className={cn('flex w-full', className)}>
      <div className="relative flex w-6 flex-col items-center overflow-hidden">
        {!isLast && (
          <div
            className={cn(
              'absolute top-6 bottom-0 left-1/2 z-0 h-full w-[1px] -translate-x-1/2',
              statusBgClass,
            )}
          />
        )}
        <div className="relative size-6 rounded-full">
          <div className={cn('absolute inset-0 rounded-full opacity-35', statusBgClass)} />
          <div
            className={cn(
              'absolute top-1/2 left-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full',
              statusBgClass,
            )}
          />
        </div>
      </div>
      <div className={cn('flex-1 pb-6 pl-6', contentClassName)}>{children}</div>
    </div>
  );
}
