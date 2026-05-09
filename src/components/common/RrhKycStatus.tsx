import { cn } from '@/lib/utils';
import { CircleCheck, CircleX, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type KycStatus = 2 | -1 | 1 | 0 | -2; // 2:审核中 -1:待审核 1:通过 0:拒绝 -2:未提交

export const kycStatusBgClassMap: Record<KycStatus, string> = {
  2: 'bg-amber-500',
  [-1]: 'bg-blue-600',
  1: 'bg-green-600',
  0: 'bg-red-500',
  [-2]: 'bg-gray-500',
};

export const kycStatusTextMap: Record<KycStatus, string> = {
  2: 'accountOpening.kycVerifyStatus.2',
  [-1]: 'accountOpening.kycVerifyStatus.-1',
  1: 'accountOpening.kycVerifyStatus.1',
  0: 'accountOpening.kycVerifyStatus.0',
  [-2]: 'accountOpening.kycVerifyStatus.-2',
};

export const toKycStatus = (status?: number | null): KycStatus => {
  if (status === 2 || status === -1 || status === 1 || status === 0 || status === -2) {
    return status;
  }
  return -2;
};

export const getKycStatusBgClass = (status?: number | null) => {
  return kycStatusBgClassMap[toKycStatus(status)];
};

type RrhKycStatusProps = {
  status?: KycStatus;
  className?: string;
};

const statusStyleMap: Record<
  KycStatus,
  {
    bg: string;
    icon: typeof CircleCheck;
  }
> = {
  2: {
    bg: kycStatusBgClassMap[2],
    icon: Loader,
  },
  [-1]: {
    bg: kycStatusBgClassMap[-1],
    icon: Loader,
  },
  1: {
    bg: kycStatusBgClassMap[1],
    icon: CircleCheck,
  },
  0: {
    bg: kycStatusBgClassMap[0],
    icon: CircleX,
  },
  [-2]: {
    bg: kycStatusBgClassMap[-2],
    icon: Loader,
  },
};

export function RrhKycStatus({ status, className }: RrhKycStatusProps) {
  const { t } = useTranslation();

  if (status === undefined || !statusStyleMap[status]) {
    return <div className={cn('text-xs leading-4 font-medium', className)}>-</div>;
  }

  const { bg, icon: Icon } = statusStyleMap[status];

  return (
    <div className={cn('inline-block', className)}>
      <div className={cn('flex items-center gap-1 rounded-2xl px-2 py-0.5', bg)}>
        <Icon className="size-2.5 text-white" />
        <div className="text-xs leading-4 font-medium text-white">
          {t(`${kycStatusTextMap[status]}`)}
        </div>
      </div>
    </div>
  );
}
