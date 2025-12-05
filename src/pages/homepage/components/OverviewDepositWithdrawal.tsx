import { useFundFlowReport } from '@/api/hooks/workbench';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhSelect } from '@/components/common/RrhSelect';
import { timeRangeOptions } from '@/lib/const';
import { LineChart } from '@/components/charts/LineCharts';

export const OverviewDepositWithdrawal: FC = () => {
  const { t } = useTranslation();
  const [type, setType] = useState('1');
  const { data, isLoading } = useFundFlowReport(type);

  const lineChart = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);

    const withdrawal = dataArr.map(item => item?.[1]);
    const deposit = dataArr.map(item => item?.[0]);
    const netFlow = dataArr.map(item => (item?.[0] || 0) - (item?.[1] || 0));

    return {
      labels,
      datasets: [
        {
          label: t('home.nav.Deposit'),
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
          label: t('home.nav.Withdrawal'),
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
          label: t('common.netFlow'),
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

  return (
    <div className="bg-card flex flex-col justify-between rounded-lg p-3 shadow-xs lg:p-6">
      <div className="flex items-start justify-between">
        <div className="text-card-foreground text-lg leading-7 font-semibold">
          {t('home.WithDrawReport')}
        </div>
        <div>
          <RrhSelect
            options={timeRangeOptions}
            showRowValue={false}
            showi18nLabel={true}
            className="px-3 py-2"
            value={type}
            onValueChange={value => {
              setType(value);
            }}
          />
        </div>
      </div>
      <div>
        {isLoading ? <div>{t('common.loading')}</div> : <LineChart lineChartProps={lineChart} />}
      </div>
    </div>
  );
};
