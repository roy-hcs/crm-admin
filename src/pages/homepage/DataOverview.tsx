import { useFundFlowReport, useSumReport } from '@/api/hooks/workbench';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart } from '@/components/charts/BarCharts';
import { ChevronRight } from 'lucide-react';

export const DataOverview: FC = () => {
  const { t } = useTranslation();
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  const yesterday = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD');
  const [todayData, setTodayData] = useState<number[]>([]);
  const { data } = useSumReport();
  const { data: withdrawAndDepositData } = useFundFlowReport('1');
  const difference = useMemo(() => {
    const withdrawAndDepositObj = withdrawAndDepositData?.data;
    const yesterdayData = withdrawAndDepositObj?.[yesterday] || [0, 0];
    const todayData = withdrawAndDepositObj?.[today] || [0, 0];
    return {
      input:
        yesterdayData[0] === 0
          ? todayData[0] === 0
            ? 0
            : 1
          : (todayData[0] - yesterdayData[0]) / yesterdayData[0],
      output:
        yesterdayData[1] === 0
          ? todayData[1] === 0
            ? 0
            : 1
          : (todayData[1] - yesterdayData[1]) / yesterdayData[1],
    };
  }, [withdrawAndDepositData, today, yesterday]);
  const inputChartData = useMemo(() => {
    const rowData = withdrawAndDepositData?.data || {};
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: 'Input',
        data: dataArr.map(item => item?.[0] || 0),
      },
    ];
    return { labels, datasets };
  }, [withdrawAndDepositData]);
  const outputChartData = useMemo(() => {
    const rowData = withdrawAndDepositData?.data || {};
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: 'Input',
        data: dataArr.map(item => item?.[1] || 0),
      },
    ];
    return { labels, datasets };
  }, [withdrawAndDepositData]);

  const percentageFormat = (value: number) => {
    return (value * 100).toFixed(0) + '%';
  };

  const sumData = useMemo(() => {
    const sum = data?.data;
    return [
      { title: 'home.CRMUserCount', value: sum?.crmUser || 0 },
      { title: 'home.TradingAccountCount', value: sum?.dealAccount || 0 },
      { title: 'home.PendingDeposit', value: sum?.deposit || 0 },
      { title: 'home.PendingWithdrawal', value: sum?.withdraw || 0 },
    ];
  }, [data]);
  useEffect(() => {
    if (withdrawAndDepositData && withdrawAndDepositData.data) {
      setTodayData(withdrawAndDepositData.data[today] || [0, 0]);
    }
  }, [withdrawAndDepositData, today]);

  return (
    <div className="mb-6 rounded-lg">
      <div className="xl:4 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {/* 今日入金 */}
        <div className="bg-card grid grid-cols-1 rounded-lg border px-3 py-4">
          <div className="relative">
            <div className="text-sm">{t('home.TodayDeposit')}</div>
            <div className="mt-2 mb-2">
              <span className="mr-1 h-6 text-xl leading-6 font-semibold">{todayData[0]}</span>
              <span className="text-xs font-normal">USD</span>
            </div>
            <div
              className={cn(
                'text-color-DataOverview inline-block min-w-10 rounded-lg px-1 py-0.5 text-center text-xs',
                difference.input >= 0 ? 'bg-green-500' : 'bg-red-500',
              )}
            >
              ↑ {percentageFormat(difference.input)}
            </div>
          </div>
          <div className="flex items-end">
            <BarChart
              title=""
              labels={inputChartData.labels}
              datasets={inputChartData.datasets}
              height={64}
              hideLegend={true}
              horizontal={false}
              vertical={false}
            />
          </div>
        </div>
        {/* 今日出金 */}
        <div className="bg-card grid grid-cols-1 rounded-lg border px-3 py-4">
          <div className="relative">
            <div className="text-sm">{t('home.TodayWithdraw')}</div>
            <div className="mt-2 mb-2">
              <span className="mr-1 h-6 text-xl leading-6 font-semibold">{todayData[1]}</span>
              <span className="text-xs font-normal">USD</span>
            </div>
            <div
              className={cn(
                'text-color-DataOverview inline-block min-w-10 rounded-lg px-1 py-0.5 text-center text-xs',
                difference.output >= 0 ? 'bg-green-500' : 'bg-red-500',
              )}
            >
              ↓ {percentageFormat(difference.output)}
            </div>
          </div>
          <div className="flex items-end">
            <BarChart
              title=""
              labels={outputChartData.labels}
              datasets={outputChartData.datasets}
              height={64}
              hideLegend={true}
              horizontal={false}
              vertical={false}
            />
          </div>
        </div>
        {/* crm用户数量 */}
        <div className="grid gap-4">
          {sumData.slice(0, 2).map((it, index) => {
            return (
              <div className="bg-card rounded-lg border px-3 py-4" key={index}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm">{t(it.title)}</span>
                  </div>
                  <div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <span className="mr-1 align-bottom text-xl leading-6 font-semibold">
                    {it.value}
                  </span>
                  <span className="text-xs font-normal">USD</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* 出入金待审 */}
        <div className="grid gap-4">
          {sumData.slice(2, 4).map((it, index) => {
            return (
              <div className="bg-card rounded-lg border px-3 py-4" key={index}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm">{t(it.title)}</span>
                  </div>
                  <div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <span className="mr-1 align-bottom text-xl leading-6 font-semibold">
                    {it.value}
                  </span>
                  <span className="text-xs font-normal">USD</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
