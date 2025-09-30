import {
  useDepositAllReport,
  useFundFlowReport,
  useRegCountReport,
  useServerList,
  useSumReport,
  useSymbolReport,
} from '@/api/hooks/system/system';
import { ServerItem } from '@/api/hooks/system/types';
import { BarChart } from '@/components/charts/BarCharts';
import { LineChart } from '@/components/charts/LineCharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stepper from '@/components/Stepper';
import TodoList from '@/components/TodoList';
import { ReactNode, useEffect, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  CreditCardIcon,
  ChevronRight,
  EllipsisVertical,
  PenLine,
  TriangleAlert,
  ServerCog,
} from 'lucide-react';
import DepositWithdrawChart from './components/DepositWithdrawChart';
import TradingVarietiesChart from './components/TradingVarietiesChart';

const DataOverviewCard: FC = () => {
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
      <div className="grid gap-4 sm:grid-cols-[1fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr_1fr]">
        {/* 今日入金 */}
        <div className="bg-card grid grid-cols-1 rounded-lg border px-3 py-4">
          <div className="relative">
            <div className="text-sm">{t('home.TodayDeposit')}</div>
            <div className="mt-2 mb-2">
              <span
                className="mr-1 text-xl font-semibold"
                style={{
                  verticalAlign: 'bottom',
                  lineHeight: '24px',
                  display: 'inline-block',
                  height: '24px',
                }}
              >
                {todayData[0]}
              </span>
              <span className="text-xs font-normal">USD</span>
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
        <div className="bg-card grid grid-cols-1 rounded-lg border px-3 py-4">
          <div className="relative">
            <div className="text-sm">{t('home.TodayWithdraw')}</div>
            <div className="mt-2 mb-2">
              <span
                className="mr-1 text-xl font-semibold"
                style={{
                  verticalAlign: 'bottom',
                  lineHeight: '24px',
                  display: 'inline-block',
                  height: '24px',
                }}
              >
                {todayData[1]}
              </span>
              <span className="text-xs font-normal">USD</span>
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

const NavList: FC = () => {
  const { t } = useTranslation();
  // 列表内容配置（可根据实际路由修改 to）
  const navItems = [
    { label: 'home.nav.Deposit', icon: CreditCardIcon, to: '/deposit' },
    { label: 'home.nav.Withdrawal', icon: CreditCardIcon, to: '/withdrawal' },
    { label: 'home.nav.InternalTransfer', icon: CreditCardIcon, to: '/internal-transfer' },
    { label: 'home.nav.WalletFlow', icon: CreditCardIcon, to: '/wallet-flow' },
    { label: 'home.nav.OrderHistory', icon: CreditCardIcon, to: '/order-history' },
    { label: 'home.nav.OpenPositions', icon: CreditCardIcon, to: '/open-positions' },
    { label: 'home.nav.PendingOrder', icon: CreditCardIcon, to: '/pending-order' },
    { label: 'home.nav.TAFlow', icon: CreditCardIcon, to: '/ta-flow' },
  ];
  return (
    <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {navItems.map(item => (
        <Link
          key={item.label}
          to={item.to}
          className="bg-component hover:bg-component/80 flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition"
        >
          <item.icon className="mr-2 size-6" />
          <span className="text-sm font-normal">{t(item.label)}</span>
        </Link>
      ))}
    </div>
  );
};

const SymbolReportPieChart: FC<{ serverList: ServerItem[] }> = ({ serverList }) => {
  const { t } = useTranslation();
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

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold">
            {t('home.TradingPairOverview')}
          </span>
        </div>
        <div onClick={() => setType('2')}>
          <EllipsisVertical className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-12 min-h-75">
        {isLoading ? <div>{t('common.loading')}</div> : <TradingVarietiesChart />}
      </div>
    </div>
  );
};

const WithDrawReportAreaChart: FC = () => {
  const { t } = useTranslation();
  const [type, setType] = useState('1');
  const { isLoading } = useFundFlowReport(type);
  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold">
            {t('home.WithDrawReport')}
          </span>
        </div>
        <div onClick={() => setType('2')}>
          <EllipsisVertical className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-7 min-h-75">
        {isLoading ? <div>{t('common.loading')}</div> : <DepositWithdrawChart height={262} />}
      </div>
    </div>
  );
};

const RegCountReportLineChart: FC<{ serverList: ServerItem[] }> = () => {
  const { t } = useTranslation();
  const [type, setType] = useState('1');
  const { data, isLoading } = useRegCountReport(type);
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('home.NewRealAccount'),
        data: dataArr.map(item => item?.[0] || 0),
      },
      {
        label: t('home.NewDemoAccount'),
        data: dataArr.map(item => item?.[1] || 0),
      },
      {
        label: t('home.NewCRMUser'),
        data: dataArr.map(item => item?.[2] || 0),
      },
    ];
    return { labels, datasets };
  }, [data, t]);

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold">
            {t('home.AccountOverview')}
          </span>
        </div>
        <div onClick={() => setType('2')}>
          <EllipsisVertical className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-6.5 mb-9 flex gap-20 px-6">
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal">{t('home.NewCRMUser')}</div>
          <div className="h-5 text-base leading-5 font-semibold">5</div>
        </div>
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal">{t('home.NewRealAccount')}</div>
          <div className="h-5 text-base leading-5 font-semibold">5</div>
        </div>
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal">{t('home.NewDemoAccount')}</div>
          <div className="h-5 text-base leading-5 font-semibold">5</div>
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

