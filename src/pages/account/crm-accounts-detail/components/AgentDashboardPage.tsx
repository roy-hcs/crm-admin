import {
  useGetAgentAccountStats,
  useGetAgentCommissionStats,
  useGetAgentFundStats,
  useGetAgentNewAccountStats,
  useGetAgentTradeStats,
} from '@/api/hooks/agent/agent';
import { AgentAccountStatsRes, AgentCommissionRes } from '@/api/hooks/agent/types';
import { ServerItem, useServerList } from '@/api/hooks/system';
import { useGetUserAccountOperation, useGetUserRebateAccountTab } from '@/api/hooks/system/system';
import { LineChart } from '@/components/charts/LineCharts';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhSelect } from '@/components/common/RrhSelect';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { timeRangeOptionsSecondary } from '@/lib/const';
import { serverMap } from '@/lib/constant';
import { cn, formatMoneyNumber } from '@/lib/utils';
import { TabsContent } from '@radix-ui/react-tabs';
import { ReactElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const InfoItem = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number | ReactElement;
  className?: string;
}) => {
  return (
    <div className={cn('border-border border-r pr-10 last:border-0', className)}>
      <div className="mb-2 text-sm">{label}</div>
      <div className="flex items-baseline gap-3 text-base font-semibold">{value}</div>
    </div>
  );
};

