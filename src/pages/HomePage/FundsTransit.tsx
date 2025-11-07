import { useDepositAllReport } from '@/api/hooks/workbench';
import { BarChart } from '@/components/charts/BarCharts';
import { LegendHeader } from '@/components/charts/LegendHeader';
import { RrhSelect } from '@/components/common/RrhSelect';
import { DEFAULT_TIME_RANGE, timeRangeOptions, TimeRangeType } from '@/lib/const';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const FundsTransit: FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRangeType>(DEFAULT_TIME_RANGE);
  const { data, isLoading } = useDepositAllReport(timeRange);
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('home.AuditedWithdrawalAll'),
        data: dataArr.map(item => item?.[1] || 0),
      },
      {
        label: t('home.PendingWithdrawalAll'),
        data: dataArr.map(item => item?.[0] || 0),
      },
    ];
    return { labels, datasets };
  }, [data, t]);
  const reviewData = useMemo(() => {
    if (!data || !data?.data) return { AuditedDepositToday: 0, PendingDepositToday: 0 };
    const rowData = data.data;
    const lastKey = Object.keys(rowData).pop() || '';
    const lastData = rowData[lastKey] || [];
    return {
      AuditedDepositToday: lastData?.[1] || 0,
      PendingDepositToday: lastData?.[0] || 0,
    };
  }, [data]);
  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-6">
          <h2 className="text-xl leading-6 font-semibold">{t('home.InTransitFunds')}</h2>
        </div>
        <div>
          <RrhSelect
            options={timeRangeOptions}
            showRowValue={false}
            showi18nLabel={true}
            className="w-40"
            value={timeRange}
            onValueChange={val => setTimeRange(val as TimeRangeType)}
          />
        </div>
      </div>
      <div className="mt-6.5 mb-9 flex gap-20 px-6">
        <LegendHeader
          label={t('home.AuditedDepositToday')}
          value={reviewData.AuditedDepositToday}
        />
        <LegendHeader
          label={t('home.PendingDepositToday')}
          value={reviewData.PendingDepositToday}
        />
      </div>
      <div className="min-h-75">
        {isLoading ? (
          <div>{t('common.loading')}</div>
        ) : (
          <BarChart
            labels={chartData?.labels || []}
            datasets={chartData?.datasets || []}
            title=""
            hideLegend={true}
            options={{
              responsive: true,
              scales: {
                x: {
                  stacked: true,
                  ticks: {
                    maxTicksLimit: 7, // Limit the number of ticks shown
                    autoSkip: true, // Enable automatic skipping of labels
                    maxRotation: 45, // Rotate labels if needed
                    minRotation: 0,
                  },
                  grid: {
                    display: true,
                  },
                },
                y: {
                  stacked: true,
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};
