import { generateColorfulColor } from '@/lib/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import type { FC } from 'react';
import { Bar } from 'react-chartjs-2';

// Register the components we need
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart: FC<
  ChartData<'bar'> & {
    title: string;
    height?: number;
    options?: ChartOptions<'bar'>;
    hideLegend?: boolean;
    horizontal?: boolean; // 横向柱状图
    vertical?: boolean; // 纵向柱状图
  }
> = ({
  title = 'Bar Chart',
  labels,
  datasets,
  height = 300,
  horizontal = true,
  vertical = true,
  options = {},
  hideLegend = false,
}) => {
  // 依据横/纵向动态配置 x/y 的网格与边框

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      legend: {
        display: !hideLegend,
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    // 先应用外部 options，再用我们明确的 scales 覆盖关键项，避免 any 与类型问题
    ...options,
    scales: {
      x: horizontal
        ? {
            // 横向柱：x 为数值轴（展示横向参考线）
            grid: {
              display: false,
              color: '#E5E7EB',
              lineWidth: 2,
              // @ts-expect-error Chart.js 4 支持 dash，但类型定义可能缺失
              dash: [10, 6],
            },
            border: { display: false },
          }
        : {
            display: false,
          },
      y: vertical
        ? {
            // 纵向柱：y 为数值轴（展示横向参考线）
            grid: {
              display: true,
              color: '#E5E7EB',
              lineWidth: 2,
              // @ts-expect-error Chart.js 4 支持 dash，但类型定义可能缺失
              dash: [10, 6],
            },
            border: { display: false },
          }
        : {
            display: false,
          },
    },
  };

  const chartData: ChartData<'bar'> = {
    labels,
    datasets: datasets.map((dataset, index) => {
      const color = dataset.borderColor || generateColorfulColor(index);
      return {
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor || color,
        hoverBackgroundColor: dataset.hoverBackgroundColor || color + '80',
        borderColor: dataset.borderColor || 'transparent',
        borderWidth: dataset.borderWidth || 1,
        borderRadius: 4,
      };
    }),
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Bar options={barOptions} data={chartData} />
    </div>
  );
};
