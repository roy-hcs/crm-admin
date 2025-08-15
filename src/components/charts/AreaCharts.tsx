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
import type { FC } from 'react';
import { Line } from 'react-chartjs-2';

// Register the components we need, including the Filler plugin for area charts
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

interface AreaChartProps {
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    fillOpacity?: number;
    tension?: number;
  }[];
  height?: number;
  stacked?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  options?: ChartOptions<'line'>;
}

export const AreaChart: FC<AreaChartProps> = ({
  // title = 'Area Chart',
  labels,
  datasets,
  height = 300,
  // stacked = false,
  // xAxisLabel = '',
  // yAxisLabel = '',
  options = {},
}) => {
  const areaOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        // position: 'top' as const,
        display: false,
      },
      title: {
        // display: !!title,
        // text: title,
        display: false,
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
    scales: {
      x: {
        grid: {
          display: false, // 不显示纵向网格线
        },
      },
      y: {
        grid: {
          display: true,
          color: '#E5E7EB',
          dash: [6, 6],
          lineWidth: 1,
        } as never,
        border: {
          display: false, //关闭y轴线
        },
      },
    },
    ...options,
  };

  // Format the datasets with theme-compatible colors and fill
  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => {
      const colorVar = dataset.backgroundColor || `var(--chart-${(index % 5) + 1})`;

      return {
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.borderColor || colorVar,
        backgroundColor:
          typeof colorVar === 'string' && colorVar.startsWith('#')
            ? colorVar + '80' // Add 50% opacity if hex color to make all color area can be seen
            : colorVar,
        tension: dataset.tension || 0.3,
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
      };
    }),
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Line options={areaOptions} data={chartData} />
    </div>
  );
};

export default AreaChart;
