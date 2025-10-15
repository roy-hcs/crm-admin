import { useCustomerTransactionsReport } from '@/api/hooks/system/system';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from '@/components/charts/BarCharts';
import { RrhSelect } from '@/components/common/RrhSelect';
import { ServerItem } from '@/api/hooks/system/types';
import { DEFAULT_TIME_RANGE, timeRangeOptions, TimeRangeType } from '@/lib/const';
import { cn } from '@/lib/utils';
import { serverMap } from '@/lib/constant';

export const CustomerTransactions = ({ serverList }: { serverList: ServerItem[] }) => {
  const { t } = useTranslation();

  // 初始 serverId（若首项存在）
  const initialServerId = serverList[0]?.id || '';
  const [serverId, setServerId] = useState(initialServerId);
  const [timeRange, setTimeRange] = useState<TimeRangeType>(DEFAULT_TIME_RANGE);

  const { data, isLoading } = useCustomerTransactionsReport({
    type: timeRange,
    serverId,
  });
  // 平仓盈亏 图表数据
  const PositionProfitLossChartData = useMemo(() => {
    if (!data || !data?.data?.data) return { labels: [], datasets: [] };
    const rowData = data.data.data;
    const labels = rowData.map(item => item.statisticDate);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('common.profit'),
        data: dataArr.map((item: { profit: number }) => item.profit || 0),
      },
      {
        label: t('common.loss'),
        data: dataArr.map((item: { loss: number }) => Math.abs(item.loss || 0)),
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

  // server 列表 useMemo防止重复渲染
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

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-6">
          <h2 className="text-xl leading-6 font-semibold">{t('home.CustomerTrading')}</h2>
        </div>
        <div className={cn('flex items-center gap-4')}>
          <RrhSelect
            options={serverOptions}
            showRowValue={false}
            className="w-40"
            value={serverId}
            renderItem={option => {
              return (
                <div>
                  <span>{option.serviceProperty === 1 ? t('common.live') : t('common.demo')}</span>
                  {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                  <span>{option.label}</span>
                </div>
              );
            }}
            onValueChange={value => {
              setServerId(value);
            }}
          />
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
      <div className="mt-3">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="dark:bg-accent bg-slate-100">
            <TabsTrigger value="account">{t('home.PositionProfitLoss')}</TabsTrigger>
            <TabsTrigger value="volume">{t('home.TradingVolume')}</TabsTrigger>
            <TabsTrigger value="order">{t('home.TradingOrder')}</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="mb-6 flex gap-20 px-6">
              <BuildText label={t('home.NetProfit')} value={PositionProfitLossData.profit} />
              <BuildText label={t('home.GrossLoss')} value={PositionProfitLossData.loss} />
              <BuildText
                label={t('home.NetProfitToday')}
                value={PositionProfitLossData.netProfit}
              />
            </div>
            <div className="min-h-75">
              {isLoading ? (
                <div>{t('common.loading')}</div>
              ) : (
                <BarChart
                  labels={PositionProfitLossChartData?.labels || []}
                  datasets={PositionProfitLossChartData?.datasets || []}
                  title=""
                  hideLegend={true}
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                        ticks: {
                          maxTicksLimit: 7, // Limit the number of ticks shown
                          autoSkip: true, // Enable automatic skipping of labels
                          maxRotation: 45, // Rotate labels if needed
                          minRotation: 0,
                        },
                        grid: {
                          display: true,
                        },
                      },
                      y: {
                        stacked: true,
                      },
                    },
                  }}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="volume">
            <div className="mb-6 flex gap-20 px-6">
              <BuildText
                label={t('home.TradingVolumeThisMonth')}
                value={TradingVolumeData.thisMonth}
              />
              <BuildText label={t('home.TradingVolumeToday')} value={TradingVolumeData.today} />
            </div>
            <div className="min-h-75">
              {isLoading ? (
                <div>{t('common.loading')}</div>
              ) : (
                <BarChart
                  labels={TradingVolumeChartData?.labels || []}
                  datasets={TradingVolumeChartData?.datasets || []}
                  title=""
                  hideLegend={true}
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                        ticks: {
                          maxTicksLimit: 7, // Limit the number of ticks shown
                          autoSkip: true, // Enable automatic skipping of labels
                          maxRotation: 45, // Rotate labels if needed
                          minRotation: 0,
                        },
                        grid: {
                          display: true,
                        },
                      },
                      y: {
                        stacked: true,
                      },
                    },
                  }}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="order">
            <div className="mb-6 flex gap-20 px-6">
              <BuildText label={t('home.quantityThisMonth')} value={TradingOrderData.thisMonth} />
              <BuildText label={t('home.quantityToday')} value={TradingOrderData.today} />
            </div>
            <div className="min-h-75">
              {isLoading ? (
                <div>{t('common.loading')}</div>
              ) : (
                <BarChart
                  labels={TradingOrderChartData?.labels || []}
                  datasets={TradingOrderChartData?.datasets || []}
                  title=""
                  hideLegend={true}
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        stacked: true,
                        ticks: {
                          maxTicksLimit: 7, // Limit the number of ticks shown
                          autoSkip: true, // Enable automatic skipping of labels
                          maxRotation: 45, // Rotate labels if needed
                          minRotation: 0,
                        },
                        grid: {
                          display: true,
                        },
                      },
                      y: {
                        stacked: true,
                      },
                    },
                  }}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function BuildText(props: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 h-4 text-xs leading-4 font-normal">{props.label}</div>
      <div className="h-5 text-base leading-5 font-semibold">{props.value}</div>
    </div>
  );
}
