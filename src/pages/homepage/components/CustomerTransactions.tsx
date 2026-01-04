import { useCustomerTransactionsReport, ServerItem } from '@/api/hooks/workbench';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RrhSelect } from '@/components/common/RrhSelect';
import { DEFAULT_TIME_RANGE, timeRangeOptions, TimeRangeType } from '@/lib/const';
import { cn, getCssVar } from '@/lib/utils';
import { serverMap } from '@/lib/constant';
import { LegendHeader } from '@/components/charts/LegendHeader';

import { BarChart } from '@/components/charts/BarCharts';

export const CustomerTransactions = ({ serverList }: { serverList: ServerItem[] }) => {
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
  const initialServerId = serverList[0]?.id || '';
  const { t } = useTranslation();
  const [serverId, setServerId] = useState(initialServerId);
  const [timeRange, setTimeRange] = useState<TimeRangeType>(DEFAULT_TIME_RANGE);

  const { data, isLoading } = useCustomerTransactionsReport({
    type: timeRange,
    serverId,
  });

  useEffect(() => {
    const handler = () => {
      setLegendColor(getCssVar('--card-foreground', '#0a0a0a'));
      setBorderColor(getCssVar('--border', '#E1E3EA'));
    };
    window.addEventListener('themechange', handler as EventListener);
    return () => window.removeEventListener('themechange', handler as EventListener);
  }, []);

  // 平仓盈亏 图表数据
  const PositionProfitLossChartData = useMemo(() => {
    if (!data || !data?.data?.data) return { labels: [], datasets: [] };
    const rowData = data.data.data;
    const labels = rowData.map(item => item.statisticDate);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('common.profit'),
        data: dataArr.map((item: { profit: number }) => item.profit),
        borderDash: [6, 4], // dashed line
        backgroundColor: '#3E97FF',
        pointStyle: 'circle',
        pointRadius: 6,
        borderRadius: 4,
      },
      {
        label: t('common.loss'),
        data: dataArr.map((item: { loss: number }) => Math.abs(item.loss)),
        borderDash: [6, 4], // dashed line
        backgroundColor: '#27AE60',
        pointStyle: 'circle',
        pointRadius: 6,
        borderRadius: 4,
      },
    ];
    return { labels, datasets };
  }, [data, t]);
  // 平仓盈亏 数据
  const PositionProfitLossData = useMemo(() => {
    if (!data || !data?.data?.data) return { profit: 0, loss: 0, netProfit: 0 };
    /**
     * 取最后一天的数据
     */
    const rowData = data.data.data;
    const lastKey = Number(Object.keys(rowData).pop()) || 0;
    const lastData = rowData[lastKey] || [];
    return {
      profit: lastData?.profit || 0,
      loss: lastData?.loss || 0,
      netProfit: lastData?.profit - Math.abs(lastData?.loss) || 0,
    };
  }, [data]);
  // 交易量 图表数据
  const TradingVolumeChartData = useMemo(() => {
    if (!data || !data?.data?.data) return { labels: [], datasets: [] };
    const rowData = data.data.data;
    const labels = rowData.map(item => item.statisticDate);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('table.volume'),
        data: dataArr.map((item: { volume: number }) => item.volume || 0),
        borderDash: [6, 4], // dashed line
        backgroundColor: '#27AE60',
        pointStyle: 'circle',
        pointRadius: 6,
        borderRadius: 4,
      },
    ];
    return { labels, datasets };
  }, [data, t]);
  // 交易量数据
  const TradingVolumeData = useMemo(() => {
    // data?.sumThisMonth.volume 本月交易量
    // data.data.data取最后一个数据 今日交易量
    const today = data?.data?.data?.[data?.data?.data?.length - 1];
    return {
      // 本月交易量
      thisMonth: data?.data?.sumThisMonth?.volume || 0,
      // 今日交易量
      today: today?.volume || 0,
    };
  }, [data]);
  // 交易订单 图表数据
  const TradingOrderChartData = useMemo(() => {
    if (!data || !data?.data?.data) return { labels: [], datasets: [] };
    const rowData = data.data.data;
    const labels = rowData.map(item => item.statisticDate);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('home.quantity'),
        data: dataArr.map((item: { quantity: number }) => item.quantity || 0),
        borderDash: [6, 4], // dashed line
        backgroundColor: '#27AE60',
        pointStyle: 'circle',
        pointRadius: 6,
        borderRadius: 4,
      },
    ];
    return { labels, datasets };
  }, [data, t]);
  // 交易订单数据
  const TradingOrderData = useMemo(() => {
    // data?.sumThisMonth.quantity 本月订单量
    // data.data.data取最后一个数据 今日订单量
    const today = data?.data?.data?.[data?.data?.data?.length - 1];
    return {
      // 本月订单量
      thisMonth: data?.data?.sumThisMonth?.quantity || 0,
      // 今日订单量
      today: today?.quantity || 0,
    };
  }, [data]);

  const serverOptions = useMemo(
    () =>
      serverList.map(item => ({
        label: item.serverName,
        value: item.id,
        serviceProperty: item.serviceProperty,
        serviceType: item.serviceType,
      })),
    [serverList],
  );

  useEffect(() => {
    if (!serverList.length) return;
    const exists = serverList.some(s => s.id === serverId);
    if (!exists) {
      setServerId(serverList[0].id);
    }
  }, [serverList, serverId]);

  return (
    <div className="bg-card rounded-lg p-2 shadow-xs lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-1.5 lg:flex-nowrap">
        <div className="text-card-foreground text-lg leading-7 font-semibold">
          {t('home.CustomerTrading')}
        </div>
        <div className={cn('flex flex-wrap items-center gap-1 lg:flex-nowrap lg:gap-4')}>
          <div className="flex-1">
            <RrhSelect
              options={serverOptions}
              showRowValue={false}
              className="px-3 py-2"
              value={serverId}
              renderItem={option => {
                return (
                  <div>
                    <span>
                      {option.serviceProperty === 1 ? t('common.live') : t('common.demo')}
                    </span>
                    {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                    <span>{option.label}</span>
                  </div>
                );
              }}
              onValueChange={value => {
                setServerId(value);
              }}
            />
          </div>
          <div className="flex-1">
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
      </div>
      <Tabs defaultValue="account" className="mt-2 w-full lg:mt-6">
        <TabsList className="dark:bg-accent bg-slate-100">
          <TabsTrigger value="account" className="max-w-[100px] truncate md:max-w-full">
            {t('home.PositionProfitLoss')}
          </TabsTrigger>
          <TabsTrigger value="volume" className="max-w-[100px] truncate md:max-w-full">
            {t('home.TradingVolume')}
          </TabsTrigger>
          <TabsTrigger value="order" className="max-w-[100px] truncate md:max-w-full">
            {t('home.TradingOrder')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="mb-2 flex lg:mb-6">
            <div className="flex-1">
              <LegendHeader label={t('home.NetProfit')} value={PositionProfitLossData.profit} />
            </div>
            <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
            <div className="flex-1">
              <LegendHeader label={t('home.GrossLoss')} value={PositionProfitLossData.loss} />
            </div>
            <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
            <div className="flex-1">
              <LegendHeader
                label={t('home.NetProfitToday')}
                value={PositionProfitLossData.netProfit}
              />
            </div>
          </div>
          <div className="h-80 w-full">
            {isLoading ? (
              <div>{t('common.loading')}</div>
            ) : (
              <BarChart
                options={options}
                labels={PositionProfitLossChartData.labels}
                datasets={PositionProfitLossChartData.datasets}
                hideLegend={true}
              />
            )}
          </div>
        </TabsContent>
        <TabsContent value="volume">
          <div className="mb-2 flex lg:mb-6">
            <div className="flex-1">
              <LegendHeader
                label={t('home.TradingVolumeThisMonth')}
                value={TradingVolumeData.thisMonth}
              />
            </div>
            <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
            <div className="flex-1">
              <LegendHeader label={t('home.TradingVolumeToday')} value={TradingVolumeData.today} />
            </div>
          </div>
          <div className="h-80 w-full">
            {isLoading ? (
              <div>{t('common.loading')}</div>
            ) : (
              <BarChart
                options={options}
                labels={TradingVolumeChartData.labels}
                datasets={TradingVolumeChartData.datasets}
                hideLegend={true}
              />
            )}
          </div>
        </TabsContent>
        <TabsContent value="order">
          <div className="mb-2 flex lg:mb-6">
            <div className="flex-1">
              <LegendHeader
                label={t('home.quantityThisMonth')}
                value={TradingOrderData.thisMonth}
              />
            </div>
            <div className="bg-border mx-6 hidden w-[1px] md:block"></div>
            <div className="flex-1">
              <LegendHeader label={t('home.quantityToday')} value={TradingOrderData.today} />
            </div>
          </div>
          <div className="h-80 w-full">
            {isLoading ? (
              <div>{t('common.loading')}</div>
            ) : (
              <BarChart
                options={options}
                labels={TradingOrderChartData.labels}
                datasets={TradingOrderChartData.datasets}
                hideLegend={true}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
