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
import { ToolTip } from '@/components/common/ToolTip';
import { CrmSelect } from '@/components/common/CrmSelect';
import { Info } from 'lucide-react';
import { useEffect, useMemo, useState, type FC } from 'react';
// import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
const options = [
  { label: '7天内', value: 1 },
  { label: '15天内', value: 2 },
  { label: '30天内', value: 3 },
  { label: '3月内', value: 4 },
  { label: '半年内', value: 5 },
  { label: '一年内', value: 6 },
];

const DataOverviewCard: FC = () => {
  const now = dayjs(new Date()).format('YYYY-MM-DD HH:mm');
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
    <div className="bg-card mb-4 rounded-lg shadow">
      <div className="flex justify-between border-b p-4">
        <div className="flex">
          <div>数据总览</div>
          <ToolTip content={<div>it is some info in tooltip</div>}>
            <Info />
          </ToolTip>
        </div>
        <div>数据更新时间: {now}</div>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="rounded-lg border p-3">
          <div className="relative">
            <div>今日入金</div>
            <div>{todayData[0]}</div>
            <div
              className={cn(
                'absolute top-0 right-0 min-w-10 rounded-full p-1 text-xs',
                difference.input >= 0 ? 'bg-green-500' : 'bg-red-500',
              )}
            >
              {percentageFormat(difference.input)}
            </div>
          </div>
          <div>
            <BarChart
              title=""
              labels={inputChartData.labels}
              datasets={inputChartData.datasets}
              height={200}
              hideLegend={true}
              options={{
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="relative">
            <div>今日出金</div>
            <div>{todayData[1]}</div>
            <div
              className={cn(
                'absolute top-0 right-0 min-w-10 rounded-full p-1 text-center text-xs',
                difference.output >= 0 ? 'bg-green-500' : 'bg-red-500',
              )}
            >
              {percentageFormat(difference.output)}
            </div>
          </div>
          <div>
            <BarChart
              title=""
              labels={outputChartData.labels}
              datasets={outputChartData.datasets}
              height={200}
              hideLegend={true}
              options={{
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          {sumData.map((item, index) => (
            <div key={index} className="rounded-lg border p-3">
              <div className="text-muted-foreground text-sm">{item.title}</div>
              <div
                className="line-clamp-1 text-lg font-semibold overflow-ellipsis"
                title={`${item.value}`}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
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

  const chartData = useMemo(() => {
    return data?.rows
      ? {
          labels: data?.rows.map(item => item.symbol || ''),
          datasets: [
            {
              data: data?.rows.map(item => item.amount),
            },
          ],
        }
      : { labels: [''], datasets: [{ data: [100] }] };
  }, [data?.rows]);

  return (
    <div className="bg-card mb-4 rounded-lg p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <div>交易品种概览</div>
        <CrmSelect
          onValueChange={setServerId}
          options={servers}
          value={serverId}
          showRowValue={false}
          className="h-4 w-40"
          placeholder="选择服务器"
        />
        <CrmSelect
          onValueChange={setType}
          options={options}
          value={type}
          className="h-4 w-25"
          placeholder="选择时间"
        />
      </div>
      <div className="mt-4 min-h-75">
        {isLoading ? (
          <div>loading</div>
        ) : (
          <PieChart labels={chartData.labels} datasets={chartData.datasets} height={300} />
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
      },
      {
        label: '入金',
        data: dataArr.map(item => item?.[0] || 0),
        borderColor: 'rgba(145, 204, 117, 1)',
        backgroundColor: 'rgba(145, 204, 117, 0.5)',
      },
      {
        label: '净流入/流出',
        data: dataArr.map(item => (item?.[0] || 0) - (item?.[1] || 0)),
        borderColor: 'rgba(250, 200, 88, 1)',
        backgroundColor: 'rgba(250, 200, 88, 0.5)',
      },
    ];
    return { labels, datasets };
  }, [data]);
  return (
    <div className="bg-card rounded-lg p-6 shadow">
      <div className="flex justify-between">
        <div>出入金总览</div>
        <CrmSelect
          onValueChange={setType}
          options={options}
          value={type}
          className="h-4 w-25"
          placeholder="选择时间"
        />
      </div>
      <div className="mt-4 min-h-75">
        {isLoading ? (
          <div>loading</div>
        ) : (
          <AreaChart
            labels={chartData?.labels || []}
            datasets={chartData?.datasets || []}
            title="出入金总览"
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
    <div className="bg-card mb-4 rounded-lg p-6 shadow">
      <div className="flex justify-between">
        <div>账户开通概览</div>
        <CrmSelect
          onValueChange={setType}
          options={options}
          value={type}
          className="h-4 w-25"
          placeholder="选择时间"
        />
      </div>
      <div className="mt-4 min-h-75">
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
    <div className="bg-card mb-4 rounded-lg p-6 shadow">
      <div className="flex justify-between">
        <div>在途资金预览</div>
        <CrmSelect
          onValueChange={setType}
          options={options}
          value={type}
          className="h-4 w-25"
          placeholder="选择时间"
        />
      </div>
      <div className="mt-4 min-h-75">
        {isLoading ? (
          <div>loading</div>
        ) : (
          <BarChart
            labels={chartData?.labels || []}
            datasets={chartData?.datasets || []}
            title="在途资金预览"
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

export function HomePage() {
  const [serverList, setServerList] = useState<ServerItem[]>([]);
  const { data: serverListRes } = useServerList();
  useEffect(() => {
    if (serverListRes && serverListRes.rows) {
      setServerList(serverListRes.rows);
    }
  }, [serverListRes]);

  return (
    <div className="">
      <DataOverviewCard />
      <div className="mb-6">
        <SymbolReportPieChart serverList={serverList} />
        <RegCountReportLineChart serverList={serverList} />
        <DepositAllReportBarChart />
        <WithDrawReportAreaChart />
      </div>
    </div>
  );
}
