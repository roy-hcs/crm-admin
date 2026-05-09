import { LeverageReviewDetailRes } from '@/api/hooks/review';
import { InfoItem } from '@/components/common/InfoItem';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhCard } from '@/components/common/RrhCard';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const LeverageInfoCard: FC<{
  data: LeverageReviewDetailRes['data'];
}> = ({ data }) => {
  const depositInfo = data.detail;

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
        label: 'common.server',
        value: depositInfo.aliasName,
      },
      {
        label: 'table.login',
        value: depositInfo.login,
      },
      {
        label: 'leverage.currentLever',
        value: depositInfo.currentLever ? `1:${depositInfo.currentLever}` : '-',
      },
      {
        label: 'leverage.targetLever',
        value: depositInfo.targetLever ? `1:${depositInfo.targetLever}` : '-',
      },
    ];
  }, [depositInfo]);

  return (
    <RrhCard title={t('leverage.leverageInfo')} className="flex-1 md:px-10 md:py-6">
      <div className="max-w-125">
        <div>
          <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
            {t('table.accountInformation')}
          </h2>
          {accountInfo.map(item => (
            <LabelItem label={t(item.label)} ContentDom={<InfoItem info={item.value || '-'} />} />
          ))}
        </div>
        <div>
          <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
            {t('leverage.accountInfo')}
          </h2>
          {otherInfo.map(item => (
            <LabelItem label={t(item.label)} ContentDom={<InfoItem info={item.value || '-'} />} />
          ))}
        </div>
      </div>
    </RrhCard>
  );
};
