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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart: FC<
  ChartData<'bar'> & {
    title?: string;
    options?: ChartOptions<'bar'>;
    hideLegend?: boolean;
  }
> = ({ title = '', options = {}, hideLegend = false, labels, datasets }) => {
  const barOptions: ChartOptions<'bar'> = options
    ? {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        ...options,
      }
    : {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
          legend: {
            display: !hideLegend,
            position: 'top' as const,
          },
          title: {
            display: Boolean(title),
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
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      };

  const chartData: ChartData<'bar'> = {
    labels,
    datasets,
  };

  return (
    <div className="h-full w-full">
      <Bar options={barOptions} data={chartData} />
    </div>
  );
};
