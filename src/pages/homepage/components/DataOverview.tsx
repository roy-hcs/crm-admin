import { useFundFlowReport, useSumReport } from '@/api/hooks/workbench';
import { cn, formatMoneyNumber, percentageFormat } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart } from '@/components/charts/BarCharts';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';

const options = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
};

export const DataOverview = () => {
  const { t } = useTranslation();
  const [todayData, setTodayData] = useState<number[]>([]); // 今天的数据，[input, output]
  const { data: sumReportData } = useSumReport();
  const { data: withdrawAndDepositData } = useFundFlowReport('1');

  const difference = useMemo(() => {
    const inputTodayData = withdrawAndDepositData?.data || {};
    const data = Object.values(inputTodayData);
    const yesterdayData = data[data.length - 2] || [0, 0];
    const todayData = data[data.length - 1] || [0, 0];
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
  }, [withdrawAndDepositData]);

  const inputChartData = useMemo(() => {
    const rowData = withdrawAndDepositData?.data || {};
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: '',
        data: dataArr.map(item => item?.[0] || 0),
        backgroundColor: difference.input >= 0 ? '#0D9488' : '#DC2626',
        borderRadius: 8,
        borderSkipped: false,
      },
    ];
    return { labels, datasets };
  }, [difference.input, withdrawAndDepositData?.data]);

  const outputChartData = useMemo(() => {
    const rowData = withdrawAndDepositData?.data || {};
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: '',
        data: dataArr.map(item => item?.[1] || 0),
        backgroundColor: difference.output >= 0 ? '#0D9488' : '#DC2626',
        borderRadius: 8,
        borderSkipped: false,
      },
    ];
    return { labels, datasets };
  }, [difference.output, withdrawAndDepositData?.data]);

  const sumData = useMemo(() => {
    const sum = sumReportData?.data;
    return [
      { title: 'home.CRMUserCount', value: sum?.crmUser || 0 },
      { title: 'home.TradingAccountCount', value: sum?.dealAccount || 0 },
      { title: 'home.PendingDeposit', value: formatMoneyNumber(sum?.deposit || 0) },
      { title: 'home.PendingWithdrawal', value: formatMoneyNumber(sum?.withdraw || 0) },
    ];
  }, [sumReportData]);

  useEffect(() => {
    if (withdrawAndDepositData && withdrawAndDepositData.data) {
      const data = Object.values(withdrawAndDepositData.data);
      setTodayData(withdrawAndDepositData.data[data.length - 1] || [0, 0]);
    }
  }, [withdrawAndDepositData]);

  return (
    <div className="grid gap-3 lg:gap-6">
      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2 lg:gap-6">
        <div className="bg-card grid grid-cols-1 gap-6 rounded-lg p-3 shadow-xs lg:p-6">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <div className="text-muted-foreground text-sm leading-5 font-medium">
                {t('home.TodayDeposit')}
              </div>
              <div
                className={cn(
                  difference.input >= 0 ? 'text-[#0D9488]' : 'text-[#DC2626]',
                  'flex items-center gap-2 text-sm leading-5 font-medium',
                )}
              >
                {difference.input >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{percentageFormat(difference.input)}</span>
              </div>
            </div>
            <div className="text-card-foreground text-3xl leading-9 font-semibold">
              ${formatMoneyNumber(todayData[0])}
            </div>
            <div className="text-muted-foreground text-xs leading-4 font-normal">USD</div>
          </div>
          <div className="flex h-12 items-end">
            <BarChart
              labels={inputChartData.labels}
              datasets={inputChartData.datasets}
              options={options}
              hideLegend={true}
            />
          </div>
        </div>
        <div className="bg-card grid grid-cols-1 gap-3 rounded-lg p-3 shadow-xs lg:gap-6 lg:p-6">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <div className="text-muted-foreground text-sm leading-5 font-medium">
                {t('home.TodayWithdraw')}
              </div>
              <div
                className={cn(
                  difference.output >= 0 ? 'text-[#0D9488]' : 'text-[#DC2626]',
                  'flex items-center gap-2 text-sm leading-5 font-medium',
                )}
              >
                {difference.output >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{percentageFormat(difference.output)}</span>
              </div>
            </div>
            <div className="text-card-foreground text-3xl leading-9 font-semibold">
              ${formatMoneyNumber(todayData[1])}
            </div>
            <div className="text-muted-foreground text-xs leading-4 font-normal">USD</div>
          </div>
          <div className="flex h-12 items-end">
            <BarChart
              labels={outputChartData.labels}
              datasets={outputChartData.datasets}
              options={options}
              hideLegend={true}
            />
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-4 lg:gap-6">
        {sumData.map((it, index) => {
          return (
            <div className="bg-card flex flex-col gap-2 rounded-lg p-4 shadow-xs" key={index}>
              <div className="flex items-center justify-between">
                <div className="text-card-foreground text-sm leading-5 font-normal">
                  {t(it.title)}
                </div>
                <ChevronRight className="text-card-foreground h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div
                  className="text-card-foreground truncate text-base leading-4 font-semibold"
                  title={it.value.toString()}
                >
                  {it.value}
                </div>
                <div className="text-muted-foreground text-xs leading-4 font-normal">USD</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
