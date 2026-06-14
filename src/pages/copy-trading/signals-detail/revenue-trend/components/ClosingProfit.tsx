import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhSelect } from '@/components/common/RrhSelect';
import { timeRangeOptionsSecondary } from '@/lib/const';
import { LineChart } from '@/components/charts/LineCharts';
import { useGetAccountHistory } from '@/api/hooks/copyTrading';

export const ClosingProfit = ({ serverId, account }: { serverId: string; account: string }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('30');
  const { data, isLoading } = useGetAccountHistory({
    serverId: serverId,
    account: account,
    stime: timeRange,
  });

  const lineChart = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = rowData.map(i => String(i.statisticsDate));
    const profit180d = rowData.map(i => i?.profit180d);

    return {
      labels,
      datasets: [
        {
          label: t('signals.chartOptions.1'),
          data: profit180d,
          borderColor: '#0D9488',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointStyle: 'circle',
          pointBackgroundColor: '#0D9488',
        },
      ],
    };
  }, [data, t]);

  return (
    <div className="bg-card flex flex-col justify-between rounded-lg p-3 shadow-xs lg:p-6">
      <div className="flex items-start justify-between">
        <div className="text-card-foreground text-lg leading-7 font-semibold">
          {t('signals.chartOptions.2')}
        </div>
        <div>
          <RrhSelect
            options={timeRangeOptionsSecondary}
            showRowValue={false}
            showI18nLabel={true}
            className="px-3 py-2"
            value={timeRange}
            onValueChange={val => setTimeRange(val)}
          />
        </div>
      </div>
      <div>
        {isLoading ? <div>{t('common.loading')}</div> : <LineChart lineChartProps={lineChart} />}
      </div>
    </div>
  );
};
