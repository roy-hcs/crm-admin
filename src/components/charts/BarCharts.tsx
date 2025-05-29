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
  ChartData<'bar'> & { title: string; horizontal?: boolean; height?: number }
> = ({ title = 'Bar Chart', labels, datasets, height = 300, horizontal = false }) => {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  // Format the datasets with theme-compatible colors
  const chartData: ChartData<'bar'> = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor || `var(--chart-${(index % 5) + 1})`,
      hoverBackgroundColor: dataset.hoverBackgroundColor || `var(--chart-${(index % 5) + 1})`,
      borderColor: dataset.borderColor || 'transparent',
      borderWidth: dataset.borderWidth || 1,
      borderRadius: 4,
    })),
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};
