import { cn } from '@/lib/utils';

export const TableContentWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'bg-background mt-3 max-w-full min-w-0 overflow-hidden rounded-md p-3',
      className,
    )}
  >
    {children}
  </div>
);
