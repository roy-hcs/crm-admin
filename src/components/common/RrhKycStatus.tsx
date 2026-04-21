import { cn } from '@/lib/utils';
import { CircleCheck, CircleX, Loader } from 'lucide-react';

export type KycStatus = 'pending' | 'success' | 'fail';

type RrhKycStatusProps = {
  status?: KycStatus;
  text: string;
  className?: string;
};

const statusStyleMap: Record<
  KycStatus,
  {
    bg: string;
    icon: typeof CircleCheck;
  }
> = {
  pending: {
    bg: 'bg-amber-500',
    icon: Loader,
  },
  success: {
    bg: 'bg-green-600',
    icon: CircleCheck,
  },
  fail: {
    bg: 'bg-red-500',
    icon: CircleX,
  },
};

export function RrhKycStatus({ status, text = '-', className }: RrhKycStatusProps) {
  if (!status || !statusStyleMap[status]) {
    return <div className={cn('text-xs leading-4 font-medium', className)}>{text}</div>;
  }

  const { bg, icon: Icon } = statusStyleMap[status];

  return (
    <div className={cn('inline-block', className)}>
      <div className={cn('flex items-center gap-1 rounded-2xl px-2 py-0.5', bg)}>
        <Icon className="size-2.5 text-white" />
        <div className="text-xs leading-4 font-medium text-white">{text}</div>
      </div>
    </div>
  );
}
