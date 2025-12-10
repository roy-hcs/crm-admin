import { cn } from '@/lib/utils';
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
import { useTranslation } from 'react-i18next';

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
  options?: ChartOptions<'pie'>;
}

export const PieChart: FC<PieChartProps> = ({ title, labels, datasets, options = {} }) => {
  const { t } = useTranslation();

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
  const legendData = chartData?.labels?.map((label, index) => ({
    label,
    value: String(chartData.datasets[0].data[index]),
    color: Array.isArray(chartData.datasets[0].backgroundColor)
      ? chartData.datasets[0].backgroundColor[index]
      : '#36A2EB',
  }));
  legendData?.unshift({
    label: t('common.total'),
    value: t('common.TradingVolume'),
    color: '',
  });
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-between lg:flex-nowrap">
      <div className="w-full lg:h-55 lg:w-61.5">
        <Pie
          options={{
            ...pieOptions,
            plugins: { ...pieOptions.plugins, legend: { display: false } },
          }}
          data={chartData}
        />
      </div>
      <div className="scrollbar-none h-58.5 w-full overflow-y-auto lg:w-auto">
        <div className="grid gap-3.75">
          {legendData?.map((it, idx) => (
            <div className="flex justify-between lg:justify-start" key={idx}>
              <div className="w-43.5">
                {idx === 0 ? (
                  <div className="text-card-foreground text-sm leading-5 font-medium">
                    {String(it.label)}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div
                      className={cn('h-3 w-3 rounded-full')}
                      style={{
                        background: it.color,
                      }}
                    />
                    <div className="text-card-foreground text-sm leading-5 font-normal">
                      {String(it.label)}
                    </div>
                  </div>
                )}
              </div>
              <div>
                {idx === 0 ? (
                  <div className="text-card-foreground text-sm leading-5 font-medium">
                    {String(it.value)}
                  </div>
                ) : (
                  <span className="text-card-foreground text-sm leading-5 font-normal">
                    {String(it.value)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
