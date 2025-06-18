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
  options?: ChartOptions<'pie'>;
}

export const PieChart: FC<PieChartProps> = ({
  title,
  labels,
  datasets,
  height = 300,
  options = {},
}) => {
  const pieOptions: ChartOptions<'pie'> = {
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
    ...options,
  };

  const generateThemeColors = (count: number) => {
    const colorPalette = [
      '#FF6384', // pink/red
      '#36A2EB', // blue
      '#FFCE56', // yellow
      '#4BC0C0', // teal
      '#9966FF', // purple
      '#FF9F40', // orange
      '#32CD32', // lime green
      '#BA55D3', // medium orchid
      '#20B2AA', // light sea green
      '#FF6347', // tomato
    ];

    const result = [...colorPalette];

    if (count > colorPalette.length) {
      for (let i = colorPalette.length; i < count; i++) {
        // Generate a random vibrant color
        const h = Math.floor(Math.random() * 360); // hue (0-360)
        const s = Math.floor(70 + Math.random() * 30); // saturation (70-100%)
        const l = Math.floor(45 + Math.random() * 10); // lightness (45-55%)
        result.push(`hsl(${h}, ${s}%, ${l}%)`);
      }
    }

    return result.slice(0, count);
  };

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
      <Pie options={pieOptions} data={chartData} />
    </div>
  );
};
