import { RewardRecordReviewDetailRes } from '@/api/hooks/marketing';
import { useDictType } from '@/api/hooks/system';
import { InfoItem } from '@/components/common/InfoItem';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhCard } from '@/components/common/RrhCard';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const RewardRecordsInfoCard: FC<{
  data: RewardRecordReviewDetailRes['data'];
}> = ({ data }) => {
  const { data: bonusDictType } = useDictType('sys_bonus_business_type');
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
    const bonusTypeStr = bonusDictType?.find(
      item => item.dictValue === String(Info.businessType),
    )?.dictLabel;
    return [
      {
        label: 'rewardRecords.rewardAccount',
        value: Info.aliasName || '-',
      },
      {
        label: 'common.createTime',
        value: Info.subTime,
      },
      {
        label: 'table.triggerBusiness',
        value: bonusTypeStr || '-',
      },
      {
        label: 'rewardRecords.hitActivity',
        value: Info.hitActivity || '-',
      },

      {
        label: 'table.rewardType',
        value: Info.rewardTypeStr || '-',
      },

      {
        label: 'table.amount',
        value: (Info.rewardAmount || 0).toFixed(2) + (Info.rewardAmountUnit || ''),
      },

      {
        label: 'rewardRecords.rewardSubject',
        value: Info.referredUserName || '-',
      },
    ];
  }, [Info, bonusDictType]);

  return (
    <RrhCard className="flex-1 md:px-10 md:py-6">
      <div className="max-w-125">
        <div>
          <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
            {t('table.accountInformation')}
          </h2>
          {accountInfo.map((item, index) => (
            <LabelItem
              key={`${item.label}-${index}`}
              label={t(item.label)}
              ContentDom={<InfoItem info={item.value || '-'} />}
            />
          ))}
        </div>
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
