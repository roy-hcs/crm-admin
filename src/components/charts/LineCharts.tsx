import { generateColorfulColor } from '@/lib/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import type { FC } from 'react';
import { Line } from 'react-chartjs-2';

// Register the components we need
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }[];
  height?: number;
  options?: ChartOptions<'line'>;
}

export const LineChart: FC<LineChartProps> = ({ labels, datasets, height = 300, options = {} }) => {
  const lineOptions: ChartOptions<'line'> = {
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

  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => {
      const color = dataset.borderColor || generateColorfulColor(index);
      return {
        label: dataset.label,
        data: dataset.data,
        borderColor: color,
        backgroundColor: dataset.backgroundColor || color + '80', // Add transparency for background
        tension: dataset.tension || 0.3,
        borderWidth: 2,
        pointRadius: 3,
      };
    }),
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Line options={lineOptions} data={chartData} />
    </div>
  );
};
