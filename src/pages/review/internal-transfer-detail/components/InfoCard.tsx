import { InternalTransferReviewDetailRes } from '@/api/hooks/review';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhInputWithUnit } from '@/components/common/RrhInputWithUnit';
import { FormField } from '@/components/ui/form';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LabelItem } from '@/components/common/LabelItem';

export const InfoCard: FC<{
  detailData: InternalTransferReviewDetailRes['data'];
  isAudit: boolean;
}> = ({ detailData, isAudit }) => {
  const detailInfo = detailData.detail;

  const { t } = useTranslation();

  const Info = useMemo(() => {
    return [
      {
        label: 'table.fullName',
        value: `${detailInfo.userLastName} ${detailInfo.userName}`,
      },
      {
        label: 'table.userShowId',
        value: detailInfo.userShowId,
      },
    ];
  }, [detailInfo]);

  const InfoTwo = useMemo(() => {
    return [
      {
        label: 'table.transferOutAccount',
        value: `${detailInfo.aliasName} / ${detailInfo.outAccount}`,
      },
      {
        label: 'table.transferInAccount',
        value: `${detailInfo.aliasName} / ${detailInfo.inAccount}`,
      },
    ];
  }, [detailInfo]);

  return (
    <RrhCard
      title={t('internalTransferReview.internalTransferReviewInfo')}
      className="flex-1 md:px-10 md:py-6"
    >
      <div className="max-w-125">
        <div>
          <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
            {t('table.accountInformation')}
          </h2>

          {Info.map(item => (
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
            {t('internalTransferReview.internalTransferInfo')}
          </h2>

          {InfoTwo.map(item => (
            <div key={item.label} className="flex flex-col gap-2 py-3">
              <label className="text-sm font-medium">{t(item.label)}</label>
              <div className="text-muted-foreground flex items-center gap-3">
                <span>{item.value}</span>
              </div>
            </div>
          ))}

          <FormField
            name="outMoney"
            render={({ field }) => (
              <LabelItem
                label={t('table.transferOutAmount')}
                ContentDom={
                  <RrhInputWithUnit
                    unit={detailInfo.outUnit}
                    value={field.value || 0}
                    disabled={true}
                  />
                }
              />
            )}
          />
          <FormField
            name="inMoney"
            render={({ field }) => (
              <LabelItem
                label={t('table.transferInAmount')}
                ContentDom={
                  <RrhInputWithUnit
                    unit={detailInfo.inUnit}
                    value={field.value || 0}
                    disabled={true}
                  />
                }
              />
            )}
          />

          <FormField
            name="rate"
            render={({ field }) => (
              <LabelItem
                label={t('common.exchangeRate')}
                ContentDom={
                  <RrhInputWithUnit
                    unit={detailInfo.currencyPair}
                    disabled={!isAudit}
                    value={field.value}
                    onChange={field.onChange}
                  />
                }
              />
            )}
          />
        </div>
      </div>
    </RrhCard>
  );
};
