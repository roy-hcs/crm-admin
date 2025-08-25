import { TooltipItem } from 'chart.js';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function DepositWithdrawChart({ height = 300 }) {
  const { t } = useTranslation();
  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // 贴合图片走势的数据
  const depositData = [100, 600, 600, 900, 1300, 1200, 900, 1100, 700, 900, 1200, 1100];
  const withdrawalData = [100, 800, 900, 400, 1000, 1000, 500, 1200, 500, 700, 1000, 600];
  const netData = depositData.map((v, i) => v - withdrawalData[i]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'home.TodayDeposit',
        data: depositData,
        fill: true,
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34,197,94,0.08)',
        pointRadius: 0,
        tension: 0,
      },
      {
        label: 'home.TodayWithdraw',
        data: withdrawalData,
        fill: true,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59,130,246,0.08)',
        pointRadius: 0,
        tension: 0,
      },
      {
        label: 'home.Net',
        data: netData,
        fill: true,
        borderColor: '#64748B',
        backgroundColor: 'rgba(100,116,139,0.08)',
        pointRadius: 0,
        tension: 0,
      },
    ],
  };
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (tooltipItem: TooltipItem<'line'>) {
            // tooltipItem.dataset.label 是数据集名字
            // tooltipItem.parsed.y 是当前点的Y值
            return `${t(tooltipItem.dataset.label ?? '')}: ${tooltipItem.parsed.y} USD`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 2000,
        ticks: {
          stepSize: 500,
          callback: (value: unknown) => `${value} USD`,
        },
        grid: { color: '#E5E7EB' },
      },
    },
  };
  const topStats = [
    {
      label: 'home.TodayDeposit',
      value: '1,999.01',
      color: '#22C55E',
    },
    {
      label: 'home.TodayWithdraw',
      value: '1,999.01',
      color: '#3B82F6',
    },
    {
      label: 'home.Net',
      value: '1,999.01',
      color: '#64748B',
    },
  ];

  return (
    <div>
      <div className="mb-8 flex gap-12">
        {topStats.map(stat => (
          <div key={stat.label} className="flex flex-col">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: stat.color,
                }}
              ></span>
              <span>{t(stat.label)}</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 18 }}>
              {stat.value} <span style={{ fontWeight: 400, fontSize: 14 }}>USD</span>
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={options} height={height} />
      </div>
    </div>
  );
}
