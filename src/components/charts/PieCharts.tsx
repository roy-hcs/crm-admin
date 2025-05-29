import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import type { FC } from 'react';
import { Pie } from 'react-chartjs-2';

// Register the components we need
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  title?: string;
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor?: string[];
    hoverBackgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
  height?: number;
}

export const PieChart: FC<PieChartProps> = ({
  title = 'Pie Chart',
  labels,
  datasets,
  height = 300,
}) => {
  const options: ChartOptions<'pie'> = {
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

  // Generate theme-compatible colors if not provided
  const generateThemeColors = (count: number) => {
    return Array.from({ length: count }, (_, i) => `var(--chart-${(i % 5) + 1})`);
  };

  // Format the dataset with theme-compatible colors
  const chartData: ChartData<'pie'> = {
    labels,
    datasets: datasets.map(dataset => {
      const colorCount = dataset.data.length;
      return {
        data: dataset.data,
        backgroundColor: dataset.backgroundColor || generateThemeColors(colorCount),
        hoverBackgroundColor: dataset.hoverBackgroundColor || generateThemeColors(colorCount),
        borderColor: dataset.borderColor || Array(colorCount).fill('white'),
        borderWidth: dataset.borderWidth || 2,
      };
    }),
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Pie options={options} data={chartData} />
    </div>
  );
};
