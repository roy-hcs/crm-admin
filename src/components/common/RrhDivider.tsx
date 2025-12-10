import { cn } from '@/lib/utils';
import { FC, PropsWithChildren } from 'react';

export const RrhDivider: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  if (!children) {
    return <hr className={className} />;
  }
  return (
    <div className={cn('flex w-full items-center gap-2', className)}>
      <hr className="flex-1" />
      <div className="mx-2">{children}</div>
      <hr className="flex-1" />
    </div>
  );
};
