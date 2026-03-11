import { LeverageReviewDetailRes } from '@/api/hooks/review';
import { RrhCard } from '@/components/common/RrhCard';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const LeverageInfoCard: FC<{
  depositData: LeverageReviewDetailRes['data'];
}> = ({ depositData }) => {
  const depositInfo = depositData.detail;

  const { t } = useTranslation();

  const accountInfo = useMemo(() => {
    return [
      {
        label: 'table.fullName',
        value: `${depositInfo.userLastName} ${depositInfo.userName}`,
      },
      {
        label: 'table.userShowId',
        value: depositInfo.userShowId,
      },
    ];
  }, [depositInfo]);

  const otherInfo = useMemo(() => {
    return [
      {
        label: 'table.fullName',
        value: depositInfo.aliasName,
      },
      {
        label: 'table.userShowId',
        value: depositInfo.login,
      },
      {
        label: 'table.fullName',
        value: `1:${depositInfo.currentLever}`,
      },
      {
        label: 'table.userShowId',
        value: `1:${depositInfo.targetLever}`,
      },
    ];
  }, [depositInfo]);

  return (
    <RrhCard title={t('review.leverage.leverageInfo')} className="flex-1 md:px-10 md:py-6">
      <div className="max-w-125">
        <div>
          <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
            {t('table.accountInformation')}
          </h2>
          {accountInfo.map(item => (
            <div key={item.label} className="flex flex-col gap-2 py-3">
              <label className="text-sm font-medium">{t(item.label)}</label>
              <div className="text-muted-foreground flex items-center gap-3">
                <span>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
            {t('review.leverage.accountInfo')}
          </h2>
          {otherInfo.map(item => (
            <div key={item.label} className="flex flex-col gap-2 py-3">
              <label className="text-sm font-medium">{t(item.label)}</label>
              <div className="text-muted-foreground flex items-center gap-3">
                <span>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RrhCard>
  );
};
