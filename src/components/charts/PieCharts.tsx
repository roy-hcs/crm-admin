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
        // position: 'top' as const,
        display: false, // 自定义legend
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
    color: '', // 总计颜色
  });
  return (
    <div className="flex h-full w-full items-center">
      {/* 图表区域靠左 */}
      <div className="ml-11.5 h-55 w-61.5">
        <Pie
          options={{
            ...pieOptions,
            plugins: { ...pieOptions.plugins, legend: { display: false } },
          }}
          data={chartData}
        />
      </div>
      {/* legend区域靠右，超出高度滚动 */}
      <div className="ml-40 h-58.5 overflow-y-auto">
        {/* 手动渲染 legend */}
        {legendData?.map((it, idx) => (
          <div className="mb-3.75 flex" key={idx}>
            <div className="h-5 w-43.5">
              {idx === 0 ? (
                // 总计
                <div className="text-color-home h-5 text-sm leading-5 font-medium">
                  {String(it.label)}
                </div>
              ) : (
                <>
                  <span
                    className="mr-1 inline-block h-3 w-3"
                    style={{
                      background: it.color,
                      borderRadius: '50%',
                    }}
                  />
                  <span className="text-color-home text-sm font-normal">{String(it.label)}</span>
                </>
              )}
            </div>
            <div className="h-5">
              {idx === 0 ? (
                // 交易量(Lot)
                <div className="h-5 text-sm leading-5 font-medium">{String(it.value)}</div>
              ) : (
                <span className="text-color-home text-sm font-normal">{String(it.value)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
