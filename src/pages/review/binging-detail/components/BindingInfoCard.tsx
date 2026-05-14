import { BindingReviewDetailRes } from '@/api/hooks/review';
import { InfoItem } from '@/components/common/InfoItem';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhCard } from '@/components/common/RrhCard';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const BindingInfoCard: FC<{
  data: BindingReviewDetailRes['data'];
}> = ({ data }) => {
  const Info = data.detail;

  const { t } = useTranslation();

  const accountInfo = useMemo(() => {
    return [
      {
        label: 'table.fullName',
        value: `${Info.userLastName} ${Info.userName}`,
      },
      {
        label: 'table.userShowId',
        value: Info.userShowId,
      },
    ];
  }, [Info]);

  const otherInfo = useMemo(() => {
    return [
      {
        label: 'common.type',
        value: Info.serverProperty,
      },
      {
        label: 'common.server',
        value: Info.aliasName,
      },
      {
        label: 'table.tradingAccount',
        value: Info.login,
      },
      {
        label: 'table.remarks',
        value: Info.remark || '-',
      },
    ];
  }, [Info]);

  return (
    <RrhCard title={t('binding.bindingInfo')} className="flex-1 md:px-10 md:py-6">
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
            {t('binding.bindingInfo')}
          </h2>
          {otherInfo.map(item => (
            <LabelItem label={t(item.label)} ContentDom={<InfoItem info={item.value || '-'} />} />
          ))}
        </div>
      </div>
    </RrhCard>
  );
};
