import { PerformanceFeeRebateDetailRes } from '@/api/hooks/copyTrading/type';
import { InfoItem } from '@/components/common/InfoItem';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhCard } from '@/components/common/RrhCard';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { statusOptions } from '../../performance-fee-rebate/verify/data';

export const PerformanceVerifyInfoCard: FC<{
  data: PerformanceFeeRebateDetailRes['data'];
}> = ({ data }) => {
  const depositInfo = data.detail;

  const { t } = useTranslation();

  const formatAmount = (value: number | null | undefined, currency?: string | null) => {
    if (value === null || value === undefined) {
      return '-';
    }
    const amount = Number(value).toFixed(6);
    return currency ? `${amount} ${currency}` : amount;
  };

  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return '-';
    }
    return `${Number(value).toFixed(6)}%`;
  };

  const verifyStatus = useMemo(() => {
    const target = statusOptions.find(item => String(item.value) === String(depositInfo.status));
    return target?.label ? t(target.label) : '-';
  }, [depositInfo.status, t]);

  const textValue = (value?: string | null) => value || '-';

  const multilineValue = (values: Array<string | null | undefined>) => {
    const validValues = values.filter(Boolean) as string[];
    return validValues.length ? validValues : ['-'];
  };

  const accountInfo = useMemo(() => {
    return [
      {
        label: 'table.orderNumber',
        value: textValue(depositInfo.orderNo),
      },
      {
        label: 'performanceFeeRebatePage.performanceFeeOrderNo',
        value: textValue(depositInfo.performanceFeeOrderNo),
      },
      {
        label: 'signals.name',
        value: '',
        multiValue: multilineValue([
          depositInfo.signalSourceName,
          [depositInfo.traderServer, depositInfo.trader].filter(Boolean).join('-'),
        ]),
      },
      {
        label: 'performanceFeeRebatePage.signalSourceAuthor',
        value: '',
        multiValue: multilineValue([depositInfo.signalSourceOwner, depositInfo.signalSourceEmail]),
      },
      {
        label: 'performanceFeeRebatePage.subscriber',
        value: '',
        multiValue: multilineValue([depositInfo.userName, depositInfo.clientShowId]),
      },
      {
        label: 'table.subscriberAccount',
        value: '',
        multiValue: multilineValue([depositInfo.clientServer, depositInfo.client]),
      },
      {
        label: 'table.netPerformanceFee',
        value: formatAmount(depositInfo.netPerformanceFee, depositInfo.currency),
      },
      {
        label: 'table.baseRebateRatio',
        value: formatPercent(depositInfo.baseRebateRatio),
      },
      {
        label: 'performanceFeeRebatePage.rebateAmount',
        value: formatAmount(depositInfo.rebateAmount, depositInfo.currency),
      },
      {
        label: 'table.extraRebateRatio',
        value: formatPercent(depositInfo.extraRebateRatio),
      },
      {
        label: 'common.createTime',
        value: textValue(depositInfo.createTime),
      },
      {
        label: 'table.reviewStatus',
        value: verifyStatus,
      },
      {
        label: 'performanceFeeRebatePage.reviewTime',
        value: textValue(depositInfo.verifyTime),
      },
      {
        label: 'performanceFeeRebatePage.payAccount',
        value: textValue(depositInfo.payAccountName || depositInfo.payAccount),
      },
      {
        label: 'table.remarks',
        value: textValue(depositInfo.verifyRemark || depositInfo.remark),
      },
    ];
  }, [depositInfo, verifyStatus]);

  return (
    <RrhCard className="flex-1 md:px-10 md:py-6">
      <div className="max-w-125">
        {accountInfo.map((item, index) => (
          <LabelItem
            key={item.label + index}
            label={t(item.label)}
            ContentDom={
              item.multiValue ? (
                <div className="text-muted-foreground text-sm">
                  {item.multiValue.map((line, lineIndex) => (
                    <div key={line + lineIndex}>{line}</div>
                  ))}
                </div>
              ) : (
                <InfoItem info={item.value} />
              )
            }
          />
        ))}
      </div>
    </RrhCard>
  );
};
