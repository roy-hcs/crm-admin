import { useDepositAllReport } from '@/api/hooks/workbench';
import { LegendHeader } from '@/components/charts/LegendHeader';
import { RrhSelect } from '@/components/common/RrhSelect';
import { DEFAULT_TIME_RANGE, timeRangeOptions, TimeRangeType } from '@/lib/const';
import { FC, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getCssVar } from '@/lib/utils';
import { BarChart } from '@/components/charts/BarCharts';

export const FundsTransit: FC = () => {
  const [legendColor, setLegendColor] = useState(() => getCssVar('--card-foreground', '#0a0a0a'));
  const [borderColor, setBorderColor] = useState(() => getCssVar('--border', '#E1E3EA'));

  const options = {
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          color: legendColor,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: { display: false },
      },
      y: {
        grid: {
          display: true,
          color: borderColor,
          lineWidth: 1,
        },
        border: { display: false },
      },
    },
  };
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRangeType>(DEFAULT_TIME_RANGE);
  const { data, isLoading } = useDepositAllReport(timeRange);

  useEffect(() => {
    const handler = () => {
      setLegendColor(getCssVar('--card-foreground', '#0a0a0a'));
      setBorderColor(getCssVar('--border', '#E1E3EA'));
    };
    window.addEventListener('themechange', handler as EventListener);
    return () => window.removeEventListener('themechange', handler as EventListener);
  }, []);

  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };

    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('home.AuditedWithdrawalAll'),
        data: dataArr.map(item => item?.[1] || 0),
        backgroundColor: '#3E97FF',
        borderRadius: 4,
        pointStyle: 'circle',
        pointRadius: 6,
      },
      {
        label: t('home.PendingWithdrawalAll'),
        data: dataArr.map(item => item?.[0] || 0),
        backgroundColor: '#27AE60',
        borderRadius: 4,
        pointStyle: 'circle',
        pointRadius: 6,
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
    <div className="bg-card flex flex-col rounded-lg p-3 shadow-xs lg:p-6">
      <div className="flex items-center justify-between">
        <div className="text-card-foreground text-lg leading-7 font-semibold">
          {t('home.InTransitFunds')}
        </div>
        <div>
          <RrhSelect
            options={timeRangeOptions}
            showRowValue={false}
            showI18nLabel={true}
            className="px-3 py-2"
            value={timeRange}
            onValueChange={val => setTimeRange(val as TimeRangeType)}
          />
        </div>
      </div>
      <div className="mt-2 flex lg:mt-6">
        <div className="flex-1">
          <LegendHeader
            label={t('home.AuditedDepositToday')}
            value={reviewData.AuditedDepositToday}
          />
        </div>
        <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
        <div className="flex-1">
          <LegendHeader
            label={t('home.PendingDepositToday')}
            value={reviewData.PendingDepositToday}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end">
        <div className="h-80 w-full">
          {isLoading ? (
            <div>{t('common.loading')}</div>
          ) : (
            <BarChart
              options={options}
              labels={chartData.labels}
              datasets={chartData.datasets}
              hideLegend={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};
