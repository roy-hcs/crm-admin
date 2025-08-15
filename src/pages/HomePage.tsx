import {
  useDepositAllReport,
  useFundFlowReport,
  useRegCountReport,
  useServerList,
  useSumReport,
  useSymbolReport,
} from '@/api/hooks/system/system';
import { ServerItem } from '@/api/hooks/system/types';
import { AreaChart } from '@/components/charts/AreaCharts';
import { BarChart } from '@/components/charts/BarCharts';
import { LineChart } from '@/components/charts/LineCharts';
import { PieChart } from '@/components/charts/PieCharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ToolTip } from '@/components/common/ToolTip';
// import { CrmSelect } from '@/components/common/CrmSelect';
import Stepper from '@/components/Stepper';
import TodoList from '@/components/TodoList';
// import { Info } from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState, type FC } from 'react';
// import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CreditCardIcon } from 'lucide-react';
// const options = [
//   { label: '7天内', value: 1 },
//   { label: '15天内', value: 2 },
//   { label: '30天内', value: 3 },
//   { label: '3月内', value: 4 },
//   { label: '半年内', value: 5 },
//   { label: '一年内', value: 6 },
// ];

const DataOverviewCard: FC = () => {
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
      { title: 'CRM用户数（个）', value: sum?.crmUser || 0 },
      { title: '交易账户数（个）', value: sum?.dealAccount || 0 },
      { title: '入金待审（USD）', value: sum?.deposit || 0 },
      { title: '出金待审（USD）', value: sum?.withdraw || 0 },
    ];
  }, [data]);
  useEffect(() => {
    if (withdrawAndDepositData && withdrawAndDepositData.data) {
      setTodayData(withdrawAndDepositData.data[today] || [0, 0]);
    }
  }, [withdrawAndDepositData, today]);

  return (
    <div className="mb-6 rounded-lg">
      <div className="grid gap-4 sm:grid-cols-[1fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr_1fr]">
        {/* 今日入金 */}
        <div className="grid grid-cols-1 rounded-lg border px-3 py-4">
          <div className="relative">
            <div className="text-sm text-[#1E1E1E]">今日入金</div>
            <div className="mt-2 mb-2">
              <span
                className="mr-1 text-xl font-semibold text-[#1E1E1E]"
                style={{
                  verticalAlign: 'bottom',
                  lineHeight: '24px',
                  display: 'inline-block',
                  height: '24px',
                }}
              >
                {todayData[0]}
              </span>
              <span className="text-xs font-normal text-[#1E1E1E]">USD</span>
            </div>
            <div
              className={cn(
                'inline-block min-w-10 rounded-lg px-1 py-0.5 text-center text-xs text-[#fff]',
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
        <div className="grid grid-cols-1 rounded-lg border px-3 py-4">
          <div className="relative">
            <div className="text-sm text-[#1E1E1E]">今日出金</div>
            <div className="mt-2 mb-2">
              <span
                className="mr-1 text-xl font-semibold text-[#1E1E1E]"
                style={{
                  verticalAlign: 'bottom',
                  lineHeight: '24px',
                  display: 'inline-block',
                  height: '24px',
                }}
              >
                {todayData[1]}
              </span>
              <span className="text-xs font-normal text-[#1E1E1E]">USD</span>
            </div>
            <div
              className={cn(
                'inline-block min-w-10 rounded-lg px-1 py-0.5 text-center text-xs text-[#fff]',
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
              <div className="rounded-lg border px-3 py-4" key={index}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#1E1E1E]">{it.title}</span>
                  </div>
                  <div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="#1E1E1E"
                        stroke-width="0.666667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="mr-1 align-bottom text-xl leading-6 font-semibold text-[#1E1E1E]">
                    {it.value}
                  </span>
                  <span className="text-xs font-normal text-[#1E1E1E]">USD</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* 出入金待审 */}
        <div className="grid gap-4">
          {sumData.slice(2, 4).map((it, index) => {
            return (
              <div className="rounded-lg border px-3 py-4" key={index}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#1E1E1E]">{it.title}</span>
                  </div>
                  <div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="#1E1E1E"
                        stroke-width="0.666667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="mr-1 align-bottom text-xl leading-6 font-semibold text-[#1E1E1E]">
                    {it.value}
                  </span>
                  <span className="text-xs font-normal text-[#1E1E1E]">USD</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const NavList: FC = () => {
  // 列表内容配置（可根据实际路由修改 to）
  const navItems = [
    { label: 'Deposit', icon: CreditCardIcon, to: '/deposit' },
    { label: 'Withdrawal', icon: CreditCardIcon, to: '/withdrawal' },
    { label: 'Internal Transfer', icon: CreditCardIcon, to: '/internal-transfer' },
    { label: 'Wallet Flow', icon: CreditCardIcon, to: '/wallet-flow' },
    { label: 'Order History', icon: CreditCardIcon, to: '/order-history' },
    { label: 'Open Positions', icon: CreditCardIcon, to: '/open-positions' },
    { label: 'Pending Order', icon: CreditCardIcon, to: '/pending-order' },
    { label: 'TA Flow', icon: CreditCardIcon, to: '/ta-flow' },
  ];
  return (
    <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {navItems.map(item => (
        <Link
          key={item.label}
          to={item.to}
          className="flex items-center gap-2 rounded-lg bg-[#F6F7F9] px-4 py-2 text-sm transition hover:bg-[#F6F7F9]"
        >
          <item.icon className="mr-2 size-6" />
          <span className="text-sm font-normal text-[#1E1E1E]">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

const SymbolReportPieChart: FC<{ serverList: ServerItem[] }> = ({ serverList }) => {
  const [type, setType] = useState('1');
  const [serverId, setServerId] = useState<string>('');
  const { data, isLoading } = useSymbolReport({
    type,
    isAsc: 'desc',
    serverId,
    pageNum: NaN,
  });
  console.log(data, 'data===data');
  useEffect(() => {
    if (serverList.length > 0) {
      setServerId(serverList[0].id);
    }
  }, [serverList]);
  const servers = useMemo(() => {
    return serverList.map(server => ({
      label: server.serverName,
      value: server.id,
    }));
  }, [serverList]);
  console.log(servers, 'servers');
  const chartData = useMemo(() => {
    return data?.rows
      ? {
          labels: data?.rows.map(item => {
            return item.symbol ?? '';
          }),
          datasets: [
            {
              data: data?.rows.map(item => item.amount ?? 0),
            },
          ],
        }
      : {
          labels: [''],
          datasets: [{ data: [100] }],
        };
  }, [data?.rows]);

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold text-[#1E1E1E]">
            交易品种概览
          </span>
        </div>
        <div onClick={() => setType('2')}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00016 8.6665C8.36835 8.6665 8.66683 8.36803 8.66683 7.99984C8.66683 7.63165 8.36835 7.33317 8.00016 7.33317C7.63197 7.33317 7.3335 7.63165 7.3335 7.99984C7.3335 8.36803 7.63197 8.6665 8.00016 8.6665Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00016 3.99984C8.36835 3.99984 8.66683 3.70136 8.66683 3.33317C8.66683 2.96498 8.36835 2.6665 8.00016 2.6665C7.63197 2.6665 7.3335 2.96498 7.3335 3.33317C7.3335 3.70136 7.63197 3.99984 8.00016 3.99984Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00016 13.3332C8.36835 13.3332 8.66683 13.0347 8.66683 12.6665C8.66683 12.2983 8.36835 11.9998 8.00016 11.9998C7.63197 11.9998 7.3335 12.2983 7.3335 12.6665C7.3335 13.0347 7.63197 13.3332 8.00016 13.3332Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="mt-4 min-h-75">
        {isLoading ? (
          <div>loading</div>
        ) : data?.rows && data.rows.length ? (
          <PieChart labels={chartData.labels} datasets={chartData.datasets} height={300} />
        ) : (
          <div className="text-center leading-75">暂无数据</div>
        )}
      </div>
    </div>
  );
};

const WithDrawReportAreaChart: FC = () => {
  const [type, setType] = useState('1');
  const { data, isLoading } = useFundFlowReport(type);
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: '出金',
        data: dataArr.map(item => item?.[1] || 0),
        borderColor: 'rgba(84, 112, 198, 1)',
        backgroundColor: 'rgba(84, 112, 198, 0.5)',
        fill: true,
      },
      {
        label: '入金',
        data: dataArr.map(item => item?.[0] || 0),
        borderColor: 'rgba(145, 204, 117, 1)',
        backgroundColor: 'rgba(145, 204, 117, 0.5)',
        fill: true,
      },
      {
        label: '净流入/流出',
        data: dataArr.map(item => (item?.[0] || 0) - (item?.[1] || 0)),
        borderColor: 'rgba(250, 200, 88, 1)',
        backgroundColor: 'rgba(250, 200, 88, 0.5)',
        fill: true,
      },
    ];
    return { labels, datasets };
  }, [data]);
  console.log(chartData, 'chartData');
  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold text-[#1E1E1E]">
            出入金总览
          </span>
        </div>
        <div onClick={() => setType('2')}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00016 8.6665C8.36835 8.6665 8.66683 8.36803 8.66683 7.99984C8.66683 7.63165 8.36835 7.33317 8.00016 7.33317C7.63197 7.33317 7.3335 7.63165 7.3335 7.99984C7.3335 8.36803 7.63197 8.6665 8.00016 8.6665Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00016 3.99984C8.36835 3.99984 8.66683 3.70136 8.66683 3.33317C8.66683 2.96498 8.36835 2.6665 8.00016 2.6665C7.63197 2.6665 7.3335 2.96498 7.3335 3.33317C7.3335 3.70136 7.63197 3.99984 8.00016 3.99984Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00016 13.3332C8.36835 13.3332 8.66683 13.0347 8.66683 12.6665C8.66683 12.2983 8.36835 11.9998 8.00016 11.9998C7.63197 11.9998 7.3335 12.2983 7.3335 12.6665C7.3335 13.0347 7.63197 13.3332 8.00016 13.3332Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="mt-4 min-h-75">
        {isLoading ? (
          <div>loading</div>
        ) : (
          <AreaChart
            height={262}
            labels={chartData?.labels || []}
            datasets={chartData?.datasets || []}
            title=""
            stacked={false}
          />
        )}
      </div>
    </div>
  );
};

const RegCountReportLineChart: FC<{ serverList: ServerItem[] }> = () => {
  const [type, setType] = useState('1');
  const { data, isLoading } = useRegCountReport(type);
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: '新增真实账号',
        data: dataArr.map(item => item?.[0] || 0),
      },
      {
        label: '新增模拟账号',
        data: dataArr.map(item => item?.[1] || 0),
      },
      {
        label: '新注册CRM账号',
        data: dataArr.map(item => item?.[2] || 0),
      },
    ];
    return { labels, datasets };
  }, [data]);

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold text-[#1E1E1E]">
            账户开通概览
          </span>
        </div>
        <div onClick={() => setType('2')}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00016 8.6665C8.36835 8.6665 8.66683 8.36803 8.66683 7.99984C8.66683 7.63165 8.36835 7.33317 8.00016 7.33317C7.63197 7.33317 7.3335 7.63165 7.3335 7.99984C7.3335 8.36803 7.63197 8.6665 8.00016 8.6665Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00016 3.99984C8.36835 3.99984 8.66683 3.70136 8.66683 3.33317C8.66683 2.96498 8.36835 2.6665 8.00016 2.6665C7.63197 2.6665 7.3335 2.96498 7.3335 3.33317C7.3335 3.70136 7.63197 3.99984 8.00016 3.99984Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00016 13.3332C8.36835 13.3332 8.66683 13.0347 8.66683 12.6665C8.66683 12.2983 8.36835 11.9998 8.00016 11.9998C7.63197 11.9998 7.3335 12.2983 7.3335 12.6665C7.3335 13.0347 7.63197 13.3332 8.00016 13.3332Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="mt-6.5 mb-9 flex gap-20 px-6">
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal text-[#1e1e1e]">
            新注册CRM账号(今日)
          </div>
          <div className="h-5 text-base leading-5 font-semibold text-[#1e1e1e]">5</div>
        </div>
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal text-[#1e1e1e]">
            新增真实账号(今日)
          </div>
          <div className="h-5 text-base leading-5 font-semibold text-[#1e1e1e]">5</div>
        </div>
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal text-[#1e1e1e]">
            新增模拟账号(今日)
          </div>
          <div className="h-5 text-base leading-5 font-semibold text-[#1e1e1e]">5</div>
        </div>
      </div>
      <div className="min-h-75">
        {isLoading ? (
          <div>loading</div>
        ) : (
          <LineChart
            labels={chartData?.labels || []}
            datasets={chartData?.datasets || []}
            title="账户开通概览"
          />
        )}
      </div>
    </div>
  );
};

const CustomerTransactionOverview: FC = () => {
  const [type, setType] = useState('1');
  const { data, isLoading } = useDepositAllReport(type);
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: '已审出金',
        data: dataArr.map(item => item?.[1] || 0),
      },
      {
        label: '待审入金',
        data: dataArr.map(item => item?.[0] || 0),
      },
    ];
    return { labels, datasets };
  }, [data]);

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold text-[#1E1E1E]">
            客户交易
          </span>
        </div>
        <div className="flex gap-4" onClick={() => setType('2')}>
          <div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2295_2041)">
                <path
                  d="M7.23483 9.84816L6.9795 10.4635M7.23483 9.84816C7.4775 9.9487 7.73737 10.0004 8.00004 10.0004C8.26271 10.0004 8.52281 9.94867 8.7655 9.84816M7.23483 9.84816C6.99216 9.74763 6.77144 9.60019 6.58571 9.41444C6.39999 9.22869 6.25267 9.00818 6.15216 8.7655M8.7655 9.84816C9.00818 9.74766 9.22869 9.60034 9.41444 9.41461C9.60019 9.22889 9.74753 9.00839 9.84807 8.76572M8.7655 9.84816L9.02016 10.4642M9.84807 8.76572C9.9486 8.52305 10.0004 8.26296 10.0004 8.00029C10.0004 7.73762 9.94867 7.47751 9.84816 7.23483M9.84807 8.76572L10.4635 9.02083M9.84816 7.23483C9.74766 6.99215 9.60034 6.77164 9.41461 6.58589C9.22889 6.40014 9.00839 6.25279 8.76572 6.15226M9.84816 7.23483L10.4635 6.9795M8.76572 6.15226C8.52305 6.05172 8.26296 5.99997 8.00029 5.99995C7.73762 5.99994 7.47751 6.05166 7.23483 6.15216M8.76572 6.15226L9.02083 5.53683M7.23483 6.15216L6.9795 5.53683M7.23483 6.15216C6.99215 6.25267 6.77164 6.39999 6.58589 6.58571C6.40014 6.77144 6.25279 6.99193 6.15226 7.2346M6.15216 8.7655C6.05166 8.52281 5.99994 8.26271 5.99995 8.00004C5.99997 7.73737 6.05172 7.47727 6.15226 7.2346M6.15216 8.7655L5.53683 9.02083M6.15226 7.2346L5.53683 6.9795M3.00016 6.66683H2.66683C2.31321 6.66683 1.97407 6.52635 1.72402 6.27631C1.47397 6.02626 1.3335 5.68712 1.3335 5.3335V2.66683C1.3335 2.31321 1.47397 1.97407 1.72402 1.72402C1.97407 1.47397 2.31321 1.3335 2.66683 1.3335H13.3335C13.6871 1.3335 14.0263 1.47397 14.2763 1.72402C14.5264 1.97407 14.6668 2.31321 14.6668 2.66683V5.3335C14.6668 5.68712 14.5264 6.02626 14.2763 6.27631C14.0263 6.52635 13.6871 6.66683 13.3335 6.66683H13.0002M3.00016 9.3335H2.66683C2.31321 9.3335 1.97407 9.47397 1.72402 9.72402C1.47397 9.97407 1.3335 10.3132 1.3335 10.6668V13.3335C1.3335 13.6871 1.47397 14.0263 1.72402 14.2763C1.97407 14.5264 2.31321 14.6668 2.66683 14.6668H13.3335C13.6871 14.6668 14.0263 14.5264 14.2763 14.2763C14.5264 14.0263 14.6668 13.6871 14.6668 13.3335V10.6668C14.6668 10.3132 14.5264 9.97407 14.2763 9.72402C14.0263 9.47397 13.6871 9.3335 13.3335 9.3335H13.0002M4.00016 12.0002H4.00683M4.00016 4.00016H4.00683"
                  stroke="#1E1E1E"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2295_2041">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.00016 8.6665C8.36835 8.6665 8.66683 8.36803 8.66683 7.99984C8.66683 7.63165 8.36835 7.33317 8.00016 7.33317C7.63197 7.33317 7.3335 7.63165 7.3335 7.99984C7.3335 8.36803 7.63197 8.6665 8.00016 8.6665Z"
                stroke="#1E1E1E"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.00016 3.99984C8.36835 3.99984 8.66683 3.70136 8.66683 3.33317C8.66683 2.96498 8.36835 2.6665 8.00016 2.6665C7.63197 2.6665 7.3335 2.96498 7.3335 3.33317C7.3335 3.70136 7.63197 3.99984 8.00016 3.99984Z"
                stroke="#1E1E1E"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.00016 13.3332C8.36835 13.3332 8.66683 13.0347 8.66683 12.6665C8.66683 12.2983 8.36835 11.9998 8.00016 11.9998C7.63197 11.9998 7.3335 12.2983 7.3335 12.6665C7.3335 13.0347 7.63197 13.3332 8.00016 13.3332Z"
                stroke="#1E1E1E"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* tabs */}
      <div className="mt-3">
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">平仓盈亏</TabsTrigger>
            <TabsTrigger value="volume">交易量</TabsTrigger>
            <TabsTrigger value="order">交易订单</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            {/* 数据概览 */}
            <div className="mb-6 flex gap-20 px-6">
              <div>
                <div className="mb-1 h-4 text-xs leading-4 font-normal text-[#1e1e1e]">
                  新注册CRM账号(今日)
                </div>
                <div className="h-5 text-base leading-5 font-semibold text-[#1e1e1e]">5</div>
              </div>
              <div>
                <div className="mb-1 h-4 text-xs leading-4 font-normal text-[#1e1e1e]">
                  新增真实账号(今日)
                </div>
                <div className="h-5 text-base leading-5 font-semibold text-[#1e1e1e]">5</div>
              </div>
              <div>
                <div className="mb-1 h-4 text-xs leading-4 font-normal text-[#1e1e1e]">
                  新增模拟账号(今日)
                </div>
                <div className="h-5 text-base leading-5 font-semibold text-[#1e1e1e]">5</div>
              </div>
            </div>
            {/* 图表 */}
            <div className="min-h-75">
              {isLoading ? (
                <div>loading</div>
              ) : (
                <BarChart
                  labels={chartData?.labels || []}
                  datasets={chartData?.datasets || []}
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
          <TabsContent value="volume">Change your volume here.</TabsContent>
          <TabsContent value="order">Change your order here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const DepositAllReportBarChart: FC = () => {
  const [type, setType] = useState('1');
  const { data, isLoading } = useDepositAllReport(type);
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: '已审出金',
        data: dataArr.map(item => item?.[1] || 0),
      },
      {
        label: '待审入金',
        data: dataArr.map(item => item?.[0] || 0),
      },
    ];
    return { labels, datasets };
  }, [data]);

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold text-[#1E1E1E]">
            在途资金预览
          </span>
        </div>
        <div onClick={() => setType('2')}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00016 8.6665C8.36835 8.6665 8.66683 8.36803 8.66683 7.99984C8.66683 7.63165 8.36835 7.33317 8.00016 7.33317C7.63197 7.33317 7.3335 7.63165 7.3335 7.99984C7.3335 8.36803 7.63197 8.6665 8.00016 8.6665Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00016 3.99984C8.36835 3.99984 8.66683 3.70136 8.66683 3.33317C8.66683 2.96498 8.36835 2.6665 8.00016 2.6665C7.63197 2.6665 7.3335 2.96498 7.3335 3.33317C7.3335 3.70136 7.63197 3.99984 8.00016 3.99984Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.00016 13.3332C8.36835 13.3332 8.66683 13.0347 8.66683 12.6665C8.66683 12.2983 8.36835 11.9998 8.00016 11.9998C7.63197 11.9998 7.3335 12.2983 7.3335 12.6665C7.3335 13.0347 7.63197 13.3332 8.00016 13.3332Z"
              stroke="#1E1E1E"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="mt-6.5 mb-9 flex gap-20 px-6">
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal text-[#1e1e1e]">
            已审入金(今日)
          </div>
          <div className="h-5 text-base leading-5 font-semibold text-[#1e1e1e]">
            0.00(USD) 待审入金(今日)
          </div>
        </div>
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal text-[#1e1e1e]">
            待审入金(今日)
          </div>
          <div className="h-5 text-base leading-5 font-semibold text-[#1e1e1e]">
            0.00(USD) 待审入金(今日)
          </div>
        </div>
      </div>
      <div className="min-h-75">
        {isLoading ? (
          <div>loading</div>
        ) : (
          <BarChart
            labels={chartData?.labels || []}
            datasets={chartData?.datasets || []}
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
    </div>
  );
};

const Step: FC = () => {
  const steps: {
    label: string;
    status: 'complete' | 'current' | 'upcoming';
    content: ReactNode;
  }[] = [
    {
      label: '2025/07/20 16：28：09',
      status: 'complete',
      content: (
        <div className="mb-3 rounded-lg border-[0.5px] border-[#EB575780] bg-[#EB57571A] p-3">
          <div className="mb-1 text-sm leading-3.5 font-medium text-[#1e1e1e]">
            Abnormal server connection
          </div>
          <div className="text-xs leading-3 font-normal text-[#1e1e1e]">
            服务器：ABC Limited-Live
          </div>
          <div className="text-xs leading-3 font-normal text-[#1e1e1e]">备注： </div>
          <div className="text-xs leading-3 font-normal text-[#1e1e1e]">原因：No connection</div>
        </div>
      ),
    },
    {
      label: '',
      status: 'complete',
      content: (
        <div className="mb-3 rounded-lg border-[0.5px] border-[#EB575780] bg-[#EB57571A] p-3 text-xs">
          若长时间未恢复连接，请检查交易服务器
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 px-3">
        <div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 9.99999V12.6667M12 15.3333H12.0066M18.4866 16L13.1533 6.66665C13.037 6.46146 12.8684 6.29078 12.6646 6.17203C12.4608 6.05329 12.2291 5.99072 11.9933 5.99072C11.7574 5.99072 11.5258 6.05329 11.322 6.17203C11.1182 6.29078 10.9496 6.46146 10.8333 6.66665L5.49995 16C5.38241 16.2036 5.32077 16.4346 5.32129 16.6697C5.32181 16.9047 5.38447 17.1355 5.50292 17.3385C5.62136 17.5416 5.79138 17.7097 5.99575 17.8259C6.20011 17.942 6.43156 18.0021 6.66662 18H17.3333C17.5672 17.9997 17.797 17.938 17.9995 17.8208C18.202 17.7037 18.3701 17.5354 18.487 17.3327C18.6038 17.1301 18.6653 16.9002 18.6653 16.6663C18.6652 16.4324 18.6036 16.2026 18.4866 16Z"
              stroke="#EB5757"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span className="inline-block text-xl leading-5 font-semibold text-[#1E1E1E]">
          Abnormal transaction server
        </span>
      </div>
      <div className="mx-auto max-w-2xl px-4.5">
        <Stepper steps={steps} />
      </div>
    </div>
  );
};

const Todo: FC = () => {
  type TodoItemType = {
    id: number;
    title: string;
    time: string;
    isEditing: boolean; // 是否可编辑
    editStatus: boolean; // 编辑状态
  };
  const initialTodos: TodoItemType[] = [
    {
      id: 5,
      title: 'Jackie Huang',
      time: '2025/07/20 16：28：09',
      isEditing: true,
      editStatus: false,
    },
    { id: 1, title: 'Account opening review', time: '5', isEditing: false, editStatus: false },
    { id: 2, title: 'Deposit review', time: '38', isEditing: false, editStatus: false },
    { id: 3, title: 'Withdrawal review', time: '1', isEditing: false, editStatus: false },
    { id: 4, title: 'Message moderation', time: '20', isEditing: false, editStatus: false },
  ];
  const [todos, setTodos] = useState(initialTodos);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl leading-5 font-semibold text-[#1E1E1E]">代办</span>
        </div>
        <div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.6663 13.9999H13.9996M14.1156 4.54126C14.4681 4.18888 14.6662 3.71091 14.6662 3.2125C14.6663 2.71409 14.4683 2.23607 14.116 1.8836C13.7636 1.53112 13.2856 1.33307 12.7872 1.33301C12.2888 1.33295 11.8108 1.53088 11.4583 1.88326L2.56096 10.7826C2.40618 10.9369 2.29171 11.127 2.22763 11.3359L1.34696 14.2373C1.32973 14.2949 1.32843 14.3562 1.3432 14.4145C1.35796 14.4728 1.38824 14.5261 1.43083 14.5686C1.47341 14.6111 1.52671 14.6413 1.58507 14.656C1.64343 14.6707 1.70467 14.6693 1.7623 14.6519L4.6643 13.7719C4.87308 13.7084 5.06308 13.5947 5.21763 13.4406L14.1156 4.54126Z"
              stroke="#1E1E1E"
              stroke-width="0.666667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
    </div>
  );
};

export function HomePage() {
  const [serverList, setServerList] = useState<ServerItem[]>([]);
  const now = dayjs(new Date()).format('YYYY-MM-DD HH:mm');
  const { data: serverListRes } = useServerList();
  useEffect(() => {
    if (serverListRes && serverListRes.rows) {
      setServerList(serverListRes.rows);
    }
  }, [serverListRes]);

  return (
    <>
      {/* 标题 */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex">
          <div className="text-xl font-semibold text-[#1E1E1E]">数据总览</div>
        </div>
        <div className="text-xs font-normal text-[#757F8D]">数据更新时间: {now}</div>
      </div>
      {/* 内容 */}
      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-[1fr_296px]">
        <div>
          {/* 数据概览 */}
          <DataOverviewCard />
          {/* 导航列表 */}
          <NavList />
          {/* 出入金总览 */}
          <WithDrawReportAreaChart />
          {/* 交易品种概览 */}
          <SymbolReportPieChart serverList={serverList} />
          {/* 账户开通概览 */}
          <RegCountReportLineChart serverList={serverList} />
          {/* 客户交易概览 */}
          <CustomerTransactionOverview />
          {/* 在途资金预览 */}
          <DepositAllReportBarChart />
        </div>
        <div className="lg:flex lg:gap-6 xl:block xl:gap-0">
          {/* 开户步骤进度条 */}
          <div className="bg-background mb-6 w-[296px] rounded-lg border py-4">
            <Step />
          </div>
          {/* 代办 */}
          <div className="bg-background w-[296px] rounded-lg border p-6">
            <Todo />
          </div>
        </div>
      </div>
    </>
  );
}
