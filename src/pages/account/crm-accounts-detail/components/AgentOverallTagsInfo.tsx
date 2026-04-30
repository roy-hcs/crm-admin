import { TagProgress } from '@/api/hooks/system';
import { cn, formatMoneyNumber } from '@/lib/utils';
import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

const TagContainer: FC<PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'bg-accent flex items-center justify-between gap-6 rounded-lg px-5 py-1.5',
        className,
      )}
    >
      {children}
    </div>
  );
};
export const AgentOverallTagsInfo = ({
  tagProgress,
  totalRebate,
}: {
  tagProgress: TagProgress;
  totalRebate: number;
}) => {
  const { t } = useTranslation();
  const kycStatusText = (status: number | null) => {
    switch (status) {
      case 0:
        return t('CRMAccountPage.kycVerifyStatus.2');
      case -1:
        return t('CRMAccountPage.kycVerifyStatus.1');
      case 1:
        return t('CRMAccountPage.kycVerifyStatus.3');
      default:
        return t('CRMAccountPage.kycVerifyStatus.0');
    }
  };
  const tagInfo = [
    [
      {
        label: t('accountOpening.KYCInfo'),
        value: kycStatusText(tagProgress.kycStatus),
      },
    ],
    [
      {
        label: t('table.realAccountNumber'),
        value: tagProgress.liveAccount || 0,
      },
      {
        label: t('table.demoAccountNumber'),
        value: tagProgress.demoAccount || 0,
      },
    ],
    [
      {
        label: t('customerTracking.depositFirstStr'),
        value: formatMoneyNumber(tagProgress.firstDeposit || 0),
      },
    ],
    [
      {
        label: t('customerTracking.depositTotalStr'),
        value: formatMoneyNumber(tagProgress.totalDeposit || 0),
      },
      {
        label: t('customerTracking.withdrawTotalStr'),
        value: formatMoneyNumber(tagProgress.totalWithdraw || 0),
      },
      {
        label: t('customerTracking.netTotalStr'),
        value: formatMoneyNumber(tagProgress.net || 0),
      },
    ],
    [
      {
        label: t('table.totalRebate'),
        value: formatMoneyNumber(totalRebate),
      },
    ],
  ];
  return (
    <div className="bg-background flex gap-4 rounded-2xl p-4">
      {tagInfo.map((group, index) => (
        <TagContainer key={index}>
          {group.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="text-muted-foreground text-sm">{item.label}</div>
              <div className="text-lg font-semibold">{item.value}</div>
            </div>
          ))}
        </TagContainer>
      ))}
    </div>
  );
};
