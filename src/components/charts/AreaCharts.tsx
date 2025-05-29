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
}

export const AreaChart: FC<AreaChartProps> = ({
  title = 'Area Chart',
  labels,
  datasets,
  height = 300,
  stacked = false,
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
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        stacked: stacked,
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
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
      <Line options={options} data={chartData} />
    </div>
  );
};

export default AreaChart;
