import { NetBonusRewardRecordReviewDetailRes } from '@/api/hooks/marketing';
import { InfoItem } from '@/components/common/InfoItem';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhCard } from '@/components/common/RrhCard';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const NetBonusRewardRecordsInfoCard: FC<{
  data: NetBonusRewardRecordReviewDetailRes['data'];
}> = ({ data }) => {
  const Info = data.detail;

  const { t } = useTranslation();

  const otherInfo = useMemo(() => {
    return [
      {
        label: 'table.orderNumber',
        value: Info.orderNo || '-',
      },
      {
        label: 'rewardRecords.rewardTarget',
        value: `${Info.bonusUserName}(${Info.bonusUserShowId})`,
      },
      {
        label: 'customerTracking.statisticMonthStr',
        value: Info.bonusMonthStr || '-',
      },
      {
        label: 'table.rewardParams',
        value: `${(Info.rewardParam || 0).toFixed(2)}%`,
      },
      {
        label: 'rewardRecords.amount',
        value: `${(Info.bonusAmount || 0).toFixed(2)} USD`,
      },
      {
        label: 'table.actualDisbursedAmount',
        value: `${(Info.actualAmount || 0).toFixed(2)} USD`,
      },
      {
        label: 'table.paymentAccount',
        value: Info.accountName || '-',
      },
      {
        label: 'common.createTime',
        value: Info.createTime || '-',
      },
    ];
  }, [Info]);

  return (
    <RrhCard className="flex-1 md:px-10 md:py-6">
      <div className="max-w-125">
        <div>
          <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
            {t('rewardRecords.rewardInfo')}
          </h2>
          {otherInfo.map((item, index) => (
            <LabelItem
              key={`${item.label}-${index}`}
              label={t(item.label)}
              ContentDom={<InfoItem info={item.value || '-'} />}
            />
          ))}
        </div>
      </div>
    </RrhCard>
  );
};