const AgentAccountInfo = ({ agentAccountData }: { agentAccountData: AgentAccountStatsRes }) => {
  const { t } = useTranslation();
  const accountInfo = [
    {
      title: t('table.CRMAccount'),
      infos: [
        {
          title: t('CRMAccountPage.totalCustomerNumber'),
          value: agentAccountData?.crmUser,
          newValue: agentAccountData?.newCrmUser || 0,
        },
        {
          title: t('customerTracking.directBroker'),
          value: agentAccountData?.directUser,
          newValue: agentAccountData?.newDirectUser || 0,
        },
      ],
    },
    {
      title: t('tradingAccounts.title'),
      infos: [
        {
          title: t('CRMAccountPage.totalAccountNumber'),
          value: agentAccountData?.dealAccount,
          newValue: agentAccountData?.newDealAccount || 0,
        },
        {
          title: t('customerTracking.directBroker'),
          value: agentAccountData?.directAccount,
          newValue: agentAccountData?.newDirectAccount || 0,
        },
      ],
    },
  ];
  return (
    <RrhCard>
      <div className="mb-3 flex items-end justify-between border-b pb-3">
        <h3 className="text-xl font-semibold">{t('overview.title')}</h3>
        <span className="text-accent-foreground text-sm">
          {t('home.DataUpdateTime')}: {agentAccountData?.statisticDate}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {accountInfo.map((group, index) => (
          <div key={index}>
            <div className="mb-2 font-semibold">{group.title}</div>
            <div className="grid grid-cols-2 p-2">
              {group.infos.map((info, idx) => (
                <div key={idx}>
                  <InfoItem
                    label={info.title}
                    value={
                      <>
                        <span className="text-2xl font-semibold">{info.value}</span>
                        <span className="text-base font-normal">
                          {t('CRMAccountPage.currentMonth')}
                        </span>
                        <span className="text-base font-normal">
                          {info.newValue > 0 ? `+${info.newValue}` : t('CRMAccountPage.fair')}
                        </span>
                      </>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </RrhCard>
  );
};
const AgentCommissionInfo = ({
  agentCommissionData,
}: {
  agentCommissionData: AgentCommissionRes;
}) => {
  const { t } = useTranslation();
  return (
    <RrhCard>
      <div className="mb-3 flex items-end justify-between border-b pb-3">
        <h3 className="text-xl font-semibold">{t('CRMAccountPage.commission')}(USD)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="grid grid-cols-2">
          <InfoItem
            label={t('CRMAccountPage.commissionTotal')}
            value={formatMoneyNumber(agentCommissionData?.totalCommission || 0)}
            className="border-0"
          />
          <InfoItem
            label={t('CRMAccountPage.currentMonthCommission')}
            value={formatMoneyNumber(agentCommissionData?.monthCommission || 0)}
            className="border-0"
          />
        </div>
      </div>
    </RrhCard>
  );
};
const AgentNewAccountInfo = ({ userId }: { userId: string }) => {
  const [days, setDays] = useState('7');
  const { data: agentNewAccountStats } = useGetAgentNewAccountStats(userId, days);
  const agentNewAccountData = useMemo(
    () => agentNewAccountStats?.data || [],
    [agentNewAccountStats],
  );
  const { t } = useTranslation();
  const lastDayInfo = agentNewAccountData.at(-1);
  const lineChart = useMemo(() => {
    if (!agentNewAccountData) return { labels: [], datasets: [] };
    const labels = agentNewAccountData.map(i => i.day.toString());

    const crmUser = agentNewAccountData.map(i => i.newCrmUser.toString());
    const realAccount = agentNewAccountData.map(i => i.newRealAccount.toString());
    const demoAccount = agentNewAccountData.map(i => i.newDemoAccount.toString());
    const generalConfig = {
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointStyle: 'circle',
    };
    return {
      labels,
      datasets: [
        {
          label: t('CRMAccountPage.newCRMAccount'),
          data: crmUser,
          borderColor: '#0D9488',
          pointBackgroundColor: '#0D9488',
          ...generalConfig,
        },
        {
          label: t('CRMAccountPage.newRealAccount'),
          data: realAccount,
          borderColor: '#EA580C',
          pointBackgroundColor: '#EA580C',
          ...generalConfig,
        },
        {
          label: t('CRMAccountPage.newDemoAccount'),
          data: demoAccount,
          borderColor: '#FF4D4F',
          pointBackgroundColor: '#FF4D4F',
          ...generalConfig,
        },
      ],
    };
  }, [agentNewAccountData, t]);

  return (
    <RrhCard>
      <div className="mb-3 flex items-end justify-between border-b pb-3">
        <h3 className="text-xl font-semibold">{t('CRMAccountPage.accountOpening')}</h3>
        <RrhSelect
          options={timeRangeOptionsSecondary}
          showRowValue={false}
          showI18nLabel={true}
          className="px-3 py-2"
          value={days}
          onValueChange={value => {
            setDays(value);
          }}
        />
      </div>
      <div className="flex gap-10">
        <InfoItem
          label={`${t('CRMAccountPage.newCRMAccount')}(${t('common.yesterday')})`}
          value={lastDayInfo?.newCrmUser || 0}
        />
        <InfoItem
          label={`${t('CRMAccountPage.newRealAccount')}(${t('common.yesterday')})`}
          value={lastDayInfo?.newRealAccount || 0}
        />
        <InfoItem
          label={`${t('CRMAccountPage.newDemoAccount')}(${t('common.yesterday')})`}
          value={lastDayInfo?.newDemoAccount || 0}
        />
      </div>
      <div className="mt-6 h-90">
        <LineChart
          lineChartProps={lineChart}
          chartOptions={{
            maintainAspectRatio: false,
            scales: { y: { min: 0, suggestedMax: 5, ticks: { stepSize: 1 } } },
          }}
        />
      </div>
    </RrhCard>
  );
};

const AgentFundInfo = ({ userId, serverList }: { userId: string; serverList: ServerItem[] }) => {
  const { t } = useTranslation();
  const initServerId = serverList[0]?.id || '';
  const [serverId, setServerId] = useState(initServerId);
  const [days, setDays] = useState('7');
  const { data: agentFundStats } = useGetAgentFundStats(userId, days, serverId);
  const agentFundData = useMemo(() => agentFundStats?.data || [], [agentFundStats]);
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
  const lastDayInfo = agentFundData.at(-1);
  const lineChart = useMemo(() => {
    if (!agentFundData) return { labels: [], datasets: [] };
    const labels = agentFundData.map(i => i.day.toString());
    const deposit = agentFundData.map(i => i.deposit.toString());
    const withdrawal = agentFundData.map(i => i.withdraw.toString());
    const generalConfig = {
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointStyle: 'circle',
    };
    return {
      labels,
      datasets: [
        {
          label: t('table.Deposit'),
          data: deposit,
          borderColor: '#0D9488',
          pointBackgroundColor: '#0D9488',
          ...generalConfig,
        },
        {
          label: t('table.Withdrawal'),
          data: withdrawal,
          borderColor: '#EA580C',
          pointBackgroundColor: '#EA580C',
          ...generalConfig,
        },
        {
          label: t('common.netFlow'),
          data: withdrawal,
          borderColor: '#FF4D4F',
          pointBackgroundColor: '#FF4D4F',
          ...generalConfig,
        },
      ],
    };
  }, [agentFundData, t]);
  return (
    <RrhCard>
      <div className="mb-3 flex items-end justify-between border-b pb-3">
        <h3 className="text-xl font-semibold">{t('CRMAccountPage.customerFundOverview')}</h3>
        <div className="flex flex-wrap items-center gap-1 lg:flex-nowrap lg:gap-4">
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
              options={timeRangeOptionsSecondary}
              showRowValue={false}
              showI18nLabel={true}
              className="px-3 py-2"
              value={days}
              onValueChange={value => {
                setDays(value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-10">
        <InfoItem
          label={`${t('table.Deposit')}(${t('common.yesterday')})`}
          value={formatMoneyNumber(lastDayInfo?.deposit || 0)}
        />
        <InfoItem
          label={`${t('table.Withdrawal')}(${t('common.yesterday')})`}
          value={formatMoneyNumber(lastDayInfo?.withdraw || 0)}
        />
        <InfoItem
          label={`${t('common.netFlow')}(${t('common.yesterday')})`}
          value={formatMoneyNumber((lastDayInfo?.deposit || 0) + (lastDayInfo?.withdraw || 0))}
        />
      </div>
      <div className="mt-6 h-90">
        <LineChart
          lineChartProps={lineChart}
          chartOptions={{
            maintainAspectRatio: false,
            scales: { y: { min: 0, suggestedMax: 5, ticks: { stepSize: 1 } } },
          }}
        />
      </div>
    </RrhCard>
  );
};
const AgentTradeInfo = ({ userId, serverList }: { userId: string; serverList: ServerItem[] }) => {
  const { t } = useTranslation();
  const initServerId = serverList[0]?.id || '';
  const [serverId, setServerId] = useState(initServerId);
  const [days, setDays] = useState('7');
  const { data: agentTradeStats } = useGetAgentTradeStats(userId, days, serverId);
  const agentTradeData = useMemo(() => agentTradeStats?.data.datas || [], [agentTradeStats]);
  const agentTradeMonthSum = useMemo(
    () => agentTradeStats?.data.sumThisMonth || { quantity: 0, volume: 0 },
    [agentTradeStats],
  );
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
  const lastDayInfo = agentTradeData.at(-1);
  const tabs = useMemo(() => {
    return [
      {
        value: t('home.PositionProfitLoss'),
        content: (
          <div className="flex gap-10">
            <InfoItem
              label={`${t('common.profit')}(${t('common.yesterday')})`}
              value={formatMoneyNumber(lastDayInfo?.closeProfit || 0) + '(USD)'}
            />
            <InfoItem
              label={`${t('common.loss')}(${t('common.yesterday')})`}
              value={formatMoneyNumber(lastDayInfo?.closeLoss || 0) + '(USD)'}
            />
            <InfoItem
              label={`${t('common.netProfit')}(${t('common.yesterday')})`}
              value={
                formatMoneyNumber((lastDayInfo?.closeProfit || 0) + (lastDayInfo?.closeLoss || 0)) +
                '(USD)'
              }
            />
          </div>
        ),
      },
      {
        value: t('table.volume'),
        content: (
          <div className="flex gap-10">
            <InfoItem
              label={`${t('table.volume')}(${t('CRMAccountPage.currentMonth')})`}
              value={(agentTradeMonthSum.volume || 0).toFixed(2)}
            />
            <InfoItem
              label={`${t('table.volume')}(${t('common.yesterday')})`}
              value={(lastDayInfo?.volume || 0).toFixed(2)}
            />
          </div>
        ),
      },
      {
        value: t('home.TradingOrder'),
        content: (
          <div className="flex gap-10">
            <InfoItem
              label={`${t('home.quantity')}(${t('CRMAccountPage.currentMonth')})`}
              value={agentTradeMonthSum.quantity || 0}
            />
            <InfoItem
              label={`${t('home.quantity')}(${t('common.yesterday')})`}
              value={(lastDayInfo?.dealLoss || 0) + (lastDayInfo?.dealProfit || 0)}
            />
          </div>
        ),
      },
    ];
  }, [
    agentTradeMonthSum.quantity,
    agentTradeMonthSum.volume,
    lastDayInfo?.closeLoss,
    lastDayInfo?.closeProfit,
    lastDayInfo?.dealLoss,
    lastDayInfo?.dealProfit,
    lastDayInfo?.volume,
    t,
  ]);
  const [currentTab, setCurrentTab] = useState(tabs[0].value);
  const lineChart = useMemo(() => {
    if (!agentTradeData) return { labels: [], datasets: [] };
    const labels = agentTradeData.map(i => i.day.toString());
    const dealLoss = agentTradeData.map(i => i.dealLoss);
    const dealProfit = agentTradeData.map(i => i.dealProfit);
    const volume = agentTradeData.map(i => i.volume);
    const closeLoss = agentTradeData.map(i => i.closeLoss);
    const closeProfit = agentTradeData.map(i => i.closeProfit);
    const generalConfig = {
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointStyle: 'circle',
    };
    return {
      labels,
      datasets:
        currentTab === tabs[0].value
          ? [
              {
                label: t('common.profit'),
                data: closeProfit,
                borderColor: '#0D9488',
                pointBackgroundColor: '#0D9488',
                ...generalConfig,
              },
              {
                label: t('common.loss'),
                data: closeLoss,
                borderColor: '#F43F5E',
                pointBackgroundColor: '#F43F5E',
                ...generalConfig,
              },
            ]
          : currentTab === tabs[1].value
            ? [
                {
                  label: t('table.volume'),
                  data: volume,
                  borderColor: '#0D9488',
                  pointBackgroundColor: '#0D9488',
                  ...generalConfig,
                },
              ]
            : [
                {
                  label: t('CRMAccountPage.profitDeal'),
                  data: dealProfit,
                  borderColor: '#0D9488',
                  pointBackgroundColor: '#0D9488',
                  ...generalConfig,
                },
                {
                  label: t('CRMAccountPage.lossDeal'),
                  data: dealLoss,
                  borderColor: '#F43F5E',
                  pointBackgroundColor: '#F43F5E',
                  ...generalConfig,
                },
              ],
    };
  }, [agentTradeData, currentTab, tabs, t]);
  return (
    <RrhCard>
      <div className="mb-3 flex items-end justify-between border-b pb-3">
        <h3 className="text-xl font-semibold">{t('CRMAccountPage.customerFundOverview')}</h3>
        <div className="flex flex-wrap items-center gap-1 lg:flex-nowrap lg:gap-4">
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
              options={timeRangeOptionsSecondary}
              showRowValue={false}
              showI18nLabel={true}
              className="px-3 py-2"
              value={days}
              onValueChange={value => {
                setDays(value);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <Tabs
          defaultValue={currentTab}
          onValueChange={value => {
            console.log('value changed', value);
            setCurrentTab(value);
          }}
        >
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {t(tab.value)}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => {
            return (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
      <div className="mt-6 h-90">
        <LineChart
          lineChartProps={lineChart}
          chartOptions={{
            maintainAspectRatio: false,
            scales: { y: { min: 0, suggestedMax: 5, ticks: { stepSize: 1 } } },
          }}
        />
      </div>
    </RrhCard>
  );
};

export const AgentDashboardPage = ({ userId }: { userId: string }) => {
  const { data: agentAccountStats } = useGetAgentAccountStats(userId);
  const { data: agentCommissionStats } = useGetAgentCommissionStats(userId);
  const { data: dataOne } = useGetUserRebateAccountTab(userId);
  const { data: dataTwo } = useGetUserAccountOperation(userId);

  const { data: serverListRes } = useServerList();
  const serverList = serverListRes?.rows || [];
  console.log(dataOne, dataTwo);
  return (
    <div className="flex flex-col gap-4">
      {agentAccountStats?.data && <AgentAccountInfo agentAccountData={agentAccountStats.data} />}
      {agentCommissionStats?.data && (
        <AgentCommissionInfo agentCommissionData={agentCommissionStats.data} />
      )}
      <AgentNewAccountInfo userId={userId} />
      <AgentFundInfo userId={userId} serverList={serverList} />
      <AgentTradeInfo userId={userId} serverList={serverList} />
    </div>
  );
};
