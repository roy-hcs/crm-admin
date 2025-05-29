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
}

export const LineChart: FC<LineChartProps> = ({
  title = 'Line Chart',
  labels,
  datasets,
  height = 300,
}) => {
  const options: ChartOptions<'line'> = {
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
    },
  };

  // Format the datasets with theme-compatible colors
  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor || `var(--chart-${(index % 5) + 1})`,
      backgroundColor: dataset.backgroundColor || `var(--chart-${(index % 5) + 1})`,
      tension: dataset.tension || 0.3,
      borderWidth: 2,
      pointRadius: 3,
    })),
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Line options={options} data={chartData} />
    </div>
  );
};
