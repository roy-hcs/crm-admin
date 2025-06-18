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

export const LineChart: FC<LineChartProps> = ({
  title = 'Line Chart',
  labels,
  datasets,
  height = 300,
  options = {},
}) => {
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
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
