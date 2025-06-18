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
    horizontal?: boolean;
    height?: number;
    options?: ChartOptions<'bar'>;
    hideLegend?: boolean;
  }
> = ({
  title = 'Bar Chart',
  labels,
  datasets,
  height = 300,
  horizontal = false,
  options = {},
  hideLegend = false,
}) => {
  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
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
    ...options,
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
