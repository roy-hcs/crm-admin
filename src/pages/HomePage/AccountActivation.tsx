import { useRegCountReport } from '@/api/hooks/system/system';
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
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('home.NewCRMUser'),
        data: dataArr.map(item => item?.[1] || 0),
      },
      {
        label: t('home.NewRealAccount'),
        data: dataArr.map(item => item?.[0] || 0),
      },
      {
        label: t('home.NewDemoAccount'),
        data: dataArr.map(item => item?.[2] || 0),
      },
    ];
    return { labels, datasets };
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
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-6">
          <h2 className="text-xl leading-6 font-semibold">{t('home.AccountOverview')}</h2>
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
        <LegendHeader label={t('home.NewCRMUser')} value={todayData.crm} />
        <LegendHeader label={t('home.NewRealAccount')} value={todayData.real} />
        <LegendHeader label={t('home.NewDemoAccount')} value={todayData.demo} />
      </div>
      <div className="min-h-75">
        {isLoading ? (
          <div>{t('common.loading')}</div>
        ) : (
          <LineChart labels={chartData?.labels || []} datasets={chartData?.datasets || []} />
        )}
      </div>
    </div>
  );
};
