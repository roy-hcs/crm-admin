import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhSelect } from '@/components/common/RrhSelect';
import { timeRangeOptionsSecondary } from '@/lib/const';
import { PieChart } from '@/components/charts/PieCharts';
import { useMapReportSymbolReport } from '@/api/hooks/copyTrading';

interface PieData {
  labels: string[];
  datasets: { label: string; data: number[] }[];
}
export const OverviewTradingVarieties = ({
  serverId,
  login,
}: {
  serverId: string;
  login: string;
}) => {
  const { t } = useTranslation();

  const [timeRange, setTimeRange] = useState('30');

  const { data, isLoading } = useMapReportSymbolReport({
    stime: timeRange,
    serverId,
    login,
    isAsc: 'asc',
    pageNum: 'NaN',
    orderByColumn: '',
  });

  const pieData: PieData | null = useMemo(() => {
    const list = data?.rows || [];
    if (!list.length) return null;
    const labels = list.map(item => item.symbol || '');
    const values = list.map(item => Number(item.volume ?? 0));
    // 如果全部为 0，可选择返回 null 作为无数据
    if (values.every(v => v === 0)) return null;
    return {
      labels,
      datasets: [
        {
          label: t('home.TradingVolume'),
          data: values,
        },
      ],
    };
  }, [data, t]);

  return (
    <div className="bg-card rounded-lg p-2 shadow-xs lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-1.5 lg:flex-nowrap">
        <div className="text-card-foreground text-lg leading-7 font-semibold">
          {t('home.TradingPairOverview')}
        </div>
        <RrhSelect
          options={timeRangeOptionsSecondary}
          showRowValue={false}
          showI18nLabel={true}
          className="px-3 py-2"
          value={timeRange}
          onValueChange={val => setTimeRange(val)}
        />
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div>{t('common.loading')}</div>
        ) : pieData ? (
          <PieChart labels={pieData.labels} datasets={pieData.datasets} />
        ) : (
          <div>{t('common.NoData')}</div>
        )}
      </div>
    </div>
  );
};
