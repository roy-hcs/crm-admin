import { useGetAccountHistory } from '@/api/hooks/copyTrading';
import { LegendHeader } from '@/components/charts/LegendHeader';
import { LineChart } from '@/components/charts/LineCharts';
import { RrhSelect } from '@/components/common/RrhSelect';
import { timeRangeOptionsSecondary } from '@/lib/const';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const NetWorthBalance = ({ serverId, account }: { serverId: string; account: string }) => {
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
    const labels = rowData?.map(i => String(i.statisticsDate));
    const equity = rowData.map(i => i?.equity);
    const balance = rowData.map(i => i?.balance);

    return {
      labels,
      datasets: [
        {
          label: t('signals.netWorthBalanceOptions.1'),
          data: equity,
          borderColor: '#0D9488',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointStyle: 'circle',
          pointBackgroundColor: '#0D9488',
        },
        {
          label: t('signals.netWorthBalanceOptions.2'),
          data: balance,
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
    if (!data || !data?.data)
      return {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };
    const rowData = data.data;
    const lastData = rowData[rowData.length - 1] || [];
    return {
      1: lastData?.equity || 0,
      2: lastData?.balance || 0,
      3: lastData?.margin || 0,
      4: lastData?.marginFree || 0,
      5: lastData?.marginLevel || 0,
    };
  }, [data]);

  return (
    <div className="bg-card rounded-lg p-3 shadow-xs lg:p-6">
      <div className="flex items-center justify-between">
        <div className="text-card-foreground text-lg leading-7 font-semibold">
          {t('signals.chartOptions.3')}
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
      <div className="mt-2 mb-2 flex lg:mt-6 lg:mb-6">
        <div className="flex-1">
          <LegendHeader label={t('signals.netWorthBalanceOptions.1')} value={todayData[1]} />
        </div>
        <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
        <div className="flex-1">
          <LegendHeader label={t('signals.netWorthBalanceOptions.2')} value={todayData[2]} />
        </div>
        <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
        <div className="flex-1">
          <LegendHeader label={t('signals.netWorthBalanceOptions.3')} value={todayData[3]} />
        </div>
        <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
        <div className="flex-1">
          <LegendHeader label={t('signals.netWorthBalanceOptions.3')} value={todayData[4]} />
        </div>
        <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
        <div className="flex-1">
          <LegendHeader label={t('signals.netWorthBalanceOptions.4')} value={todayData[5]} />
        </div>
      </div>
      <div>
        {isLoading ? <div>{t('common.loading')}</div> : <LineChart lineChartProps={lineChart} />}
      </div>
    </div>
  );
};
