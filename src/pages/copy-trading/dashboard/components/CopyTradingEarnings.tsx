import { useGetEstimatedFee } from '@/api/hooks/copyTrading';
import { LegendHeader } from '@/components/charts/LegendHeader';
import { LineChart } from '@/components/charts/LineCharts';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const CopyTradingEarnings = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetEstimatedFee();

  const lineChart = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const dataArr = Object.values(rowData);
    const labels = rowData.map(i => i.createTime);

    const estimatedSubscribeFee = dataArr.map(i => i.subscribeFee || 0);
    const estimatedManagementFee = dataArr.map(i => i.managementFee || 0);

    return {
      labels: labels,
      datasets: [
        {
          label: t('dashboard.estimatedSubscribeFee'),
          data: estimatedSubscribeFee,
          borderColor: '#0D9488',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointStyle: 'circle',
          pointBackgroundColor: '#0D9488',
        },
        {
          label: t('dashboard.estimatedManagementFee'),
          data: estimatedManagementFee,
          borderColor: '#EA580C',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointStyle: 'circle',
          pointBackgroundColor: '#EA580C',
        },
      ],
    };
  }, [data, t]);

  const todayData = useMemo(() => {
    if (!data || !data?.data) return { orderCount: 0, managementFee: 0, subscribeFee: 0 };
    const rowData = data.data;
    const lastData = Object.values(rowData)?.[Object.values(rowData)?.length - 1];
    return {
      orderCount: Number(lastData?.orderCount || 0),
      managementFee: Number(lastData?.managementFee || 0),
      subscribeFee: Number(lastData?.subscribeFee || 0),
    };
  }, [data]);

  return (
    <div className="bg-card rounded-lg p-3 shadow-xs lg:p-6">
      <div className="text-card-foreground text-lg leading-7 font-semibold">
        {t('dashboard.copyTradingEarnings')}
      </div>
      <div className="mt-2 mb-2 flex lg:mt-6 lg:mb-6">
        <div className="flex-1">
          <LegendHeader label={t('dashboard.todayOrders')} value={todayData.orderCount} />
        </div>
        <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
        <div className="flex-1">
          <LegendHeader
            label={t('dashboard.todayEstimatedSubscribeFee')}
            value={todayData.subscribeFee}
          />
        </div>
        <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
        <div className="flex-1">
          <LegendHeader
            label={t('dashboard.todayEstimatedManagementFee')}
            value={todayData.managementFee}
          />
        </div>
      </div>
      <div>
        {isLoading ? <div>{t('common.loading')}</div> : <LineChart lineChartProps={lineChart} />}
      </div>
    </div>
  );
};
