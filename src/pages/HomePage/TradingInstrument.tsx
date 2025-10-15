import { useSymbolReport } from '@/api/hooks/system/system';
import { ServerItem } from '@/api/hooks/system/types';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhSelect } from '@/components/common/RrhSelect';
import { DEFAULT_TIME_RANGE, timeRangeOptions, TimeRangeType } from '@/lib/const';
import { cn } from '@/lib/utils';
import { serverMap } from '@/lib/constant';
import { PieChart } from '@/components/charts/PieCharts';

interface PieData {
  labels: string[];
  datasets: { label: string; data: number[] }[];
}
export const TradingInstrument = ({ serverList }: { serverList: ServerItem[] }) => {
  const { t } = useTranslation();

  // 初始 serverId（若首项存在）
  const initialServerId = serverList[0]?.id || '';
  const [serverId, setServerId] = useState(initialServerId);
  const [timeRange, setTimeRange] = useState<TimeRangeType>(DEFAULT_TIME_RANGE);

  const { data, isLoading } = useSymbolReport({
    type: timeRange,
    isAsc: 'desc',
    serverId,
    pageNum: NaN,
  });

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
  const pieData: PieData | null = useMemo(() => {
    const list = data?.rows || [];
    if (!list.length) return null;
    const labels = list.map(item => item.symbol || '');
    const values = list.map(item => Number(item.amount ?? 0));
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
  // 若 serverList 更新但不包含当前 serverId，重置
  useEffect(() => {
    if (!serverList.length) return;
    const exists = serverList.some(s => s.id === serverId);
    if (!exists) {
      setServerId(serverList[0].id);
    }
  }, [serverList, serverId]);

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-6">
          <h1 className="text-xl leading-6 font-semibold">{t('home.TradingPairOverview')}</h1>
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
      <div className="mt-12 flex min-h-75 items-center justify-center">
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
