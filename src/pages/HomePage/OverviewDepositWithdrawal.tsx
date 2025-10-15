import { useFundFlowReport } from '@/api/hooks/system/system';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhSelect } from '@/components/common/RrhSelect';
import { timeRangeOptions } from '@/lib/const';
import { LineChart } from '@/components/charts/LineCharts';

export const OverviewDepositWithdrawal: FC = () => {
  const { t } = useTranslation();
  const [type, setType] = useState('1');
  const { data, isLoading } = useFundFlowReport(type);
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('home.nav.Withdrawal'),
        data: dataArr.map(item => item?.[1] || 0),
      },
      {
        label: t('home.nav.Deposit'),
        data: dataArr.map(item => item?.[0] || 0),
      },
      {
        label: t('common.netFlow'),
        data: dataArr.map(item => item?.[0] - item?.[1]),
      },
    ];
    return { labels, datasets };
  }, [data, t]);
  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-6">
          <span className="inline-block text-xl leading-6 font-semibold">
            {t('home.WithDrawReport')}
          </span>
        </div>
        <div>
          <RrhSelect
            options={timeRangeOptions}
            showRowValue={false}
            showi18nLabel={true}
            className="w-40"
            value={type}
            onValueChange={value => {
              setType(value);
            }}
          />
        </div>
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
