import { cn } from '@/lib/utils';

export const TableContentWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn('bg-background mt-3 rounded-md p-3', className)}>{children}</div>;
