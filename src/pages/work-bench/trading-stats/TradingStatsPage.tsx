import { useTranslation } from 'react-i18next';
import { TradingStatsForm } from './TradingStatsForm';
import { LineChart } from '@/components/charts/LineCharts';
import { useEffect, useMemo, useState } from 'react';
import { useMtServiceUpdate, useServerList, MtServiceUpdateRes } from '@/api/hooks/workbench';
import { PageInfo } from '@/components/common/PageInfo';

export function TradingStatsPage() {
  const [serverId, setServerId] = useState('');
  const { t } = useTranslation();
  const { data: serverListResult, isLoading: serverLoading } = useServerList();
  useEffect(() => {
    // 首次加载时，若无 serverId，则设置为第一个
    if (serverId) return; // 已有就不处理
    const firstId = serverListResult?.rows?.[0]?.id;
    if (firstId) setServerId(firstId);
  }, [serverId, serverListResult]);
  const { data: statsData, isLoading: statsLoading } = useMtServiceUpdate(
    {
      server: serverId,
    },
    { enabled: Boolean(serverId) },
  );
  const chartData = useMemo(() => {
    const countObj = (statsData as MtServiceUpdateRes | undefined)?.count;
    if (!countObj || Object.keys(countObj).length === 0) {
      return { labels: [], datasets: [] };
    }
    const entries = Object.entries(countObj).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
    );
    const labels = entries.map(([date]) => date);
    const dataPoints = entries.map(([, val]) => val ?? 0);
    return {
      labels,
      datasets: [
        {
          label: t('common.accountCount'),
          data: dataPoints,
        },
      ],
    };
  }, [statsData, t]);
  const allAccount = (statsData as MtServiceUpdateRes | undefined)?.allAccount ?? 0;
  const todayAccount = (statsData as MtServiceUpdateRes | undefined)?.todayAccount ?? 0;

  const showChartPlaceholder = !statsLoading && chartData.labels.length === 0;
  return (
    <div>
      <PageInfo title={t('workBench.title')} />
      <div className="my-3.5 flex items-center justify-between">
        <TradingStatsForm
          serverOptions={serverListResult?.rows || []}
          setServerId={setServerId}
          initialServerId={serverId}
        />
      </div>
      {serverLoading && <div className="text-sm text-gray-500">{t('common.loading')}</div>}
      <div>
        <div className="grid gap-4 sm:grid-cols-[1fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr_1fr]">
          <MetricCard label={t('common.totalAccount')} value={allAccount} loading={statsLoading} />
          <MetricCard
            label={t('common.todayAccount')}
            value={todayAccount}
            loading={statsLoading}
          />
        </div>
      </div>
      {showChartPlaceholder ? (
        <div className="mt-4 text-sm text-gray-500">{t('common.NoData')}</div>
      ) : (
        <LineChart lineChartProps={chartData} />
      )}
    </div>
  );
}

function MetricCard(props: { label: string; value: number; loading?: boolean }) {
  const { label, value, loading } = props;
  return (
    <div className="bg-card grid grid-cols-1 rounded-lg border px-3 py-4">
      <div className="relative">
        <div className="text-sm">{label}</div>
        <div className="mt-2 mb-2">
          <span className="mr-1 h-6 text-xl leading-6 font-semibold" aria-label={label}>
            {loading ? '...' : value}
          </span>
        </div>
      </div>
    </div>
  );
}
