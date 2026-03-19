import { RebateReviewDetailRes } from '@/api/hooks/review';
import { RrhCard } from '@/components/common/RrhCard';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const TradingRebateInfoCard: FC<{
  data: RebateReviewDetailRes['data'];
}> = ({ data }) => {
  const Info = data.detail;

  const { t } = useTranslation();

  const accountInfo = useMemo(() => {
    return [
      {
        label: 'table.server',
        value: Info.serverName || '-',
      },
      {
        label: 'table.traderAccount',
        value: Info.trderAccount || '-',
      },
      {
        label: 'table.tradingOrderNumber',
        value: Info.ticket || '-',
      },
      {
        label: 'table.symbol',
        value: Info.taderType || '-',
      },
      {
        label: 'table.volume',
        value: Info.volume || '-',
      },
      {
        label: 'table.tradingTime',
        value: Info.traderTime || '-',
      },
      {
        label: 'table.rebateAmount',
        value: Info.totalAmtText || '-',
      },
      {
        label: 'table.rebateUser',
        value: Info.rebateUser || '-',
      },
      {
        label: 'table.orderNumber',
        value: Info.id || '-',
      },
      {
        label: 'table.targetRule',
        value: Info.rebateTraderRuleId || '-',
      },
      {
        label: 'table.commissionAccount',
        value: Info.commissionBase || '-',
      },
    ];
  }, [Info]);

  return (
    <RrhCard title={t('tradingRebateReview.reviewInfo')} className="flex-1 md:px-10 md:py-6">
      <div className="max-w-125">
        <div>
          <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
            {t('tradingRebateReview.rebateInfo')}
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
      </div>
    </RrhCard>
  );
};