const CustomerTransactionOverview: FC = () => {
  const { t } = useTranslation();
  const [type, setType] = useState('1');
  const { data, isLoading } = useDepositAllReport(type);
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('home.AuditedWithdrawalAll'),
        data: dataArr.map(item => item?.[1] || 0),
      },
      {
        label: t('home.PendingWithdrawalAll'),
        data: dataArr.map(item => item?.[0] || 0),
      },
    ];
    return { labels, datasets };
  }, [data, t]);

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold">
            {t('home.CustomerTrading')}
          </span>
        </div>
        <div className="flex gap-4" onClick={() => setType('2')}>
          <div>
            <ServerCog className="h-4 w-4" />
          </div>
          <div>
            <EllipsisVertical className="h-4 w-4" />
          </div>
        </div>
      </div>
      {/* tabs */}
      <div className="mt-3">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="dark:bg-accent bg-slate-100">
            <TabsTrigger value="account">{t('home.PositionProfitLoss')}</TabsTrigger>
            <TabsTrigger value="volume">{t('home.TradingVolume')}</TabsTrigger>
            <TabsTrigger value="order">{t('home.TradingOrder')}</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            {/* 数据概览 */}
            <div className="mb-6 flex gap-20 px-6">
              <div>
                <div className="mb-1 h-4 text-xs leading-4 font-normal">{t('home.NetProfit')}</div>
                <div className="h-5 text-base leading-5 font-semibold">5</div>
              </div>
              <div>
                <div className="mb-1 h-4 text-xs leading-4 font-normal">{t('home.GrossLoss')}</div>
                <div className="h-5 text-base leading-5 font-semibold">5</div>
              </div>
              <div>
                <div className="mb-1 h-4 text-xs leading-4 font-normal">
                  {t('home.NetProfitToday')}
                </div>
                <div className="h-5 text-base leading-5 font-semibold">5</div>
              </div>
            </div>
            {/* 图表 */}
            <div className="min-h-75">
              {isLoading ? (
                <div>{t('common.loading')}</div>
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
          <TabsContent value="volume">volume</TabsContent>
          <TabsContent value="order">order</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const DepositAllReportBarChart: FC = () => {
  const { t } = useTranslation();
  const [type, setType] = useState('1');
  const { data, isLoading } = useDepositAllReport(type);
  const chartData = useMemo(() => {
    if (!data || !data.data) return { labels: [], datasets: [] };
    const rowData = data.data;
    const labels = Object.keys(rowData);
    const dataArr = Object.values(rowData);
    const datasets = [
      {
        label: t('home.AuditedWithdrawalAll'),
        data: dataArr.map(item => item?.[1] || 0),
      },
      {
        label: t('home.PendingWithdrawalAll'),
        data: dataArr.map(item => item?.[0] || 0),
      },
    ];
    return { labels, datasets };
  }, [data, t]);

  return (
    <div className="bg-card mb-6 rounded-lg border p-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div className="h-[24px]">
          <span className="inline-block text-xl leading-6 font-semibold">
            {t('home.InTransitFunds')}
          </span>
        </div>
        <div onClick={() => setType('2')}>
          <EllipsisVertical className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-6.5 mb-9 flex gap-20 px-6">
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal">
            {t('home.AuditedDepositToday')}
          </div>
          <div className="h-5 text-base leading-5 font-semibold">0.00(USD)</div>
        </div>
        <div>
          <div className="mb-1 h-4 text-xs leading-4 font-normal">
            {t('home.PendingDepositToday')}
          </div>
          <div className="h-5 text-base leading-5 font-semibold">0.00(USD)</div>
        </div>
      </div>
      <div className="min-h-75">
        {isLoading ? (
          <div>{t('common.loading')}</div>
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
  // 数据等待对接 不加多语言
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
          <div className="mb-1 text-sm leading-3.5 font-medium">Abnormal server connection</div>
          <div className="text-xs leading-3 font-normal">服务器：ABC Limited-Live</div>
          <div className="text-xs leading-3 font-normal">备注： </div>
          <div className="text-xs leading-3 font-normal">原因：No connection</div>
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
          <TriangleAlert className="h-4 w-4 text-[#EB5757]" />
        </div>
        <span className="inline-block text-xl leading-5 font-semibold">
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
  // 数据等待对接 不加多语言
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
          <span className="text-xl leading-5 font-semibold">代办</span>
        </div>
        <div>
          <PenLine className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-6">
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
    </div>
  );
};

export function HomePage() {
  const { t } = useTranslation();
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
          <div className="text-xl font-semibold">{t('home.DataOverview')}</div>
        </div>
        <div className="text-xs font-normal">
          {t('home.DataUpdateTime')}: {now}
        </div>
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
          <div className="bg-card mb-6 w-[296px] rounded-lg border py-4">
            <Step />
          </div>
          {/* 代办 */}
          <div className="bg-card w-[296px] rounded-lg border p-6">
            <Todo />
          </div>
        </div>
      </div>
    </>
  );
}
