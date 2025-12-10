import { useRegCountReport } from '@/api/hooks/workbench';
import { LegendHeader } from '@/components/charts/LegendHeader';
import { LineChart } from '@/components/charts/LineCharts';
import { RrhSelect } from '@/components/common/RrhSelect';
import { DEFAULT_TIME_RANGE, timeRangeOptions, TimeRangeType } from '@/lib/const';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AccountActivation = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRangeType>(DEFAULT_TIME_RANGE);
  const { data, isLoading } = useRegCountReport(timeRange);

  const lineChart = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);

    const withdrawal = dataArr.map(i => i?.[1]);
    const deposit = dataArr.map(i => i?.[0]);
    const netFlow = dataArr.map(i => i?.[2]);

    return {
      labels,
      datasets: [
        {
          label: t('home.NewCRMUser'),
          data: deposit,
          borderColor: '#0D9488',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointStyle: 'circle',
          pointBackgroundColor: '#0D9488',
        },
        {
          label: t('home.NewRealAccount'),
          data: withdrawal,
          borderColor: '#EA580C',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointStyle: 'circle',
          pointBackgroundColor: '#EA580C',
        },
        {
          label: t('home.NewDemoAccount'),
          data: netFlow,
          borderColor: '#FF4D4F',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointStyle: 'circle',
          pointBackgroundColor: '#FF4D4F',
        },
      ],
    };
  }, [data, t]);

  const todayData = useMemo(() => {
    if (!data || !data?.data) return { crm: 0, real: 0, demo: 0 };
    const rowData = data.data;
    /**
     * 取最后一天的数据
     * rowData 结构：{ '2023-10-01': [realCount, crmCount, demoCount], ... }
     */
    const lastKey = Object.keys(rowData).pop() || '';
    const lastData = rowData[lastKey] || [];
    return {
      crm: lastData?.[1] || 0,
      real: lastData?.[0] || 0,
      demo: lastData?.[2] || 0,
    };
  }, [data]);

  return (
    <div className="bg-card rounded-lg p-3 shadow-xs lg:p-6">
      <div className="flex items-center justify-between">
        <div className="text-card-foreground text-lg leading-7 font-semibold">
          {t('home.AccountOverview')}
        </div>
        <div>
          <RrhSelect
            options={timeRangeOptions}
            showRowValue={false}
            showi18nLabel={true}
            className="px-3 py-2"
            value={timeRange}
            onValueChange={val => setTimeRange(val as TimeRangeType)}
          />
        </div>
      </div>
      <div className="mt-2 mb-2 flex lg:mt-6 lg:mb-6">
        <div className="flex-1">
          <LegendHeader label={t('home.NewCRMUser')} value={todayData.crm} />
        </div>
        <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
        <div className="flex-1">
          <LegendHeader label={t('home.NewRealAccount')} value={todayData.real} />
        </div>
        <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
        <div className="flex-1">
          <LegendHeader label={t('home.NewDemoAccount')} value={todayData.demo} />
        </div>
      </div>
      <div>
        {isLoading ? <div>{t('common.loading')}</div> : <LineChart lineChartProps={lineChart} />}
      </div>
    </div>
  );
};
